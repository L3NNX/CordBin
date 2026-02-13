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
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

/* ============================================================================
   ✅ CHANGE #1:
   SidebarContent is extracted OUTSIDE MainLayout
   This prevents React from recreating the component on every render
============================================================================ */
const SidebarContent = ({
  folders,
  currentFolder,
  onFolderChange,
  onShowStats,
  setMobileSidebarOpen,
  theme,
  setTheme,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* ── Brand ── */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
            <HardDrive className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2
              className="text-lg font-heading font-bold leading-none tracking-tight"
              data-testid="app-title"
            >
              StashBox
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Modern file storage
            </p>
          </div>
        </div>
      </div>

      {/* ── Primary nav ── */}
      <nav className="flex-1 px-3 space-y-6 overflow-hidden">
        {/* Home */}
        <Button
          variant={!currentFolder ? "default" : "ghost"}
          className="w-full justify-start rounded-xl h-10"
          onClick={() => {
            onFolderChange(null);
            setMobileSidebarOpen(false);
          }}
          data-testid="home-nav-btn"
        >
          <Home className="h-4 w-4 mr-3" />
          All Files
        </Button>

        {/* Folders */}
        <div className="flex flex-col min-h-0 flex-1">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Folders
          </p>

          <ScrollArea className="flex-1 -mr-2 pr-2">
            <div className="space-y-0.5">
              {folders.map((folder) => {
                const isActive = currentFolder === folder.id;

                return (
                  <Button
                    key={folder.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start rounded-xl h-10"
                    onClick={() => {
                      onFolderChange(folder.id);
                      setMobileSidebarOpen(false);
                    }}
                    data-testid={`folder-nav-${folder.id}`}
                  >
                    {isActive ? (
                      <FolderOpen className="h-4 w-4 mr-3" />
                    ) : (
                      <Folder className="h-4 w-4 mr-3" />
                    )}
                    <span className="truncate flex-1 text-left text-sm">
                      {folder.name}
                    </span>

                    {folder.fileCount > 0 && (
                      <span className="ml-auto rounded-md px-1.5 py-0.5 text-[11px]">
                        {folder.fileCount}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </nav>

      {/* ── Footer ── */}
      <div className="mt-auto border-t px-3 py-3 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl h-10"
          onClick={() => {
            onShowStats();
            setMobileSidebarOpen(false);
          }}
          data-testid="stats-nav-btn"
        >
          <BarChart3 className="h-4 w-4 mr-3" />
          Storage Stats
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl h-10"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-testid="theme-toggle-btn"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 mr-3" />
          ) : (
            <Moon className="h-4 w-4 mr-3" />
          )}
          Toggle Theme
        </Button>
      </div>
    </div>
  );
};

/* ============================================================================
   MainLayout
============================================================================ */
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden md:flex flex-col border-r transition-all ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
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

      {/* ── Mobile sidebar ── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 h-full w-72 bg-card">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-5"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

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

      {/* ── Main column ── */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>

          <span className="text-sm font-medium truncate">
            {currentFolder
              ? folders.find((f) => f.id === currentFolder)?.name ?? "Folder"
              : "All Files"}
          </span>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
