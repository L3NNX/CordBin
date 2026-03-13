import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Link2, Copy, Check, Trash2, Clock, Globe,
  Shield, Loader2, Share2,
} from 'lucide-react';
import { fileService } from '../../service/services';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const EXPIRY_OPTIONS = [
  { label: 'No expiry', value: null },
  { label: '1 hour', value: 1 },
  { label: '24 hours', value: 24 },
  { label: '7 days', value: 168 },
  { label: '30 days', value: 720 },
];

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (date) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ShareModal = ({ file, open, onClose }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [selectedExpiry, setSelectedExpiry] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [hasExistingLink, setHasExistingLink] = useState(false);

  useEffect(() => {
    if (open) {
      setShareUrl('');
      setExpiresAt(null);
      setHasExistingLink(false);
      setCopied(false);
      setSelectedExpiry(null);
    }
  }, [open, file?.id]);

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      const response = await fileService.createShareLink(file.id, selectedExpiry);
      setShareUrl(response.shareUrl);
      setExpiresAt(response.expiresAt);
      setHasExistingLink(true);
      toast.success('Share link created');
    } catch (error) {
      toast.error(error.message || 'Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLink = async () => {
    setRemoving(true);
    try {
      await fileService.removeShareLink(file.id);
      setShareUrl('');
      setExpiresAt(null);
      setHasExistingLink(false);
      toast.success('Share link removed');
    } catch {
      toast.error('Failed to remove share link');
    } finally {
      setRemoving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md p-0 overflow-hidden">

        {/* Header */}
        <div className="relative px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
          <div className="absolute inset-x-0 top-0 h-1 gradient-accent" />
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10">
                <Share2 className="h-5 w-5 text-accent" />
              </div>
              <div className="min-w-0">
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

        <div className="border-t border-border/60 px-4 py-4 sm:px-6 sm:py-5 space-y-4 overflow-hidden">

          {/* File info */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:p-3.5 min-w-0 overflow-hidden">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10">
              <Globe className="h-4 w-4 text-accent" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                {formatSize(file.size)}
              </p>
            </div>
          </div>

          {/* ── Not yet shared ── */}
          {!hasExistingLink && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Link expiry
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {EXPIRY_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setSelectedExpiry(option.value)}
                      className={cn(
                        'rounded-lg border px-2.5 py-1.5 text-[11px] sm:text-xs font-medium transition-all duration-150',
                        selectedExpiry === option.value
                          ? 'border-accent/30 bg-accent/10 text-accent'
                          : 'border-border text-muted-foreground hover:border-accent/20 hover:text-foreground'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-accent/5 px-3 py-2.5">
                <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/60" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Anyone with the link can download this file.
                  {selectedExpiry
                    ? ` Link expires after ${EXPIRY_OPTIONS.find((o) => o.value === selectedExpiry)?.label}.`
                    : ' Link never expires.'}
                </p>
              </div>

              <button
                onClick={handleCreateLink}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl gradient-accent
                  px-4 py-3 text-sm font-medium text-accent-foreground shadow-sm
                  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent-sm
                  active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
                ) : (
                  <><Link2 className="h-4 w-4" /> Create Share Link</>
                )}
              </button>
            </div>
          )}

          {/* ── Link created ── */}
          {hasExistingLink && shareUrl && (
            <div className="space-y-3 sm:space-y-4">

              {/* ✅ URL field — same height input + button */}
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                  Share Link
                </label>
                <div className="flex items-stretch gap-2 min-w-0">
                  {/* ✅ Input — fixed h-10, truncated with ellipsis */}
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    onClick={(e) => e.target.select()}
                    className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-muted/50
                      px-3 font-mono text-[11px] sm:text-xs text-foreground
                      truncate cursor-text
                      focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  {/* ✅ Copy button — exact same h-10 w-10 */}
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition-all duration-200',
                      copied
                        ? 'border-green-500/30 bg-green-500/10 text-green-600'
                        : 'border-border text-muted-foreground hover:bg-accent/5 hover:text-foreground'
                    )}
                    aria-label="Copy link"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Expiry info */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{expiresAt ? `Expires ${formatDate(expiresAt)}` : 'Link never expires'}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl gradient-accent
                    px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm
                    transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent-sm
                    active:scale-[0.98]"
                >
                  {copied ? (
                    <><Check className="h-4 w-4 shrink-0" /> <span className="truncate">Copied!</span></>
                  ) : (
                    <><Copy className="h-4 w-4 shrink-0" /> <span className="truncate">Copy Link</span></>
                  )}
                </button>
                <button
                  onClick={handleRemoveLink}
                  disabled={removing}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border
                    text-muted-foreground transition-all duration-200
                    hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive
                    disabled:opacity-50"
                >
                  {removing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;