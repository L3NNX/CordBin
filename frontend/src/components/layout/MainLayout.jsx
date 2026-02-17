import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  HardDrive,
  BarChart3,
  Home,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File as FileIcon,
  Share2,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

const SidebarContent = ({
  onShowStats,
  onUpload,
  onFilterChange,
  activeFilter,
  storageUsed,
  onLogout,
  storageTotal,
  setMobileSidebarOpen,
  theme,
  setTheme,
}) => {
  const navigate = useNavigate();

  const handleNav = (filter) => {
    onFilterChange(filter);
    setMobileSidebarOpen(false);
  };

  // Storage percentage
  const storagePercent =
    storageTotal > 0 ? Math.min((storageUsed / storageTotal) * 100, 100) : 0;

  const formatStorage = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const categories = [
    { id: "all", label: "All Files", icon: Home },
    { id: "image", label: "Images", icon: ImageIcon },
    { id: "video", label: "Videos", icon: Video },
    { id: "audio", label: "Audio", icon: Music },
    { id: "document", label: "Documents", icon: FileText },
    { id: "other", label: "Other", icon: FileIcon },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-5 pb-4 pt-6">
        <button
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            navigate("/");
            handleNav("all");
          }}
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-accent shadow-accent-sm">
            <HardDrive className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h2
              className="font-display text-lg leading-none tracking-tight"
              data-testid="app-title"
            >
              StashBox
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Modern file storage
            </p>
          </div>
        </button>
      </div>

      {/* Upload Button */}
      <div className="px-3 pb-4">
        <button
          onClick={() => {
            onUpload();
            setMobileSidebarOpen(false);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl gradient-accent
            px-4 h-10 text-sm font-medium text-accent-foreground shadow-accent-sm
            transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
          data-testid="sidebar-upload-btn"
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </button>
      </div>

      {/* Navigation Categories */}
      <nav className="flex flex-1 flex-col overflow-hidden px-3">
        <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/50">
          Categories
        </p>

        <div className="space-y-0.5">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => handleNav(cat.id)}
                data-testid={`nav-${cat.id}`}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 h-10 text-sm transition-all duration-150",
                  isActive
                    ? "gradient-accent text-accent-foreground shadow-accent-sm font-medium"
                    : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Shared Files link */}
        {/* <div className="mt-6">
          <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/50">
            Quick Access
          </p>
          <button
            onClick={() => handleNav("shared")}
            data-testid="nav-shared"
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl px-3 h-10 text-sm transition-all duration-150",
              activeFilter === "shared"
                ? "gradient-accent text-accent-foreground shadow-accent-sm font-medium"
                : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
            )}
          >
            <Share2 className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Shared Files</span>
          </button>
        </div> */}
      </nav>

      {/* Storage Usage Mini Card */}
      <div className="mx-3 mb-3 rounded-xl border border-border/60 bg-muted/30 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-foreground">Storage</p>
          <p className="font-mono text-[11px] text-muted-foreground">
            {storagePercent.toFixed(0)}%
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              storagePercent > 90
                ? "bg-destructive"
                : storagePercent > 70
                ? "bg-yellow-500"
                : "gradient-accent"
            )}
            style={{ width: `${storagePercent}%` }}
          />
        </div>

        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          {formatStorage(storageUsed)} of {formatStorage(storageTotal)} used
        </p>
      </div>

      {/* Footer actions */}
      <div className="border-t border-border/60 px-3 py-3 space-y-0.5">
        <button
          onClick={() => {
            onShowStats();
            setMobileSidebarOpen(false);
          }}
          data-testid="stats-nav-btn"
          className="group flex w-full items-center gap-3 rounded-xl px-3 h-10 text-sm text-muted-foreground
            transition-colors duration-150 hover:bg-accent/5 hover:text-foreground"
        >
          <BarChart3 className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Storage Stats</span>
          <ChevronRight
            className="h-3.5 w-3.5 text-muted-foreground/40 transition-transform duration-150
            group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          />
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-testid="theme-toggle-btn"
          className="group flex w-full items-center gap-3 rounded-xl px-3 h-10 text-sm text-muted-foreground
            transition-colors duration-150 hover:bg-accent/5 hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 shrink-0" />
          ) : (
            <Moon className="h-4 w-4 shrink-0" />
          )}
          <span className="flex-1 text-left">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

          <button
          onClick={() => {
            setMobileSidebarOpen(false);
            onLogout();
          }}
          data-testid="logout-btn"
          className="group flex w-full items-center gap-3 rounded-xl px-3 h-10 text-sm text-muted-foreground
            transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Log Out</span>
        </button>
      </div>
    </div>
  );
};

const MainLayout = ({ children, onShowStats, onUpload, onFilterChange, onLogout, activeFilter, storageUsed = 0, storageTotal = 1073741824 }) => {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/60 bg-card overflow-hidden",
          "transition-[width] duration-300 ease-out",
          sidebarOpen ? "w-64" : "w-0"
        )}
        data-testid="sidebar"
      >
        {sidebarOpen && (
          <SidebarContent
            onShowStats={onShowStats}
            onUpload={onUpload}
            onFilterChange={onFilterChange}
            onLogout={onLogout}
            activeFilter={activeFilter}
            storageUsed={storageUsed}
            storageTotal={storageTotal}
            setMobileSidebarOpen={setMobileSidebarOpen}
            theme={theme}
            setTheme={setTheme}
          />
        )}
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 h-full w-72 bg-card shadow-2xl animate-slide-in">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute right-3 top-5 grid h-8 w-8 place-items-center rounded-lg
                text-muted-foreground transition-colors duration-150
                hover:bg-accent/5 hover:text-foreground"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              onShowStats={onShowStats}
              onUpload={onUpload}
              onFilterChange={onFilterChange}
               onLogout={onLogout}
              activeFilter={activeFilter}
              storageUsed={storageUsed}
              storageTotal={storageTotal}
              setMobileSidebarOpen={setMobileSidebarOpen}
              theme={theme}
              setTheme={setTheme}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-4 bg-card/80 backdrop-blur-sm">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg md:hidden
              text-muted-foreground transition-colors duration-150
              hover:bg-accent/5 hover:text-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="hidden md:grid h-9 w-9 place-items-center rounded-lg
              text-muted-foreground transition-colors duration-150
              hover:bg-accent/5 hover:text-foreground"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </button>

          <span className="truncate text-sm font-medium">All Files</span>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;