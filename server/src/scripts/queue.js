class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.len = 0;
  }

  push(val) {
    let new_node = new Node(val);
    if (!this.head) {
      this.head = new_node;
      this.tail = new_node;
    } else {
      this.tail.next = new_node;
      this.tail = new_node;
    }
    this.len++;
  }

  pop(val) {
    if (!this.len) return null;
    let return_node = this.head;
    this.head = this.head.next;
    this.len--;
    if (this.len === 0) {
      this.tail = null;
    }
    return return_node.val;
  }
}

module.exports = Queue;
