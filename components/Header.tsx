
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-2">
        PNG Pro Converter
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
        Batch convert and compress your images to web-ready PNGs. Fast, private, and all in your browser.
      </p>
    </header>
  );
};
