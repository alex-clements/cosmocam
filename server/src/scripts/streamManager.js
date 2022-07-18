class StreamManager {
  constructor() {
    this.userStreams = new Map();
  }

  getAllUserStreams() {
    return this.userStreams;
  }

  hasUser(username) {
    return this.userStreams.has(username);
  }

  // adds a user to the steam manager
  addUser(username) {
    this.userStreams.set(username, new Map());
    this.userStreams.get(username).set("peers", new Map());
    this.userStreams.get(username).set("streams", new Map());
  }

  // adds a user peer
  addUserPeer(username, socket_id, peer) {
    this.userStreams.get(username).get("peers").set(socket_id, peer);
  }

  hasUserPeer(username, socket_id) {
    return this.userStreams.get(username).get("peers").has(socket_id);
  }

  getPeer(username, socket_id) {
    return this.userStreams.get(username).get("peers").get(socket_id);
  }

  // closes and removes a user peer
  removeUserPeer(username, socket_id) {
    let peer = this.userStreams.get(username).get("peers").get(socket_id);
    peer = null;
    this.userStreams.get(username).get("peers").delete(socket_id);
  }

  // adds a user stream
  addUserStream(username, socket_id, stream) {
    this.userStreams.get(username).get("streams").set(socket_id, stream);
  }

  // removes a user stream
  removeUserStream(username, socket_id) {
    this.userStreams.get(username).get("streams").delete(socket_id);
  }

  getUserStreams(username) {
    let return_streams = [];
    const streams = this.userStreams.get(username).get("streams");
    for (const [key, value] of streams) {
      return_streams.push(value);
    }

    return return_streams;
  }

  hasUserStream(username, stream) {
    const streams = this.userStreams.get(username).get("streams");
    for (const [key, value] of streams) {
      if (value == stream) {
        return true;
      }
    }
    return false;
  }
}

const streamManager = new StreamManager();

module.exports = streamManager;
