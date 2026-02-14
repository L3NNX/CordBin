import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Copy, Check, Share2, Link2, Eye, Download, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const ShareModal = ({ file, open, onClose }) => {
  const [permissions, setPermissions] = useState("view");
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/share`, {
        fileId: file.id,
        permissions,
      });
      const link = `${window.location.origin}/shared/${response.data.token}`;
      setShareLink(link);
      toast.success("Share link generated!");
    } catch (error) {
      console.error("Error generating share link:", error);
      toast.error("Failed to generate share link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden" data-testid="share-modal">
        {/* Header with gradient accent bar */}
        <div className="relative px-6 pb-5 pt-6">
          <div className="absolute inset-x-0 top-0 h-1 gradient-accent" />

          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10">
                <Share2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground">
                  Share File
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Generate a shareable link
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="border-t border-border/60 px-6 py-5 space-y-5">
          {/* File info */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10">
              <Link2 className="h-4 w-4 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground" data-testid="share-file-name">
                {file.name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {file.type}
              </p>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/60">
              Permissions
            </label>
            <Select value={permissions} onValueChange={setPermissions}>
              <SelectTrigger
                className="h-11 rounded-xl border-border bg-card text-sm
                  focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
                data-testid="share-permissions-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">
                  <span className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    View only
                  </span>
                </SelectItem>
                <SelectItem value="download">
                  <span className="flex items-center gap-2">
                    <Download className="h-3.5 w-3.5 text-muted-foreground" />
                    View & Download
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate or copy link */}
          {!shareLink ? (
            <button
              onClick={generateShareLink}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-accent
                py-3.5 text-sm font-medium text-accent-foreground shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-accent-sm hover:brightness-110
                active:scale-[0.98]
                disabled:pointer-events-none disabled:opacity-60"
              data-testid="generate-link-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  Generate Share Link
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/60">
                Share Link
              </label>

              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    value={shareLink}
                    readOnly
                    className="h-11 w-full rounded-xl border border-border bg-muted/30 px-4 pr-3
                      font-mono text-xs text-foreground
                      focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    data-testid="share-link-input"
                  />
                </div>

                <button
                  onClick={copyToClipboard}
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-all duration-200 active:scale-[0.95]",
                    copied
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border bg-card text-muted-foreground hover:border-accent/30 hover:bg-accent/5 hover:text-foreground"
                  )}
                  data-testid="copy-link-btn"
                  aria-label="Copy link"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                Anyone with this link can{" "}
                {permissions === "view" ? "view" : "view and download"} this file
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;