import React, { useState, useCallback, useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';
import { ProcessedImage } from '../types';

export const useImageProcessor = () => {
    const posthog = usePostHog();
    const [images, setImages] = useState<ProcessedImage[]>([]);
    const [appStatus, setAppStatus] = useState<'idle' | 'processing' | 'done'>('idle');

    // Prevent memory leaks when the overall hook unmounts
    useEffect(() => {
        return () => {
            images.forEach(image => {
                if (image.previewUrl) URL.revokeObjectURL(image.previewUrl);
            });
        };
    }, [images]);

    const handleFileSelect = useCallback((files: FileList) => {
        posthog?.capture('interaction: files_uploaded', {
            file_count: files.length
        });

        // Revoke old URLs to prevent memory leaks during re-uploads
        setImages(prevImages => {
            prevImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
            return prevImages;
        });

        const validFiles = Array.from(files).filter(file => {
            // Reject GIFs as they drop frames inherently in Canvas operations.
            if (file.type === 'image/gif') {
                alert(`Cannot process ${file.name}: Animated GIFs are not supported for basic conversion as they flatten to a single frame.`);
                return false;
            }
            return true;
        });

        const newImages: ProcessedImage[] = validFiles.map((file, index) => {
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
    }, []);

    const processImage = useCallback(async (image: ProcessedImage): Promise<ProcessedImage> => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(new URL('../workers/imageWorker.ts', import.meta.url), {
                type: 'module'
            });

            worker.onmessage = (e: MessageEvent) => {
                const { blob, success, error } = e.data;
                worker.terminate(); // Kill worker immediately to free memory

                if (success) {
                    resolve({
                        ...image,
                        processedBlob: blob,
                        newSize: blob.size,
                        status: 'done',
                    });
                } else {
                    reject(new Error(error || 'Worker processing failed.'));
                }
            };

            worker.onerror = (e: ErrorEvent) => {
                worker.terminate();
                reject(new Error(e.message || 'Worker thread crashed.'));
            };

            worker.postMessage({ id: image.id, file: image.originalFile });
        });
    }, []);

    const handleProcessImages = useCallback(async () => {
        setAppStatus('processing');

        posthog?.capture('conversion: started_batch', {
            image_count: images.length,
            total_original_bytes: images.reduce((acc, img) => acc + img.originalSize, 0)
        });

        setImages((prevImages) =>
            prevImages.map((img) => ({ ...img, status: 'processing' }))
        );

        // Limit concurrency to hardware cores to prevent crashing the browser completely
        // Hard limit at 4 parallel workers by chunking (lazy-eval)
        const chunkSize = navigator.hardwareConcurrency || 4;

        const processQueue = [...images];
        const executing = new Set<Promise<ProcessedImage>>();

        let successCount = 0;
        let errorCount = 0;

        for (const image of processQueue) {
            const p = processImage(image)
                .then(processed => {
                    successCount++;
                    setImages(prev => prev.map(img => img.id === processed.id ? processed : img));
                    return processed;
                })
                .catch(error => {
                    errorCount++;
                    console.error(`Failed to process ${image.originalFile.name}:`, error);
                    const errorResult = { ...image, status: 'error' as const, error: error.message };
                    setImages(prev => prev.map(img => img.id === errorResult.id ? errorResult : img));
                    return errorResult as ProcessedImage;
                });

            executing.add(p);
            p.finally(() => executing.delete(p));

            if (executing.size >= chunkSize) {
                await Promise.race(executing);
            }
        }

        await Promise.all(executing);
        setAppStatus('done');

        posthog?.capture('conversion: completed_batch', {
            success_count: successCount,
            error_count: errorCount
        });
    }, [images, processImage]);

    const handleDownloadAll = useCallback(async () => {
        // Dynamic import to decouple JSZip from the main bundle as requested in TODO.md
        const JSZipModule = await import('jszip');
        const JSZip = JSZipModule.default;

        const zip = new JSZip();
        const doneImages = images.filter((image) => image.status === 'done' && image.processedBlob);

        posthog?.capture('interaction: downloaded_zip', {
            file_count: doneImages.length
        });

        doneImages.forEach((image) => {
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
