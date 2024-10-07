'use client';

import React, { useRef, useEffect, useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoEditorWindowProps {
  renderId: string | null;
}

const VideoEditorWindow: React.FC<VideoEditorWindowProps> = ({ renderId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>('https://f002.backblazeb2.com/file/creatomate-c8xg3hsxdu/135adfb6-2cb9-47c1-8908-01a8aaa8cafd.mp4');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (renderId) {
      console.log("Received renderId:", renderId);
      pollRenderStatus(renderId);
    }
  }, [renderId]);

  const pollRenderStatus = async (renderId: string) => {
    console.log("Beginning polling render status for:", renderId);
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/render-status/${renderId}`);
        const data = await response.json();

        console.log("Polling render status:", data.status);
        
        if (data.status === 'succeeded') {
          if (!data.videoUrl) {
            console.error('Render succeeded but videoUrl is missing.');
            return;
          }
          console.log("Video render completed:", data.videoUrl);
          clearInterval(interval);
          setVideoUrl(data.videoUrl);
        }
      } catch (error) {
        console.error('Error polling render status:', error);
      }
    }, 2500);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* VideoPreviewTopBar */}
      <div className="flex flex-wrap gap-1 sm:gap-2 w-full p-2">
        <Button variant="default" size="sm" aria-label="font" className="text-xs sm:text-sm">
          Font
        </Button>
        <Button variant="default" size="icon" aria-label="Decrease font size" className="w-6 h-6 sm:w-8 sm:h-8">
          -
        </Button>
        <span className="flex items-center justify-center text-xs sm:text-sm text-white">48</span>
        <Button variant="default" size="icon" aria-label="Increase font size" className="w-6 h-6 sm:w-8 sm:h-8">
          +
        </Button>
        <Button variant="default" size="icon" aria-label="Bold" className="w-6 h-6 sm:w-8 sm:h-8">
          <Bold className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <Button variant="default" size="icon" aria-label="Italic" className="w-6 h-6 sm:w-8 sm:h-8">
          <Italic className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <Button variant="default" size="icon" aria-label="Change case" className="w-6 h-6 sm:w-8 sm:h-8">
          aA
        </Button>
        <Button variant="default" size="icon" aria-label="Underline" className="w-6 h-6 sm:w-8 sm:h-8">
          <Underline className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <Button variant="default" size="icon" aria-label="Align text" className="w-6 h-6 sm:w-8 sm:h-8">
          <AlignLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <Button variant="default" size="icon" aria-label="Select area" className="w-6 h-6 sm:w-8 sm:h-8">
          <div className="flex shrink-0 w-3 h-3 sm:w-4 sm:h-4 rounded border border-white border-solid"></div>
        </Button>
        <div className="flex gap-1 sm:gap-2 ml-auto">
          <Button variant="default" size="icon" aria-label="Add shape" className="w-6 h-6 sm:w-8 sm:h-8">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f175bfb4432f331a0e6d522eac6042de6c99fb76586831462bf76b727116e06d?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
              alt=""
              className="object-contain w-full h-full rounded-none"
            />
          </Button>
          <Button variant="default" size="icon" aria-label="Add image" className="w-6 h-6 sm:w-8 sm:h-8">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f1dff542c81b18f169c1719a5589a4bc911de3cd8aedd1b4a946fc58e9de21fa?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
              alt=""
              className="object-contain w-full h-full rounded-none"
            />
          </Button>
          <Button variant="default" size="icon" aria-label="Refresh preview" className="w-6 h-6 sm:w-8 sm:h-8">
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
      {/* VideoPreviewTopBar End */}

      {/* Video Preview */}
      <div className="flex-grow overflow-hidden rounded-lg checkerboard flex items-center justify-center">
        {videoUrl ? ( 
          // For some reason, you have to add key={videoUrl} to force the video to reload
          <video key={videoUrl} className="max-w-full max-h-full object-contain" controls> 
            <source src={videoUrl} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400">No video available</p>
          </div>
        )}
      </div>

      {/* VideoTimelineTopBar */}
      <div className="flex items-center justify-between mx-2 my-2 w-full align-middle">
        {/* Left section */}
        <div className="flex items-center gap-2 space-x-2">
          <span className="text-sm sm:text-base font-medium text-white whitespace-nowrap">Clip Editor</span>
          <button aria-label="Previous clip">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button aria-label="Next clip">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button aria-label="Split clip">
            <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button aria-label="Delete clip">
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Center section */}
        <div className="flex-grow">
          <button aria-label="Play/Pause" className="w-[60px] sm:w-[81px] h-[11px] flex items-center justify-center">
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center">
          <button
            aria-label="Toggle fullscreen"
            className="mr-3 flex shrink-0 w-3 h-3 sm:w-4 sm:h-4 rounded border border-white border-solid items-center justify-center"
          >
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      {/* VideoTimelineTopBar End */}

      {/* Timeline */}
      <div>
        <div className="flex gap-5 justify-between items-center mt-2.5 mr-4 text-xs font-medium text-white whitespace-nowrap max-md:mr-2.5">
          <div className="flex gap-8 self-stretch my-auto">
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
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff8ec43f06abb4bd47592dd853bbfee2ad7c92e3ceee4991ee9b15d0e8860e0b?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
          alt="Video timeline"
          className="object-contain mt-2.5 rounded-none aspect-[23.26] w-[750px] max-md:max-w-full"
        />
        <div className="flex flex-wrap gap-1 mt-1 max-md:max-w-full">
          <button aria-label="Toggle audio">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0931d74cf02cde574e1c388ab1bae81dd09b9ff1fcef5f1474c66fea62975221?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
              alt=""
              className="object-contain shrink-0 w-8 rounded-none aspect-square"
            />
          </button>
          <div className="flex shrink-0 h-8 rounded-lg bg-neutral-800 w-[51px]"></div>
          <button
            aria-label="Add audio track"
            className="flex flex-col justify-center items-start px-2 py-2.5 rounded-lg border border-indigo-400 border-solid bg-indigo-400 bg-opacity-20 max-md:pr-5 max-md:max-w-full"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cec8a37156bff22674bc0314cbf3700b890805b8f22f1e312b405678fa31c69c?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
              alt=""
              className="object-contain w-4 aspect-[1.14]"
            />
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mt-1 max-md:max-w-full">
          <button aria-label="Toggle video">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cdbf3053fedfeb27b017ced2c04cba4cf55a4cffcab03110545659ce43cb4d61?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
              alt=""
              className="object-contain shrink-0 w-8 rounded-none aspect-square"
            />
          </button>
          <div className="flex shrink-0 h-8 rounded-lg bg-neutral-800 w-[122px]"></div>
          <button
            aria-label="Add video track"
            className="flex flex-col justify-center items-start px-2.5 py-2.5 bg-indigo-400 rounded-lg max-md:pr-5"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7a8af2284f4343ec2c60d583b6ebf14e8b401e7dff3d49455dcf4e8a460bbfe2?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
              alt=""
              className="object-contain w-3 aspect-square"
            />
          </button>
          <div className="flex shrink-0 max-w-full h-8 rounded-lg bg-neutral-800 w-[395px]"></div>
        </div>
      </div>
      {/* Timeline End */}

      <div className="mt-4">
        <div className="relative h-4 bg-gray-900 rounded">
          <div ref={trackRef} className="absolute inset-0"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditorWindow;