/// <reference lib="webworker" />

self.addEventListener('message', async (e: MessageEvent) => {
    const { id, file } = e.data;

    try {
        // createImageBitmap is much more efficient than using an HTMLImageElement
        // and can be called safely within a web worker thread.
        const bitmap = await createImageBitmap(file);

        // Create offscreen canvas sized perfectly to the image
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Could not get OffscreenCanvas 2D context');
        }

        ctx.drawImage(bitmap, 0, 0);

        // Convert directly to a PNG blob using the mathematical capabilities
        // of the offscreen browser engine, completely free from the main thread.
        const blob = await canvas.convertToBlob({ type: 'image/png', quality: 1.0 });

        self.postMessage({ id, blob, success: true });

        // Clean up memory aggressively
        bitmap.close();
    } catch (error: any) {
        self.postMessage({ id, error: error.message || 'Unknown processing error', success: false });
    }
});
