import React from 'react';

export const LatexBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-1000">
      {/* Base Latex Shine */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,50,1)_0%,rgba(5,5,5,1)_100%)] opacity-80 mix-blend-overlay" />
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_50%)] rotate-45 pointer-events-none" />
      </div>

      {/* Water Droplets / Sweat Effect */}
      <div className="absolute inset-0 opacity-30">
        {/* Static droplets */}
        <div className="absolute top-[10%] left-[20%] w-2 h-2 rounded-full bg-white/10 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),2px_2px_4px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-[30%] left-[80%] w-3 h-3 rounded-full bg-white/10 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),2px_2px_4px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-[70%] left-[15%] w-4 h-4 rounded-full bg-white/10 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),2px_2px_4px_rgba(0,0,0,0.5)]" />
        
        {/* Drip animations could be added here if needed, but keeping it static for performance first */}
      </div>

      {/* Matrix Neon Grid Overlay (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
    </div>
  );
};
