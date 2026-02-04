import {
  File as FileIcon,
  Image as ImageIcon,
  Video,
  FileText,
  Folder as FolderIcon,
  MoreVertical,
  Download,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const FileGrid = ({ 
  files = [], 
  folders = [], 
  onFileClick, 
  onFolderClick, 
  onDelete, 
  onShare, 
  onDownload 
}) => {
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-8 w-8" />;
    if (type.startsWith("video/")) return <Video className="h-8 w-8" />;
    if (type.includes("pdf") || type.includes("text")) return <FileText className="h-8 w-8" />;
    return <FileIcon className="h-8 w-8" />;
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

  // Safety check - ensure arrays exist
  const safeFiles = Array.isArray(files) ? files : [];
  const safeFolders = Array.isArray(folders) ? folders : [];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {/* Folders */}
      {safeFolders.map((folder) => (
        <div
          key={folder.id}
          className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
          onClick={() => onFolderClick(folder.id)}
          data-testid={`folder-card-${folder.id}`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FolderIcon className="h-8 w-8 text-primary" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`folder-menu-${folder.id}`}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(folder.id);
                    }}
                    className="text-destructive"
                    data-testid={`delete-folder-${folder.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-medium truncate mb-1" data-testid={`folder-name-${folder.id}`}>{folder.name}</h3>
            <p className="text-xs text-muted-foreground">{folder.fileCount} files</p>
          </div>
        </div>
      ))}

      {/* Files */}
      {safeFiles.map((file) => (
        <div
          key={file.id}
          className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
          onClick={() => onFileClick(file)}
          data-testid={`file-card-${file.id}`}
        >
          {/* Thumbnail or Icon */}
          <div className="file-card-thumbnail flex items-center justify-center bg-muted">
            {file.type.startsWith("image/") && file.thumbnailId ? (
              <img
                src={`$/files/${file.id}/thumbnail`}
                alt={file.name}
                className="w-full h-full object-cover"
                data-testid={`file-thumbnail-${file.id}`}
              />
            ) : (
              <div className="text-muted-foreground">{getFileIcon(file.type)}</div>
            )}
          </div>

          {/* File Info */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-medium text-sm truncate flex-1" data-testid={`file-name-${file.id}`}>
                {file.name}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6" data-testid={`file-menu-${file.id}`}>
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(file);
                    }}
                    data-testid={`download-file-${file.id}`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare(file);
                    }}
                    data-testid={`share-file-${file.id}`}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(file.id);
                    }}
                    className="text-destructive"
                    data-testid={`delete-file-${file.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(file.uploadedAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;