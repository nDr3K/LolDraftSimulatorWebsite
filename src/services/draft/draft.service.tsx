import { DraftSide } from "@/types/draft-side";
import { DraftState } from "./model/draft-state";
import { DraftEvent } from "./types/draft-event";

export interface DraftService {
  sendEvent(event: DraftEvent): Promise<void>;
  subscribe(callback: (state: DraftState) => void): () => void;
  disconnect(): void
}

export class SoloDraftService implements DraftService {
  private draftState: DraftState;
  private subscribers: Array<(state: DraftState) => void> = [];
  private turnCounter: number = 0;

  constructor() {
      this.draftState = this.initState();
  }

  private initState(): DraftState {
    return {
      timer: false,
      turn: 'blue',
      hover: '',
      chat: [],
      phase: 'ban',
      blueTeam: {
        name: 'blue',
        bans: [],
        picks: [],
        previousBans: [],
        previousPicks: []
      },
      redTeam: {
        name: 'red',
        bans: [],
        picks: [],
        previousBans: [],
        previousPicks: []
      }
    }
  };

  async sendEvent(event: DraftEvent): Promise<void> {

    switch (event.type) {
      case 'START':
        //no readycheck for offline
        break;
      case 'TIMEOUT':
        //no timer for offline
        break;
      case 'MESSAGE':
        //no chat for offline
        break;
      case 'HOVER': 
      this.draftState = {
        ...this.draftState,
        hover: event.payload
      };
      break;
      case 'SELECT':
        this.turnCounter++;
        this.handleSelectEvent(event);
        break;
    }

    this.notifySubscribers(this.draftState);
  }

  private handleSelectEvent(event: DraftEvent) {
    const team: DraftSide = event.user === this.draftState.blueTeam.name ? 'blue' : 'red';
    const isBanPhase = this.draftState.phase === 'ban';
  
    const updateTeamState = (teamKey: 'blueTeam' | 'redTeam', field: 'bans' | 'picks') => {
      this.draftState = {
        ...this.draftState,
        [teamKey]: {
          ...this.draftState[teamKey],
          [field]: [...this.draftState[teamKey][field], event.payload],
        },
      };
    };
  
    updateTeamState(
      team === 'blue' ? 'blueTeam' : 'redTeam', 
      isBanPhase ? 'bans' : 'picks'
    );
  
    this.draftState = {
      ...this.draftState,
      turn: this.getTurn(),
    };
  }

  private getTurn(): string {
    switch(this.turnCounter) {
      //bans
      case 0: return 'blue';
      case 1: return 'red';
      case 2: return 'blue';
      case 3: return 'red';
      case 4: return 'blue';
      case 5: return 'red';
      case 6: return 'blue';
      case 7: return 'red';
      case 8: return 'blue';
      case 9: return 'red';
      //picks
      case 10: return 'blue';
      case 11: return 'red';
      case 12: return 'red';
      case 13: return 'blue';
      case 14: return 'blue';
      case 15: return 'red';
      //bans
      case 16: return 'red';
      case 17: return 'blue';
      case 18: return 'red';
      case 19: return 'blue';
      //picks
      case 20: return 'red';
      case 21: return 'blue';
      case 22: return 'blue';
      case 23: return 'red';
      default: throw Error('Invalid turn counter');
    }
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
    this.draftState = this.initState();
    this.turnCounter = 0;
    this.subscribers = [];
  }
}