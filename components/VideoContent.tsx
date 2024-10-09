"use client";

import React, { createContext, useState } from "react";

interface VideoContextType {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}

export const VideoContext = createContext<VideoContextType>({
  videoUrl: "",
  setVideoUrl: () => {},
});

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <VideoContext.Provider value={{ videoUrl, setVideoUrl }}>
      {children}
    </VideoContext.Provider>
  );
};
