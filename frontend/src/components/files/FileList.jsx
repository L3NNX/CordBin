import {
  File as FileIcon,
  Image as ImageIcon,
  Video,
  FileText,
  Folder as FolderIcon,
  Download,
  Share2,
  Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";

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

const ActionButton = ({ onClick, label, destructive, children }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={cn(
      "grid h-8 w-8 place-items-center rounded-lg opacity-0 transition-all duration-150 group-hover:opacity-100",
      destructive
        ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
    )}
    aria-label={label}
  >
    {children}
  </button>
);

const FileList = ({ files = [], folders = [], onFileClick, onFolderClick, onDelete, onShare, onDownload }) => {
  const safeFiles = Array.isArray(files) ? files : [];
  const safeFolders = Array.isArray(folders) ? folders : [];

  return (
    <div className="space-y-1">
      {/* Header row */}
      <div className="hidden items-center gap-4 px-4 py-2 sm:flex">
        <div className="w-9" />
        <p className="flex-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40">
          Name
        </p>
        <p className="hidden w-24 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40 md:block">
          Size
        </p>
        <p className="hidden w-28 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/40 lg:block">
          Modified
        </p>
        <div className="w-28" />
      </div>

      {/* Folders */}
      {safeFolders.map((folder) => (
        <div
          key={folder.id}
          onClick={() => onFolderClick(folder.id)}
          className="group flex cursor-pointer items-center gap-4 rounded-xl border border-transparent
            px-4 py-3 transition-all duration-150
            hover:border-accent/15 hover:bg-accent/[0.02]"
          data-testid={`folder-list-item-${folder.id}`}
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10">
            <FolderIcon className="h-4 w-4 text-accent" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground" data-testid={`folder-list-name-${folder.id}`}>
              {folder.name}
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground sm:hidden">
              {folder.fileCount} file{folder.fileCount !== 1 && "s"}
            </p>
          </div>

          <p className="hidden w-24 font-mono text-[11px] text-muted-foreground md:block">
            {folder.fileCount} file{folder.fileCount !== 1 && "s"}
          </p>

          <p className="hidden w-28 text-[11px] text-muted-foreground lg:block">—</p>

          <div className="flex w-28 items-center justify-end gap-1">
            <ActionButton onClick={() => onDelete(folder.id)} label="Delete folder" destructive>
              <Trash2 className="h-3.5 w-3.5" />
            </ActionButton>
          </div>
        </div>
      ))}

      {/* Divider between folders and files */}
      {safeFolders.length > 0 && safeFiles.length > 0 && (
        <div className="mx-4 border-t border-border/40" />
      )}

      {/* Files */}
      {safeFiles.map((file) => {
        const Icon = getFileIcon(file.type);

        return (
          <div
            key={file.id}
            onClick={() => onFileClick(file)}
            className="group flex cursor-pointer items-center gap-4 rounded-xl border border-transparent
              px-4 py-3 transition-all duration-150
              hover:border-accent/15 hover:bg-accent/[0.02]"
            data-testid={`file-list-item-${file.id}`}
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground" data-testid={`file-list-name-${file.id}`}>
                {file.name}
              </p>
              {/* Mobile metadata */}
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground sm:hidden">
                <span className="font-mono">{formatFileSize(file.size)}</span>
                <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
                <span>{formatDate(file.uploadedAt)}</span>
              </div>
            </div>

            <p className="hidden w-24 font-mono text-[11px] text-muted-foreground md:block">
              {formatFileSize(file.size)}
            </p>

            <p className="hidden w-28 text-[11px] text-muted-foreground lg:block">
              {formatDate(file.uploadedAt)}
            </p>

            <div className="flex w-28 items-center justify-end gap-1">
              <ActionButton onClick={() => onDownload(file)} label="Download file">
                <Download className="h-3.5 w-3.5" />
              </ActionButton>
              <ActionButton onClick={() => onShare(file)} label="Share file">
                <Share2 className="h-3.5 w-3.5" />
              </ActionButton>
              <ActionButton onClick={() => onDelete(file.id)} label="Delete file" destructive>
                <Trash2 className="h-3.5 w-3.5" />
              </ActionButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileList;