import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Download, Share2, X } from "lucide-react";



const FilePreviewModal = ({ file, open, onClose, onDownload, onShare }) => {
const ext = file.name.split(".").pop()?.toLowerCase();

const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
const isPDF = ext === "pdf";
const isVideo = ["mp4", "webm", "mov"].includes(ext);
const isText = ["txt", "md", "json"].includes(ext);
const previewUrl = `${import.meta.env.VITE_API_URL}/api/files/preview/${file.id}`;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto" data-testid="file-preview-modal">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-heading font-bold truncate" data-testid="preview-file-name">
              {file.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)} • {file.type}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onShare}
              className="rounded-full"
              data-testid="preview-share-btn"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onDownload}
              className="rounded-full"
              data-testid="preview-download-btn"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="rounded-full"
              data-testid="preview-close-btn"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="rounded-lg overflow-hidden bg-muted/30">
          {isImage && (
            <img
             src={previewUrl}
              alt={file.name}
              className="w-full h-auto max-h-[70vh] object-contain"
              data-testid="preview-image"
            />
          )}

          {isPDF && (
            <iframe
              src={previewUrl}
              className="w-full h-[70vh]"
              title={file.name}
              data-testid="preview-pdf"
            />
          )}

          {isVideo && (
            <video
              controls
              className="w-full max-h-[70vh]"
              data-testid="preview-video"
            >
              <source src={previewUrl} type={file.type} />
              Your browser does not support the video tag.
            </video>
          )}

          {isText && (
            <iframe
              src={previewUrl}
              className="w-full h-[70vh]"
              title={file.name}
              data-testid="preview-text"
            />
          )}

          {!isImage && !isPDF && !isVideo && !isText && (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8" data-testid="preview-not-available">
              <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
              <Button onClick={onDownload} className="rounded-full" data-testid="preview-download-fallback-btn">
                <Download className="h-4 w-4 mr-2" />
                Download to view
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;