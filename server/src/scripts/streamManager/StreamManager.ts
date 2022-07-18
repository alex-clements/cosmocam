import { User } from "./User";
import { AbstractSocket } from "./AbstractSocket";
import { StreamingSocket } from "./StreamingSocket";
import { ViewingSocket } from "./ViewingSocket";
import { Peer } from "./Peer";
import { Stream } from "./Stream";
class StreamManager {
  users: Map<String, User>;
  sockets: Set<AbstractSocket>;

  constructor() {
    this.users = new Map();
    this.sockets = new Set();
  }

  // removes a socket
  removeSocket(socket: String) {
    this.sockets.forEach((test_socket) => {
      if (test_socket.id === socket) {
        test_socket.close();
        this.sockets.delete(test_socket);
      }
    });
  }

  // determines if a user exists in the StreamManager
  hasUser(username: String) {
    return this.users.has(username);
  }

  // adds a User to the StreamManager
  addUser(username: String) {
    this.users.set(username, new User(username));
  }

  // adds a new StreamingSocket to a User
  addStreamingSocket(username: String, socket: String) {
    let user = this.users.get(username);
    if (!user) return;

    let new_socket: AbstractSocket = new StreamingSocket(socket, user);
    this.sockets.add(new_socket);
  }

  // adds a new ViewingSocket to a User
  addViewingSocket(username: String, socket: String) {
    let user = this.users.get(username);
    if (!user) return;
    let new_socket: AbstractSocket = new ViewingSocket(socket, user);
    this.sockets.add(new_socket);
  }

  // adds a Peer to a ViewingSocket
  addViewingPeer(username: String, socket_id: String, peer: RTCPeerConnection) {
    let user = this.users.get(username);
    let socket: ViewingSocket = user.getViewingSocket(socket_id);
    let new_peer: Peer = new Peer(peer);
    socket.setPeer(new_peer);
  }

  // adds a Peer to a StreamingSocket
  addStreamingPeer(
    username: String,
    socket_id: String,
    peer: RTCPeerConnection
  ) {
    let user = this.users.get(username);
    let socket: StreamingSocket = user.getStreamingSocket(socket_id);
    let new_peer: Peer = new Peer(peer);
    socket.setPeer(new_peer);
  }

  // determines if a given user has a viewing peer
  hasViewingPeer(username: String, socket_id: String) {
    let user = this.users.get(username);
    if (!user) return false;
    let viewing_socket: ViewingSocket = user.getViewingSocket(socket_id);
    return viewing_socket.peer != null;
  }

  // determines if a given user has a viewing peer
  hasStreamingPeer(username: String, socket_id: String) {
    let user = this.users.get(username);
    if (!user) return false;
    let streaming_socket: StreamingSocket = user.getStreamingSocket(socket_id);
    return streaming_socket.peer != null;
  }

  // returns the peer of a ViewingSocket
  getViewingPeer(username: String, socket_id: String) {
    let user = this.users.get(username);
    if (!user) return;
    let viewing_socket: ViewingSocket = user.getViewingSocket(socket_id);
    return viewing_socket.peer.peer;
  }

  // returns the peer of a StreamingSocket
  getStreamingPeer(username: String, socket_id: String) {
    let user = this.users.get(username);
    if (!user) return;
    let streaming_socket: StreamingSocket = user.getStreamingSocket(socket_id);
    return streaming_socket.peer.peer;
  }

  // closes down a ViewingSocket
  removeViewingSocket(username: String, socket_id: String) {
    let user = this.users.get(username);
    if (!user) return;
    user.removeViewingSocket(socket_id);
    this.removeSocket(socket_id);
  }

  // closes down a StreamingSocket
  removeStreamingSocket(username: String, socket_id: String) {
    let user = this.users.get(username);
    if (!user) return;
    user.removeStreamingSocket(socket_id);
    this.removeSocket(socket_id);
  }

  // adds a stream to a StreamingSocket
  addStream(username: String, socket_id: String, stream: MediaStream) {
    let user = this.users.get(username);
    if (!user) return;

    let streaming_socket: StreamingSocket = user.getStreamingSocket(socket_id);
    if (!streaming_socket) return;

    let new_stream: Stream = new Stream(stream);
    streaming_socket.setStream(new_stream);
  }

  // determines if a user has a stream
  hasUserStream(username: String, stream: MediaStream) {
    let user = this.users.get(username);
    return user.hasStream(stream);
  }
}

let streamManager: StreamManager = new StreamManager();

module.exports = streamManager;
