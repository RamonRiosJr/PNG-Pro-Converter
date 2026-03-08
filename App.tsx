
import React, { useState, useCallback } from 'react';
import { ProcessedImage } from './types';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { ImageList } from './components/ImageList';
import { ActionButton } from './components/ActionButton';
import { DownloadIcon, ZapIcon, ArrowLeftIcon } from './components/icons';

// Make JSZip available in the window scope for TypeScript
declare global {
  interface Window {
    JSZip: any;
  }
}

const App: React.FC = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [appStatus, setAppStatus] = useState<'idle' | 'processing' | 'done'>('idle');

  const handleFileSelect = (files: FileList) => {
    const newImages: ProcessedImage[] = Array.from(files).map((file, index) => {
      const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
      return {
        id: `${Date.now()}-${index}`,
        originalFile: file,
        processedBlob: null,
        previewUrl: URL.createObjectURL(file),
        newName: `${originalName}.png`,
        originalSize: file.size,
        newSize: null,
        status: 'pending',
      };
    });
    setImages(newImages);
  };

  const processImage = useCallback(async (image: ProcessedImage): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = image.previewUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context.'));
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas toBlob failed.'));
            }
            resolve({
              ...image,
              processedBlob: blob,
              newSize: blob.size,
              status: 'done',
            });
          },
          'image/png',
          1.0 
        );
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for processing.'));
      };
    });
  }, []);

  const handleProcessImages = useCallback(async () => {
    setAppStatus('processing');
    setImages((prevImages) => 
      prevImages.map((img) => ({ ...img, status: 'processing' }))
    );

    const processingPromises = images.map((image) => 
      processImage(image)
        .then(processed => {
          setImages(prev => prev.map(img => img.id === processed.id ? processed : img));
          return processed;
        })
        .catch(error => {
          console.error(`Failed to process ${image.originalFile.name}:`, error);
          const errorResult = { ...image, status: 'error' as const, error: error.message };
          setImages(prev => prev.map(img => img.id === errorResult.id ? errorResult : img));
          return errorResult;
        })
    );

    await Promise.allSettled(processingPromises);
    setAppStatus('done');
  }, [images, processImage]);

  const handleDownloadAll = async () => {
    if (!window.JSZip) {
      alert('JSZip library not found. Please check your internet connection.');
      return;
    }
    const zip = new window.JSZip();
    images
      .filter((image) => image.status === 'done' && image.processedBlob)
      .forEach((image) => {
        zip.file(image.newName, image.processedBlob!);
      });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'compressed-images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleReset = () => {
    images.forEach(image => URL.revokeObjectURL(image.previewUrl));
    setImages([]);
    setAppStatus('idle');
  };

  return (
    <div className="min-h-screen font-sans antialiased">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        
        {images.length === 0 ? (
          <FileUploader onFileSelect={handleFileSelect} />
        ) : (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Your Images</h2>
              <div className="flex gap-2">
                <ActionButton onClick={handleReset} variant="secondary">
                  <ArrowLeftIcon />
                  Start Over
                </ActionButton>
                {appStatus === 'idle' && (
                  <ActionButton onClick={handleProcessImages}>
                    <ZapIcon />
                    Convert {images.length} {images.length > 1 ? 'images' : 'image'}
                  </ActionButton>
                )}
                {appStatus === 'done' && (
                  <ActionButton onClick={handleDownloadAll}>
                    <DownloadIcon />
                    Download All (.zip)
                  </ActionButton>
                )}
              </div>
            </div>
            
            <ImageList images={images} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
