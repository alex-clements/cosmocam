class Node {
  val: any;
  next: any;
  constructor(val: any) {
    this.val = val;
    this.next = null;
  }
}

export class Queue {
  head: Node | null;
  tail: Node | null;
  len: number;
  constructor() {
    this.head = null;
    this.tail = null;
    this.len = 0;
  }

  push(val: any) {
    let new_node = new Node(val);
    if (!this.head) {
      this.head = new_node;
      this.tail = new_node;
    } else {
      if (this.tail) this.tail.next = new_node;
      this.tail = new_node;
    }
    this.len++;
  }

  pop() {
    if (!this.len) return null;
    let return_node = this.head;
    if (this.head) this.head = this.head.next;
    this.len--;
    if (this.len === 0) {
      this.tail = null;
    }
    return return_node?.val;
  }
}
