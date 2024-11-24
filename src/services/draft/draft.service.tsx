import { DraftState } from "./model/draft-state";
import { DraftEvent } from "./types/draft-event";

export interface DraftService {
  sendEvent(event: DraftEvent): Promise<void>;
  subscribe(callback: (state: DraftState) => void): () => void;
  disconnect(): void
}