import { DraftChampion } from "@/types/draft-champion";
import { DraftOptions } from "@/types/draft-options";

export type DraftState = {
    timer: number;
    hasTimer: boolean;
    phase: 'ready' |'ban' | 'pick' | 'end' | 'restart' | 'over';
    turn: 'red' | 'blue' | 'end' | 'start';
    game: number;
    chat: Array<string>; //{user, message}
    blueTeam: TeamState;
    redTeam: TeamState;
    options: DraftOptions;
    disabledChampionIds: Array<string>;
}

export type TeamState = {
    name: string;
    picks: Array<DraftChampion | null>;
    bans: Array<string | null>;
    previousPicks: Array<string>;
    previousBans: Array<string>;
}