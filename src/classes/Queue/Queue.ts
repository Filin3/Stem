import { IQueue } from "./interfaces/IQueue"

export class Queue {
  private queue: IQueue[] = []

  get() {
    return this.queue
  }

  next() {
    return this.remove()
      .at(0)
  }

  add(queueItem: IQueue) {
    this.queue.push(queueItem)
  }

  remove(removeAt: number = 0) {
    return this.queue.splice(removeAt, 1)
  }

  reset() {
    this.queue = []
  }
}