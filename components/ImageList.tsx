
import React from 'react';
import { ProcessedImage } from '../types';
import { formatBytes } from '../utils/fileUtils';
import { Spinner } from './Spinner';
import { DownloadIcon, CheckCircleIcon, AlertTriangleIcon } from './icons';

interface ImageListProps {
  images: ProcessedImage[];
}

const ImageListItem: React.FC<{ image: ProcessedImage }> = ({ image }) => {
  const reduction =
    image.status === 'done' && image.newSize
      ? ((image.originalSize - image.newSize) / image.originalSize) * 100
      : 0;
      
  const handleDownload = () => {
    if (!image.processedBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(image.processedBlob);
    link.download = image.newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:ring-1 hover:ring-slate-700">
      <div className="relative aspect-video">
        <img src={image.previewUrl} alt={image.originalFile.name} className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white text-sm font-bold p-2 bg-black/60 rounded">{image.originalFile.name}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
            <p className="text-sm font-medium text-slate-300 truncate w-full" title={image.originalFile.name}>
              {image.originalFile.name}
            </p>
          {image.status === 'processing' && <Spinner />}
          {image.status === 'done' && <CheckCircleIcon />}
          {image.status === 'error' && <AlertTriangleIcon />}
        </div>
        
        {image.status === 'pending' && (
          <p className="text-xs text-slate-400 mt-1">
            Original: {formatBytes(image.originalSize)}
          </p>
        )}
        
        {image.status === 'processing' && (
           <p className="text-xs text-blue-400 mt-1 animate-pulse">Converting...</p>
        )}

        {image.status === 'done' && image.newSize !== null && (
          <div className="mt-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Original:</span>
              <span className="text-slate-300 font-mono">{formatBytes(image.originalSize)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Converted:</span>
              <span className="text-slate-300 font-mono">{formatBytes(image.newSize)}</span>
            </div>
             <div className="flex justify-between mt-1 pt-1 border-t border-slate-700">
              <span className="font-semibold text-green-400">Reduction:</span>
              <span className="font-semibold text-green-400 font-mono">{reduction.toFixed(1)}%</span>
            </div>
          </div>
        )}

        {image.status === 'error' && (
          <p className="text-xs text-red-400 mt-1 truncate" title={image.error}>
            Error: {image.error || 'Conversion failed'}
          </p>
        )}
        
        {image.status === 'done' && (
          <button 
            onClick={handleDownload}
            className="mt-4 w-full flex items-center justify-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-md transition-colors"
          >
            <DownloadIcon />
            Download PNG
          </button>
        )}
      </div>
    </div>
  );
};

export const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <ImageListItem key={image.id} image={image} />
      ))}
    </div>
  );
};
