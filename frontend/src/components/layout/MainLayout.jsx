import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  HardDrive,
  BarChart3,
  Folder,
  FolderOpen,
  Home,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../../lib/utils";

const SidebarContent = ({
  folders,
  currentFolder,
  onFolderChange,
  onShowStats,
  setMobileSidebarOpen,
  theme,
  setTheme,
}) => {
  const handleNavigate = (folderId) => {
    onFolderChange(folderId);
    setMobileSidebarOpen(false);
  };
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col">

      <div className="px-5 pb-4 pt-6">
        <button className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
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


      <nav className="flex flex-1 flex-col space-y-6 overflow-hidden px-3">
        {/* Home / All Files */}
        <button
          onClick={() => handleNavigate(null)}
          data-testid="home-nav-btn"
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-3 h-10 text-sm transition-colors duration-150",
            !currentFolder
              ? "gradient-accent text-accent-foreground shadow-accent-sm font-medium"
              : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          All Files
        </button>

        {/* Folders Section */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Section label — monospace, uppercase, wide tracking */}
          <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/50">
            Folders
          </p>

          <ScrollArea className="-mr-2 flex-1 pr-2">
            <div className="space-y-0.5">
              {folders.map((folder) => {
                const isActive = currentFolder === folder.id;

                return (
                  <button
                    key={folder.id}
                    onClick={() => handleNavigate(folder.id)}
                    data-testid={`folder-nav-${folder.id}`}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 h-10 text-sm transition-colors duration-150",
                      isActive
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                    )}
                  >
                    {/* Active indicator bar */}
                    <span
                      className={cn(
                        "h-5 w-[3px] shrink-0 rounded-full transition-colors duration-150",
                        isActive ? "gradient-accent" : "bg-transparent"
                      )}
                    />

                    {isActive ? (
                      <FolderOpen className="h-4 w-4 shrink-0" />
                    ) : (
                      <Folder className="h-4 w-4 shrink-0" />
                    )}

                    <span className="flex-1 truncate text-left">
                      {folder.name}
                    </span>

                    {folder.fileCount > 0 && (
                      <span
                        className={cn(
                          "ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-mono tabular-nums transition-colors duration-150",
                          isActive
                            ? "bg-accent/15 text-accent"
                            : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
                        )}
                      >
                        {folder.fileCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </nav>

      <div className="mt-auto border-t border-border/60 px-3 py-3 space-y-0.5">
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
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-transform duration-150
            group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
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
      </div>
    </div>
  );
};

const MainLayout = ({
  children,
  folders,
  currentFolder,
  onFolderChange,
  onDeleteFolder,
  onShowStats,
}) => {
  const { theme, setTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* Current folder name for header breadcrumb */
  const currentFolderName = currentFolder
    ? folders.find((f) => f.id === currentFolder)?.name ?? "Folder"
    : "All Files";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ─────────────────────────────────────────────
          Desktop Sidebar
          
          Width animates between 16rem and 0.
          overflow-hidden clips content during transition.
      ───────────────────────────────────────────── */}
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
            folders={folders}
            currentFolder={currentFolder}
            onFolderChange={onFolderChange}
            onShowStats={onShowStats}
            setMobileSidebarOpen={setMobileSidebarOpen}
            theme={theme}
            setTheme={setTheme}
          />
        )}
      </aside>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer panel */}
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
              folders={folders}
              currentFolder={currentFolder}
              onFolderChange={onFolderChange}
              onShowStats={onShowStats}
              setMobileSidebarOpen={setMobileSidebarOpen}
              theme={theme}
              setTheme={setTheme}
            />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-4 bg-card/80 backdrop-blur-sm">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg md:hidden
              text-muted-foreground transition-colors duration-150
              hover:bg-accent/5 hover:text-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop sidebar toggle */}
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

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 overflow-hidden">
            {currentFolder && (
              <>
                <button
                  onClick={() => onFolderChange(null)}
                  className="text-sm text-muted-foreground transition-colors duration-150
                    hover:text-foreground shrink-0"
                >
                  All Files
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              </>
            )}
            <span className="truncate text-sm font-medium">
              {currentFolderName}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;