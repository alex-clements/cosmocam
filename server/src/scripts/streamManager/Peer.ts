import { Queue } from "../Queue.js";

export class Peer {
  peer?: RTCPeerConnection;
  ice_queue: Queue;

  constructor() {
    this.ice_queue = new Queue();
  }

  /**
   * Adds a track to the Peer
   * @param track a MediaStreamTrack
   */
  addTrack(track: MediaStreamTrack) {
    this.peer?.addTrack(track);
  }

  /**
   * Adds an RTCIceCandidate object to the peer. If the RTCPeerConnection
   * has not been set, then will store the RTCIceCandidate in a queue to
   * be added later
   * @param ice An RTCIceCandidate object send from the client
   */
  addIceCandidate(ice?: RTCIceCandidate) {
    if (ice) {
      if (this.peer) {
        this.peer.addIceCandidate(ice);
        while (this.ice_queue.len > 0) {
          this.peer.addIceCandidate(this.ice_queue.pop());
        }
      } else {
        this.ice_queue.push(ice);
      }
    } else {
      while (this.ice_queue.len > 0) {
        this.peer?.addIceCandidate(this.ice_queue.pop());
      }
    }
  }

  /**
   * Eliminates the contained RTCPeerConnection
   */
  close() {
    this.peer = undefined;
  }

  /**
   * Sets the RTCPeerConnection of this Peer object
   * @param peer An RTCPeerConnection object
   */
  setPeer(peer: RTCPeerConnection) {
    this.peer = peer;
    this.addIceCandidate();
  }
}
