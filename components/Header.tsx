
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative text-center mb-12 md:mb-20 pt-8">
      {/* Decorative top glow matching a "Pro" engineering look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-blue-500/30 blur-2xl rounded-full"></div>

      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 mb-4 drop-shadow-sm">
        Lumina Transcoder
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium tracking-wide">
        High-performance, zero-knowledge image compression pipeline. <br className="hidden md:block" />
        <span className="text-slate-300">Lossless exports, hyper-optimized payloads, 100% locally on your machine.</span>
      </p>
    </header>
  );
};
