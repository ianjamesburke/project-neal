import React from "react";
import { Slider } from "@/components/ui/slider";
import {
  Fullscreen,
  LayoutGrid,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
export const BottomToolbar = () => {
  return (
    <div className="flex h-10 w-full items-center  justify-end border-t border-t-dark-700 bg-neutral-950  px-8">
      <div className="mr-[14px] flex gap-3 text-white">
        <ZoomOut className="h-4 w-4" />
        <Slider defaultValue={[63]} max={100} className="w-[150px]" step={1} />
        <span className="text-[12px] font-bold text-white">63%</span>
        <ZoomIn className="h-4 w-4" />
      </div>
      <div className="ml-4 flex items-center gap-2 text-white">
        <Button variant="toolbar">
          <Maximize2 className="h-6 w-6" />
        </Button>
        <Button variant="toolbar">
          <LayoutGrid className="h-6 w-6" />
        </Button>
        <Button variant="toolbar">
          <Fullscreen className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
