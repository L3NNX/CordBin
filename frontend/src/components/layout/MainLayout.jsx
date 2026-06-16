import { useState } from "react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import {
  PanelLeft,
  PanelLeftClose,
  Menu,
  X,
  Home,
  ImageIcon,
  Video,
  Music,
  FileText,
  File as FileIcon,
  BarChart3,
  Sun,
  Moon,
  LogOut,
  Upload,
  HardDrive,
} from "lucide-react";
import { cn } from "../../lib/utils";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = ({
  activeFilter,
  onFilterChange,
  onUpload,
  onShowStats,
  onLogout,
  storageUsed,
  storageTotal,
  onClose,
}) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const storagePercent =
    storageTotal > 0 ? Math.min((storageUsed / storageTotal) * 100, 100) : 0;

  const fmt = (b) => {
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
    if (b < 1024 ** 3) return (b / 1024 ** 2).toFixed(1) + " MB";
    return (b / 1024 ** 3).toFixed(2) + " GB";
  };

  const nav = [
    { id: "all",      label: "All Files",  icon: Home },
    { id: "image",    label: "Images",     icon: ImageIcon },
    { id: "video",    label: "Videos",     icon: Video },
    { id: "audio",    label: "Audio",      icon: Music },
    { id: "document", label: "Documents",  icon: FileText },
    { id: "other",    label: "Other",      icon: FileIcon },
  ];

  const handleNav = (id) => {
    onFilterChange(id);
    onClose?.();
  };

  return (
    <div className="flex h-full flex-col bg-card">

      {/* ── Logo ── */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5">
        <button
          onClick={() => { navigate("/"); handleNav("all"); }}
          className="flex items-center gap-3 focus-visible:outline-none"
        >
          <img src="/favicon.svg" alt="CordBin" className="h-8 w-8 shrink-0" />
          <div className="text-left">
            <p className="text-sm font-semibold leading-none tracking-tight">
              CordBin
            </p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Modern file storage
            </p>
          </div>
        </button>
      </div>

      {/* ── Upload CTA ── */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => { onUpload(); onClose?.(); }}
          className={cn(
            "group relative flex w-full items-center justify-center gap-2",
            "h-9 rounded-lg border border-border bg-background",
            "text-sm font-medium text-foreground",
            "transition-all duration-150 hover:bg-muted active:scale-[0.98]",
          )}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload files
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-2">
        <p className="mb-1.5 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
          Library
        </p>

        <div className="space-y-px">
          {nav.map(({ id, label, icon: Icon }) => {
            const active = activeFilter === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                data-testid={`nav-${id}`}
                className={cn(
                  "group flex w-full items-center gap-2.5 rounded-md px-2.5 h-9 text-sm transition-all duration-100",
                  active
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Storage widget ── */}
      <div className="mx-3 mb-2 rounded-lg border border-border bg-muted/40 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Storage</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            {storagePercent.toFixed(0)}%
          </span>
        </div>

        <div className="h-1 w-full overflow-hidden rounded-full bg-border">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              storagePercent > 90
                ? "bg-destructive"
                : storagePercent > 70
                ? "bg-yellow-500"
                : "bg-foreground",
            )}
            style={{ width: `${storagePercent}%` }}
          />
        </div>

        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          {fmt(storageUsed)} / {fmt(storageTotal)}
        </p>
      </div>

      {/* ── Footer actions ── */}
      <div className="border-t border-border px-3 py-2 space-y-px">
        <button
          onClick={() => { onShowStats(); onClose?.(); }}
          data-testid="stats-nav-btn"
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 h-9 text-sm
            text-muted-foreground transition-all duration-100 hover:bg-muted hover:text-foreground"
        >
          <BarChart3 className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Storage stats</span>
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-testid="theme-toggle-btn"
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 h-9 text-sm
            text-muted-foreground transition-all duration-100 hover:bg-muted hover:text-foreground"
        >
          {theme === "dark"
            ? <Sun className="h-4 w-4 shrink-0" />
            : <Moon className="h-4 w-4 shrink-0" />}
          <span className="flex-1 text-left">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>

        <button
          onClick={() => { onClose?.(); onLogout(); }}
          data-testid="logout-btn"
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 h-9 text-sm
            text-muted-foreground transition-all duration-100
            hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Log out</span>
        </button>
      </div>
    </div>
  );
};

// ─── MainLayout ───────────────────────────────────────────────────────────────

const MainLayout = ({
  children,
  onShowStats,
  onUpload,
  onFilterChange,
  onLogout,
  activeFilter,
  storageUsed = 0,
  storageTotal = 1073741824,
}) => {
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [mobileSidebarOpen, setMobile]      = useState(false);

  const sidebarProps = {
    activeFilter,
    onFilterChange,
    onUpload,
    onShowStats,
    onLogout,
    storageUsed,
    storageTotal,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">

      {/* ── Desktop sidebar ── */}
      <aside
        data-testid="sidebar"
        className={cn(
          "hidden md:block shrink-0 border-r border-border",
          "transition-all duration-300 ease-out overflow-hidden",
          sidebarOpen ? "w-[220px]" : "w-0",
        )}
      >
        {sidebarOpen && (
          <Sidebar {...sidebarProps} onClose={() => {}} />
        )}
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setMobile(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-[220px] shadow-xl">
            <button
              onClick={() => setMobile(false)}
              className="absolute right-3 top-[18px] z-10 grid h-8 w-8 place-items-center
                rounded-md text-muted-foreground hover:bg-muted transition"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar
              {...sidebarProps}
              onClose={() => setMobile(false)}
            />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* ── Top bar ── */}
        <header
          className={cn(
            "flex h-16 shrink-0 items-center gap-3 border-b border-border",
            "bg-background/80 px-4 backdrop-blur-md",
          )}
        >
          {/* Mobile menu */}
          <button
            onClick={() => setMobile(true)}
            className="grid h-9 w-9 place-items-center rounded-md
              text-muted-foreground hover:bg-muted transition md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="hidden md:grid h-9 w-9 place-items-center rounded-md
              text-muted-foreground hover:bg-muted transition"
          >
            {sidebarOpen
              ? <PanelLeftClose className="h-4 w-4" />
              : <PanelLeft className="h-4 w-4" />}
          </button>

          {/* Spacer */}
          <div className="flex-1" />
        </header>

        {/* ── Content ── */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;