import DraftBan from '@/components/features/Draft/draft-ban';
import DraftDisabled from '@/components/features/Draft/draft-disabled';
import DraftGrid from '@/components/features/Draft/draft-grid';
import DraftHeader from '@/components/features/Draft/draft-header';
import DraftSelection from '@/components/features/Draft/draft-selection';
import DraftTeam from '@/components/features/Draft/draft-team';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ChampionService from '@/services/champions.service';
import { useDraftService } from '@/services/draft/draft-utils';
import { DraftChampion } from '@/types/draft-champion';
import { Role } from '@/types/role';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export default function Draft() {
  const location = useLocation();
  const { isFearless, fearlessMode, tournamentBan, blueTeamName, redTeamName, hasTimer, disabledChampionIds } = location.state || {};
  const { gameId, role } = useParams();
  const [version, setVersion] = useState('');
  const [champions, setChampions] = useState<Array<DraftChampion>>([]);
  const [filter, setFilter] = useState<{ role: Role | null; search: string }>({
    role: null,
    search: '',
  });
  const [currentChampion, setCurrentChampion] = useState<DraftChampion | null>(null);
  const { draftState, sendEvent } = useDraftService(
    role,
    {
      isFearless: isFearless, 
      banPick: isFearless && (fearlessMode == 'standard' || fearlessMode == 'hardcore'), 
      keepBan: isFearless && fearlessMode == 'hardcore', 
      tournamentBan: tournamentBan,
      hasTimer: hasTimer
    },
    gameId,
    blueTeamName,
    redTeamName,
    disabledChampionIds
  );

  const handleRoleSelect = (role: Role | null) => {
    setFilter((prev) => ({ ...prev, role }));
    if (!currentChampion?.role.some(r => r == role) && role && draftState.phase != 'pick') {
      setCurrentChampion(null);
    }
  };

  const handleSearchChange = (search: string) => {
    setFilter((prev) => ({ ...prev, search }));
  };

  const handleChampionSelect = (champion: DraftChampion) => {
    setCurrentChampion(champion);
    sendEvent({
      type: 'HOVER',
      payload: champion,
      user: role ?? draftState.turn,
      flag: null
    });
  }

  const handleLockIn = () => {
    switch(draftState.phase) {
      case 'ban':
      case 'pick':
        if (currentChampion) {
          sendEvent({
            type: 'SELECT',
            payload: {...currentChampion, status: 'selected'},
            user: role ?? draftState.turn,
            flag: null
          });
          setCurrentChampion(null);
          setFilter({ role: null, search: ''});
        }
        break;
      case 'ready':
      case 'end':
        sendEvent({
          type: 'START',
          payload: null,
          user: role ?? '',
          flag: null,
        })
        setFilter({ role: null, search: ''});
        break;
      case 'restart':
        break;
    }
  }

  const handleStartNewDraft = (switchSide: boolean) => {
    sendEvent({
      type: 'START',
      payload: null,
      user: role ?? '',
      flag: switchSide
    })
  }

  useEffect(() => {
    const loadChampions = async () => {
      try {
        const latestVersion = await ChampionService.fetchLatestVersion();
        setVersion(latestVersion);

        const championsData = await ChampionService.fetchChampions();
        
        const bannedPrevPicks = draftState.options.banPick 
          ? [...draftState.blueTeam.previousPicks, ...draftState.redTeam.previousPicks]
          : draftState.phase == 'pick' 
          ? draftState.turn == 'blue' 
            ? draftState.blueTeam.previousPicks 
            : draftState.redTeam.previousPicks 
          : [];

        const disabledChampionIds = new Set([
          ...draftState.blueTeam.bans,
          ...draftState.redTeam.bans,
          ...draftState.blueTeam.picks.filter(pick => pick?.status === 'selected').map(pick => pick!.id),
          ...draftState.redTeam.picks.filter(pick => pick?.status === 'selected').map(pick => pick!.id),
          ...draftState.blueTeam.previousBans,
          ...draftState.redTeam.previousBans,
          ...bannedPrevPicks,
          ...draftState.disabledChampionIds
        ].filter(Boolean));

        const transformedChampions = ChampionService.transformChampions(
          championsData,
          disabledChampionIds,
          currentChampion,
          draftState.phase
        );

        setChampions(transformedChampions);
      } catch (err) {
        console.error('Error fetching champion data:', err);
      }
    };

    loadChampions();
  }, [
    draftState.blueTeam.bans, 
    draftState.redTeam.bans, 
    draftState.blueTeam.picks, 
    draftState.redTeam.picks, 
    draftState.phase,
    draftState.disabledChampionIds
  ]);

  return(
    <>
      <DraftHeader blueTeamName={draftState.blueTeam.name} redTeamName={draftState.redTeam.name} timer={draftState.hasTimer ? draftState.timer : null} turn={draftState.turn} />
      <div className='flex justify-between items-stretch space-x-4 px-4 h-[43rem]'>
        <div>
          <DraftBan bans={draftState.blueTeam.bans} version={version} side='blue' turn={draftState.phase == 'ban' ? draftState.turn : 'end'} />
          <DraftTeam team={draftState.blueTeam.picks} side='blue' picking={draftState.turn == 'blue' && draftState.phase == 'pick'} />
        </div>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <div className='flex-shrink-0 mb-2'>
            <DraftSelection 
              onRoleSelect={handleRoleSelect} 
              onSearchChange={handleSearchChange} 
              onConfirm={handleLockIn} 
              state={
                role == 'spectator' ? 'none'
                : draftState.phase == 'ready' ? 
                draftState.turn == role || draftState.turn == 'start' ? 'ready' : 'waiting' 
                : draftState.phase
              }
              enabled={
                role ? (draftState.turn == role || draftState.turn == 'start') && draftState.timer > -2 : true
              }
            />
          </div>
          <div className='flex-1 overflow-y-auto'>
            <DraftGrid champions={champions} version={version} filter={filter} onChampionSelect={(champion) => handleChampionSelect(champion)} selectedChampion={currentChampion} state={draftState.phase} />
          </div>
        </div>
        <div>
          <DraftBan bans={draftState.redTeam.bans} version={version} side='red' turn={draftState.phase == 'ban' ? draftState.turn : 'end'} />
          <DraftTeam team={draftState.redTeam.picks} side='red' picking={draftState.turn == 'red' && draftState.phase == 'pick'} />
        </div>
      </div>
      <div className='flex justify-between px-4 mt-6'>
        <DraftDisabled bans={draftState.blueTeam.previousPicks} version={version} side='blue' />
        <DraftDisabled bans={draftState.redTeam.previousPicks} version={version} side='red' />
      </div>
      <div className='flex justify-between px-4'>
        <DraftDisabled bans={draftState.blueTeam.previousBans} version={version} side='blue' />
        <DraftDisabled bans={draftState.redTeam.previousBans} version={version} side='red' />
      </div>

      <Dialog open={draftState.phase == 'restart' && (!role || draftState.turn == role)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-center'>Do you want to swap side?</DialogTitle>
            <DialogDescription className='flex justify-between px-4 py-2'>
              <Button className="w-20 hover:cursor-pointer" onClick={() => handleStartNewDraft(true)} asChild><span>Yes</span></Button>
              <Button className="w-20 hover:cursor-pointer" onClick={() => handleStartNewDraft(false)} asChild><span>No</span></Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}