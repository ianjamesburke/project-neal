"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

import { TopToolbar } from "./_partials/top-toolbar";
import { VideoPreview } from "./_partials/video-preview";
import { Timeline } from "./_partials/timeline";
import { ClipToolbar } from "./_partials/clip-toolbar";
import { LockKeyhole } from "lucide-react";

interface VideoEditorWindowProps {
  renderId: string | null;
}

const VideoEditorWindow: React.FC<VideoEditorWindowProps> = ({ renderId }) => {
  /* const containerRef = useRef<HTMLDivElement>(null); */
  const trackRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    "https://f002.backblazeb2.com/file/creatomate-c8xg3hsxdu/135adfb6-2cb9-47c1-8908-01a8aaa8cafd.mp4"
  );
  /* const [isLoading, setIsLoading] = useState<boolean>(true); */

  const pollRenderStatus = async (renderId: string) => {
    console.log("Beginning polling render status for:", renderId);
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/flask/render-status/${renderId}`);
        const data = await response.json();

        console.log("Polling render status:", data.status);

        if (data.status === "succeeded") {
          if (!data.videoUrl) {
            console.error("Render succeeded but videoUrl is missing.");
            return;
          }
          console.log("Video render completed:", data.videoUrl);
          clearInterval(interval);
          setVideoUrl(data.videoUrl);
        }
      } catch (error) {
        console.error("Error polling render status:", error);
      }
    }, 2500);
  };
  const handlePlayVideo = useCallback(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.play();
      setIsPlaying(true);
    }
  }, [videoPlayerRef]);
  const handlePauseVideo = useCallback(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    }
  }, [videoPlayerRef]);

  // Effects
  useEffect(() => {
    if (renderId) {
      console.log("Received renderId:", renderId);
      pollRenderStatus(renderId);
    }
  }, [renderId]);
  useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.onended = () => setIsPlaying(false);
    }
  }, [videoPlayerRef]);

  return (
    <div className="mx-4 mt-4 flex h-full w-full flex-col overflow-x-hidden rounded-2xl rounded-b-none border border-b-0 border-dark-700">
      <TopToolbar />
      <VideoPreview videoUrl={videoUrl} videoPlayerRef={videoPlayerRef} />
      <ClipToolbar
        isPlaying={isPlaying}
        handlePlayVideo={handlePlayVideo}
        handlePauseVideo={handlePauseVideo}
      />
      <div className="relative flex flex-col">
        <Timeline />
        <div className="mt-4">
          <div className="relative h-4 rounded">
            <div ref={trackRef} className="absolute inset-0"></div>
          </div>
        </div>

        <div className="bg-dark-800/50 absolute inset-0 flex items-center justify-center backdrop-blur-md">
          <span className="flex items-center gap-2 rounded-lg border border-white bg-white/10 px-4 py-2 text-white backdrop-blur-md">
            <LockKeyhole /> Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoEditorWindow;
