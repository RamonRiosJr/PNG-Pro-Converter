import { useState, useCallback } from 'react';
import { ProcessedImage } from '../types';

export const useImageProcessor = () => {
    const [images, setImages] = useState<ProcessedImage[]>([]);
    const [appStatus, setAppStatus] = useState<'idle' | 'processing' | 'done'>('idle');

    const handleFileSelect = useCallback((files: FileList) => {
        const newImages: ProcessedImage[] = Array.from(files).map((file, index) => {
            const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
            return {
                id: `${Date.now()}-${index}`,
                originalFile: file,
                processedBlob: null,
                previewUrl: URL.createObjectURL(file), // Memory leak risk flagged, will fix fully alongside Workers
                newName: `${originalName}.png`,
                originalSize: file.size,
                newSize: null,
                status: 'pending',
            };
        });
        setImages(newImages);
    }, []);

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

    const handleDownloadAll = useCallback(async () => {
        // Dynamic import to decouple JSZip from the main bundle as requested in TODO.md
        const JSZipModule = await import('jszip');
        const JSZip = JSZipModule.default;

        const zip = new JSZip();
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
    }, [images]);

    const handleReset = useCallback(() => {
        images.forEach(image => URL.revokeObjectURL(image.previewUrl));
        setImages([]);
        setAppStatus('idle');
    }, [images]);

    return {
        images,
        appStatus,
        handleFileSelect,
        handleProcessImages,
        handleDownloadAll,
        handleReset,
    };
};
