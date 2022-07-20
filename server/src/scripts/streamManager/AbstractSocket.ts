import { User } from "./User.js";
import { Peer } from "./Peer.js";

export class AbstractSocket {
  user: User;
  id: String;
  peer: Peer | null;
  peer_set: Boolean;

  constructor(socket: String, user: User) {
    this.user = user;
    this.id = socket;
    this.peer = null;
    this.peer_set = false;
  }

  setPeer(peer: Peer) {
    this.peer = peer;
    this.peer_set = true;
  }

  close() {}
}
