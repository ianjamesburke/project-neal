"use client"

import React from 'react';
import ChatSection from './ChatSection';
import VideoEditorWindow from './VideoEditorWindow';

const SpliceAI: React.FC = () => {
  return (
    <div className="flex h-full max-md:flex-col">
      <div className="w-1/3 overflow-auto">
        <ChatSection onVideoReady={() => {}} />
      </div>
      <div className="flex-grow overflow-auto pl-4">
        <VideoEditorWindow />
      </div>
    </div>
  );
};

export default SpliceAI;