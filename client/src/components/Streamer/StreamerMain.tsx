import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../../app/hooks";
import { selectUsername } from "../TokenManager/tokenSlice";
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
  const HEIGHT: number = isMobile ? 100 : 500;
  const WIDTH: number = isMobile ? 100 : 500;

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

  useEffect(() => {
    const peer = createPeer();
    console.log("username: ", username);
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

  const init = async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;
    const peer = createPeer();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    peerRef.current = peer;
  };

  const createPeer = (): RTCPeerConnection => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    peer.onicecandidate = (e) => {
      if (e.candidate)
        socket.emit("ice_broadcast", {
          ice: e.candidate?.toJSON(),
          user: username,
          socket_id: socket.id,
        });
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
        <video
          ref={videoRef}
          autoPlay
          height={HEIGHT}
          width={WIDTH}
          style={{ transform: "scaleX(-1)" }}
        ></video>
      </div>
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
    </div>
  );
};

export default StreamerMain;