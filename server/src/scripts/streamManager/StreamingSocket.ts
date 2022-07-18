import { AbstractSocket } from "./AbstractSocket";
import { Stream } from "./Stream";
import { User } from "./User";

export class StreamingSocket extends AbstractSocket {
  stream: Stream;
  stream_set: Boolean;

  constructor(socket: String, user: User) {
    super(socket, user);
    this.user.addStreamingSocket(this);
    this.stream_set = false;
  }

  // sets the contained stream
  setStream(stream: Stream) {
    this.stream = stream;
    this.stream_set = true;
  }

  /**
   * Removes the stream from the StreamingSocket
   */
  removeStream() {
    this.stream = null;
    this.stream_set = false;
  }

  // given a MediaStream, determines if the contained stream is the same one
  streamEquals(stream: MediaStream) {
    return this.stream.equals(stream);
  }

  // given an RTCPeerConnection, will add all the tracks of the contained stream
  // if it exists
  addStreamTracksToPeer(peer: RTCPeerConnection) {
    if (this.stream.stream) {
      this.stream.stream.getTracks().forEach((track) => {
        peer.addTrack(track);
      });
    }
  }

  // cleans up the socket by closing the peer and removing the contained stream
  close() {
    this.stream = null;
    this.peer.close();
    this.user.removeStreamingSocket(this.id);
  }
}
