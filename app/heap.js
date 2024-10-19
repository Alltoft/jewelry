class PowerOfTwoMaxHeap {
  constructor(x) {
    this.x = x;
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / this.x);
  }

  getChildrenIndices(index) {
    const childrenIndices = [];
    for (let i = 1; i <= this.x; i++) {
      const childIndex = this.x * index + i;
      if (childIndex < this.heap.length) {
        childrenIndices.push(childIndex);
      }
    }
    return childrenIndices;
  }

  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  popMax() {
    if (this.heap.length === 0) {
      return null;
    }

    const max = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }

    return max;
  }

  heapifyUp(index) {
    const parentIndex = this.getParentIndex(index);
    if (index > 0 && this.heap[index] > this.heap[parentIndex]) {
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      this.heapifyUp(parentIndex);
    }
  }

  heapifyDown(index) {
    const childrenIndices = this.getChildrenIndices(index);
    let maxChildIndex = index;

    for (const childIndex of childrenIndices) {
      if (this.heap[childIndex] > this.heap[maxChildIndex]) {
        maxChildIndex = childIndex;
      }
    }

    if (maxChildIndex !== index) {
      [this.heap[index], this.heap[maxChildIndex]] = [this.heap[maxChildIndex], this.heap[index]];
      this.heapifyDown(maxChildIndex);
    }
  }
}
