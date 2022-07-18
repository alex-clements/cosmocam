import { AbstractSocket } from "./AbstractSocket";
import { Peer } from "./Peer";
import { User } from "./User";

export class ViewingSocket extends AbstractSocket {
  constructor(socket: String, user: User) {
    super(socket, user);
    this.user.addViewingSocket(this);
  }

  /**
   * Sets the peer of this ViewingSocket. Adds all streams from existing StreamingSockets to the Peer.
   * @param peer a Peer connection
   */
  setPeer(peer: Peer) {
    this.peer = peer;
    this.user.addStreamsToPeer(peer);
  }

  /**
   * Eliminates the peer connection and removes the ViewingSocket from the associated user.
   */
  close() {
    this.peer.close();
    this.peer = null;
    this.user.removeViewingSocket(this.id);
  }
}

module.exports = ViewingSocket;
