"use client";

import { useState } from "react";

import ChatSection from "@/components/chat-section";
import VideoEditorWindow from "@/components/video-editor-window";

export default function DashboardContent() {
  // States
  const [renderId, setRenderId] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-64px)] max-md:flex-col">
      <div className="w-1/3 p-6">
        <ChatSection onRenderIdChange={setRenderId} />
      </div>
      <div className="mx-4 h-full w-px bg-dark-700 "></div>
      <div className="w-full p-6 pl-4">
        <VideoEditorWindow renderId={renderId} />
      </div>
    </div>
  );
}
