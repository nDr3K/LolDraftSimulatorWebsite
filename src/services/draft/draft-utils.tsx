import { useState, useEffect } from 'react';
import { DraftService } from './draft.service';
import { DraftState } from './model/draft-state';
import { DraftEvent } from './types/draft-event';
import { SoloDraftService } from './draft-solo.service';
import { MultiplayerDraftService } from './draft-multiplayer.service';
import { DraftOptions } from '@/types/draft-options';

export function getInitState(
  phase: 'ready' | 'ban',
  game: number,
  hasTimer: boolean,
  turn: 'red' | 'blue',
  blueTeamName: string,
  redTeamName: string,
  options: DraftOptions
): DraftState {
  return {
    timer: hasTimer ? 30 : 0,
    hasTimer: hasTimer,
    turn: turn,
    chat: [],
    phase: phase,
    game: game,
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
  }
}

export function useDraftService(
    role: string | undefined,
    options: DraftOptions,
    gameId?: string,
    blueTeamName: string = 'blue',
    redTeamName: string = 'red'
) {
  const [draftService, setDraftService] = useState<DraftService | null>(null);
  const [draftState, setDraftState] = useState<DraftState>(getInitState(
    gameId ? 'ready' : 'ban',
    1,
    false,
    'blue',
    blueTeamName,
    redTeamName,
    options
  ));

  useEffect(() => {
    const service = gameId && role
      ? new MultiplayerDraftService(gameId, role)
      : new SoloDraftService(draftState);

    const unsubscribe = service.subscribe(setDraftState);
    setDraftService(service);

    return () => {
      unsubscribe();
      service.disconnect();
    };
  }, [gameId]);

  const sendEvent = async (event: DraftEvent) => {
    if (draftService) {
      await draftService.sendEvent(event);
    }
  };

  return { draftState, sendEvent };
}