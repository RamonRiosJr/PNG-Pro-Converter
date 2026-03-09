
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface FileUploaderProps {
  onFileSelect: (files: FileList) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`group relative flex flex-col items-center justify-center w-full p-16 border border-dashed rounded-2xl transition-all duration-300 overflow-hidden ${isDragging
          ? 'border-blue-400 bg-blue-900/10 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]'
          : 'border-slate-800 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-900/80 shadow-none'
          }`}
      >
        <label htmlFor="file-upload" className="absolute inset-0 w-full h-full cursor-pointer z-10">
          <span className="sr-only">Upload images</span>
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            title="Upload images"
            aria-label="Upload images"
            className="opacity-0 w-full h-full cursor-pointer"
            onChange={handleChange}
          />
        </label>

        {/* Subtle background glow effect tied to hover/drag state */}
        <div className={`absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none ${isDragging ? 'opacity-100' : 'group-hover:opacity-100'}`}></div>

        <div className="relative z-20 flex flex-col items-center pointer-events-none">
          <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-800 group-hover:text-blue-400'}`}>
            <UploadIcon />
          </div>
          <p className="mt-6 text-xl font-semibold text-slate-200 tracking-wide">
            <span className="text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="mt-2 text-sm text-slate-500 font-medium tracking-wide">Supports JPG, WEBP, PNG, GIF, BMP</p>
        </div>
      </div>
    </div>
  );
};
