import { Socket } from "socket.io";
import { AbstractSocket } from "./AbstractSocket.js";
import { Peer } from "./Peer.js";
import { User } from "./User.js";

export class ViewingSocket extends AbstractSocket {
  constructor(socket_id: String, user: User, socket: Socket) {
    super(socket_id, user, socket, "viewing");
    this.user.addViewingSocket(this);
  }

  /**
   * Sets the peer of this ViewingSocket. Adds all streams from existing StreamingSockets to the Peer.
   * @param peer a Peer connection
   */
  setPeer(peer: RTCPeerConnection) {
    this.peer?.setPeer(peer);
    this.user.addStreamsToPeer(this.peer);
  }

  /**
   * Eliminates the peer connection and removes the ViewingSocket from the associated user.
   */
  close() {
    this.peer?.close();
    this.user.removeViewingSocket(this.id);
  }
}
