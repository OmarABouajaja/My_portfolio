import React from 'react';

export const AnimatedBackground = () => {
  return (
    <>
      {/* Base Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 z-[-1]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-[-1]" />
      <div className="fixed inset-0 bg-grid-white/[0.02] z-[-1]" />
      
      {/* Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden z-[-1]">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/20 via-transparent to-transparent rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-primary/20 via-transparent to-transparent rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>
    </>
  );
}; 