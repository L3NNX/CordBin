import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { fileService } from '../../service/services';
import { useToast } from '../../hooks/use-toast';

const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB chunks

const FileUploadZone = ({ onUploadComplete }) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const { toast } = useToast();

  const uploadFile = useCallback(async (file) => {
    const fileId = `${Date.now()}-${file.name}`;
    let completedChunks = 0;
    // Add file to upload queue
    setUploadQueue(prev => [...prev, {
      id: fileId,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
      error: null
    }]);

    try {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      // Step 1: Initialize upload
      const initResponse = await fileService.initUpload(
        file.name,
        file.size,
        file.type,
        totalChunks
      );

      const backendFileId = initResponse.fileId;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Upload ONE chunk
        await fileService.uploadChunk(
          backendFileId,
          chunkIndex,
          chunk
        );

        // ✅ chunk finished
        completedChunks++;

        const progress = Math.round(
          (completedChunks / totalChunks) * 100
        );

        setUploadQueue(prev =>
          prev.map(item =>
            item.id === fileId
              ? { ...item, progress }
              : item
          )
        );
      }


      // Mark as complete
      setUploadQueue(prev => prev.map(item =>
        item.id === fileId
          ? { ...item, status: 'complete', progress: 100 }
          : item
      ));

      toast({
        title: 'Success',
        description: `${file.name} uploaded successfully`
      });

      // Call completion callback after a short delay
      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete();
        }
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);

      setUploadQueue(prev => prev.map(item =>
        item.id === fileId
          ? {
            ...item,
            status: 'error',
            error: error.message || 'Upload failed'
          }
          : item
      ));

      toast({
        title: 'Error',
        description: `Failed to upload ${file.name}`,
        variant: 'destructive'
      });
    }
  }, [toast, onUploadComplete]);

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const removeFromQueue = (fileId) => {
    setUploadQueue(prev => prev.filter(item => item.id !== fileId));
  };

  const retryUpload = (fileId) => {
    const fileItem = uploadQueue.find(item => item.id === fileId);
    if (fileItem && fileItem.status === 'error') {
      // Remove from queue and re-upload
      removeFromQueue(fileId);
      // Note: We don't have the original File object here
      // In a real implementation, you'd need to store the File object
      toast({
        title: 'Info',
        description: 'Please select the file again to retry upload',
        variant: 'default'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
  {...getRootProps()}
  className={`
    rounded-xl border border-dashed
    px-6 py-10 text-center
    transition-colors cursor-pointer
    ${isDragActive
      ? 'border-purple-500 bg-purple-50'
      : 'border-gray-300 hover:border-purple-400'}
  `}
>
  <input {...getInputProps()} />
  <Upload className="mx-auto h-8 w-8 text-purple-500 mb-3" />
  <p className="text-sm font-medium text-gray-900">
    Click to upload <span className="text-gray-400">or drag and drop</span>
  </p>
  <p className="text-xs text-gray-400 mt-1">
    Any file type · Large files supported
  </p>
</div>


      {/* Upload Queue */}
     <div className="space-y-3 mt-6">
  {uploadQueue.map((file) => (
    <div
      key={file.id}
      className={`
        rounded-lg border p-4
        ${file.status === 'error'
          ? 'border-red-400 bg-red-50'
          : 'border-gray-200'}
      `}
    >
      <div className="flex items-start gap-3">
        <File className="h-6 w-6 text-purple-500 mt-1" />

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>

          <p className="text-xs text-gray-500 mt-0.5">
            {(file.size / (1024 * 1024)).toFixed(2)} MB ·{" "}
            {file.status === "uploading" && "Uploading…"}
            {file.status === "complete" && (
              <span className="text-green-600 font-medium">Complete</span>
            )}
            {file.status === "error" && (
              <span className="text-red-600 font-medium">Failed</span>
            )}
          </p>

          {file.status === "uploading" && (
            <div className="mt-2">
              <Progress value={file.progress} className="h-2" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {file.status === "complete" && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}

          {file.status === "error" && (
            <button
              onClick={() => retryUpload(file.id)}
              className="text-xs text-red-600 hover:underline"
            >
              Try again
            </button>
          )}

          <button onClick={() => removeFromQueue(file.id)}>
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default FileUploadZone;