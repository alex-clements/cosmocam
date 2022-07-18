export class Peer {
  peer: RTCPeerConnection;

  constructor(peer: RTCPeerConnection) {
    this.peer = peer;
  }

  /**
   * Adds a track to the Peer
   * @param track a MediaStreamTrack
   */
  addTrack(track: MediaStreamTrack) {
    this.peer.addTrack(track);
  }

  /**
   * Eliminates the contained RTCPeerConnection
   */
  close() {
    this.peer = null;
  }
}

module.exports = Peer;