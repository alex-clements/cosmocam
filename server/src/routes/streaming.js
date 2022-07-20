import express from "express";
const router = express.Router();
import webrtc from "@koush/wrtc";

router.post("/broadcast", async (req, res) => {
  console.log("/broadcast");
  const streamManager = req.app.get("streamManager");
  const user = req.body.user.toLowerCase();
  const socket_id = req.body.socket_id;
  const broadcastPeer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
  broadcastPeer.ontrack = (e) =>
    handleTrackEvent(e, broadcastPeer, streamManager, user, socket_id);
  const desc = new webrtc.RTCSessionDescription(req.body.sdp);
  await broadcastPeer.setRemoteDescription(desc);
  const answer = await broadcastPeer.createAnswer();
  await broadcastPeer.setLocalDescription(answer);
  const payload = {
    sdp: broadcastPeer.localDescription,
  };
  req.app.get("streamManager").addStreamingPeer(user, socket_id, broadcastPeer);
  res.json(payload);
});

router.post("/consumer", async (req, res) => {
  console.log("/consumer");
  const username = req.body.user.toLowerCase();
  const streamManager = req.app.get("streamManager");
  const socket_id = req.body.socket_id;
  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });

  req.app.set("viewerPeer", peer);

  const desc = new webrtc.RTCSessionDescription(req.body.sdp);
  await peer.setRemoteDescription(desc);

  streamManager.addViewingPeer(username, socket_id, peer);

  // const streams = streamManager.getUserStreams(username);

  // streams.forEach((stream, index) => {
  //   stream.getTracks().forEach((track) => {
  //     peer.addTrack(track);
  //   });
  // });

  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };
  res.json(payload);
});

function handleTrackEvent(e, peer, streamManager, user, socket_id) {
  if (!streamManager.hasUserStream(user, e.streams[0])) {
    streamManager.addStream(user, socket_id, e.streams[0]);
  }
}

export default router;
