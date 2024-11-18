import DraftGrid from '@/components/features/Draft/draft-grid';
import DraftHeader from '@/components/features/Draft/draft-header';
import DraftSelection from '@/components/features/Draft/draft-selection';
import DraftTeam from '@/components/features/Draft/draft-team';
import { DataChampion } from '@/types/datadragon-champion';
import { DraftChampion } from '@/types/draft-champion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Draft() {
  const location = useLocation();
  const { mode, isFearless, banPick, keepBan } = location.state || {};
  const [version, setVersion] = useState('');
  const [champions, setChampions] = useState<Array<DraftChampion>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('Draft Mode:', mode);
  console.log('Options:', { isFearless, banPick, keepBan });

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        setIsLoading(true);
        setError(null);

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
            status: 'none'
          })
        );

        setChampions(transformedChampions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
        console.error('Error fetching champion data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChampions();
  }, []);


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return(
    <>
      <DraftHeader blueTeamName='Blue' redTeamName='Red' timer={30}/>
      <div className="flex justify-between items-stretch space-x-4 p-4 h-[40rem]">
        <DraftTeam team={[null,null,null,null,null]} side='blue' />
        <div className="flex-1 overflow-hidden">
          <DraftSelection />
          {!isLoading &&
            <DraftGrid champions={champions} version={version} />
          }
        </div>
        <DraftTeam team={[null,null,null,null,null]} side='red' />
      </div>
    </>
  )
}