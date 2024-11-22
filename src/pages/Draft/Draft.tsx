import DraftBan from '@/components/features/Draft/draft-ban';
import DraftDisabled from '@/components/features/Draft/draft-disabled';
import DraftGrid from '@/components/features/Draft/draft-grid';
import DraftHeader from '@/components/features/Draft/draft-header';
import DraftSelection from '@/components/features/Draft/draft-selection';
import DraftTeam from '@/components/features/Draft/draft-team';
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
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<{ role: Role | null; search: string }>({
    role: null,
    search: '',
  });

  const handleRoleSelect = (role: Role | null) => {
    setFilter((prev) => ({ ...prev, role }));
  };

  const handleSearchChange = (search: string) => {
    setFilter((prev) => ({ ...prev, search }));
  };

  console.log('Draft Mode:', mode);
  console.log('Options:', { isFearless, banPick, keepBan, tournamentBan });

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        setIsLoading(true);

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

        const transformedChampions: Array<DraftChampion> = Object.values(championsData.data as Record<string,DataChampion>).map(
          (champion: DataChampion) => ({
            id: champion.id,
            name: champion.name,
            role: [],
            status: 'none'
          })
        );

        setChampions(transformedChampions);
      } catch (err) {
        console.error('Error fetching champion data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChampions();
  }, []);

  return(
    <>
      <DraftHeader blueTeamName='Blue' redTeamName='Red' timer={30} />
      <div className='flex justify-between items-stretch space-x-4 p-4 h-[45rem]'>
        <div>
          <DraftBan bans={[null,null,null,null,null]} version={version} side='blue' />
          <DraftTeam team={[null,null,null,null,null]} side='blue' />
        </div>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <div className='flex-shrink-0 mb-2'>
            <DraftSelection onRoleSelect={handleRoleSelect} onSearchChange={handleSearchChange} />
          </div>
          <div className='flex-1 overflow-y-auto'>
            {isLoading ? (
              <div className='flex justify-center items-center h-full'>
                <div className='animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent'></div>
              </div>
            ) : (
              <DraftGrid champions={champions} version={version} filter={filter} />
            )}
          </div>
        </div>
        <div>
          <DraftBan bans={[null,null,null,null,null]} version={version} side='red' />
          <DraftTeam team={[null,null,null,null,null]} side='red' />
        </div>
      </div>
      <div className='flex justify-between px-4 mt-2'>
        <DraftDisabled bans={[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]} version={version} side='blue' />
        <DraftDisabled bans={[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]} version={version} side='red' />
      </div>
      <div className='flex justify-between px-4'>
        <DraftDisabled bans={[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]} version={version} side='blue' />
        <DraftDisabled bans={[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]} version={version} side='red' />
      </div>
    </>
  )
}