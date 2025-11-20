import React from 'react';
import { Crop, Github } from 'lucide-react';

interface HeaderProps {
  totalConverted: number;
}

const Header: React.FC<HeaderProps> = ({ totalConverted }) => {
  return (
    <header className="w-full h-20 flex items-center sticky top-0 z-50 transition-all duration-300">
      {/* Glassmorphism Container */}
      <div className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/[0.08]"></div>
      
      <div className="relative container mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-[#131725] p-2 rounded-xl border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Crop className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
              InstaCrops
            </h1>
            <span className="text-[10px] font-medium text-indigo-400/80 tracking-wider uppercase mt-0.5">Pro Studio</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Conversion Counter Badge */}
          <div className="hidden md:flex items-center justify-center mr-2">
            <div className="flex items-baseline gap-2 px-6 py-2.5 rounded-2xl bg-[#131725]/80 border border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.15)] backdrop-blur-xl group hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(79,70,229,0.25)] transition-all duration-300">
              <span className="text-xs font-bold text-gray-400 self-center uppercase tracking-wider">已完成</span>
              <span key={totalConverted} className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 font-mono tabular-nums leading-none tracking-tighter drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)] animate-fade-in-up">
                {totalConverted}
              </span>
              <span className="text-xs font-bold text-gray-400 self-center uppercase tracking-wider">张转换</span>
            </div>
          </div>

          <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-400">Online</span>
          </div>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            aria-label="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
