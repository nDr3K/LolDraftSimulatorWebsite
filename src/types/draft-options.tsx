export type LobbyOptions = {
  blueTeamName: string;
  redTeamName: string;
  isFearless: boolean;
  fearlessMode: 'soft' | 'standard' | 'hardcore';
  tournamentBan: boolean;
}

export type DraftOptions = {
  isFearless: boolean;
  banPick: boolean;
  keepBan: boolean;
  tournamentBan: boolean;
};