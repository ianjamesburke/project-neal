"use client";

import { useState } from "react";

import ChatSection from "@/components/chat-section";
import VideoEditorWindow from "@/components/video-editor-window";

export default function DashboardContent() {
  // States
  const [renderId, setRenderId] = useState<string | null>(null);

  return (
    <>
      <div className="w-1/3 overflow-auto">
        <ChatSection onRenderIdChange={setRenderId} />
      </div>
      <div className="h-full w-px bg-dark-700"></div>
      <div className="overflow-auto pl-4">
        <VideoEditorWindow renderId={renderId} />
      </div>
    </>
  );
}
