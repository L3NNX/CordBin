import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, RotateCcw, Cloud, ArrowUpRight } from 'lucide-react';
import { fileService } from '../../service/services';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';

const CHUNK_SIZE = 8 * 1024 * 1024;
const MAX_CONCURRENT = 3;
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 2000;


const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const FileUploadZone = ({ onUploadComplete, onUploadingChange }) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const { toast } = useToast();
  const activeUploadsRef = useRef(0);
  const totalFilesRef = useRef(0);
  const completedFilesRef = useRef(0);
  const hasErrorRef = useRef(false);
  const isUploading = uploadQueue.some(f => f.status === 'uploading');

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const updateFile = useCallback((fileId, updates) => {
    setUploadQueue(prev =>
      prev.map(item => item.id === fileId ? { ...item, ...updates } : item)
    );
  }, []);

  const checkAllComplete = useCallback(() => {
    completedFilesRef.current += 1;

    if (completedFilesRef.current >= totalFilesRef.current) {
      if (hasErrorRef.current) {

        toast({
          title: 'Some uploads failed',
          description: 'Click the retry button to try again',
          variant: 'destructive',
        });

      } else {
        toast({
          title: 'All uploads complete',
          description: `${totalFilesRef.current} file(s) uploaded successfully`,
        });
        setTimeout(() => {
          onUploadComplete?.();
        }, 1500);
      }
    }
  }, [onUploadComplete, toast]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const uploadSingleFile = useCallback(async (file, fileId) => {
    let completedChunks = 0;
    try {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const initResponse = await fileService.initUpload(file.name, file.size, file.type, totalChunks);
      const backendFileId = initResponse.fileId;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        let lastError = null;
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            await fileService.uploadChunk(
              backendFileId,
              chunkIndex,
              chunk,
              totalChunks
            );
            lastError = null;
            break;
          } catch (err) {
            lastError = err;
            if (attempt < MAX_RETRIES) {
              const delay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1);
              console.warn(
                `Chunk ${chunkIndex} attempt ${attempt} failed. ` +
                `Retrying in ${delay}ms...`,
                err.message
              );
              updateFile(fileId, {
                error: `Retry ${attempt}/${MAX_RETRIES}...`,
              });
              await sleep(delay);
            }
          }
        }
        if (lastError) throw lastError;
        completedChunks++;
        const progress = Math.round((completedChunks / totalChunks) * 100);
        updateFile(fileId, { progress });
      }
      updateFile(fileId, { status: 'complete', progress: 100 });
    } catch (error) {
      console.error(`Upload error for ${file.name}:`, error);
      hasErrorRef.current = true;
      updateFile(fileId, { status: 'error', error: error.message || 'Upload failed' });
      toast({
        title: 'Upload failed',
        description: `${file.name} — click retry to try again`,
        variant: 'destructive',
      });
    } finally {
      activeUploadsRef.current -= 1;
      checkAllComplete();
    }
  }, [updateFile, checkAllComplete, toast]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    totalFilesRef.current = acceptedFiles.length;
    completedFilesRef.current = 0;
    hasErrorRef.current = false;
    activeUploadsRef.current = 0;

    const newEntries = acceptedFiles.map((file) => {
      const fileId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
        error: null,
      };
    });

    setUploadQueue(prev => [...prev, ...newEntries]);

    const filesToProcess = newEntries.map(entry => ({ file: entry.file, fileId: entry.id }));
    const queue = [...filesToProcess];
    const startNext = () => {
      while (activeUploadsRef.current < MAX_CONCURRENT && queue.length > 0) {
        const { file, fileId } = queue.shift();
        activeUploadsRef.current += 1;
        uploadSingleFile(file, fileId).then(() => { startNext(); });
      }
    };
    startNext();
  }, [uploadSingleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  const removeFromQueue = (fileId) => {
    setUploadQueue(prev => prev.filter(item => item.id !== fileId));
  };

  const retryUpload = (fileId) => {
    const fileItem = uploadQueue.find(item => item.id === fileId);
    if (!fileItem?.file) return;

    // Reset the failed item in-place (don't remove/re-add)
    const newId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setUploadQueue(prev =>
      prev.map(item =>
        item.id === fileId
          ? { ...item, id: newId, progress: 0, status: 'uploading', error: null }
          : item
      )
    );

    // ✅ Fix: properly reset the tracking refs
    totalFilesRef.current = 1;
    completedFilesRef.current = 0;
    hasErrorRef.current = false;
    activeUploadsRef.current += 1;

    uploadSingleFile(fileItem.file, newId);
  };

  const retryAllFailed = () => {
    const failedItems = uploadQueue.filter(f => f.status === 'error');
    if (failedItems.length === 0) return;

    totalFilesRef.current = failedItems.length;
    completedFilesRef.current = 0;
    hasErrorRef.current = false;

    const queue = [];

    const updatedQueue = uploadQueue.map(item => {
      if (item.status === 'error') {
        const newId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        queue.push({ file: item.file, fileId: newId });
        return { ...item, id: newId, progress: 0, status: 'uploading', error: null };
      }
      return item;
    });

    setUploadQueue(updatedQueue);

    const startNext = () => {
      while (activeUploadsRef.current < MAX_CONCURRENT && queue.length > 0) {
        const { file, fileId } = queue.shift();
        activeUploadsRef.current += 1;
        uploadSingleFile(file, fileId).then(() => startNext());
      }
    };
    startNext();
  };

  const uploading = uploadQueue.filter(f => f.status === 'uploading');
  const completed = uploadQueue.filter(f => f.status === 'complete');
  const failed = uploadQueue.filter(f => f.status === 'error');

  const overallProgress = uploadQueue.length > 0
    ? Math.round(uploadQueue.reduce((sum, f) => sum + f.progress, 0) / uploadQueue.length)
    : 0;

  return (
    /* ── ROOT: constrain width & prevent overflow ── */
    <div className="w-full min-w-0 overflow-hidden space-y-5">

      {/* ── Dropzone ── */}
      <div
        {...getRootProps()}
        className={cn(
          "group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300",
          "w-full min-w-0 overflow-hidden",
          isDragActive
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-border hover:border-accent/40"
        )}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={cn(
            "absolute -top-20 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full blur-[80px] transition-opacity duration-500",
            isDragActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          )}
            style={{ background: 'radial-gradient(ellipse at center, hsl(var(--accent) / 0.15), transparent 70%)' }}
          />
          <div className="absolute left-4 top-4 h-8 w-8 rounded-lg border border-accent/10 bg-accent/[0.03]" />
          <div className="absolute bottom-4 right-4 h-6 w-6 rounded-md border border-accent/10 bg-accent/[0.03]" />
          <div className="absolute right-12 top-6 h-3 w-3 rounded-full bg-accent/10" />
          <div className="absolute bottom-6 left-10 grid grid-cols-3 gap-1.5 opacity-30">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-accent/40" />
            ))}
          </div>
        </div>

        <input {...getInputProps()} />

        <div className="relative px-6 py-14 sm:py-16">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className={cn(
                "absolute -inset-4 rounded-full border border-dashed transition-all duration-700",
                isDragActive
                  ? "border-accent/30 animate-rotate-slow"
                  : "border-transparent group-hover:border-accent/15"
              )} />
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

            <div className="text-center max-w-full px-2">
              <p className={cn(
                "text-sm font-medium transition-colors duration-200",
                isDragActive ? "text-accent" : "text-foreground"
              )}>
                {isDragActive ? "Drop your files here" : "Drop files here or click to browse"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground/60">
                Any file type · Large files auto-chunked · Up to {MAX_CONCURRENT} simultaneous uploads
              </p>
            </div>

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

      {/* ── Upload queue ── */}
      {uploadQueue.length > 0 && (
        <div className="w-full min-w-0 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/50">
              Uploads ({uploadQueue.length})
            </p>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {completed.length > 0 && (
                <span className="flex items-center gap-1 text-accent">
                  <CheckCircle className="h-3 w-3" />
                  {completed.length} done
                </span>
              )}
              {uploading.length > 0 && (
                <span>{uploading.length} uploading…</span>
              )}
              {failed.length > 0 && (
                <span className="flex items-center gap-1 text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {failed.length} failed
                </span>
              )}
            </div>
          </div>

          {/* Overall progress */}
          {isUploading && (
            <div className="overflow-hidden rounded-full bg-accent/10">
              <div
                className="h-1 rounded-full gradient-accent transition-all duration-300 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          )}

          {failed.length > 0 && !isUploading && (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              <p className="flex-1 text-sm text-destructive">
                {failed.length} upload{failed.length !== 1 && 's'} failed
              </p>
              <button
                onClick={retryAllFailed}
                className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5
                  text-xs font-medium text-destructive transition-colors
                  hover:bg-destructive/20 active:scale-[0.97]"
              >
                <RotateCcw className="h-3 w-3" />
                Retry All
              </button>
            </div>
          )}

          {/* File items */}
          <div className="max-h-64 space-y-2 overflow-y-auto overflow-x-hidden pr-1">
            {uploadQueue.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "w-full min-w-0 rounded-xl border p-3.5 transition-colors duration-200",
                  file.status === 'error'
                    ? "border-destructive/30 bg-destructive/5"
                    : file.status === 'complete'
                      ? "border-accent/20 bg-accent/[0.02]"
                      : "border-border bg-card"
                )}
              >
                {/* ── Row: icon + info + actions ── */}
                <div className="flex items-center gap-3 min-w-0">

                  {/* Icon */}
                  <div className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
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

                  {/* Info — this is the key overflow-fix container */}
                  <div className="min-w-0 flex-1 overflow-hidden">

                    {/* Name + size row */}
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="truncate min-w-0 flex-1 text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {file.status === 'uploading' ? `${file.progress}%` : formatSize(file.size)}
                      </span>
                    </div>

                    {/* Per-file progress */}
                    {file.status === 'uploading' && (
                      <div className="mt-2 overflow-hidden rounded-full bg-accent/10">
                        <div
                          className="h-1 rounded-full gradient-accent transition-all duration-300 ease-out"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}

                    {file.status === 'error' && (
                      <p className="mt-1 truncate text-[11px] text-destructive">
                        {file.error || 'Upload failed'}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
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
                    {file.status !== 'uploading' && (
                      <button
                        onClick={() => removeFromQueue(file.id)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground
                          transition-colors duration-150 hover:bg-accent/5 hover:text-foreground"
                        aria-label="Remove from queue"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;