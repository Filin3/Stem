import { IQueue } from "./interfaces/IQueue"

export class Queue {
  static MAX_SIZE = 10
  private queue: IQueue[] = []

  get() {
    return this.queue
  }

  next() {
    return this.remove()
      .at(0)
  }

  add(queueItem: IQueue) {
    if (this.queue.length >= Queue.MAX_SIZE) { return } 
    this.queue.push(queueItem)
  }

  remove(removeAt: number = 0) {
    return this.queue.splice(removeAt, 1)
  }

  reset() {
    this.queue = []
  }
}
