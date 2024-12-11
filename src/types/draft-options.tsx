export type fearlessMode = 'soft' | 'standard' | 'hardcore';

export type LobbyOptions = {
  blueTeamName: string;
  redTeamName: string;
  isFearless: boolean;
  fearlessMode: fearlessMode;
  tournamentBan: boolean;
  hasTimer: boolean;
}

export type DraftOptions = {
  isFearless: boolean;
  banPick: boolean;
  keepBan: boolean;
  tournamentBan: boolean;
  hasTimer: boolean;
};