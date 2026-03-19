import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/upload.php', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}` },
        body: form
      });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      onChange(url);
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label}
      </label>

      {/* Preview */}
      {value && (
        <div className="relative group w-full aspect-video bg-slate-100 rounded-sm overflow-hidden mb-2">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange('')}
              className="opacity-0 group-hover:opacity-100 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-opacity"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-sm p-6 text-center transition-all cursor-pointer
          ${isDragging ? 'border-black bg-slate-50' : 'border-slate-200 hover:border-slate-400'}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Uploading…
          </div>
        ) : (
          <>
            <div className="text-2xl mb-2">🖼</div>
            <p className="text-[11px] text-slate-500 font-medium">
              Drag & drop or <span className="text-black font-bold underline">browse</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP up to 20MB</p>
          </>
        )}
      </div>

      {/* URL input fallback */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL…"
        className="w-full border border-slate-200 px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-black transition-colors"
      />

      {error && <p className="text-red-500 text-[10px]">{error}</p>}
    </div>
  );
}
