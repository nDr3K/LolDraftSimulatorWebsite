import { DraftSide } from "@/types/draft-side";
import { DraftState } from "./model/draft-state";
import { DraftEvent } from "./types/draft-event";
import { DraftService } from "./draft.service";
import { DraftChampion } from "@/types/draft-champion";

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
      switch (event.type) {
        case 'START':
          this.handleStartEvent(event);
          this.notifySubscribers(this.draftState);
          break;
        case 'TIMEOUT':
          //no timer for offline
          break;
        case 'MESSAGE':
          //no chat for offline
          break;
        case 'HOVER':
          if (this.draftState.phase == 'pick') {
            this.handleHoverEvent(event);
            this.notifySubscribers(this.draftState);
          }
          break;
        case 'SELECT':
          this.handleSelectEvent(event);
          this.notifySubscribers(this.draftState);
          break;
      }
    }

    private handleStartEvent(event: DraftEvent) {
      switch(this.draftState.phase) {
        case 'end':
          this.draftState = {
            ...this.draftState,
            phase: 'restart',
          }
          break;
        case 'restart':
          if (this.draftState.game < 5)
            this.handleRestart(event.flag || false)
          else
            this.draftState = {
              ...this.draftState,
              phase: 'over'
          }
          break;
        default:
          break;
      }
    }

    private handleRestart(switchSide: boolean) {
      const blueSide = switchSide ? this.draftState.redTeam : this.draftState.blueTeam;
      const redSide = switchSide ? this.draftState.blueTeam : this.draftState.redTeam;
      if (this.draftState.options.isFearless) {
        blueSide.previousPicks = [...blueSide.previousPicks, ...blueSide.picks.map(p => p?.id ?? 'none')];
        redSide.previousPicks = [...redSide.previousPicks, ...redSide.picks.map(p => p?.id ?? 'none')];
        blueSide.previousBans = this.draftState.options.keepBan ? [...blueSide.previousBans, ...blueSide.bans.map(b => b ?? 'none')] : [];
        redSide.previousBans = this.draftState.options.keepBan ? [...redSide.previousBans, ...redSide.bans.map(b => b ?? 'none')] : [];
      }
      blueSide.picks = [null,null,null,null,null];
      redSide.picks = [null,null,null,null,null];
      blueSide.bans = [null,null,null,null,null];
      redSide.bans = [null,null,null,null,null];

      this.turnCounter = 1;
      this.draftState = {
        ...this.draftState,
        phase: 'ban',
        game: this.draftState.game++,
        turn: 'blue',
        blueTeam: blueSide,
        redTeam: redSide,
      }
    }

    private handleHoverEvent(event: DraftEvent) {
      const { teamKey } = this.determineTeam(event.user);
      const hoverChampion: DraftChampion = { ...event.payload as DraftChampion, status: 'hover' };
  
      const updated = this.updateStateArray<DraftChampion>(
        teamKey,
        'picks',
        hoverChampion,
        item => item?.status === 'hover'
      ) || this.updateStateArray<DraftChampion>(
        teamKey,
        'picks',
        hoverChampion,
        item => item === null
      );
  
      if (!updated) {
        // console.warn('Unable to hover the champion');
      }
    }
  
    private handleSelectEvent(event: DraftEvent) {
      const { teamKey } = this.determineTeam(event.user);
      const isBanPhase = this.draftState.phase === 'ban';
      const field = isBanPhase ? 'bans' : 'picks';
  
      const updated = isBanPhase 
        ? this.updateStateArray<string>(
            teamKey,
            field,
            (event.payload as DraftChampion).id,
            (v: string | null) => v === null
          )
        : this.updateStateArray<DraftChampion>(
            teamKey,
            field,
            event.payload as DraftChampion,
            (v: DraftChampion | null) => v?.status === 'hover'
          );
  
      if (!updated) {
        // console.warn(`Unable to ${isBanPhase ? 'ban' : 'select'} the champion`);
        return;
      }
      this.turnCounter++;
      this.updatePhaseAndTurn();
    }

    private getStandardTurn(): 'red' | 'blue' | 'end' {
      switch(this.turnCounter) {
        //bans
        case 1: return 'blue';
        case 2: return 'red';
        case 3: return 'blue';
        case 4: return 'red';
        case 5: return 'blue';
        case 6: return 'red';
        case 7: return 'blue';
        case 8: return 'red';
        case 9: return 'blue';
        case 10: return 'red';
        //picks
        case 11: return 'blue';
        case 12: return 'red';
        case 13: return 'red';
        case 14: return 'blue';
        case 15: return 'blue';
        case 16: return 'red';
        case 17: return 'red';
        case 18: return 'blue';
        case 19: return 'blue';
        case 20: return 'red';
        //end
        case 21: return 'end';
        default: throw Error('Invalid turn counter');
      }
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
        //end
        case 21: return 'end';
        default: throw Error('Invalid turn counter');
      }
    }

    private determineTeam(username: string): { team: DraftSide; teamKey: 'blueTeam' | 'redTeam' } {
      const team = username === 'blue' ? 'blue' : 'red';
      const teamKey = team === 'blue' ? 'blueTeam' : 'redTeam';
      return { team, teamKey };
    }

    private determineStandardPhase(turnCounter: number): 'ban' | 'pick' | 'end' {
      if (turnCounter <= 10) return 'ban';
      if (turnCounter <= 20) return 'pick';
      return 'end'
    }
  
    private determinePhase(turnCounter: number): 'ban' | 'pick' | 'end' {
      if (turnCounter <= 6) return 'ban';
      if (turnCounter <= 12) return 'pick';
      if (turnCounter <= 16) return 'ban';
      if (turnCounter <= 20) return 'pick';
      return 'end';
    }
  
    private updateStateArray<T extends string | DraftChampion>(
      teamKey: 'blueTeam' | 'redTeam',
      field: 'bans' | 'picks',
      value: T,
      condition: (v: T | null) => boolean
    ): boolean {
      type ArrayType = (T | null)[];
      const currentArray = this.draftState[teamKey][field] as ArrayType;
      const targetIndex = currentArray.findIndex(item => condition(item));
        
      if (targetIndex === -1) return false;
    
      this.draftState = {
        ...this.draftState,
        [teamKey]: {
          ...this.draftState[teamKey],
          [field]: currentArray.map((item, index) => 
            index === targetIndex ? value : item
          ),
        },
      };
    
      return true;
    }
  
    private updatePhaseAndTurn() {
      this.draftState = {
        ...this.draftState,
        phase: this.draftState.options.tournamentBan ? this.determinePhase(this.turnCounter) : this.determineStandardPhase(this.turnCounter),
        turn: this.draftState.options.tournamentBan ? this.getTurn() : this.getStandardTurn(),
      };
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