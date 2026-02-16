import {
  File as FileIcon,
  Image as ImageIcon,
  Video,
  FileText,
  MoreVertical,
  Download,
  Share2,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const getFileIcon = (type) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  if (type.includes("pdf") || type.includes("text")) return FileText;
  return FileIcon;
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const FileGrid = ({
  files = [],
  onFileClick,
  onDelete,
  onShare,
  onDownload,
}) => {
  const safeFiles = Array.isArray(files) ? files : [];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {safeFiles.map((file) => {
        const Icon = getFileIcon(file.type);

        return (
          <div
            key={file.id}
            onClick={() => onFileClick(file)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card
              transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-md"
            data-testid={`file-card-${file.id}`}
          >
            {/* Thumbnail / Icon area */}
            <div className="relative flex h-36 items-center justify-center bg-muted/50">
              {file.type.startsWith("image/") && file.thumbnailId ? (
                <img
                  src={`/files/${file.id}/thumbnail`}
                  alt={file.name}
                  className="h-full w-full object-cover"
                  data-testid={`file-thumbnail-${file.id}`}
                />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
              )}

              {/* Menu — overlaid top-right, visible on hover */}
              <div className="absolute right-2 top-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button
                      className="grid h-7 w-7 place-items-center rounded-lg bg-card/80 text-muted-foreground
                        opacity-0 shadow-sm backdrop-blur-sm transition-all duration-150
                        hover:bg-card hover:text-foreground group-hover:opacity-100"
                      data-testid={`file-menu-${file.id}`}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(file);
                      }}
                      data-testid={`download-file-${file.id}`}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(file);
                      }}
                      data-testid={`share-file-${file.id}`}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(file.id);
                      }}
                      className="text-destructive focus:text-destructive"
                      data-testid={`delete-file-${file.id}`}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* File info */}
            <div className="p-3.5">
              <h3 className="truncate text-sm font-medium text-foreground" data-testid={`file-name-${file.id}`}>
                {file.name}
              </h3>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono">{formatFileSize(file.size)}</span>
                <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
                <span>{formatDate(file.uploadedAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileGrid;