import { DraftOptions } from "@/types/draft-options";

export type CreateLobbyPayload = {
  blueTeamName: string;
  redTeamName: string;
  options: DraftOptions;
}