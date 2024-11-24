export type DraftState = {
    timer: boolean;
    phase: 'ready' |'ban' | 'pick';
    turn: string;
    hover: string;
    chat: Array<string>;
    blueTeam: TeamState;
    redTeam: TeamState;
}

export type TeamState = {
    name: string;
    picks: Array<string>;
    bans: Array<string>;
    previousPicks: Array<string>;
    previousBans: Array<string>;
}