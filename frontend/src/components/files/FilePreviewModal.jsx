import { API_CONFIG } from "../../config/api";
import { Dialog, DialogContent } from "../ui/dialog";
import { Download, Share2, X, FileQuestion } from "lucide-react";

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const FilePreviewModal = ({ file, open, onClose, onDownload, onShare }) => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPDF = ext === "pdf";
  const isVideo = ["mp4", "webm", "mov"].includes(ext);
  const isText = ["txt", "md", "json"].includes(ext);
  // const previewUrl = `${import.meta.env.VITE_API_URL}/api/files/preview/${file.id}`;
    const previewUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILE_PREVIEW}/${file.id}`;

  const canPreview = isImage || isPDF || isVideo || isText;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-auto p-0" data-testid="file-preview-modal">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border/60 bg-card/95 px-6 py-4 backdrop-blur-sm">
          <div className="min-w-0 flex-1">
            <h2
              className="truncate font-display text-lg text-foreground"
              data-testid="preview-file-name"
            >
              {file.name}
            </h2>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-mono">{formatFileSize(file.size)}</span>
              <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
              <span>{file.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onShare}
              className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground
                transition-all duration-150 hover:bg-accent/5 hover:text-foreground"
              data-testid="preview-share-btn"
              aria-label="Share file"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={onDownload}
              className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground
                transition-all duration-150 hover:bg-accent/5 hover:text-foreground"
              data-testid="preview-download-btn"
              aria-label="Download file"
            >
              <Download className="h-4 w-4" />
            </button>
            <div className="mx-1 h-5 w-px bg-border/60" />
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground
                transition-all duration-150 hover:bg-destructive/10 hover:text-destructive"
              data-testid="preview-close-btn"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="bg-muted/30 p-4">
          <div className="overflow-hidden rounded-xl">
            {isImage && (
              <img
                src={previewUrl}
                alt={file.name}
                className="mx-auto max-h-[70vh] w-full object-contain"
                data-testid="preview-image"
              />
            )}

            {isPDF && (
              <iframe
                src={previewUrl}
                className="h-[70vh] w-full"
                title={file.name}
                data-testid="preview-pdf"
              />
            )}

            {isVideo && (
              <video
                controls
                className="mx-auto max-h-[70vh] w-full"
                data-testid="preview-video"
              >
                <source src={previewUrl} type={file.type} />
                Your browser does not support the video tag.
              </video>
            )}

            {isText && (
              <iframe
                src={previewUrl}
                className="h-[70vh] w-full bg-card"
                title={file.name}
                data-testid="preview-text"
              />
            )}

            {!canPreview && (
              <div className="flex flex-col items-center justify-center py-20 text-center" data-testid="preview-not-available">
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-accent/10 bg-accent/5">
                  <FileQuestion className="h-6 w-6 text-accent/60" />
                </div>
                <p className="mb-1 text-sm font-medium text-foreground">
                  No preview available
                </p>
                <p className="mb-6 text-sm text-muted-foreground">
                  This file type can't be previewed in browser
                </p>
                <button
                  onClick={onDownload}
                  className="group flex items-center gap-2 rounded-xl gradient-accent px-5 py-2.5 text-sm
                    font-medium text-accent-foreground shadow-sm transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-accent-sm active:scale-[0.98]"
                  data-testid="preview-download-fallback-btn"
                >
                  <Download className="h-4 w-4" />
                  Download to view
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;