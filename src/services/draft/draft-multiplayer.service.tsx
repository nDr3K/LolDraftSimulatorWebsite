import { DraftService } from "./draft.service";
import { DraftState } from "./model/draft-state";
import { DraftEvent } from "./types/draft-event";

export class MultiplayerDraftService implements DraftService {
  private ws: WebSocket | null = null;
  private subscribers: Array<(state: DraftState) => void> = [];

  constructor(gameId: string, role: string) {
    const wsUrl = `/ws/lobby/${gameId}/${role}`;
    this.ws = new WebSocket(wsUrl);

    // this.ws.onopen = () => {
    //   console.log("WebSocket connection established.");
    // };

    this.ws.onmessage = (message) => {
      if (message.data) {
        const state: DraftState = JSON.parse(message.data);
        this.notifySubscribers(state);
      }
    };

    // this.ws.onclose = () => {
    //   console.log("WebSocket connection closed.");
    // };

    // this.ws.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    // };
  }

  sendEvent(event: DraftEvent): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return reject(new Error("WebSocket is not connected."));
      }

      try {
        const message = JSON.stringify(event);
        this.ws.send(message);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private notifySubscribers(state: DraftState): void {
    this.subscribers.forEach(callback => callback(state));
  }

  subscribe(callback: (state: DraftState) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers = [];
  }
}