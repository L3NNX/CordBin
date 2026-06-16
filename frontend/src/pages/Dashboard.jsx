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

const CHUNK_SIZE = 8 * 1024 * 1024; 

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

// Replace ONLY the return (...) block in your Dashboard with this (logic unchanged)

return (
  <MainLayout
    onShowStats={() => setShowStats(true)}
    onUpload={() => setShowUploadDialog(true)}
    onFilterChange={setActiveFilter}
    activeFilter={activeFilter}
    onLogout={logout}
    storageUsed={storageUsed}
    storageTotal={1073741824}
  >
    {/* ── Page wrapper ── */}
    <div className="min-h-full px-6 py-8 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Page header ── */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/60">
              {isSearching ? "Search" : "Library"}
            </p>
            <h1
              className="text-3xl tracking-tight"
              data-testid="dashboard-title"
            >
              {isSearching ? "Search results" : getCategoryLabel()}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSearching ? (
                <>
                  {filteredFiles.length}{" "}
                  {filteredFiles.length === 1 ? "file" : "files"} for{" "}
                  <span className="text-foreground">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                </>
              ) : (
                <>
                  {filteredFiles.length}{" "}
                  {filteredFiles.length === 1 ? "file" : "files"}
                </>
              )}
            </p>
          </div>

          {/* ── Upload button ── */}
          <button
            onClick={() => setShowUploadDialog(true)}
            data-testid="upload-btn"
            className={cn(
              "inline-flex shrink-0 items-center gap-2",
              "h-9 rounded-lg border border-foreground bg-foreground px-4",
              "font-mono text-xs font-medium text-background",
              "transition-all duration-150 hover:opacity-80 active:scale-[0.97]",
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload files
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="search-input"
              className={cn(
                "h-9 w-full rounded-lg border border-border bg-card pl-9 pr-9",
                "font-mono text-sm placeholder:text-muted-foreground/50",
                "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            />
            {isSearching && (
              <button
                onClick={clearSearch}
                data-testid="clear-search-btn"
                className="absolute right-2 top-1/2 -translate-y-1/2 grid h-5 w-5 place-items-center
                  rounded text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              data-testid="grid-view-btn"
              aria-label="Grid view"
              className={cn(
                "grid h-9 w-9 place-items-center border-r border-border transition",
                viewMode === "grid"
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              data-testid="list-view-btn"
              aria-label="List view"
              className={cn(
                "grid h-9 w-9 place-items-center transition",
                viewMode === "list"
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ── Incomplete banner ── */}
        {showIncompleteBanner && incompleteFiles.length > 0 && (
          <IncompleteFileBanner
            files={incompleteFiles}
            resumingFiles={resumingFiles}
            onResume={handleResumeUpload}
            onDelete={handleDeleteIncomplete}
            onDismiss={() => setShowIncompleteBanner(false)}
          />
        )}

        {/* ── Content area ── */}
        {loading ? (
          <div
            className="flex flex-col items-center justify-center py-32"
            data-testid="loading-state"
          >
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Loading…
            </p>
          </div>

        ) : isSearching && filteredFiles.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-32"
            data-testid="no-results-state"
          >
            <div className="corner-bracket mb-6 grid h-14 w-14 place-items-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold">No results</h3>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              Nothing matched &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              onClick={clearSearch}
              data-testid="clear-search-results-btn"
              className="h-9 rounded-lg border border-border bg-card px-5 font-mono text-xs
                text-muted-foreground transition hover:bg-muted"
            >
              Clear search
            </button>
          </div>

        ) : filteredFiles.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-32"
            data-testid="empty-state"
          >
            <div className="corner-bracket mb-6 grid h-14 w-14 place-items-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold">
              {activeFilter === "all"
                ? "No files yet"
                : `No ${getCategoryLabel().toLowerCase()}`}
            </h3>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              {activeFilter === "all"
                ? "Upload your first file to get started"
                : `You have no ${getCategoryLabel().toLowerCase()} yet`}
            </p>
            <button
              onClick={() => setShowUploadDialog(true)}
              data-testid="upload-first-btn"
              className={cn(
                "inline-flex items-center gap-2 h-9 rounded-lg px-5",
                "border border-foreground bg-foreground font-mono text-xs text-background",
                "transition hover:opacity-80 active:scale-[0.97]",
              )}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload files
            </button>
          </div>

        ) : (
          <div data-testid="files-container" className="space-y-6">
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
                files={visibleFiles}
                onFileClick={handleFileClick}
                onDelete={handleDeleteFile}
                onShare={handleShare}
                onDownload={handleDownload}
              />
            )}

            {hasMore && (
              <div className="flex flex-col items-center gap-2 pt-6">
                <p className="font-mono text-[11px] text-muted-foreground">
                  {visibleFiles.length} of {filteredFiles.length}
                </p>
                <button
                  onClick={() => setVisibleCount((c) => c + 20)}
                  data-testid="load-more-btn"
                  className="h-9 rounded-lg border border-border bg-card px-6 font-mono text-xs
                    text-muted-foreground transition hover:bg-muted active:scale-[0.97]"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>

    {/* ── Upload dialog ── */}
    <Dialog open={showUploadDialog} onOpenChange={handleUploadDialogChange}>
      <DialogContent
        data-testid="upload-dialog"
        onPointerDownOutside={(e) => isUploading && e.preventDefault()}
        onEscapeKeyDown={(e) => isUploading && e.preventDefault()}
        onInteractOutside={(e) => isUploading && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            Upload files
            {isUploading && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border
                bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
                Uploading…
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <FileUploadZone
          onUploadComplete={handleUploadComplete}
          onUploadingChange={setIsUploading}
        />
      </DialogContent>
    </Dialog>

    {/* ── File preview ── */}
    {selectedFile && (
      <FilePreviewModal
        file={selectedFile}
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onDownload={() => handleDownload(selectedFile)}
        onShare={() => { setShowPreview(false); setShowShare(true); }}
      />
    )}

    {/* ── Share modal ── */}
    {selectedFile && (
      <ShareModal
        file={selectedFile}
        open={showShare}
        onClose={() => setShowShare(false)}
      />
    )}

    {/* ── Storage stats ── */}
    <StorageDashboard open={showStats} onClose={() => setShowStats(false)} />
  </MainLayout>
);
};

export default Dashboard;