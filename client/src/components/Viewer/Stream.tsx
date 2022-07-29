import React, { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";

interface StreamProps {
  source: MediaStreamTrack;
}

const Stream = ({ source }: StreamProps) => {
  const HEIGHT = isMobile ? 300 : 500;
  const WIDTH = isMobile ? 300 : 500;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let new_stream = new MediaStream();
    new_stream.addTrack(source);
    if (videoRef.current) {
      videoRef.current.srcObject = new_stream;
      videoRef.current.play();
    }
  }, []);

  return (
    <video
      ref={videoRef}
      height={HEIGHT}
      width={WIDTH}
      muted
      autoPlay
      playsInline
    ></video>
  );
};

export default Stream;
