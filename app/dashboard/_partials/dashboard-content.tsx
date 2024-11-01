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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! Welcome to Splice AI. Here’s how it works. I’ll ask you to upload some b-roll footage of the product you’re advertising, and then I’ll ask you a few questions about the product itself. Then, I’ll chop up the footage, generate a script, and edit it into a full blown ad creative. Let’s begin!",
      sender: "ai",
    },
  ]);

  const SectionRenderer = () => {
    if (mode === "Splice AI")
      return (
        <ChatSection 
          onRenderIdChange={setRenderId} 
          messages={messages}
          setMessages={setMessages}
        />
      );

    if (mode === "Uploads") {
      return <UploadSection />;
    }

    return null;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-md:flex-col ">
      <div className="w-[calc(100%-64px)] border-r border-dark-700 p-4">
        <SectionRenderer />
      </div>

      <div className="flex w-full flex-col">
        <VideoEditorWindow renderId={renderId} />
        <BottomToolbar />
      </div>
    </div>
  );
}
