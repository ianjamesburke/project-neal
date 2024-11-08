"use client";

import { useState } from "react";

import { useSidebarStore } from "@/lib/store/use-sidebar-store";
import { UploadSection } from "./upload-section";
import { ChatSection } from "./chat-section";
import VideoEditorWindow from "@/app/dashboard/_partials/video-editor-window";
import { BottomToolbar } from "./bottom-toolbar";

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  suggestions?: string[];
}

export function DashboardContent() {
  const { mode } = useSidebarStore();

  // States
  const [renderId, setRenderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Parallax! We create video content that converts. Where would you like to start?",
      sender: "ai",
      suggestions: [
        "Transcribe a TikTok",
        "Open previous project (coming soon)",
        "Create a new project"
      ],
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
