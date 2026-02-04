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
import { Button } from "../ui/button";



const FileList = ({ files, folders, onFileClick, onFolderClick, onDelete, onShare, onDownload }) => {
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (type.startsWith("video/")) return <Video className="h-5 w-5" />;
    if (type.includes("pdf") || type.includes("text")) return <FileText className="h-5 w-5" />;
    return <FileIcon className="h-5 w-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="list-view space-y-2">
      {/* Folders */}
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="file-item group cursor-pointer"
          onClick={() => onFolderClick(folder.id)}
          data-testid={`folder-list-item-${folder.id}`}
        >
          <div className="flex items-center gap-4 flex-1">
            <FolderIcon className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" data-testid={`folder-list-name-${folder.id}`}>{folder.name}</p>
              <p className="text-xs text-muted-foreground">{folder.fileCount} files</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(folder.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`delete-folder-list-${folder.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Files */}
      {files.map((file) => (
        <div
          key={file.id}
          className="file-item group cursor-pointer"
          onClick={() => onFileClick(file)}
          data-testid={`file-list-item-${file.id}`}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="text-muted-foreground flex-shrink-0">{getFileIcon(file.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" data-testid={`file-list-name-${file.id}`}>{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(file);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`download-file-list-${file.id}`}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(file);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`share-file-list-${file.id}`}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(file.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`delete-file-list-${file.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;