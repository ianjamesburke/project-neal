'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Preview } from '@creatomate/preview';
import { DraggableCore } from 'react-draggable';
import throttle from 'lodash/throttle';
import VideoPreviewTopBar from './VideoPreviewTopBar';

const VideoPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState<any>(null);
  const previewRef = useRef<Preview | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [dragContext, setDragContext] = useState<{ startX: number; startTime: number } | null>(null);



  useEffect(() => {
    if (containerRef.current && source) {
      console.log('Initializing Preview with source:', source);
      const preview = new Preview(containerRef.current, 'interactive', 'public-x8bxtu47pj5cryqys83j2v45');
      previewRef.current = preview;

      preview.onReady = async () => {
        console.log('Preview is ready, setting source...');
        await preview.setSource(source);
        console.log('Source set successfully');
      };

      preview.onTimeChange = (time) => {
        setCurrentTime(time);
      };
    }
  }, [source]);

  const setTime = async (time: number) => {
    if (previewRef.current) {
      await previewRef.current.setTime(time);
    }
  };

  const setTimeThrottled = useCallback(throttle(setTime, 15), []);

  const currentTrackProgress = previewRef.current?.state?.duration
    ? currentTime / previewRef.current.state.duration
    : 0;

  // Add a function to refresh the preview
  const refreshPreview = useCallback(async () => {
    console.log('Refreshing preview...');
    try {
      const response = await fetch('/api/get_from_kv/temp_payload_key');
      const data = await response.json();
      if (data.value) {
        let parsedSource = data.value;
        
        // Parse and decode the source for each element
        parsedSource.elements = parsedSource.elements.map((element: { source: string; }) => ({
          ...element,
          source: element.source ? atob(element.source) : element.source
        }));

        setSource(parsedSource);
        if (previewRef.current) {
          await previewRef.current.setSource(parsedSource);
        }
      }
    } catch (error) {
      console.error('Error refreshing preview:', error);
    }
  }, []);

  return (
    <div>
      <VideoPreviewTopBar onRefresh={refreshPreview} />
      <div ref={containerRef} className="relative w-full aspect-video max-w-full bg-gray-800">
        {/* The Creatomate Preview will be rendered here */}
      </div>
      <div className="mt-4">
        <div className="relative h-4 bg-gray-900 rounded">
          <div ref={trackRef} className="absolute inset-0">
            <DraggableCore
              nodeRef={handleRef}
              onStart={(e, data) => {
                setDragContext({
                  startX: data.x,
                  startTime: currentTime,
                });
              }}
              onDrag={(e, data) => {
                if (previewRef.current?.state && trackRef.current && dragContext) {
                  const trackWidth = trackRef.current.clientWidth;
                  const trackProgress = (data.x - dragContext.startX) / trackWidth;
                  const trackProgressSeconds = Math.min(
                    Math.max(
                      dragContext.startTime + previewRef.current.state.duration * trackProgress,
                      0
                    ),
                    previewRef.current.state.duration - 0.001
                  );
                  setTimeThrottled(trackProgressSeconds);
                }
              }}
              onStop={() => {
                setDragContext(null);
              }}
            >
              <div
                ref={handleRef}
                className="absolute top-0 w-4 h-4 bg-white rounded-full cursor-pointer"
                style={{ left: `${currentTrackProgress * 100}%` }}
              />
            </DraggableCore>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;