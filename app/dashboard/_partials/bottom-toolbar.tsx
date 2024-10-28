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
    <div className="flex h-10 w-full items-center justify-end border-t border-t-dark-700 bg-neutral-950  px-8">
      <div className="mr-[14px] flex items-center gap-1 text-white">
        <ZoomOut className="h-5 w-5" />
        <Slider defaultValue={[63]} max={100} className="w-[150px]" step={1} />
        <ZoomIn className="h-5 w-5" />
        <span className="ml-2.5 text-[12px] font-bold text-white">63%</span>
      </div>
      <div className="ml-[26px] flex items-center gap-4 text-white">
        <Button variant="toolbar" disabled>
          <Maximize2 className="h-6 w-6" />
        </Button>
        <Button variant="toolbar" disabled>
          <LayoutGrid className="h-6 w-6" />
        </Button>
        <Button variant="toolbar" disabled>
          <Fullscreen className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
