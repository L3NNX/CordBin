import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { Upload, X, FileIcon, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";



const FileUploadZone = ({ folderId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) formData.append("folderId", folderId);

    try {
      await axios.post(`/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: percentCompleted,
          }));
        },
      });

      setUploadedFiles((prev) => [...prev, file.name]);
      return true;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload ${file.name}`);
      return false;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    setUploadProgress({});
    setUploadedFiles([]);

    const uploadPromises = acceptedFiles.map((file) => uploadFile(file));
    const results = await Promise.all(uploadPromises);

    const successCount = results.filter((r) => r).length;
    if (successCount > 0) {
      setTimeout(() => {
        onUploadComplete();
      }, 500);
    }

    setUploading(false);
  }, [folderId, uploadFile, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`upload-zone rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive ? "drag-active" : ""
        }`}
        data-testid="file-upload-zone"
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground">Maximum file size: 100MB</p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-3" data-testid="upload-progress">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {uploadedFiles.includes(filename) ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <FileIcon className="h-4 w-4" />
                  )}
                  <span className="truncate max-w-xs">{filename}</span>
                </div>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && !uploading && (
        <div className="text-center text-sm text-green-600 dark:text-green-400" data-testid="upload-success">
          {uploadedFiles.length} file(s) uploaded successfully!
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;