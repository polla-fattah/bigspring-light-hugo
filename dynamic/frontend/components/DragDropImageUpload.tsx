'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, CheckCircle2, Loader2, Link as LinkIcon } from 'lucide-react';

interface Props {
  multiple?: boolean;
  value: string | string[];
  onChange: (value: any) => void;
  label?: string;
  description?: string;
  accept?: string;
}

export default function DragDropImageUpload({
  multiple = false,
  value,
  onChange,
  label,
  description,
  accept = "image/*"
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const urls: string[] = multiple
    ? (Array.isArray(value) ? value : (value ? [value] : []))
    : (typeof value === 'string' && value ? [value] : []);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('file', file);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Upload failed');
      }

      const data = await res.json();
      const uploadedUrls: string[] = data.urls || [data.url];

      if (multiple) {
        onChange([...urls, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    if (multiple) {
      onChange(urls.filter((u) => u !== urlToRemove));
    } else {
      onChange('');
    }
  };

  const handleAddUrl = () => {
    if (!urlInputValue.trim()) return;
    const cleanUrl = urlInputValue.trim();
    if (multiple) {
      onChange([...urls, cleanUrl]);
    } else {
      onChange(cleanUrl);
    }
    setUrlInputValue('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex justify-between items-center">
          <label className="font-extrabold text-[var(--secondary-blue)] text-xs flex items-center space-x-1.5">
            <ImageIcon className="w-4 h-4 text-[var(--primary-maroon)]" />
            <span>{label}</span>
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] font-bold text-[var(--primary-maroon)] hover:underline flex items-center space-x-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Use File Drag & Drop' : 'Enter Direct URL'}</span>
          </button>
        </div>
      )}

      {description && (
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      )}

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            placeholder="Paste image URL (e.g. /images/events/fb/photo.jpg or https://...)"
            className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)]/30"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary-maroon)] text-white hover:bg-red-900"
          >
            Add Image
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
            isDragging
              ? 'border-[var(--primary-maroon)] bg-red-50/50 scale-[0.99]'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          {isUploading ? (
            <div className="flex items-center space-x-2 text-xs font-bold text-[var(--primary-maroon)]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading & Processing Image(s)...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[var(--primary-maroon)]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  <span className="text-[var(--primary-maroon)] underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {multiple ? 'Supports batch selection of PNG, JPG, WEBP, SVG' : 'Supports single cover image PNG, JPG, WEBP, SVG'}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
          {error}
        </p>
      )}

      {/* Live Thumbnails Grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {urls.map((url, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
              <img
                src={url}
                alt={`Upload thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(url);
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 transition-all shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-mono px-1.5 py-0.5 rounded truncate max-w-[90%]">
                {url.split('/').pop()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
