// src/pages/SharedFile.jsx — REPLACE ENTIRE FILE

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Download, FileText, Clock, AlertTriangle,
  FileQuestion, Loader2, Shield,
} from 'lucide-react';
import { fileService } from '../service/services';

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const SharedFile = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadFileInfo();
  }, [token]);

  const loadFileInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await fileService.getSharedFileInfo(token);
      setFileInfo(info);
    } catch (err) {
      console.error('Error loading shared file:', err);
      if (err.message?.includes('expired') || err.message?.includes('410')) {
        setError('expired');
      } else if (err.message?.includes('not found') || err.message?.includes('404')) {
        setError('not_found');
      } else {
        setError('unknown');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fileService.downloadSharedFile(token);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileInfo.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Loading shared file...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10">
            {error === 'expired' ? (
              <Clock className="h-7 w-7 text-destructive" />
            ) : (
              <AlertTriangle className="h-7 w-7 text-destructive" />
            )}
          </div>

          <h1 className="text-xl font-semibold text-foreground">
            {error === 'expired'
              ? 'Link Expired'
              : error === 'not_found'
                ? 'File Not Found'
                : 'Something Went Wrong'}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error === 'expired'
              ? 'This share link has expired. Ask the owner for a new link.'
              : error === 'not_found'
                ? 'This shared file does not exist or has been removed.'
                : 'An error occurred while loading the shared file.'}
          </p>

          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5
              text-sm font-medium text-foreground transition-all hover:bg-accent/5"
          >
            Go to CordBin
          </a>
        </div>
      </div>
    );
  }

  // File Info
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-lg">

        {/* Header */}
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-muted-foreground">
              Shared via CordBin
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-accent/10">
              <FileText className="h-7 w-7 text-accent" />
            </div>

            <h1 className="text-lg font-semibold text-foreground break-all">
              {fileInfo.fileName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
              <span className="font-mono">{formatSize(fileInfo.fileSize)}</span>
              <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
              <span>{fileInfo.fileType}</span>
              {fileInfo.uploadDate && (
                <>
                  <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/40" />
                  <span>Uploaded {formatDate(fileInfo.uploadDate)}</span>
                </>
              )}
            </div>

            {fileInfo.expiresAt && (
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-yellow-600 dark:text-yellow-400">
                <Clock className="h-3 w-3" />
                <span>Expires {formatDate(fileInfo.expiresAt)}</span>
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl gradient-accent
                px-6 py-3 text-sm font-medium text-accent-foreground shadow-sm
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent-sm
                active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {downloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download File
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/20 px-6 py-3">
          <p className="text-center text-[10px] text-muted-foreground/60">
            Files are encrypted and securely stored.{' '}
            <a href="/" className="text-accent hover:underline">
              CordBin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedFile;