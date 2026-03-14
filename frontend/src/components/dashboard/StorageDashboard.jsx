import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  HardDrive, Files, TrendingUp, BarChart3,
  File as FileIcon, Image as ImageIcon, Video, Music,
  FileText, Archive, Code, AlertTriangle,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "../../lib/utils";
import { fileService } from "../../service/services";

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
};

const CHART_COLORS = [
  "hsl(var(--accent))",
  "#f472b6", // pink
  "#a78bfa", // purple
  "#fb923c", // orange
  "#34d399", // green
  "#60a5fa", // blue
  "#fbbf24", // yellow
];

const getCategoryIcon = (name) => {
  const icons = {
    Images: ImageIcon,
    Videos: Video,
    Audio: Music,
    PDFs: FileText,
    Text: Code,
    Archives: Archive,
    Documents: FileText,
  };
  return icons[name] || FileIcon;
};

const StatCard = ({ icon: Icon, label, value, sub, gradient }) => (
  <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md">
    <div className="flex items-center gap-4">
      <div className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
        gradient ? "gradient-accent shadow-accent-sm" : "bg-accent/10"
      )}>
        <Icon className={cn("h-5 w-5", gradient ? "text-accent-foreground" : "text-accent")} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
          {label}
        </p>
        <p className="mt-0.5 font-display text-2xl text-foreground">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
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
      const data = await fileService.getStorageStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data — by SIZE (not count)
  const chartData = stats?.categories
    ? Object.entries(stats.categories)
        .map(([name, data]) => ({ name, value: data.size, count: data.count }))
        .sort((a, b) => b.value - a.value)
    : [];

  const usagePercent = stats
    ? Math.min(100, Math.round((stats.totalSize / stats.storageLimit) * 100))
    : 0;

  const isNearLimit = usagePercent > 80;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-3xl overflow-auto p-0">

        {/* Header */}
        <div className="relative px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
          <div className="absolute inset-x-0 top-0 h-1 gradient-accent" />
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="font-display text-lg text-foreground">
                  Storage Overview
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Your storage usage and file breakdown
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="border-t border-border/60 px-4 py-5 sm:px-6 sm:py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
              <p className="mt-4 text-sm text-muted-foreground">Loading statistics…</p>
            </div>
          ) : stats && stats.fileCount > 0 ? (
            <div className="space-y-6">

              {/* ── Storage quota bar ── */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
                    Storage Used
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {formatFileSize(stats.totalSize)} / {formatFileSize(stats.storageLimit)}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="overflow-hidden rounded-full bg-accent/10">
                  <div
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-500",
                      isNearLimit ? "bg-destructive" : "gradient-accent"
                    )}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className={cn(
                    "text-[11px] font-medium",
                    isNearLimit ? "text-destructive" : "text-accent"
                  )}>
                    {usagePercent}% used
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatFileSize(stats.storageLimit - stats.totalSize)} remaining
                  </span>
                </div>

                {/* Warning if near limit */}
                {isNearLimit && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/5 border border-destructive/15 px-3 py-2">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                    <p className="text-[11px] text-destructive">
                      You're running low on storage. Consider deleting unused files.
                    </p>
                  </div>
                )}
              </div>

              {/* ── Stat cards ── */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard
                  icon={HardDrive}
                  label="Total Size"
                  value={formatFileSize(stats.totalSize)}
                  gradient
                />
                <StatCard
                  icon={Files}
                  label="Total Files"
                  value={stats.fileCount}
                />
                <StatCard
                  icon={BarChart3}
                  label="Avg File Size"
                  value={formatFileSize(
                    stats.fileCount > 0
                      ? Math.round(stats.totalSize / stats.fileCount)
                      : 0
                  )}
                />
              </div>

              {/* ── File type distribution ── */}
              {chartData.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                  <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
                    Storage by File Type
                  </p>

                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                    {/* Pie chart */}
                    <div className="h-44 w-44 shrink-0 sm:h-48 sm:w-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {chartData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => formatFileSize(value)}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '0.75rem',
                              fontSize: '12px',
                              boxShadow: '0 4px 12px hsl(0 0% 0% / 0.08)',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend — shows SIZE and COUNT */}
                    <div className="w-full min-w-0 flex-1 space-y-2.5">
                      {chartData.map((entry, index) => {
                        const pct = stats.totalSize > 0
                          ? ((entry.value / stats.totalSize) * 100).toFixed(0)
                          : 0;
                        const Icon = getCategoryIcon(entry.name);

                        return (
                          <div key={entry.name} className="flex items-center gap-3 min-w-0">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-sm"
                              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="flex-1 truncate text-sm text-foreground">
                              {entry.name}
                            </span>
                            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                              {formatFileSize(entry.value)}
                            </span>
                            <span className="shrink-0 text-[10px] text-muted-foreground/60">
                              {entry.count} file{entry.count !== 1 && 's'} · {pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Two columns: Recent + Largest ── */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Recent uploads */}
                {stats.recentUploads?.length > 0 && (
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-accent" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
                        Recent Uploads
                      </p>
                    </div>

                    <div className="space-y-1">
                      {stats.recentUploads.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-accent/[0.02]"
                        >
                          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted">
                            <FileIcon className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">
                              {file.name}
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Largest files */}
                {stats.largestFiles?.length > 0 && (
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <HardDrive className="h-3.5 w-3.5 text-accent" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
                        Largest Files
                      </p>
                    </div>

                    <div className="space-y-1">
                      {stats.largestFiles.map((file, i) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-accent/[0.02]"
                        >
                          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted">
                            <span className="font-mono text-[10px] font-bold text-muted-foreground">
                              #{i + 1}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">
                              {file.name}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-[11px] font-medium text-accent">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-accent/10 bg-accent/5">
                <BarChart3 className="h-6 w-6 text-accent/60" />
              </div>
              <p className="text-sm font-medium text-foreground">No statistics yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Upload files to see your usage</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StorageDashboard;