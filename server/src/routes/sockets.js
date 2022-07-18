"use strict";
const Queue = require("../scripts/queue");

module.exports = function (server, app) {
  const io = require("socket.io")(server);
  let broadcastQueue = new Queue();
  let viewerQueue = new Queue();

  const clearStreamsAndPeers = async (socket) => {
    const streamManager = app.get("streamManager");
    let userStreams = streamManager.getAllUserStreams();
    for (const [key, value] of userStreams) {
      let peers = value.get("peers");
      let streams = value.get("streams");
      for (const [test_socket, stream] of streams) {
        if (test_socket === socket) {
          streamManager.removeUserStream(key, test_socket);
        }
      }

      for (const [test_socket, peer] of peers) {
        if (test_socket === socket) {
          streamManager.removeUserPeer(key, test_socket);
        }
      }
    }
  };

  io.use((socket, next) => {
    next();
  });

  io.on("connection", (socket) => {
    console.log("socket connected: ", socket.id);

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected: ", socket.id);
      clearStreamsAndPeers(socket.id);
      io.emit("reestablish_connection", "socket disconnected");
    });

    socket.on("ice_broadcast", (data) => {
      const socket_id = data.socket_id;
      const username = data.user.toLowerCase();
      const ice = data.ice;
      let streamManager = app.get("streamManager");

      if (streamManager.hasUserPeer(username, socket_id)) {
        streamManager.getPeer(username, socket_id).addIceCandidate(data.ice);
        while (broadcastQueue.len > 0) {
          streamManager
            .getPeer(username, socket_id)
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
      streamManager.removeUserStream(username.toLowerCase(), socket.id);
      streamManager.removeUserPeer(username.toLowerCase(), socket.id);
      io.emit("reestablish_connection", "socket disconnected");
    });
  });
};
