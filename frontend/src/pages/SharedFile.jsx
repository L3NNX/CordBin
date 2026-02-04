import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "../components/ui/sonner";
import MainLayout from "../components/layout/MainLayout";
import FileUploadZone from "../components/files/FileUploadZone";
import FileGrid from "../components/files/FileGrid";
import FileList from "../components/files/FileList";
import FilePreviewModal from "../components/files/FilePreviewModal";
import ShareModal from "../components/files/ShareModal";
import StorageDashboard from "../components/dashboard/StorageDashboard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Grid, List, Upload, Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";



const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("uploadedAt");
  const [sortOrder, setSortOrder] = useState("desc");
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
  }, [currentFolder, searchQuery, sortBy, sortOrder]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentFolder) params.append("folderId", currentFolder);
      if (searchQuery) params.append("search", searchQuery);
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const response = await axios.get(`/files?${params}`);
      setFiles(response.data);
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const params = new URLSearchParams();
      if (currentFolder) params.append("parentId", currentFolder);

      const response = await axios.get(`/folders?${params}`);
      setFolders(response.data);
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
      await axios.post(`/folders`, {
        name: newFolderName,
        parentId: currentFolder,
      });
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
      await axios.delete(`/files/${fileId}`);
      loadFiles();
      toast.success("File deleted");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await axios.delete(`/folders/${folderId}`);
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
      const response = await axios.get(`/files/${file.id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
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
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b pb-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight" data-testid="dashboard-title">
              My Files
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {files.length} files {folders.length > 0 && `• ${folders.length} folders`}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowNewFolderDialog(true)}
              variant="outline"
              size="sm"
              className="rounded-full"
              data-testid="new-folder-btn"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button
              onClick={() => setShowUploadDialog(true)}
              size="sm"
              className="rounded-full shadow-lg shadow-primary/20"
              data-testid="upload-btn"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
              data-testid="search-input"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-full"
              data-testid="grid-view-btn"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-full"
              data-testid="list-view-btn"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12" data-testid="loading-state">
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      ) : files.length === 0 && folders.length === 0 ? (
        <div className="text-center py-12" data-testid="empty-state">
          <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No files yet</h3>
          <p className="text-muted-foreground mb-4">Upload your first file to get started</p>
          <Button onClick={() => setShowUploadDialog(true)} className="rounded-full" data-testid="upload-first-btn">
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
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
        <DialogContent className="max-w-2xl" data-testid="upload-dialog">
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
          <div className="space-y-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              data-testid="folder-name-input"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} data-testid="create-folder-btn">
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
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

      {/* Share Modal */}
      {selectedFile && (
        <ShareModal
          file={selectedFile}
          open={showShare}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* Storage Dashboard */}
      <StorageDashboard open={showStats} onClose={() => setShowStats(false)} />
    </MainLayout>
  );
};

export default Dashboard;