export type DraftState = {
    timer: boolean;
    phase: 'ready' |'ban' | 'pick' | 'end';
    turn: 'red' | 'blue' | 'end';
    hover: string;
    chat: Array<string>;
    blueTeam: TeamState;
    redTeam: TeamState;
}

export type TeamState = {
    name: string;
    picks: Array<string | null>;
    bans: Array<string | null>;
    previousPicks: Array<string>;
    previousBans: Array<string>;
}