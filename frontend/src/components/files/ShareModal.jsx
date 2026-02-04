import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Copy, Check, Share2 } from "lucide-react";



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
      <DialogContent className="max-w-md" data-testid="share-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share File
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="font-medium mb-1" data-testid="share-file-name">{file.name}</p>
            <p className="text-sm text-muted-foreground">Generate a shareable link for this file</p>
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <Select value={permissions} onValueChange={setPermissions}>
              <SelectTrigger data-testid="share-permissions-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View only</SelectItem>
                <SelectItem value="download">View & Download</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!shareLink ? (
            <Button
              onClick={generateShareLink}
              disabled={loading}
              className="w-full rounded-full"
              data-testid="generate-link-btn"
            >
              {loading ? "Generating..." : "Generate Share Link"}
            </Button>
          ) : (
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                  data-testid="share-link-input"
                />
                <Button
                  onClick={copyToClipboard}
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  data-testid="copy-link-btn"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can {permissions === "view" ? "view" : "view and download"} this file
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;