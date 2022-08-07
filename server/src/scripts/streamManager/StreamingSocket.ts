import { Socket } from "socket.io";
import { AbstractSocket } from "./AbstractSocket.js";
import { Stream } from "./Stream.js";
import { User } from "./User.js";

export class StreamingSocket extends AbstractSocket {
  stream: Stream | null;
  stream_set: Boolean;

  constructor(socket_id: String, user: User, socket: Socket) {
    super(socket_id, user, socket, "streaming");
    this.user.addStreamingSocket(this);
    this.stream_set = false;
    this.stream = null;
  }

  // sets the contained stream
  setStream(stream: Stream) {
    this.stream = stream;
    this.stream.addStreamingSocket(this.id);
    this.stream_set = true;
  }

  clearStreamAndPeer() {
    this.removeStream();
    this.removePeer();
  }

  /**
   * Removes the stream from the StreamingSocket
   */
  removeStream() {
    this.stream = null;
    this.stream_set = false;
  }

  /**
   * Removes the peer from the StreamingSocket
   */
  removePeer() {
    this.peer.close();
    this.peer_set = false;
  }

  // given a MediaStream, determines if the contained stream is the same one
  streamEquals(stream: MediaStream) {
    return this.stream?.equals(stream);
  }

  // given an RTCPeerConnection, will add all the tracks of the contained stream
  // if it exists
  addStreamTracksToPeer(peer?: RTCPeerConnection) {
    if (!peer) return;
    if (this.stream?.stream) {
      this.stream.stream.getTracks().forEach((track) => {
        peer.addTrack(track);
      });
    }
  }

  // cleans up the socket by closing the peer and removing the contained stream
  close() {
    this.stream = null;
    this.peer?.close();
    this.user.removeStreamingSocket(this.id);
  }

  setPeer(peer: RTCPeerConnection) {
    this.peer?.setPeer(peer);
    this.peer_set = true;
    this.user.updateViewingSockets();
  }
}
