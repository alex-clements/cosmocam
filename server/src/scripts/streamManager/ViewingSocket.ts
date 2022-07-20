import { AbstractSocket } from "./AbstractSocket.js";
import { Peer } from "./Peer.js";
import { User } from "./User.js";

export class ViewingSocket extends AbstractSocket {
  constructor(socket: String, user: User) {
    super(socket, user);
    this.user.addViewingSocket(this);
    console.log("ViewingSocket created");
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
    if (this.peer) {
      this.peer.close();
    }
    this.peer = null;
    this.user.removeViewingSocket(this.id);
  }
}
