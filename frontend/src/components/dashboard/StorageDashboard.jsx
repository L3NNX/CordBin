import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { HardDrive, Files, FolderOpen, TrendingUp, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "../../lib/utils";
import { fileService } from "../../service/services";

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
};

const CHART_COLORS = [
  "hsl(var(--accent))",
  "hsl(var(--accent-secondary))",
  "hsl(220 80% 72%)",
  "hsl(220 60% 80%)",
  "hsl(220 40% 88%)",
];

const StatCard = ({ icon: Icon, label, value, testId, gradient }) => (
  <div
    className="relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md"
    data-testid={testId}
  >
    <div className="flex items-center gap-4">
      <div className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
        gradient ? "gradient-accent shadow-accent-sm" : "bg-accent/10"
      )}>
        <Icon className={cn("h-5 w-5", gradient ? "text-accent-foreground" : "text-accent")} />
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/60">
          {label}
        </p>
        <p className="mt-0.5 font-display text-2xl text-foreground" data-testid={`${testId}-value`}>
          {value}
        </p>
      </div>
    </div>
  </div>
);

const StorageDashboard = ({ open, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) loadStats();
  }, [open]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fileService.listFiles();
      const files = response.files || [];

      // Compute stats from actual file data
      const totalSize = files.reduce((sum, f) => sum + (f.fileSize || 0), 0);
      const fileCount = files.length;

      // Group by file type category
      const typeMap = {};
      files.forEach((f) => {
        const mime = f.fileType || "unknown";
        let category = "Other";
        if (mime.startsWith("image/")) category = "Images";
        else if (mime.startsWith("video/")) category = "Videos";
        else if (mime.startsWith("audio/")) category = "Audio";
        else if (mime.includes("pdf")) category = "PDFs";
        else if (mime.includes("text") || mime.includes("json") || mime.includes("xml")) category = "Text";
        else if (mime.includes("zip") || mime.includes("rar") || mime.includes("tar") || mime.includes("gzip")) category = "Archives";
        else if (mime.includes("word") || mime.includes("document") || mime.includes("spreadsheet") || mime.includes("presentation")) category = "Documents";

        typeMap[category] = (typeMap[category] || 0) + 1;
      });

      // Recent uploads — last 5 files
      const recentUploads = files
        .slice(0, 5)
        .map((f) => ({
          id: f._id,
          name: f.fileName,
          size: f.fileSize,
          uploadedAt: f.uploadDate,
        }));

      setStats({
        totalSize,
        fileCount,
        fileTypes: typeMap,
        recentUploads,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats
    ? Object.entries(stats.fileTypes).map(([name, value]) => ({ name, value }))
    : [];

  const totalFiles = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-auto p-0" data-testid="storage-dashboard">
        {/* Header */}
        <div className="relative px-6 pb-5 pt-6">
          <div className="absolute inset-x-0 top-0 h-1 gradient-accent" />
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <DialogTitle className="font-display text-lg text-foreground">
                  Storage Statistics
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Overview of your storage usage
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="border-t border-border/60 px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
              <p className="mt-4 text-sm text-muted-foreground">Loading statistics…</p>
            </div>
          ) : stats && stats.fileCount > 0 ? (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard
                  icon={HardDrive}
                  label="Total Storage"
                  value={formatFileSize(stats.totalSize)}
                  testId="total-storage-card"
                  gradient
                />
                <StatCard
                  icon={Files}
                  label="Total Files"
                  value={stats.fileCount}
                  testId="file-count-card"
                />
              </div>

              {/* File type distribution */}
              {chartData.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6" data-testid="file-types-chart">
                  <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/60">
                    File Types Distribution
                  </p>

                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
                    <div className="h-48 w-48 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {chartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '0.75rem',
                              fontSize: '12px',
                              boxShadow: '0 4px 6px hsl(0 0% 0% / 0.07)',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex-1 space-y-3">
                      {chartData.map((entry, index) => {
                        const pct = totalFiles > 0 ? ((entry.value / totalFiles) * 100).toFixed(0) : 0;
                        return (
                          <div key={entry.name} className="flex items-center gap-3">
                            <div
                              className="h-3 w-3 shrink-0 rounded-sm"
                              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            <span className="flex-1 text-sm text-foreground">{entry.name}</span>
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {entry.value} ({pct}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent uploads */}
              {stats.recentUploads.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-6" data-testid="recent-uploads-card">
                  <div className="mb-5 flex items-center gap-2.5">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/60">
                      Recent Uploads
                    </p>
                  </div>

                  <div className="space-y-1">
                    {stats.recentUploads.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-accent/[0.02]"
                      >
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted">
                          <Files className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground" data-testid={`recent-file-${file.id}`}>
                            {file.name}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-mono">{formatFileSize(file.size)}</span>
                          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
                          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-accent/10 bg-accent/5">
                <BarChart3 className="h-6 w-6 text-accent/60" />
              </div>
              <p className="text-sm font-medium text-foreground">No statistics available</p>
              <p className="mt-1 text-xs text-muted-foreground">Upload some files to see your usage</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StorageDashboard;