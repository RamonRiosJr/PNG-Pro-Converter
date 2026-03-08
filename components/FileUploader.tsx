
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
        className={`relative flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-blue-400 bg-slate-800' : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'}`}
      >
        <input 
          type="file" 
          id="file-upload" 
          multiple 
          accept="image/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
        />
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center cursor-pointer">
          <UploadIcon />
          <p className="mt-4 text-lg font-semibold text-slate-300">
            <span className="text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-sm text-slate-500">Supports JPG, WEBP, PNG, GIF and more</p>
        </label>
      </div>
    </div>
  );
};
