import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Stream from "./Stream";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../../app/hooks";
import { selectUsername } from "../TokenManager/tokenSlice";

interface ViewerProps {
  socket: Socket;
}

const Viewer = ({ socket }: ViewerProps) => {
  let peerRef: RTCPeerConnection;
  const [streams, setStreams] = useState<MediaStreamTrack[]>();
  const streamsRef = useRef<MediaStreamTrack[]>([]);
  const username = useAppSelector(selectUsername);

  const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  const updateTrackState = () => {
    if (streamsRef.current.length > 0) {
      let newState = streamsRef.current;
      setStreams(newState);
      streamsRef.current = [];
    }
  };

  const debouncedUpdate = debounce(updateTrackState);

  useEffect(() => {
    socket.on("reestablish_connection", (data) => {
      setStreams([]);
      startStream();
    });

    return () => {
      if (peerRef) peerRef.close();
    };
  }, []);

  const startStream = () => {
    init();
  };

  async function init() {
    const peer = createPeer();
    peerRef = peer;
    peer.addTransceiver("video", { direction: "recvonly" });
    peer.addTransceiver("video", { direction: "recvonly" });
    peer.addTransceiver("video", { direction: "recvonly" });
  }

  function createPeer() {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    peer.onicecandidate = (e) => {
      if (e.candidate)
        socket.emit("ice_viewer", {
          ice: e.candidate?.toJSON(),
          user: username,
          socket_id: socket.id,
        });
    };
    return peer;
  }

  async function handleNegotiationNeededEvent(peer: any) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
      sdp: peer.localDescription,
      user: username,
      socket_id: socket.id,
    };
    const { data } = await axios.post("/streaming/consumer", payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e: any) => console.log(e));
  }

  function handleTrackEvent(e: any) {
    streamsRef.current.push(e.track);
    debouncedUpdate();
  }

  return (
    <div>
      <Button variant="contained" onClick={startStream}>
        Start Stream
      </Button>
      <div>
        {streams
          ? streams.map((stream) => {
              return <Stream source={stream} />;
            })
          : null}
      </div>
    </div>
  );
};

export default Viewer;
