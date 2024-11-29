export type DraftEvent = {
    user: string;
    type: 'SELECT' | 'HOVER' | 'MESSAGE' | 'START' | 'TIMEOUT';
    payload: any;
}