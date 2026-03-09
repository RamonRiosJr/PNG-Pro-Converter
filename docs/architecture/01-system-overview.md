# Architecture

## System Overview

`PNG-Pro-Converter` is a strictly client-side React (Vite) application designed for converting and compressing user imagery securely.

## Core Tenets

1. **Zero-Server Processing**: Image data strictly remains on the client's browser. There are no API backends handling image data, ensuring total privacy.
2. **Ephemeral Memory Model**: User data is kept in standard Javascript memory and HTML5 File/Blob instances. State is cleared entirely on page refresh.

## Data Flow

1. **Input**: User uploads files via HTML `<input type="file">` triggered via Drag & Drop or click.
2. **Preview Generation**: `URL.createObjectURL(file)` is leveraged for immediate DOM preview rendering.
3. **Processing Layer**:
   - Files are loaded into an `HTMLImageElement`.
   - The image is drawn contextually onto an in-memory `HTMLCanvasElement`.
   - The Canvas invokes `.toBlob()` passing `'image/png'`.
4. **Export**: Processed blobs are collected. If bulk downloaded, `JSZip` bundles the in-memory blobs into an archive and invokes a synthetic `<a>` tag click to trigger a local file system save.

## Current Limitations

- **Main Thread Bound**: The current implementation leverages synchronous canvas drawing on the main thread, risking UI suspension.
- **WASM Constraints**: Native Canvas `toBlob` compression for PNG is extremely limited since PNG is mathematically lossless. Genuine compression requires WebAssembly.

## Architectural Roadmap

Long-term evolution dictates that the Canvas Processing Layer must be extracted into an asynchronous `Web Worker` pool to protect 60fps UI rendering. Furthermore, integrating a WASM library like `oxipng` will be required to execute true compression heuristic loops.
