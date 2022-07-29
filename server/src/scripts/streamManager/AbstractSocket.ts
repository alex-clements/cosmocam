import { User } from "./User.js";
import { Peer } from "./Peer.js";
import { Socket } from "socket.io";

export abstract class AbstractSocket {
  user: User;
  id: String;
  peer: Peer;
  peer_set: Boolean;
  socket: Socket;
  type: string;

  constructor(socket_id: String, user: User, socket: Socket, type: string) {
    this.user = user;
    this.id = socket_id;
    this.peer = new Peer();
    this.peer_set = false;
    this.socket = socket;
    this.type = type;
  }

  setPeer(peer: RTCPeerConnection) {
    this.peer?.setPeer(peer);
    this.peer_set = true;
  }

  getPeer(): Peer {
    return this.peer;
  }

  close() {}
}
