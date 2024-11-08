import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  CopyPlus,
  Eye,
  FolderSync,
  Play,
  Redo2,
  SkipBack,
  SkipForward,
  SquareSplitHorizontal,
  Timer,
  Trash2,
  Undo2,
  Volume1,
  Volume2,
  Pause,
} from "lucide-react";

export const ClipToolbar = ({
  isPlaying,
  handlePlayVideo,
  handlePauseVideo,
}: {
  isPlaying: boolean;
  handlePlayVideo: () => void;
  handlePauseVideo: () => void;
}) => {
  return (
    <div className="flex h-12 w-full items-center justify-between border-y border-dark-700 bg-dark-800 px-4 py-2 text-white">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <Button variant="toolbar" disabled>
          <SquareSplitHorizontal />
        </Button>
        <Button variant="toolbar" disabled>
          <FolderSync />
        </Button>
        <Button variant="toolbar" disabled>
          <Timer />
        </Button>

        <Button variant="toolbar" disabled>
          <Eye />
        </Button>
        <Button variant="toolbar" disabled>
          <CopyPlus />
        </Button>
        <Button variant="toolbar" disabled>
          <Trash2 />
        </Button>
      </div>

      {/* Center section */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Button variant="toolbar">
            <SkipBack />
          </Button>
          <Button
            variant="toolbar"
            onClick={isPlaying ? handlePauseVideo : handlePlayVideo}
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <Button variant="toolbar">
            <SkipForward />
          </Button>
        </div>

        {/* <div className="flex items-center gap-2">
          <span>00:22</span>
          <span className="text-gray-dark"> / 01:19</span>
        </div> */}

        {/* <div className="flex items-center gap-1">
          <Button variant="toolbar" disabled>
            <Undo2 />
          </Button>
          <Button variant="toolbar" disabled>
            <Redo2 />
          </Button>
        </div> */}
      </div>

      {/* Right section */}
      <div className="mr-[14px] flex items-center gap-1">
        <Volume1 />
        <Slider defaultValue={[63]} max={100} className="w-[100px]" step={1} />
        <Volume2 />
        <span className="ml-1.5 text-[12px] font-bold text-white">65%</span>
      </div>
    </div>
  );
};
