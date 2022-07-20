import { User } from "./User.js";
import { AbstractSocket } from "./AbstractSocket.js";
import { StreamingSocket } from "./StreamingSocket.js";
import { ViewingSocket } from "./ViewingSocket.js";
import { Peer } from "./Peer.js";
import { Stream } from "./Stream.js";
import { Socket } from "socket.io";
import { reduceEachTrailingCommentRange } from "typescript";

export default class StreamManager {
  users: Map<String, User>;
  sockets: Set<AbstractSocket>;
  socket_io_map: Map<String, Socket>;

  constructor() {
    this.users = new Map();
    this.sockets = new Set();
    this.socket_io_map = new Map<String, Socket>();
  }

  /**
   *
   * @param socket_id An ID of a socket
   * @param socket A socket.io socket
   */
  addSocketIO(socket_id: String, socket: Socket) {
    if (this.socket_io_map.has(socket_id)) return;
    this.socket_io_map.set(socket_id, socket);
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
  addStreamingSocket(username: String, socket: String): StreamingSocket | null {
    let user = this.users.get(username);
    if (!user) return null;

    let new_socket: StreamingSocket = new StreamingSocket(socket, user);
    this.sockets.add(new_socket);

    return new_socket;
  }

  // adds a new ViewingSocket to a User
  addViewingSocket(username: String, socket: String): ViewingSocket | null {
    let user = this.users.get(username);
    if (!user) return null;
    let new_socket: ViewingSocket = new ViewingSocket(socket, user);
    this.sockets.add(new_socket);
    return new_socket;
  }

  // adds a Peer to a ViewingSocket
  addViewingPeer(username: String, socket_id: String, peer: RTCPeerConnection) {
    let user = this.users.get(username);

    let socket: ViewingSocket | null | undefined =
      user?.getViewingSocket(socket_id);

    if (!socket) {
      socket = this.addViewingSocket(username, socket_id);
    }
    let new_peer: Peer = new Peer(peer);
    socket?.setPeer(new_peer);
  }

  // adds a Peer to a StreamingSocket
  addStreamingPeer(
    username: String,
    socket_id: String,
    peer: RTCPeerConnection
  ): void {
    let user = this.users.get(username);
    let socket: StreamingSocket | null | undefined =
      user?.getStreamingSocket(socket_id);
    let new_peer: Peer = new Peer(peer);
    socket?.setPeer(new_peer);
  }

  // determines if a given user has a viewing peer
  hasViewingPeer(username: String, socket_id: String): Boolean {
    let user = this.users.get(username);
    if (!user) return false;
    let viewing_socket: ViewingSocket | null = user.getViewingSocket(socket_id);
    return viewing_socket?.peer != null;
  }

  // determines if a given user has a viewing peer
  hasStreamingPeer(username: String, socket_id: String): Boolean {
    let user = this.users.get(username);
    if (!user) return false;
    let streaming_socket: StreamingSocket | null =
      user.getStreamingSocket(socket_id);
    return streaming_socket?.peer != null;
  }

  // returns the peer of a ViewingSocket
  getViewingPeer(username: String, socket_id: String) {
    let user = this.users.get(username);
    if (!user) return;
    let viewing_socket: ViewingSocket | null = user.getViewingSocket(socket_id);
    return viewing_socket?.peer?.peer;
  }

  // returns the peer of a StreamingSocket
  getStreamingPeer(username: String, socket_id: String) {
    let user = this.users.get(username);
    if (!user) return;
    let streaming_socket: StreamingSocket | null =
      user.getStreamingSocket(socket_id);
    return streaming_socket?.peer?.peer;
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

    let streaming_socket: StreamingSocket | null =
      user.getStreamingSocket(socket_id);
    if (!streaming_socket) {
      streaming_socket = this.addStreamingSocket(username, socket_id);
    }

    let new_stream: Stream = new Stream(stream);
    streaming_socket?.setStream(new_stream);
  }

  // determines if a user has a stream
  hasUserStream(username: String, stream: MediaStream): Boolean | null {
    let user = this.users.get(username);
    if (!user) return null;

    return user.hasStream(stream);
  }

  clearStreamingSocket(username: String, socket_id: String) {
    let user = this.users.get(username);
    if (!user) return null;
    let socket = user.getStreamingSocket(socket_id);
    socket?.clearStreamAndPeer();
  }
}
