import React from "react";

export const VideoPreview = ({
  videoUrl,
  videoPlayerRef,
}: {
  videoUrl: string | null;
  videoPlayerRef: React.RefObject<HTMLVideoElement>;
}) => {
  return (
    <div className="dotboard flex grow items-center justify-center overflow-hidden rounded-lg">
      {videoUrl ? (
        // For some reason, you have to add key={videoUrl} to force the video to reload
        <video
          key={videoUrl}
          className="max-h-full max-w-full object-contain"
          ref={videoPlayerRef}
          controls={false}
        >
          <source src={videoUrl} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="">No video available</p>
        </div>
      )}
    </div>
  );
};
