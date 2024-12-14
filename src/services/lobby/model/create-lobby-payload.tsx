import {DraftChampion} from "@/types/draft-champion";
import { DraftOptions } from "@/types/draft-options";

export type CreateLobbyPayload = {
  blueTeamName: string;
  redTeamName: string;
  options: DraftOptions;
  champions: Array<DraftChampion>;
}