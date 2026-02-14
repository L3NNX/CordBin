// import { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { Upload, File, X, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
// import { Progress } from '../ui/progress';
// import { fileService } from '../../service/services';
// import { useToast } from '../../hooks/use-toast';
// import { cn } from '../../lib/utils';

// const CHUNK_SIZE = 8 * 1024 * 1024;

// const formatSize = (bytes) => {
//   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// };

// const FileUploadZone = ({ onUploadComplete }) => {
//   const [uploadQueue, setUploadQueue] = useState([]);
//   const { toast } = useToast();

//   const uploadFile = useCallback(async (file) => {
//     const fileId = `${Date.now()}-${file.name}`;
//     let completedChunks = 0;

//     setUploadQueue(prev => [...prev, {
//       id: fileId,
//       file,
//       name: file.name,
//       size: file.size,
//       progress: 0,
//       status: 'uploading',
//       error: null,
//     }]);

//     try {
//       const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
//       const initResponse = await fileService.initUpload(file.name, file.size, file.type, totalChunks);
//       const backendFileId = initResponse.fileId;

//       for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
//         const start = chunkIndex * CHUNK_SIZE;
//         const end = Math.min(start + CHUNK_SIZE, file.size);
//         const chunk = file.slice(start, end);

//         await fileService.uploadChunk(backendFileId, chunkIndex, chunk);
//         completedChunks++;

//         const progress = Math.round((completedChunks / totalChunks) * 100);
//         setUploadQueue(prev =>
//           prev.map(item => item.id === fileId ? { ...item, progress } : item)
//         );
//       }

//       setUploadQueue(prev =>
//         prev.map(item => item.id === fileId ? { ...item, status: 'complete', progress: 100 } : item)
//       );

//       toast({ title: 'Success', description: `${file.name} uploaded successfully` });
//       setTimeout(() => onUploadComplete?.(), 1000);
//     } catch (error) {
//       console.error('Upload error:', error);
//       setUploadQueue(prev =>
//         prev.map(item =>
//           item.id === fileId
//             ? { ...item, status: 'error', error: error.message || 'Upload failed' }
//             : item
//         )
//       );
//       toast({ title: 'Error', description: `Failed to upload ${file.name}`, variant: 'destructive' });
//     }
//   }, [toast, onUploadComplete]);

//   const onDrop = useCallback(async (acceptedFiles) => {
//     for (const file of acceptedFiles) {
//       await uploadFile(file);
//     }
//   }, [uploadFile]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

//   const removeFromQueue = (fileId) => {
//     setUploadQueue(prev => prev.filter(item => item.id !== fileId));
//   };

//   const retryUpload = (fileId) => {
//     const fileItem = uploadQueue.find(item => item.id === fileId);
//     if (fileItem?.status === 'error') {
//       removeFromQueue(fileId);
//       toast({ title: 'Info', description: 'Please select the file again to retry upload' });
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Dropzone */}
//       <div
//         {...getRootProps()}
//         className={cn(
//           "group cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200",
//           isDragActive
//             ? "border-accent bg-accent/5 shadow-inner"
//             : "border-border hover:border-accent/40 hover:bg-accent/[0.02]"
//         )}
//       >
//         <input {...getInputProps()} />
//         <div className={cn(
//           "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl transition-all duration-200",
//           isDragActive
//             ? "gradient-accent shadow-accent-sm scale-110"
//             : "bg-accent/10"
//         )}>
//           <Upload className={cn(
//             "h-5 w-5 transition-colors duration-200",
//             isDragActive ? "text-accent-foreground" : "text-accent"
//           )} />
//         </div>
//         <p className="text-sm font-medium text-foreground">
//           Click to upload{' '}
//           <span className="text-muted-foreground">or drag and drop</span>
//         </p>
//         <p className="mt-1 text-xs text-muted-foreground/60">
//           Any file type · Large files supported
//         </p>
//       </div>

//       {/* Upload queue */}
//       {uploadQueue.length > 0 && (
//         <div className="space-y-2.5">
//           {uploadQueue.map((file) => (
//             <div
//               key={file.id}
//               className={cn(
//                 "rounded-xl border p-4 transition-colors duration-200",
//                 file.status === 'error'
//                   ? "border-destructive/30 bg-destructive/5"
//                   : file.status === 'complete'
//                     ? "border-accent/20 bg-accent/[0.02]"
//                     : "border-border bg-card"
//               )}
//             >
//               <div className="flex items-start gap-3">
//                 {/* File icon */}
//                 <div className={cn(
//                   "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg",
//                   file.status === 'error' ? "bg-destructive/10" : "bg-accent/10"
//                 )}>
//                   {file.status === 'error'
//                     ? <AlertCircle className="h-4 w-4 text-destructive" />
//                     : <File className="h-4 w-4 text-accent" />
//                   }
//                 </div>

//                 {/* Info */}
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-foreground">
//                     {file.name}
//                   </p>
//                   <div className="mt-0.5 flex items-center gap-2 text-[11px]">
//                     <span className="font-mono text-muted-foreground">
//                       {formatSize(file.size)}
//                     </span>
//                     <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
//                     {file.status === 'uploading' && (
//                       <span className="text-muted-foreground">
//                         {file.progress}% uploading…
//                       </span>
//                     )}
//                     {file.status === 'complete' && (
//                       <span className="font-medium text-accent">Complete</span>
//                     )}
//                     {file.status === 'error' && (
//                       <span className="font-medium text-destructive">Failed</span>
//                     )}
//                   </div>

//                   {file.status === 'uploading' && (
//                     <div className="mt-2.5">
//                       <Progress value={file.progress} className="h-1.5" />
//                     </div>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex shrink-0 items-center gap-1.5">
//                   {file.status === 'complete' && (
//                     <CheckCircle className="h-4.5 w-4.5 text-accent" />
//                   )}
//                   {file.status === 'error' && (
//                     <button
//                       onClick={() => retryUpload(file.id)}
//                       className="grid h-7 w-7 place-items-center rounded-lg text-destructive
//                         transition-colors duration-150 hover:bg-destructive/10"
//                       aria-label="Retry upload"
//                     >
//                       <RotateCcw className="h-3.5 w-3.5" />
//                     </button>
//                   )}
//                   <button
//                     onClick={() => removeFromQueue(file.id)}
//                     className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground
//                       transition-colors duration-150 hover:bg-accent/5 hover:text-foreground"
//                     aria-label="Remove from queue"
//                   >
//                     <X className="h-3.5 w-3.5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUploadZone;

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, RotateCcw, Cloud, ArrowUpRight } from 'lucide-react';
import { Progress } from '../ui/progress';
import { fileService } from '../../service/services';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';

const CHUNK_SIZE = 8 * 1024 * 1024;

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const FileUploadZone = ({ onUploadComplete }) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const { toast } = useToast();

  const uploadFile = useCallback(async (file) => {
    const fileId = `${Date.now()}-${file.name}`;
    let completedChunks = 0;

    setUploadQueue(prev => [...prev, {
      id: fileId,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
      error: null,
    }]);

    try {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const initResponse = await fileService.initUpload(file.name, file.size, file.type, totalChunks);
      const backendFileId = initResponse.fileId;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        await fileService.uploadChunk(backendFileId, chunkIndex, chunk);
        completedChunks++;

        const progress = Math.round((completedChunks / totalChunks) * 100);
        setUploadQueue(prev =>
          prev.map(item => item.id === fileId ? { ...item, progress } : item)
        );
      }

      setUploadQueue(prev =>
        prev.map(item => item.id === fileId ? { ...item, status: 'complete', progress: 100 } : item)
      );

      toast({ title: 'Success', description: `${file.name} uploaded successfully` });
      setTimeout(() => onUploadComplete?.(), 1000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadQueue(prev =>
        prev.map(item =>
          item.id === fileId
            ? { ...item, status: 'error', error: error.message || 'Upload failed' }
            : item
        )
      );
      toast({ title: 'Error', description: `Failed to upload ${file.name}`, variant: 'destructive' });
    }
  }, [toast, onUploadComplete]);

  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  const removeFromQueue = (fileId) => {
    setUploadQueue(prev => prev.filter(item => item.id !== fileId));
  };

  const retryUpload = (fileId) => {
    const fileItem = uploadQueue.find(item => item.id === fileId);
    if (fileItem?.status === 'error') {
      removeFromQueue(fileId);
      toast({ title: 'Info', description: 'Please select the file again to retry upload' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
          isDragActive
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-border hover:border-accent/40"
        )}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          {/* Gradient glow */}
          <div className={cn(
            "absolute -top-20 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full blur-[80px] transition-opacity duration-500",
            isDragActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          )}
            style={{ background: 'radial-gradient(ellipse at center, hsl(var(--accent) / 0.15), transparent 70%)' }}
          />

          {/* Corner decorations */}
          <div className="absolute left-4 top-4 h-8 w-8 rounded-lg border border-accent/10 bg-accent/[0.03]" />
          <div className="absolute bottom-4 right-4 h-6 w-6 rounded-md border border-accent/10 bg-accent/[0.03]" />
          <div className="absolute right-12 top-6 h-3 w-3 rounded-full bg-accent/10" />

          {/* Dot grid */}
          <div className="absolute bottom-6 left-10 grid grid-cols-3 gap-1.5 opacity-30">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-accent/40" />
            ))}
          </div>
        </div>

        <input {...getInputProps()} />

        <div className="relative px-6 py-14 sm:py-16">
          <div className="flex flex-col items-center">
            {/* Icon cluster */}
            <div className="relative mb-6">
              {/* Rotating ring */}
              <div className={cn(
                "absolute -inset-4 rounded-full border border-dashed transition-all duration-700",
                isDragActive
                  ? "border-accent/30 animate-rotate-slow"
                  : "border-transparent group-hover:border-accent/15"
              )} />

              {/* Main icon */}
              <div className={cn(
                "relative grid h-16 w-16 place-items-center rounded-2xl transition-all duration-300",
                isDragActive
                  ? "gradient-accent shadow-accent-lg scale-110"
                  : "bg-accent/10 group-hover:bg-accent/15 group-hover:scale-105"
              )}>
                {isDragActive ? (
                  <ArrowUpRight className="h-7 w-7 text-accent-foreground animate-bounce" />
                ) : (
                  <Cloud className="h-7 w-7 text-accent transition-transform duration-300 group-hover:-translate-y-0.5" />
                )}
              </div>

              {/* Floating file icons */}
              <div className={cn(
                "absolute -right-3 -top-2 grid h-8 w-8 place-items-center rounded-lg border border-border bg-card shadow-sm transition-all duration-500",
                isDragActive
                  ? "translate-x-1 -translate-y-1 opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5"
              )}>
                <File className="h-3.5 w-3.5 text-accent" />
              </div>

              <div className={cn(
                "absolute -bottom-1 -left-3 grid h-7 w-7 place-items-center rounded-lg border border-border bg-card shadow-sm transition-all duration-500 delay-75",
                isDragActive
                  ? "-translate-x-1 translate-y-1 opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0.5"
              )}>
                <Upload className="h-3 w-3 text-accent" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center">
              <p className={cn(
                "text-sm font-medium transition-colors duration-200",
                isDragActive ? "text-accent" : "text-foreground"
              )}>
                {isDragActive ? "Drop your files here" : "Drop files here or click to browse"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground/60">
                Any file type · Large files auto-chunked
              </p>
            </div>

            {/* Bottom pill hint */}
            <div className={cn(
              "mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 transition-all duration-300",
              isDragActive
                ? "border-accent/30 bg-accent/10"
                : "border-border bg-card group-hover:border-accent/20 group-hover:bg-accent/5"
            )}>
              <div className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors duration-200",
                isDragActive ? "bg-accent animate-pulse-dot" : "bg-muted-foreground/30"
              )} />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {isDragActive ? "Release to upload" : "Secure upload"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload queue */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2.5">
          <p className="px-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/50">
            Uploads ({uploadQueue.length})
          </p>

          {uploadQueue.map((file) => (
            <div
              key={file.id}
              className={cn(
                "rounded-xl border p-4 transition-colors duration-200",
                file.status === 'error'
                  ? "border-destructive/30 bg-destructive/5"
                  : file.status === 'complete'
                    ? "border-accent/20 bg-accent/[0.02]"
                    : "border-border bg-card"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                  file.status === 'error'
                    ? "bg-destructive/10"
                    : file.status === 'complete'
                      ? "gradient-accent"
                      : "bg-accent/10"
                )}>
                  {file.status === 'error'
                    ? <AlertCircle className="h-4 w-4 text-destructive" />
                    : file.status === 'complete'
                      ? <CheckCircle className="h-4 w-4 text-accent-foreground" />
                      : <File className="h-4 w-4 text-accent" />
                  }
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                    <span className="font-mono text-muted-foreground">
                      {formatSize(file.size)}
                    </span>
                    <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
                    {file.status === 'uploading' && (
                      <span className="text-muted-foreground">{file.progress}%</span>
                    )}
                    {file.status === 'complete' && (
                      <span className="font-medium text-accent">Complete</span>
                    )}
                    {file.status === 'error' && (
                      <span className="font-medium text-destructive">Failed</span>
                    )}
                  </div>

                  {file.status === 'uploading' && (
                    <div className="mt-2.5 overflow-hidden rounded-full bg-accent/10">
                      <div
                        className="h-1.5 rounded-full gradient-accent transition-all duration-300 ease-out"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {file.status === 'error' && (
                    <button
                      onClick={() => retryUpload(file.id)}
                      className="grid h-7 w-7 place-items-center rounded-lg text-destructive
                        transition-colors duration-150 hover:bg-destructive/10"
                      aria-label="Retry upload"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => removeFromQueue(file.id)}
                    className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground
                      transition-colors duration-150 hover:bg-accent/5 hover:text-foreground"
                    aria-label="Remove from queue"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;