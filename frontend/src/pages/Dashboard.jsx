import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import MainLayout from "../components/layout/MainLayout";
import FileUploadZone from "../components/files/FileUploadZone";
import FileGrid from "../components/files/FileGrid";
import FileList from "../components/files/FileList";
import FilePreviewModal from "../components/files/FilePreviewModal";
import ShareModal from "../components/files/ShareModal";
import StorageDashboard from "../components/dashboard/StorageDashboard";
import IncompleteFileBanner from "../components/files/IncompleteFileBanner";
import { useAuth } from "../hooks/useAuth";
import { Grid, List, Upload, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { fileService } from "../service/services";
import { cn } from "../lib/utils";
import { API_CONFIG } from "../config/api";

const CHUNK_SIZE = 2 * 1024 * 1024; 

const Dashboard = () => {
  const { logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [incompleteFiles, setIncompleteFiles] = useState([]);
  const [showIncompleteBanner, setShowIncompleteBanner] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isUploading, setIsUploading] = useState(false);
  const [resumingFiles, setResumingFiles] = useState({});
  
  useEffect(() => {
    loadFiles();
  }, []);
const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await fileService.listFiles();

      const complete = [];
      const incomplete = [];

      response.files.forEach((file) => {
        const transformed = {
          id: file._id,
          name: file.fileName,
          type: file.fileType,
          size: file.fileSize,
          uploadedAt: file.uploadDate,
          thumbnailId: file.thumbnail || null,
          status: file.status || 'complete',
          chunksUploaded: file.chunksUploaded || 0,
          totalChunks: file.totalChunks || 1,
        };

        if (!file.status || file.status === 'complete') {
          complete.push(transformed);
        } else {
          // 'uploading' or 'failed'
          incomplete.push(transformed);
        }
      });

      setFiles(complete);
      setIncompleteFiles(incomplete);
      setShowIncompleteBanner(incomplete.length > 0);
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

  // ─── Filter by category ────────────────────────────────────
  const categoryFilteredFiles = useMemo(() => {
    if (activeFilter === "all") return files;

    return files.filter((file) => {
      const type = file.type?.toLowerCase() || "";
      switch (activeFilter) {
        case "image":
          return type.startsWith("image/");
        case "video":
          return type.startsWith("video/");
        case "audio":
          return type.startsWith("audio/");
        case "document":
          return (
            type.includes("pdf") ||
            type.includes("text") ||
            type.includes("document") ||
            type.includes("spreadsheet") ||
            type.includes("presentation") ||
            type.includes("word") ||
            type.includes("excel") ||
            type.includes("powerpoint")
          );
        case "other":
          return (
            !type.startsWith("image/") &&
            !type.startsWith("video/") &&
            !type.startsWith("audio/") &&
            !type.includes("pdf") &&
            !type.includes("text") &&
            !type.includes("document") &&
            !type.includes("spreadsheet") &&
            !type.includes("word")
          );
        default:
          return true;
      }
    });
  }, [files, activeFilter]);

  // ─── Then filter by search ─────────────────────────────────
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return categoryFilteredFiles;

    const query = searchQuery.toLowerCase().trim();

    return categoryFilteredFiles.filter((file) => {
      const nameMatch = file.name?.toLowerCase().includes(query);
      const typeMatch = file.type?.toLowerCase().includes(query);
      const extension = file.name?.split(".").pop()?.toLowerCase();
      const extensionMatch = extension?.includes(query);

      return nameMatch || typeMatch || extensionMatch;
    });
  }, [categoryFilteredFiles, searchQuery]);

  // ─── Compute storage used ──────────────────────────────────
  const storageUsed = useMemo(() => {
    return files.reduce((total, file) => total + (file.size || 0), 0);
  }, [files]);

  const isSearching = searchQuery.trim().length > 0;

  const clearSearch = () => {
    setSearchQuery("");
  };
  
  // Instead of passing all filteredFiles, slice them
  const visibleFiles = filteredFiles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFiles.length;

  useEffect(() => {
    setVisibleCount(20);
  }, [searchQuery, activeFilter]);
  // Category label for display
  const getCategoryLabel = () => {
    const labels = {
      all: "All Files",
      image: "Images",
      video: "Videos",
      audio: "Audio",
      document: "Documents",
      other: "Other Files",
      shared: "Shared Files",
    };
    return labels[activeFilter] || "All Files";
  };

    const handleUploadDialogChange = (open) => {
    if (!open && isUploading) {
      toast.warning("Please wait for uploads to finish");
      return;
    }
    setShowUploadDialog(open);
  };

  const handleUploadComplete = () => {
    loadFiles();
    setShowUploadDialog(false);
    toast.success("Files uploaded successfully!");
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

    const handleDeleteIncomplete = async (fileId) => {
    try {
      await fileService.deleteFile([fileId]);
      setIncompleteFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success("Incomplete file removed");
    } catch (error) {
      toast.error("Failed to remove file");
    }
  };
const handleResumeUpload = async (incompleteFile, browserFile) => {
    if (browserFile.size !== incompleteFile.size) {
      toast.error(
        `File size doesn't match. Expected ${formatSize(incompleteFile.size)} ` +
        `but got ${formatSize(browserFile.size)}. Select the correct file.`
      );
      return;
    }

    const fileId = incompleteFile.id;

    setResumingFiles((prev) => ({
      ...prev,
      [fileId]: { progress: 0, status: 'resuming' },
    }));

    try {
      const status = await fileService.getUploadStatus(fileId);
      const { uploadedChunks, totalChunks } = status;
      const uploadedSet = new Set(uploadedChunks);

      // Find missing chunks (1-based)
      const missingChunks = [];
      for (let i = 1; i <= totalChunks; i++) {
        if (!uploadedSet.has(i)) missingChunks.push(i);
      }

      if (missingChunks.length === 0) {
        toast.success(`"${incompleteFile.name}" is already fully uploaded!`);
        setResumingFiles((prev) => ({
          ...prev,
          [fileId]: { progress: 100, status: 'complete' },
        }));
        loadFiles();
        return;
      }

      toast.info(
        `Resuming "${incompleteFile.name}" — ${missingChunks.length} of ${totalChunks} chunks remaining`
      );

      let completedCount = 0;
      const initialProgress = Math.round((uploadedChunks.length / totalChunks) * 100);

      setResumingFiles((prev) => ({
        ...prev,
        [fileId]: { progress: initialProgress, status: 'resuming' },
      }));

      for (const chunkIndex1Based of missingChunks) {
        const chunkIndex0Based = chunkIndex1Based - 1;
        const start = chunkIndex0Based * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, browserFile.size);
        const chunk = browserFile.slice(start, end);

        // Retry logic
        let lastError = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            await fileService.uploadChunk(fileId, chunkIndex0Based, chunk, totalChunks);
            lastError = null;
            break;
          } catch (err) {
            lastError = err;
            if (attempt < 3) await new Promise((r) => setTimeout(r, 2000 * Math.pow(2, attempt - 1)));
          }
        }
        if (lastError) throw lastError;

        completedCount++;
        const progress = Math.round(
          ((uploadedChunks.length + completedCount) / totalChunks) * 100
        );
        setResumingFiles((prev) => ({
          ...prev,
          [fileId]: { progress, status: 'resuming' },
        }));
      }

      setResumingFiles((prev) => ({
        ...prev,
        [fileId]: { progress: 100, status: 'complete' },
      }));
      toast.success(`"${incompleteFile.name}" upload complete!`);

      setTimeout(() => {
        loadFiles();
        setResumingFiles((prev) => {
          const next = { ...prev };
          delete next[fileId];
          return next;
        });
      }, 2000);
    } catch (error) {
      console.error('Resume error:', error);
      setResumingFiles((prev) => ({
        ...prev,
        [fileId]: { progress: 0, status: 'error' },
      }));
      toast.error(`Failed to resume "${incompleteFile.name}"`);
      setTimeout(() => {
        setResumingFiles((prev) => {
          const next = { ...prev };
          delete next[fileId];
          return next;
        });
      }, 3000);
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

  const handleDownload = (file) => {
  const token = localStorage.getItem('accessToken');
  const downloadUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILE_DOWNLOAD}/${file.id}?token=${token}`;
  
  // ✅ Native browser download with progress bar
  window.location.href = downloadUrl;
  toast.success('Download started');
};

  return (
    <MainLayout
      onShowStats={() => setShowStats(true)}
      onUpload={() => setShowUploadDialog(true)}
      onFilterChange={setActiveFilter}
      activeFilter={activeFilter}
      onLogout={logout}
      storageUsed={storageUsed}
      storageTotal={1073741824} // 1 GB — replace with actual limit from your API
    >
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 -mx-6 mb-6 border-b border-border/60 bg-background/80 px-6 pt-6 pb-5 backdrop-blur-xl">
        {/* Top row: title + actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="font-display text-2xl tracking-tight text-foreground md:text-3xl"
              data-testid="dashboard-title"
            >
              {isSearching ? "Search Results" : getCategoryLabel()}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSearching ? (
                <>
                  {filteredFiles.length} file
                  {filteredFiles.length !== 1 && "s"}
                  {" found for "}
                  <span className="font-medium text-foreground">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                </>
              ) : (
                <>
                  {filteredFiles.length} file
                  {filteredFiles.length !== 1 && "s"}
                </>
              )}
            </p>
          </div>

          <div className="flex gap-2">
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
              className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-foreground
                placeholder:text-muted-foreground/50 transition-colors duration-150
                focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
              data-testid="search-input"
            />
            {isSearching && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground
                  transition-colors hover:text-foreground"
                data-testid="clear-search-btn"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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

      {showIncompleteBanner && (
        <IncompleteFileBanner
          files={incompleteFiles}
          resumingFiles={resumingFiles} 
           onResume={handleResumeUpload} 
          onDelete={handleDeleteIncomplete}
          onDismiss={() => setShowIncompleteBanner(false)}
        />
      )}

      {/* Content area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20" data-testid="loading-state">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading files...</p>
        </div>
      ) : isSearching && filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" data-testid="no-results-state">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-accent/5 border border-accent/10">
            <Search className="h-7 w-7 text-accent/60" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No results found</h3>
          <p className="mt-1.5 mb-6 text-sm text-muted-foreground">
            No files match <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
          </p>
          <button
            onClick={clearSearch}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground
              transition-all duration-200 hover:bg-accent/5 active:scale-[0.98]"
            data-testid="clear-search-results-btn"
          >
            Clear Search
          </button>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20" data-testid="empty-state">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-accent/5 border border-accent/10">
            <Upload className="h-7 w-7 text-accent/60" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {activeFilter === "all" ? "No files yet" : `No ${getCategoryLabel().toLowerCase()}`}
          </h3>
          <p className="mt-1.5 mb-6 text-sm text-muted-foreground">
            {activeFilter === "all"
              ? "Upload your first file to get started"
              : `You don't have any ${getCategoryLabel().toLowerCase()} yet`}
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
              files={visibleFiles}
              onFileClick={handleFileClick}
              onDelete={handleDeleteFile}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          ) : (
            <FileList
              // files={filteredFiles}
              files={visibleFiles}
              onFileClick={handleFileClick}
              onDelete={handleDeleteFile}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          )}

          {hasMore && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Showing {visibleFiles.length} of {filteredFiles.length} files
              </p>
              <button
                onClick={() => setVisibleCount((prev) => prev + 20)}
                className="rounded-xl border border-border px-6 py-2.5 text-sm 
          font-medium text-foreground transition-all duration-200 
          hover:bg-accent/5 active:scale-[0.98]"
                data-testid="load-more-btn"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={handleUploadDialogChange}>
        <DialogContent data-testid="upload-dialog"   onPointerDownOutside={(e) => {
            if (isUploading) e.preventDefault();
          }}
          // ← NEW: block escape key during uploads
          onEscapeKeyDown={(e) => {
            if (isUploading) e.preventDefault();
          }}
          // ← NEW: block any outside interaction during uploads
          onInteractOutside={(e) => {
            if (isUploading) e.preventDefault();
          }}>
          <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
              Upload Files
              {isUploading && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  Uploading…
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <FileUploadZone onUploadComplete={handleUploadComplete} onUploadingChange={setIsUploading} />
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