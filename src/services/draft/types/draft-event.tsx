import { DraftChampion } from "@/types/draft-champion";

export type DraftEvent = {
    user: string;
    type: 'SELECT' | 'HOVER' | 'MESSAGE' | 'START' | 'TIMEOUT';
    payload: DraftChampion | null;
    flag: boolean | null
}