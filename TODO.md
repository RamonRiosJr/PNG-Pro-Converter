# Architectural Critique & Backlog

As a Senior Systems Architect, here is the brutal evaluation of the current state of `PNG-Pro-Converter`. While functional as a primary proof-of-concept, it cannot scale to production workloads without significant refactoring.

## 🔴 Critical Architectural Flaws

### 1. Main Thread Blocking (The "UI Freeze")

**Issue**: The image processing (`processImage` using `canvas.toBlob`) happens entirely on the main JavaScript thread.
**Impact**: If a user uploads 50 images or a few highly-detailed 4K images, the browser tab will completely lock up. The UI will freeze, the "spinner" will stop spinning, and the browser might prompt the user to kill the page.
**Solution**: Move all image processing to a **Web Worker** using `OffscreenCanvas`. This frees the main thread to keep the UI perfectly smooth.

### 2. Memory Leaks (Object URL Mismanagement)

**Issue**: `URL.createObjectURL(file)` is heavily used for previews. It is only revoked inside `handleReset`.
**Impact**: If a user uploads images, downloads them, but doesn't hit "Start Over" and just closes the tab or navigates away (or uploads *more* files over time), memory usage continuously bloats until the tab crashes.
**Solution**: Implement a `useEffect` cleanup hook inside `ImageListItem` or a robust state manager that guarantees `URL.revokeObjectURL` is called when a component unmounts or an image is removed from state.

### 3. "Reduction" Math Assumption (The PNG Size Trap)

**Issue**: The UI displays a "Reduction" percentage colored green.
**Impact**: PNG is a *lossless* format. If a user uploads a highly compressed WebP or JPEG, the resulting PNG will almost certainly be **larger** than the original. The UI will show a negative reduction, which is counterintuitive, or break user trust.
**Solution**: Add logic to handle instances where the size increases (e.g., show "Size Increased by X%" in yellow/red). Consider offering a compression slider (by integrating a WASM library like `imagequant` or `oxipng` instead of relying purely on native Canvas outputs).

### 4. Animated GIF Handling

**Issue**: The file uploader accepts `image/*`.
**Impact**: If a user uploads an animated GIF, the HTML5 Canvas will silently drop all frames except the very first one, returning a static PNG without warning the user.
**Solution**: Add explicit MIME type checking. If `image/gif` is detected, either warn the user that only the first frame will be converted, or reject it entirely.

---

## 🟡 Code Quality & Tech Debt

### 1. Monolithic App Component

**Issue**: `App.tsx` handles UI rendering, drag-and-drop state, ZIP generation, and the core conversion logic.
**Solution**: Break this apart.

- Migrate the heavy conversion logic into a custom hook `useImageProcessing`.
- Migrate ZIP generation to a utility or a dynamically imported module.

### 2. Heavy Synchronous Bundling

**Issue**: `jszip` is statically imported at the top of `App.tsx` (`import JSZip from 'jszip'`).
**Impact**: `jszip` is a large library. It is being loaded immediately on page load, penalizing initial JavaScript parsing and TTI (Time to Interactive), even if the user hasn't uploaded a file yet.
**Solution**: Use a dynamic import (`const JSZip = (await import('jszip')).default;`) exactly at the moment the user clicks "Download All".

### 3. Zero Automated Tests

**Issue**: No unit tests, no component tests.
**Solution**: Implement Vitest and React Testing Library to explicitly test the mathematical outputs of the `fileUtils`, the rendering of UI states, and the behavior of the `handleProcessImages` logic.

## 📝 Roadmap / Backlog

- [ ] **Refactor**: Move Image converting logic to a `Web Worker` (`OffscreenCanvas`).
- [ ] **Performance**: Dynamically import `JSZip` to cut down the main bundle size.
- [ ] **Bug Fix**: Fix the "Reduction" UI to handle size increases when converting to lossless PNGs.
- [ ] **Memory**: Add `useEffect` cleanups to revoke Object URLs on component unmounts.
- [ ] **Architecture**: Extract `App.tsx` state and processing into `useImageProcessor` hook.
- [ ] **Feature**: Support WebAssembly PNG compression (e.g. `squoosh` / `oxipng`) for genuine *compression*, rather than just format conversion.
- [ ] **Testing**: Implement a Vitest configuration and achieve 80% coverage on utils and hooks.
