import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../../app/hooks";
import { selectUsername } from "../../redux/tokenSlice";
import { isMobile } from "react-device-detect";

interface StreamerMainProps {
  socket: Socket;
}

const StreamerMain = ({ socket }: StreamerMainProps) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const username = useAppSelector(selectUsername);
  const HEIGHT: number = isMobile ? 300 : 500;
  const WIDTH: number = isMobile ? 300 : 500;
  const viewerCount = useRef(0);

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: any) => track.stop());
      streamRef.current = null;
      if (peerRef.current) peerRef.current.close();
      peerRef.current = null;
    }
    socket.emit("disconnect_peer", username);
    setPlaying(false);
  };

  const getInitialActiveViewers = async () => {
    const { data } = await axios.post("/streaming/getActiveViewers", {
      user: username,
    });
    viewerCount.current = data.num_viewers;
  };

  useEffect(() => {
    getInitialActiveViewers();
    socket.on("viewer_connected", handleViewerConnected);
    socket.on("viewer_disconnected", handleViewerDisconnected);

    return () => {
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: any) => {
          track.stop();
        });
        streamRef.current = null;
      }
    };
  }, []);

  const handleViewerConnected = (data: { number_viewers: string }) => {
    console.log("viewer connected");
    console.log("number viewers: ", data.number_viewers);
    viewerCount.current = viewerCount.current + 1;
    console.log(viewerCount);
    if (viewerCount.current == 1) {
      initPeer();
    }
  };

  const handleViewerDisconnected = (data: { number_viewers: string }) => {
    console.log("viewer disconnected");
    viewerCount.current = viewerCount.current - 1;
    if (viewerCount.current == 0) {
      peerRef.current?.close();
      console.log("peer connection closed");
    }
  };

  const init = async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    streamRef.current = stream;
    if (videoRef.current && streamRef.current)
      videoRef.current.srcObject = streamRef.current;
    if (viewerCount.current >= 1) {
      initPeer();
    }
  };

  const initPeer = async (): Promise<void> => {
    const peer = createPeer();
    streamRef.current?.getTracks().forEach((track) => {
      if (streamRef.current) peer.addTrack(track, streamRef.current);
    });
    peerRef.current = peer;
  };

  const createPeer = (): RTCPeerConnection => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:openrelay.metered.ca:80",
        },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443?transport=tcp",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice_broadcast", {
          ice: e.candidate?.toJSON(),
          user: username,
          socket_id: socket.id,
        });
      }
    };
    return peer;
  };

  const handleNegotiationNeededEvent = async (peer: RTCPeerConnection) => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
      sdp: peer.localDescription,
      user: username,
      socket_id: socket.id,
    };
    const { data } = await axios.post("/streaming/broadcast", payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e: any) => console.log(e));
  };

  const startVideo = () => {
    setPlaying(true);
    init();
  };

  return (
    <div>
      <div>
        {!playing ? (
          <Button variant="contained" onClick={startVideo}>
            Start
          </Button>
        ) : (
          <Button variant="contained" onClick={stopVideo}>
            Stop
          </Button>
        )}
      </div>
      <div>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          height={HEIGHT}
          width={WIDTH}
          style={{ transform: "scaleX(-1)" }}
        ></video>
      </div>
    </div>
  );
};

export default StreamerMain;
