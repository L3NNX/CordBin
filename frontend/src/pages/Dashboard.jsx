import { useState, useEffect } from "react";
import { toast } from "sonner";
import MainLayout from "../components/layout/MainLayout";
import FileUploadZone from "../components/files/FileUploadZone";
import FileGrid from "../components/files/FileGrid";
import FileList from "../components/files/FileList";
import FilePreviewModal from "../components/files/FilePreviewModal";
import ShareModal from "../components/files/ShareModal";
import StorageDashboard from "../components/dashboard/StorageDashboard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Grid, List, Upload, Search, Plus, FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { fileService } from "../service/services";
import { cn } from "../lib/utils";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFiles();
    loadFolders();
  }, [currentFolder, searchQuery]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await fileService.listFiles();
      const transformedFiles = response.files.map((file) => ({
        id: file._id,
        name: file.fileName,
        type: file.fileType,
        size: file.fileSize,
        uploadedAt: file.uploadDate,
        thumbnailId: file.thumbnail || null,
      }));
      setFiles(transformedFiles);
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const mockFolders = [
        { id: "folder-1", name: "Documents", fileCount: 5 },
        { id: "folder-2", name: "Photos", fileCount: 12 },
      ];
      setFolders(mockFolders);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const handleUploadComplete = () => {
    loadFiles();
    setShowUploadDialog(false);
    toast.success("Files uploaded successfully!");
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      setNewFolderName("");
      setShowNewFolderDialog(false);
      loadFolders();
      toast.success("Folder created!");
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await fileService.deleteFile([fileId]);
      loadFiles();
      toast.success("File deleted");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const handleDeleteFolder = async () => {
    try {
      loadFolders();
      toast.success("Folder deleted");
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder");
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  const handleShare = (file) => {
    setSelectedFile(file);
    setShowShare(true);
  };

  const handleDownload = async (file) => {
    try {
      const response = await fileService.downloadFile(file.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <MainLayout
      folders={folders}
      currentFolder={currentFolder}
      onFolderChange={setCurrentFolder}
      onDeleteFolder={handleDeleteFolder}
      onShowStats={() => setShowStats(true)}
    >
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 -mx-6 mb-6 border-b border-border/60 bg-background/80 px-6 pb-5 backdrop-blur-xl">
        {/* Top row: title + actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="font-display text-2xl tracking-tight text-foreground md:text-3xl"
              data-testid="dashboard-title"
            >
              My Files
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {files.length} file{files.length !== 1 && "s"}
              {folders.length > 0 && ` · ${folders.length} folders`}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowNewFolderDialog(true)}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground
                transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 active:scale-[0.98]"
              data-testid="new-folder-btn"
            >
              <FolderPlus className="h-4 w-4" />
              <span className="hidden sm:inline">New Folder</span>
            </button>

            <button
              onClick={() => setShowUploadDialog(true)}
              className="group flex items-center gap-2 rounded-xl gradient-accent px-5 py-2 text-sm font-medium text-accent-foreground
                shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent-sm active:scale-[0.98]"
              data-testid="upload-btn"
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </button>
          </div>
        </div>

        {/* Bottom row: search + view toggle */}
        <div className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground
                placeholder:text-muted-foreground/50 transition-colors duration-150
                focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
              data-testid="search-input"
            />
          </div>

          <div className="flex gap-1 rounded-xl border border-border p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg transition-all duration-150",
                viewMode === "grid"
                  ? "gradient-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-testid="grid-view-btn"
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg transition-all duration-150",
                viewMode === "list"
                  ? "gradient-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-testid="list-view-btn"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20" data-testid="loading-state">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading files...</p>
        </div>
      ) : files.length === 0 && folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" data-testid="empty-state">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-accent/5 border border-accent/10">
            <Upload className="h-7 w-7 text-accent/60" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No files yet</h3>
          <p className="mt-1.5 mb-6 text-sm text-muted-foreground">
            Upload your first file to get started
          </p>
          <button
            onClick={() => setShowUploadDialog(true)}
            className="group flex items-center gap-2 rounded-xl gradient-accent px-6 py-2.5 text-sm font-medium text-accent-foreground
              shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent-sm active:scale-[0.98]"
            data-testid="upload-first-btn"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </button>
        </div>
      ) : (
        <div data-testid="files-container">
          {viewMode === "grid" ? (
            <FileGrid
              files={files}
              folders={folders}
              onFileClick={handleFileClick}
              onFolderClick={setCurrentFolder}
              onDelete={handleDeleteFile}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          ) : (
            <FileList
              files={files}
              folders={folders}
              onFileClick={handleFileClick}
              onFolderClick={setCurrentFolder}
              onDelete={handleDeleteFile}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          )}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent data-testid="upload-dialog">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <FileUploadZone
            folderId={currentFolder}
            onUploadComplete={handleUploadComplete}
          />
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent data-testid="new-folder-dialog">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground
                placeholder:text-muted-foreground/50 transition-colors duration-150
                focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
              data-testid="folder-name-input"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewFolderDialog(false)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground
                  transition-colors duration-150 hover:bg-accent/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="rounded-xl gradient-accent px-5 py-2.5 text-sm font-medium text-accent-foreground
                  shadow-sm transition-all duration-200 hover:shadow-accent-sm active:scale-[0.98]"
                data-testid="create-folder-btn"
              >
                Create
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Preview */}
      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          open={showPreview}
          onClose={() => setShowPreview(false)}
          onDownload={() => handleDownload(selectedFile)}
          onShare={() => {
            setShowPreview(false);
            setShowShare(true);
          }}
        />
      )}

      {/* Share */}
      {selectedFile && (
        <ShareModal
          file={selectedFile}
          open={showShare}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* Storage Stats */}
      <StorageDashboard open={showStats} onClose={() => setShowStats(false)} />
    </MainLayout>
  );
};

export default Dashboard;