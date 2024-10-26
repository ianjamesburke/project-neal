"use client";

import { useState } from "react";

import { useSidebarStore } from "@/lib/store/use-sidebar-store";
import { UploadSection } from "./upload-section";
import { ChatSection } from "./chat-section";
import VideoEditorWindow from "@/app/dashboard/_partials/video-editor-window";
import { BottomToolbar } from "./bottom-toolbar";

export function DashboardContent() {
  const { mode } = useSidebarStore();

  // States
  const [renderId, setRenderId] = useState<string | null>(null);

  const SectionRenderer = () => {
    if (mode === "Splice AI")
      return <ChatSection onRenderIdChange={setRenderId} />;

    if (mode === "Uploads") {
      return <UploadSection />;
    }

    return null;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-md:flex-col">
      <div className="w-full flex-1 border-r border-dark-700 p-4">
        <SectionRenderer />
      </div>

      <div className="flex w-full flex-1 flex-col">
        <VideoEditorWindow renderId={renderId} />
        <BottomToolbar />
      </div>
    </div>
  );
}
