"use strict";
import { Server } from "socket.io";

export default function (server, app) {
  const io = new Server(server);

  let streamManager = app.get("streamManager");
  streamManager?.setServer(io);

  io.use((socket, next) => {
    next();
  });

  io.on("connection", (socket) => {
    console.log("socket connected: ", socket.id);

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected: ", socket.id);
      let streamManager = app.get("streamManager");
      streamManager.removeSocket(socket.id);
    });

    socket.on("socket_connection", (data) => {
      let streamManager = app.get("streamManager");
      if (data.type === "stream") {
        streamManager.addStreamingSocket(
          data.user.toLowerCase(),
          socket.id,
          socket
        );
      } else if (data.type === "view") {
        streamManager.addViewingSocket(
          data.user.toLowerCase(),
          socket.id,
          socket
        );
      }
    });

    socket.on("ice_broadcast", (data) => {
      let streamManager = app.get("streamManager");
      streamManager
        .getStreamingPeer(data.user.toLowerCase(), socket.id)
        ?.addIceCandidate(data.ice);
    });

    socket.on("ice_viewer", (data) => {
      let streamManager = app.get("streamManager");
      streamManager
        .getViewingPeer(data.user.toLowerCase(), socket.id)
        ?.addIceCandidate(data.ice);
    });

    socket.on("disconnect_peer", (username) => {
      const streamManager = app.get("streamManager");
      streamManager.clearStreamingSocket(username.toLowerCase(), socket.id);
      io.emit("reestablish_connection", "socket disconnected");
    });
  });
}
