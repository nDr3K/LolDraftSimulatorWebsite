import { Role } from "./role";

export type DraftChampion = {
    id: string;
    name: string;
    role: Array<Role>;
    status: 'hover' | 'selected' | 'none';
}