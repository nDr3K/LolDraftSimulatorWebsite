import { useState, useEffect } from 'react';
import { DraftService } from './draft.service';
import { DraftState } from './model/draft-state';
import { DraftEvent } from './types/draft-event';
import { SoloDraftService } from './draft-solo.service';
import { MultiplayerDraftService } from './draft-multiplayer.service';
import { DraftOptions } from '@/types/draft-options';

export function useDraftService(
    mode: 'solo' | 'multiplayer', 
    options: DraftOptions,
    gameId?: string,
    blueTeamName: string = 'blue',
    redTeamName: string = 'red'
) {
  const [draftService, setDraftService] = useState<DraftService | null>(null);
  const [draftState, setDraftState] = useState<DraftState>({
    timer: false,
    turn: 'blue',
    chat: [],
    phase: 'ready',
    blueTeam: {
      name: blueTeamName,
      bans: [null,null,null,null,null],
      picks: [null,null,null,null,null],
      previousBans: [],
      previousPicks: []
    },
    redTeam: {
      name: redTeamName,
      bans: [null,null,null,null,null],
      picks: [null,null,null,null,null],
      previousBans: [],
      previousPicks: []
    },
    options: options
  });

  useEffect(() => {
    const servivce = mode === 'multiplayer' && gameId
      ? new MultiplayerDraftService(gameId)
      : new SoloDraftService(draftState);

    const unsubscribe = servivce.subscribe(setDraftState);
    setDraftService(servivce);

    return () => {
      unsubscribe();
      servivce.disconnect();
    };
  }, [mode, gameId]);

  const sendEvent = async (event: DraftEvent) => {
    if (draftService) {
      await draftService.sendEvent(event);
    }
  };

  return { draftState, sendEvent };
}