import { StreamingSocket } from "./StreamingSocket.js";
import { ViewingSocket } from "./ViewingSocket.js";
import { Peer } from "./Peer.js";

export class User {
  username: String;
  streaming_sockets: StreamingSocket[];
  viewing_sockets: ViewingSocket[];

  constructor(username: String) {
    this.username = username;
    this.streaming_sockets = [];
    this.viewing_sockets = [];
  }

  // adds a streaming socket to the user
  addStreamingSocket(socket: StreamingSocket): void {
    this.streaming_sockets.push(socket);
  }

  updateViewingSockets(): void {
    this.viewing_sockets.forEach((viewing_socket) => {
      viewing_socket.emit("reestablish_connection", "stream added");
    });
  }

  // removes a streaming socket from the user
  removeStreamingSocket(socket: String): void {
    let to_remove: number = -1;
    this.streaming_sockets.forEach((streaming_socket, index) => {
      if (streaming_socket.id === socket) {
        to_remove = index;
      }
    });
    if (to_remove >= 0) {
      this.streaming_sockets.splice(to_remove, 1);
    }
  }

  /**
   * Given a socket_id, returns the StreamingSocket associated with it.
   */
  getStreamingSocket(socket_id: String): StreamingSocket | null {
    let return_val: number = -1;

    this.streaming_sockets.forEach((test_socket, index) => {
      if (test_socket.id === socket_id) {
        return_val = index;
      }
    });

    if (return_val >= 0) {
      return this.streaming_sockets[return_val];
    } else {
      return null;
    }
  }

  /**
   * Given a ViewingSocket, adds it to the list of ViewingSockets associated with the user
   * @param socket a ViewingSocket
   */
  addViewingSocket(socket: ViewingSocket): void {
    this.viewing_sockets.push(socket);
    this.streaming_sockets.forEach((streaming_socket: StreamingSocket) => {
      streaming_socket.emit("viewer_connected", {
        number_viewers: this.viewing_sockets.length,
      });
    });
  }

  /**
   * Removes the ViewingSocket associated with the given socket_id
   * @param socket_id
   */
  removeViewingSocket(socket_id: String): void {
    let to_remove: number = -1;

    this.viewing_sockets.forEach((streaming_socket, index) => {
      if (streaming_socket.id === socket_id) {
        to_remove = index;
      }
    });
    if (to_remove >= 0) {
      this.viewing_sockets.splice(to_remove, 1);
    }

    this.streaming_sockets.forEach((streaming_socket: StreamingSocket) => {
      streaming_socket.emit("viewer_disconnected", {
        number_viewers: this.viewing_sockets.length,
      });
    });
  }

  /**
   * Returns the ViewingSocket associated with the given socket_id
   * @param socket_id
   * @returns ViewingSocket associated with the socket_id
   */
  getViewingSocket(socket_id: String): ViewingSocket | null {
    let return_index: number = -1;

    this.viewing_sockets.forEach((test_socket, index) => {
      if (test_socket.id === socket_id) {
        return_index = index;
      }
    });

    if (return_index >= 0) {
      return this.viewing_sockets[return_index];
    } else {
      return null;
    }
  }

  /**
   * Determines if the User has a stream
   * @param stream MediaStream to test for
   * @returns true if the stream exists, otherwise returns false
   */
  hasStream(stream: MediaStream): Boolean {
    this.streaming_sockets.forEach((socket) => {
      if (socket.streamEquals(stream)) {
        return true;
      }
    });
    return false;
  }

  /**
   * Given a Peer, adds all Tracks from Streams
   * @param peer
   */
  addStreamsToPeer(peer: Peer): void {
    this.streaming_sockets.forEach((socket) => {
      socket.addStreamTracksToPeer(peer.peer);
    });
  }
}
