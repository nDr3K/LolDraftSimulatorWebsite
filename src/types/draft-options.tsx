export type LobbyOptions = {
  blueTeamName: string;
  redTeamName: string;
} & DraftOptions

export type DraftOptions = {
  isFearless: boolean;
  banPick: boolean;
  keepBan: boolean;
  tournamentBan: boolean;
};