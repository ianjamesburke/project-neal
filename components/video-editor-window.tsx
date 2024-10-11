"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Scissors,
  Trash2,
  Play,
  Maximize,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface VideoEditorWindowProps {
  renderId: string | null;
}

const VideoEditorWindow: React.FC<VideoEditorWindowProps> = ({ renderId }) => {
  /* const containerRef = useRef<HTMLDivElement>(null); */
  const trackRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (renderId) {
      console.log("Received renderId:", renderId);
      pollRenderStatus(renderId);
    }
  }, [renderId]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* VideoPreviewTopBar */}
      <div className="flex w-full flex-wrap gap-1 p-2 sm:gap-2">
        <Button
          variant="default"
          size="sm"
          aria-label="font"
          className="text-xs sm:text-sm"
        >
          Font
        </Button>
        <Button
          variant="default"
          size="icon"
          aria-label="Decrease font size"
          className="h-6 w-6 sm:h-8 sm:w-8"
        >
          -
        </Button>
        <span className="flex items-center justify-center text-xs text-white sm:text-sm">
          48
        </span>
        <Button
          variant="default"
          size="icon"
          aria-label="Increase font size"
          className="h-6 w-6 sm:h-8 sm:w-8"
        >
          +
        </Button>
        <Button
          variant="default"
          size="icon"
          aria-label="Bold"
          className="h-6 w-6 sm:h-8 sm:w-8"
        >
          <Bold className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="default"
          size="icon"
          aria-label="Italic"
          className="h-6 w-6 sm:h-8 sm:w-8"
        >
          <Italic className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="default"
          size="icon"
          aria-label="Change case"
          className="h-6 w-6 sm:h-8 sm:w-8"
        >
          aA
        </Button>
        <Button
          variant="default"
          size="icon"
          aria-label="Underline"
          className="h-6 w-6 sm:h-8 sm:w-8"
        >
          <Underline className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="default"
          size="icon"
          aria-label="Align text"
          className="h-6 w-6 sm:h-8 sm:w-8"
        >
          <AlignLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="default"
          size="icon"
          aria-label="Select area"
          className="h-6 w-6 sm:h-8 sm:w-8"
        >
          <div className="flex h-3 w-3 shrink-0 rounded border border-solid border-white sm:h-4 sm:w-4"></div>
        </Button>
        <div className="ml-auto flex gap-1 sm:gap-2">
          <Button
            variant="default"
            size="icon"
            aria-label="Add shape"
            className="h-6 w-6 sm:h-8 sm:w-8"
          >
            <Image
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f175bfb4432f331a0e6d522eac6042de6c99fb76586831462bf76b727116e06d?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
              alt=""
              className="h-full w-full rounded-none object-contain"
              width={24}
              height={24}
            />
          </Button>
          <Button
            variant="default"
            size="icon"
            aria-label="Add image"
            className="h-6 w-6 sm:h-8 sm:w-8"
          >
            <Image
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f1dff542c81b18f169c1719a5589a4bc911de3cd8aedd1b4a946fc58e9de21fa?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
              alt=""
              className="h-full w-full rounded-none object-contain"
              width={24}
              height={24}
            />
          </Button>
          <Button
            variant="default"
            size="icon"
            aria-label="Refresh preview"
            className="h-6 w-6 sm:h-8 sm:w-8"
          >
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
      {/* VideoPreviewTopBar End */}

      {/* Video Preview */}
      <div className="checkerboard flex grow items-center justify-center overflow-hidden rounded-lg">
        {videoUrl ? (
          // For some reason, you have to add key={videoUrl} to force the video to reload
          <video
            key={videoUrl}
            className="max-h-full max-w-full object-contain"
            controls
          >
            <source src={videoUrl} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-gray-400">No video available</p>
          </div>
        )}
      </div>

      {/* VideoTimelineTopBar */}
      <div className="m-2 flex w-full items-center justify-between align-middle">
        {/* Left section */}
        <div className="flex items-center gap-2 space-x-2">
          <span className="whitespace-nowrap text-sm font-medium text-white sm:text-base">
            Clip Editor
          </span>
          <button aria-label="Previous clip">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button aria-label="Next clip">
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button aria-label="Split clip">
            <Scissors className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button aria-label="Delete clip">
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Center section */}
        <div className="grow">
          <button
            aria-label="Play/Pause"
            className="flex h-[11px] w-[60px] items-center justify-center sm:w-[81px]"
          >
            <Play className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center">
          <button
            aria-label="Toggle fullscreen"
            className="mr-3 flex h-3 w-3 shrink-0 items-center justify-center rounded border border-solid border-white sm:h-4 sm:w-4"
          >
            <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
      {/* VideoTimelineTopBar End */}

      {/* Timeline */}
      <div>
        <div className="mr-4 mt-2.5 flex items-center justify-between gap-5 whitespace-nowrap text-xs font-medium text-white max-md:mr-2.5">
          <div className="my-auto flex gap-8 self-stretch">
            <span>00:00</span>
            <span>00:05</span>
            <span>00:10</span>
            <span>00:15</span>
            <span>00:30</span>
            <span>00:35</span>
            <span>00:40</span>
            <span>00:45</span>
            <span>00:50</span>
            <span>00:55</span>
            <span>01:00</span>
          </div>
        </div>
        <Image
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff8ec43f06abb4bd47592dd853bbfee2ad7c92e3ceee4991ee9b15d0e8860e0b?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
          alt="Video timeline"
          className="mt-2.5 aspect-[23.26] rounded-none object-contain max-md:max-w-full"
          width={750}
          height={750}
        />
        <div className="mt-1 flex flex-wrap gap-1 max-md:max-w-full">
          <button aria-label="Toggle audio">
            <Image
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0931d74cf02cde574e1c388ab1bae81dd09b9ff1fcef5f1474c66fea62975221?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
              alt=""
              className="aspect-square shrink-0 rounded-none object-contain"
              width={32}
              height={32}
            />
          </button>
          <div className="flex h-8 w-[51px] shrink-0 rounded-lg bg-neutral-800"></div>
          <button
            aria-label="Add audio track"
            className="flex flex-col items-start justify-center rounded-lg border border-solid border-indigo-400 bg-indigo-400/20 px-2 py-2.5 max-md:max-w-full max-md:pr-5"
          >
            <Image
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cec8a37156bff22674bc0314cbf3700b890805b8f22f1e312b405678fa31c69c?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
              alt=""
              className="aspect-[1.14] w-4 object-contain"
              width={16}
              height={16}
            />
          </button>
        </div>
        <div className="mt-1 flex flex-wrap gap-1 max-md:max-w-full">
          <button aria-label="Toggle video">
            <Image
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cdbf3053fedfeb27b017ced2c04cba4cf55a4cffcab03110545659ce43cb4d61?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
              alt=""
              className="aspect-square shrink-0 rounded-none object-contain"
              width={32}
              height={32}
            />
          </button>
          <div className="flex h-8 w-[122px] shrink-0 rounded-lg bg-neutral-800"></div>
          <button
            aria-label="Add video track"
            className="flex flex-col items-start justify-center rounded-lg bg-indigo-400 p-2.5 max-md:pr-5"
          >
            <Image
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7a8af2284f4343ec2c60d583b6ebf14e8b401e7dff3d49455dcf4e8a460bbfe2?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
              alt=""
              className="aspect-square w-3 object-contain"
              width={12}
              height={12}
            />
          </button>
          <div className="flex h-8 w-[395px] max-w-full shrink-0 rounded-lg bg-neutral-800"></div>
        </div>
      </div>
      {/* Timeline End */}

      <div className="mt-4">
        <div className="relative h-4 rounded bg-gray-900">
          <div ref={trackRef} className="absolute inset-0"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditorWindow;
