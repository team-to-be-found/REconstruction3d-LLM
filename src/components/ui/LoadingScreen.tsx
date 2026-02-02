'use client';

import { Grid3x3 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background">
      <div className="relative">
        {/* Logo */}
        <Grid3x3 className="w-16 h-16 text-primary animate-pulse-glow" />

        {/* Loading Spinner */}
        <div className="absolute inset-0 -m-8">
          <div className="loading-spinner" />
        </div>
      </div>

      <h2 className="mt-8 text-xl font-semibold">Loading Knowledge Base...</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Initializing 3D visualization
      </p>
    </div>
  );
}
