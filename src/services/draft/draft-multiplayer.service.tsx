import { DraftService } from "./draft.service";
import { DraftState } from "./model/draft-state";
import { DraftEvent } from "./types/draft-event";

export class MultiplayerDraftService implements DraftService {
  private ws: WebSocket | null = null;
  private callback?: (state: DraftState) => void;

  constructor(gameId: string, role: string) {
    const wsUrl = `ws://localhost:8080/ws/lobby/${gameId}/${role}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    this.ws.onmessage = (message) => {
      if (this.callback) {
        const state: DraftState = JSON.parse(message.data);
        this.callback(state);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
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

  subscribe(callback: (state: DraftState) => void): () => void {
    this.callback = callback;

    return () => {
        this.callback = undefined;
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}