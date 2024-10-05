"use client"

import React, { useState } from 'react';
import ChatSection from './ChatSection';
import VideoEditorWindow from './VideoEditorWindow';

const SpliceAI: React.FC = () => {
  const [renderId, setRenderId] = useState<string | null>(null);

  return (
    <div className="flex h-full max-md:flex-col">
      <div className="w-1/3 overflow-auto">
        <ChatSection onRenderIdChange={setRenderId} />
      </div>
      <div className="overflow-auto pl-4">
        <VideoEditorWindow renderId={renderId} />
      </div>
    </div>
  );
};

export default SpliceAI;