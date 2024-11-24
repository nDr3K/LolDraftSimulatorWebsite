import { DraftService } from "./draft.service";
import { DraftState } from "./model/draft-state";
import { DraftEvent } from "./types/draft-event";

export class MultiplayerDraftService implements DraftService {

    constructor(gameId: string) {

    }

    sendEvent(event: DraftEvent): Promise<void> {
        throw new Error("Method not implemented.");
    }
    subscribe(callback: (state: DraftState) => void): () => void {
        throw new Error("Method not implemented.");
    }
    disconnect(): void {
        throw new Error("Method not implemented.");
    }
    
}