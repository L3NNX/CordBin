import { useRef, useState } from 'react';
import { AlertTriangle, Trash2, X, Upload, CheckCircle, Pause } from 'lucide-react';

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const IncompleteFileBanner = ({
  files = [],
  resumingFiles = {},
  onResume,
  onDelete,
  onDismiss,
}) => {
  const fileInputRef = useRef(null);
  const [resumeTargetId, setResumeTargetId] = useState(null);

  if (files.length === 0) return null;

  const handleResumeClick = (file) => {
    setResumeTargetId(file.id);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && resumeTargetId) {
      const incompleteFile = files.find((f) => f.id === resumeTargetId);
      if (incompleteFile) {
        onResume(incompleteFile, selectedFile);
      }
    }
    e.target.value = '';
    setResumeTargetId(null);
  };

  return (
    <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {files.length} incomplete upload{files.length !== 1 && 's'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Select the same file to resume uploading from where it stopped.
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground
            transition-colors hover:bg-yellow-500/10 hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* File list */}
      <div className="px-4 pb-3 pt-1">
        <div className="space-y-2">
          {files.map((file) => {
            const rs = resumingFiles[file.id];
            const isResuming = rs?.status === 'resuming';
            const isComplete = rs?.status === 'complete';

            return (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-yellow-500/10 bg-card px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono">{formatSize(file.size)}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
                    {isResuming ? (
                      <span className="text-accent font-medium">Resuming… {rs.progress}%</span>
                    ) : isComplete ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">Complete ✓</span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">
                        {file.chunksUploaded}/{file.totalChunks} chunks
                      </span>
                    )}
                  </div>
                  <div className="mt-2 overflow-hidden rounded-full bg-yellow-500/10">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        isResuming ? 'bg-accent' : isComplete ? 'bg-green-500' : 'bg-yellow-500/60'
                      }`}
                      style={{
                        width: `${
                          isResuming || isComplete
                            ? rs.progress
                            : file.totalChunks > 0
                              ? Math.round((file.chunksUploaded / file.totalChunks) * 100)
                              : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {isResuming ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-accent">
                      <div className="h-3 w-3 animate-spin rounded-full border border-accent/30 border-t-accent" />
                    </span>
                  ) : isComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <>
                      <button
                        onClick={() => handleResumeClick(file)}
                        className="flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-2.5 py-1.5
                          text-[11px] font-medium text-yellow-700 dark:text-yellow-400
                          transition-colors hover:bg-yellow-500/20 active:scale-[0.97]"
                      >
                        <Upload className="h-3 w-3" />
                        Resume
                      </button>
                      <button
                        onClick={() => onDelete(file.id)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground
                          transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {files.length > 1 && !Object.values(resumingFiles).some((r) => r.status === 'resuming') && (
          <div className="mt-3 flex gap-2 border-t border-yellow-500/10 pt-3">
            <button
              onClick={() => files.forEach((f) => onDelete(f.id))}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5
                text-xs font-medium text-muted-foreground
                transition-colors hover:bg-destructive/10 hover:text-destructive
                active:scale-[0.97]"
            >
              <Trash2 className="h-3 w-3" />
              Remove All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncompleteFileBanner;