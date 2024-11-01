import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex space-x-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-neutral-400">Generating your video</span>
    </div>
  );
};

export default LoadingAnimation;