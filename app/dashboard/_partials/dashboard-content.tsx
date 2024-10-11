"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import ChatSection from "@/components/chat-section";
import VideoEditorWindow from "@/components/video-editor-window";
import { LayoutGrid, Maximize2 } from "lucide-react";

export default function DashboardContent() {
  // States
  const [renderId, setRenderId] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-64px)] max-md:flex-col">
      <div className="w-1/3 border-r border-dark-700 p-6">
        <ChatSection onRenderIdChange={setRenderId} />
      </div>

      <div className="h-[calc(100%-40px)] w-full">
        <VideoEditorWindow renderId={renderId} />
        <div className="flex h-10 w-full items-center  justify-end border-t border-t-dark-700 bg-neutral-950">
          <div className="mr-[14px] flex gap-3">
            <Slider
              defaultValue={[63]}
              max={100}
              className="w-[150px]"
              step={1}
            />
            <span className="text-[12px] font-bold text-white">63%</span>
          </div>
          <div className="space-x-2">
            <Maximize2 />
            <LayoutGrid />
            <LayoutGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
