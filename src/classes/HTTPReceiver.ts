import express from "express";

export class HTTPReceiver {
  private app = express();

  private registeredEventListeners: string[] = [];

  constructor() {
    this.app.use(express.json());
    this.startListen();

    return this;
  }

  // TODO express types
  addEventListener(method: string, path: string, callback: (req, res) => void) {
    const eventListenerKey = this.getEventListenerKey(method, path);

    if (this.registeredEventListeners.includes(eventListenerKey)) {
      throw new Error(
        `Duplicate event listeners detected key: ${eventListenerKey}`
      );
    }

    this.registeredEventListeners.push(eventListenerKey);
    this.app[method](path, callback);
    console.log(`[HTTPReceiver] ${method}:${path} registered`);

    return this;
  }

  private startListen() {
    const port = process.env.HTTP_RECEIVER_PORT;
    if (!port) {
      throw new Error("HTTPReceiver missing port");
    }

    this.app.listen(port, () => {
      console.log(`HTTPReceiver listen port: ${port}`);
    });
  }

  // TODO express types
  private getEventListenerKey(method: string, path: string) {
    return `${method}-${path}`;
  }
}
