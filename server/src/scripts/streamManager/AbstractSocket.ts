import { User } from "./User";
import { Peer } from "./Peer";

export class AbstractSocket {
  user: User;
  id: String;
  peer: Peer;
  peer_set: Boolean;

  constructor(socket: String, user: User) {
    this.user = user;
    this.id = socket;
    this.peer_set = false;
  }

  setPeer(peer: Peer) {
    this.peer = peer;
    this.peer_set = true;
  }

  close() {}
}

module.exports = AbstractSocket;
