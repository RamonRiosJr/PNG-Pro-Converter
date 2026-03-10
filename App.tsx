import React from 'react';
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import { FileUploader } from './components/FileUploader';
import { ImageList } from './components/ImageList';
import { ActionButton } from './components/ActionButton';
import { DownloadIcon, ZapIcon, ArrowLeftIcon } from './components/icons';
import { useImageProcessor } from './hooks/useImageProcessor';

const App: React.FC = () => {
  const {
    images,
    appStatus,
    handleFileSelect,
    handleProcessImages,
    handleDownloadAll,
    handleReset,
  } = useImageProcessor();

  return (
    <div className="min-h-screen font-sans antialiased relative">
      <TopNav />
      <main className="container mx-auto px-4 py-16 md:py-24">
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
