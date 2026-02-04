import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, HardDrive, BarChart3, Folder, Home, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const MainLayout = ({ children, folders, currentFolder, onFolderChange, onDeleteFolder, onShowStats }) => {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r bg-muted/10 transition-all ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
        data-testid="sidebar"
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full p-4">
            {/* Logo/Title */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-heading font-bold" data-testid="app-title">StashBox</h2>
              </div>
              <p className="text-xs text-muted-foreground">Modern file storage</p>
            </div>

            <nav className="space-y-2 flex-1">
              {/* Home */}
              <Button
                variant={!currentFolder ? "default" : "ghost"}
                className="w-full justify-start rounded-lg"
                onClick={() => onFolderChange(null)}
                data-testid="home-nav-btn"
              >
                <Home className="h-4 w-4 mr-3" />
                All Files
              </Button>

              <Separator className="my-4" />

              {/* Folders */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-3 mb-2">FOLDERS</p>
                <ScrollArea className="h-64">
                  {folders.map((folder) => (
                    <div key={folder.id} className="group relative">
                      <Button
                        variant={currentFolder === folder.id ? "default" : "ghost"}
                        className="w-full justify-start rounded-lg mb-1"
                        onClick={() => onFolderChange(folder.id)}
                        data-testid={`folder-nav-${folder.id}`}
                      >
                        <Folder className="h-4 w-4 mr-3" />
                        <span className="truncate flex-1 text-left">{folder.name}</span>
                        {folder.fileCount > 0 && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {folder.fileCount}
                          </span>
                        )}
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </nav>

            {/* Bottom Actions */}
            <div className="space-y-2 mt-auto pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-lg"
                onClick={onShowStats}
                data-testid="stats-nav-btn"
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                Storage Stats
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full rounded-lg"
                data-testid="theme-toggle-btn"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="ml-3 flex-1 text-left">Toggle Theme</span>
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;