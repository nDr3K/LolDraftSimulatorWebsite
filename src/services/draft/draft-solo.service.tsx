import { DraftSide } from "@/types/draft-side";
import { DraftState } from "./model/draft-state";
import { DraftEvent } from "./types/draft-event";
import { DraftService } from "./draft.service";

export class SoloDraftService implements DraftService {
    private draftState: DraftState;
    private subscribers: Array<(state: DraftState) => void> = [];
    private turnCounter: number = 0;
  
    constructor(initialDraftState: DraftState) {
      this.turnCounter++;
        this.draftState = {
            ...initialDraftState,
            phase: 'ban'
        };
    }
  
    async sendEvent(event: DraftEvent): Promise<void> {
      console.log(this.draftState)
  
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
        const currentArray = this.draftState[teamKey][field];
        const nullIndex = currentArray.findIndex(item => item === null);
        
        if (nullIndex === -1) {
          return; // or handle the case where there are no null elements
        }
      
        this.draftState = {
          ...this.draftState,
          [teamKey]: {
            ...this.draftState[teamKey],
            [field]: currentArray.map((item, index) => 
              index === nullIndex ? event.payload : item
            ),
          },
        };
      };
    
      updateTeamState(
        team === 'blue' ? 'blueTeam' : 'redTeam', 
        isBanPhase ? 'bans' : 'picks'
      );

      let phase: 'ban' | 'pick' | 'ready';
      if (this.turnCounter <= 6) {
        phase = 'ban';
      } else if (this.turnCounter <= 12) {
        phase = 'pick';
      } else if (this.turnCounter <= 16) {
        phase = 'ban';
      } else {
        phase = 'pick'
      }
    
      this.draftState = {
        ...this.draftState,
        phase: phase,
        turn: this.getTurn(),
      };
    }
  
    private getTurn(): 'red' | 'blue' | 'end' {
      switch(this.turnCounter) {
        //bans
        case 1: return 'blue';
        case 2: return 'red';
        case 3: return 'blue';
        case 4: return 'red';
        case 5: return 'blue';
        case 6: return 'red';
        //picks
        case 7: return 'blue';
        case 8: return 'red';
        case 9: return 'red';
        case 10: return 'blue';
        case 11: return 'blue';
        case 12: return 'red';
        //bans
        case 13: return 'red';
        case 14: return 'blue';
        case 15: return 'red';
        case 16: return 'blue';
        //picks
        case 17: return 'red';
        case 18: return 'blue';
        case 19: return 'blue';
        case 20: return 'red';
        case 21: return 'end';
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
      this.turnCounter = 0;
      this.subscribers = [];
    }
  }