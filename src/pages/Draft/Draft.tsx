import DraftBan from '@/components/features/Draft/draft-ban';
import DraftDisabled from '@/components/features/Draft/draft-disabled';
import DraftGrid from '@/components/features/Draft/draft-grid';
import DraftHeader from '@/components/features/Draft/draft-header';
import DraftSelection from '@/components/features/Draft/draft-selection';
import DraftTeam from '@/components/features/Draft/draft-team';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDraftService } from '@/services/draft/draft-utils';
import { DataChampion } from '@/types/datadragon-champion';
import { DraftChampion } from '@/types/draft-champion';
import { Role } from '@/types/role';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Draft() {
  const location = useLocation();
  const { mode, isFearless, banPick, keepBan, tournamentBan } = location.state || {};
  const [version, setVersion] = useState('');
  const [champions, setChampions] = useState<Array<DraftChampion>>([]);
  const [filter, setFilter] = useState<{ role: Role | null; search: string }>({
    role: null,
    search: '',
  });
  const [currentChampion, setCurrentChampion] = useState<DraftChampion | null>(null);
  const { draftState, sendEvent } = useDraftService(mode, {isFearless: isFearless, banPick: banPick, keepBan: keepBan, tournamentBan: tournamentBan});

  const handleRoleSelect = (role: Role | null) => {
    setFilter((prev) => ({ ...prev, role }));
  };

  const handleSearchChange = (search: string) => {
    setFilter((prev) => ({ ...prev, search }));
  };

  const handleChampionSelect = (champion: DraftChampion) => {
    setCurrentChampion(champion);
    sendEvent({
      type: 'HOVER',
      payload: champion,
      user: draftState.turn
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
            user: draftState.turn
          });
          setCurrentChampion(null);
        }
        break;
      case 'ready':
      case 'end':
        sendEvent({
          type: 'START',
          payload: null,
          user: '', //red/blue/userId -> passed from multiplayer
        })
        break;
      case 'restart':
        break;
    }
  }

  const handleStartNewDraft = (switchSide: Boolean) => {
    sendEvent({
      type: 'START',
      payload: switchSide,
      user: '', //red/blue/userId -> passed from multiplayer
    })
  }

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const versionsResponse = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        if (!versionsResponse.ok) {
          throw new Error('Failed to fetch versions');
        }
        const versions = await versionsResponse.json();
        const latestVersion = versions[0];
        setVersion(versions[0]);

        const championsResponse = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
        );
        if (!championsResponse.ok) {
          throw new Error('Failed to fetch champions');
        }
        const championsData = await championsResponse.json();

        const bannedPrevPicks = draftState.options.banPick 
          ? [...draftState.blueTeam.previousPicks,...draftState.redTeam.previousPicks]
          : draftState.phase == 'pick' ? draftState.turn == 'blue' ? draftState.blueTeam.previousPicks : draftState.redTeam.previousPicks : []

        const disabledChampionIds = new Set([
          ...draftState.blueTeam.bans,
          ...draftState.redTeam.bans,
          ...draftState.blueTeam.picks.filter(pick => pick?.status === 'selected').map(pick => pick!.id),
          ...draftState.redTeam.picks.filter(pick => pick?.status === 'selected').map(pick => pick!.id),
          ...draftState.blueTeam.previousBans,
          ...draftState.redTeam.previousBans,
          ...bannedPrevPicks
        ].filter(Boolean));

        const transformedChampions: Array<DraftChampion> = Object.values(championsData.data as Record<string,DataChampion>).map(
          (champion: DataChampion) => ({
            id: champion.id,
            name: champion.name,
            role: [],
            status: disabledChampionIds.has(champion.id) ? 'disabled' : currentChampion?.id == champion.id ? 'hover' : 'none'
          })
        );

        transformedChampions.sort((a,b) => a.name.localeCompare(b.name));

        if(draftState.phase !== 'pick') {
          transformedChampions.unshift({id: 'none',name:'none',role: [],status:'none'})
        }

        setChampions(transformedChampions);
      } catch (err) {
        console.error('Error fetching champion data:', err);
      }
    };

    fetchChampions();
  }, [draftState.blueTeam.bans, draftState.redTeam.bans, 
    draftState.blueTeam.picks, draftState.redTeam.picks, draftState.phase]);

  return(
    <>
      <DraftHeader blueTeamName='Blue' redTeamName='Red' timer={draftState.timer ? 30 : null} turn={draftState.turn} />
      <div className='flex justify-between items-stretch space-x-4 px-4 h-[43rem]'>
        <div>
          <DraftBan bans={draftState.blueTeam.bans} version={version} side='blue' turn={draftState.phase == 'ban' ? draftState.turn : 'end'} />
          <DraftTeam team={draftState.blueTeam.picks} side='blue' picking={draftState.turn == 'blue' && draftState.phase == 'pick'} />
        </div>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <div className='flex-shrink-0 mb-2'>
            <DraftSelection onRoleSelect={handleRoleSelect} onSearchChange={handleSearchChange} onConfirm={handleLockIn} state={draftState.phase}/>
          </div>
          <div className='flex-1 overflow-y-auto'>
            <DraftGrid champions={champions} version={version} filter={filter} onChampionSelect={(champion) => handleChampionSelect(champion)} state={draftState.phase} />
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

      <Dialog open={draftState.phase == 'restart'}>
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