"use strict";
import { Queue } from "../scripts/queue.js";
import { Server } from "socket.io";

export default function (server, app) {
  const io = new Server(server);
  let broadcastQueue = new Queue();
  let viewerQueue = new Queue();

  io.use((socket, next) => {
    next();
  });

  io.on("connection", (socket) => {
    console.log("socket connected: ", socket.id);
    let streamManager = app.get("streamManager");
    streamManager.addSocketIO(socket.id, socket);

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected: ", socket.id);
      let streamManager = app.get("streamManager");
      streamManager.removeSocket(socket.id);
      io.emit("reestablish_connection", "socket disconnected");
    });

    socket.on("ice_broadcast", (data) => {
      const socket_id = data.socket_id;
      const username = data.user.toLowerCase();
      const ice = data.ice;
      let streamManager = app.get("streamManager");

      if (streamManager.hasStreamingPeer(username, socket_id)) {
        streamManager
          .getStreamingPeer(username, socket_id)
          .addIceCandidate(data.ice);
        while (broadcastQueue.len > 0) {
          streamManager
            .getStreamingPeer(username, socket_id)
            .addIceCandidate(broadcastQueue.pop());
        }
      } else {
        broadcastQueue.push(ice);
      }
    });

    socket.on("ice_viewer", (ice) => {
      if (app.get("viewerPeer")) {
        app.get("viewerPeer").addIceCandidate(ice);
        while (viewerQueue.len > 0) {
          app.get("viewerPeer").addIceCandidate(viewerQueue.pop());
        }
      } else {
        viewerQueue.push(ice);
      }
    });

    socket.on("disconnect_peer", (username) => {
      const streamManager = app.get("streamManager");
      streamManager.clearStreamingSocket(username.toLowerCase(), socket.id);
      io.emit("reestablish_connection", "socket disconnected");
    });
  });
}
