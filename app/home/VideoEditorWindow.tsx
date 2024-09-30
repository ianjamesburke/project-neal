import React from 'react';
import VideoPreviewTopBar from './VideoWindow/VideoPreviewTopBar';
import VideoPreview from './VideoWindow/VideoPreview';
import Timeline from './VideoWindow/Timeline';



const VideoEditor: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="overflow-hidden">
        <VideoPreview />
      </div>
      <Timeline />
    </div>
  );
};



export default VideoEditor;