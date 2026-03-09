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

        // We extract the raw Image Data array instead of relying on the browser's native blob generator
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Dynamically import the WASM modules so they don't block the worker's initial load
        const [{ encode: pngEncode }, { optimise: oxipngOptimize }] = await Promise.all([
            import('@jsquash/png'),
            import('@jsquash/oxipng')
        ]);

        // Step 1: Encode raw ImageData to a standard PNG ArrayBuffer
        const rawPngBuffer = await pngEncode(imageData);

        // Step 2: Pass the standard PNG buffer through the OxiPNG Rust WebAssembly algorithm
        // Level 2 is a solid balance between intense compression and speed.
        const optimizedPngBuffer = await oxipngOptimize(rawPngBuffer, { level: 2 });

        // Convert the optimized ArrayBuffer back to an immutable Blob for the UI
        const blob = new Blob([optimizedPngBuffer], { type: 'image/png' });

        self.postMessage({ id, blob, success: true });

        // Clean up memory aggressively
        bitmap.close();
    } catch (error: any) {
        self.postMessage({ id, error: error.message || 'Unknown processing error', success: false });
    }
});
