export type fearlessMode = 'soft' | 'standard' | 'hardcore';

export type LobbyOptions = {
  blueTeamName: string;
  redTeamName: string;
  isFearless: boolean;
  fearlessMode: fearlessMode;
  tournamentBan: boolean;
  hasTimer: boolean;
  disabledChampions: Array<string>;
}

export type DraftOptions = {
  isFearless: boolean;
  banPick: boolean;
  keepBan: boolean;
  tournamentBan: boolean;
  hasTimer: boolean;
};