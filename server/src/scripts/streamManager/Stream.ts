import { Peer } from "./Peer";

export class Stream {
  stream: MediaStream;
  streaming_sockets: String[];
  viewing_sockets: String[];

  constructor(stream: MediaStream) {
    this.stream = stream;
    this.streaming_sockets = [];
    this.viewing_sockets = [];
  }

  addStreamingSocket(socket: String) {
    this.streaming_sockets.push(socket);
  }

  removeStreamingSocket(socket: String) {
    let to_remove: number;
    this.streaming_sockets.forEach((streaming_socket, index) => {
      if (streaming_socket === socket) {
        to_remove = index;
      }
    });
    if (to_remove) {
      this.streaming_sockets.splice(to_remove, 1);
    }
  }

  addViewingSocket(socket: String) {
    this.viewing_sockets.push(socket);
  }

  removeViewingSocket(socket: String) {
    let to_remove: number;
    this.viewing_sockets.forEach((streaming_socket, index) => {
      if (streaming_socket === socket) {
        to_remove = index;
      }
    });
    if (to_remove) {
      this.viewing_sockets.splice(to_remove, 1);
    }
  }

  /**
   * Adds all tracks from the containedStream to the Peer
   * @param peer a Peer connection
   */
  addTracksToPeer(peer: Peer) {
    this.stream.getTracks().forEach((track) => {
      peer.addTrack(track);
    });
  }

  equals(stream: MediaStream) {
    return stream === this.stream;
  }
}

module.exports = Stream;
