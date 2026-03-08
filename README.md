# PNG Pro Converter

A fast, privacy-first, client-side image converter & compressor.

![Downloads](https://img.shields.io/github/downloads/RamonRiosJr/PNG-Pro-Converter/total) ![Contributors](https://img.shields.io/github/contributors/RamonRiosJr/PNG-Pro-Converter?color=dark-green) ![Forks](https://img.shields.io/github/forks/RamonRiosJr/PNG-Pro-Converter?style=social) ![Stargazers](https://img.shields.io/github/stars/RamonRiosJr/PNG-Pro-Converter?style=social) ![Issues](https://img.shields.io/github/issues/RamonRiosJr/PNG-Pro-Converter) ![License](https://img.shields.io/github/license/RamonRiosJr/PNG-Pro-Converter)

## About The Project

**PNG Pro Converter** is a modern, lightweight web application built to convert and compress various image formats seamlessly into high-quality PNGs. Operating entirely client-side, it ensures user privacy and blistering speed since files never leave the browser.

### Features

* **Lightning Fast:** Processes and converts imagery in-memory leveraging HTML5 Canvas.
* **Privacy-First:** Zero server uploads meaning complete data security for sensitive images.
* **Batch Support:** Upload, convert, and compress multiple files simultaneously, then download them all at once in a convenient `.zip` archive.
* **Modern Stack:** Harnesses the power of React 19, TypeScript, and Vite for a highly-responsive user experience.

### Built With

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js and npm installed.

* npm

  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/RamonRiosJr/PNG-Pro-Converter.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. *(Optional)* If the application intends to use Gemini AI features in the future, set your `GEMINI_API_KEY` in `.env.local`:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server

   ```sh
   npm run dev
   ```

## Usage

1. Open the application in your browser.
2. Drag and drop, or select one or more images from your device.
3. Click the **"Convert"** button.
4. Once processed, click **"Download All (.zip)"** to save your compressed, converted PNGs.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed instructions.

## License

Distributed under the appropriate License. See `LICENSE` for more information.

## Security

Please refer to [SECURITY.md](./SECURITY.md) for reporting security vulnerabilities.
