import React from 'react';
import { ChevronLeft, ChevronRight, Scissors, Trash2, Play, Maximize } from 'lucide-react';

const VideoEditorTopBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between mx-2 my-2 w-full align-middle">
      {/* Left section */}
      <div className="flex items-center gap-2 space-x-2">
        <span className="text-sm sm:text-base font-medium text-white whitespace-nowrap">Clip Editor</span>
        <button aria-label="Previous clip">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button aria-label="Next clip">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button aria-label="Split clip">
          <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button aria-label="Delete clip">
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Center section */}
      <div className="flex-grow">
        <button aria-label="Play/Pause" className="w-[60px] sm:w-[81px] h-[11px] flex items-center justify-center">
          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center">
        <button aria-label="Toggle fullscreen" className="mr-3 flex shrink-0 w-3 h-3 sm:w-4 sm:h-4 rounded border border-white border-solid items-center justify-center">
          <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoEditorTopBar;