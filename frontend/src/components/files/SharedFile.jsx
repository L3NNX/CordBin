import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, FileIcon, Image as ImageIcon, FileText, Video } from "lucide-react";


const SharedFile = () => {
  const { token } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSharedFile();
  }, [token]);

  const loadSharedFile = async () => {
    try {
      const response = await axios.get(`/share/${token}`);
      setFile(response.data);
    } catch (error) {
      console.error("Error loading shared file:", error);
      toast.error("Failed to load shared file");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/share/${token}/download`, {
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

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-16 w-16" />;
    if (type.startsWith("video/")) return <Video className="h-16 w-16" />;
    if (type.includes("pdf") || type.includes("text")) return <FileText className="h-16 w-16" />;
    return <FileIcon className="h-16 w-16" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">File not found</h2>
          <p className="text-muted-foreground">This shared link may have expired or been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-card border rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-primary mb-4">
              {getFileIcon(file.type)}
            </div>

            <h1 className="text-2xl font-heading font-bold mb-2" data-testid="shared-file-name">
              {file.name}
            </h1>

            <p className="text-muted-foreground mb-6">
              {formatFileSize(file.size)} • {file.type}
            </p>

            <Button
              onClick={handleDownload}
              size="lg"
              className="rounded-full shadow-lg shadow-primary/20"
              data-testid="download-shared-file-btn"
            >
              <Download className="h-5 w-5 mr-2" />
              Download File
            </Button>
          </div>

          {/* Preview if possible */}
          {file.type.startsWith("image/") && (
            <div className="mt-8">
              <img
                src={`/files/${file.id}/preview`}
                alt={file.name}
                className="w-full rounded-lg"
                data-testid="shared-file-preview"
              />
            </div>
          )}

          {file.type === "application/pdf" && (
            <div className="mt-8">
              <iframe
                src={`/files/${file.id}/preview`}
                className="w-full h-96 rounded-lg border"
                title={file.name}
                data-testid="shared-file-preview"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedFile;