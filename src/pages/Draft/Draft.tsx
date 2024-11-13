import DraftHeader from '@/components/features/Draft/draft-header';
import DraftTeam from '@/components/features/Draft/draft-team';
import { useLocation } from 'react-router-dom';

export default function Draft() {
  const location = useLocation();
  const { mode, isFearless, banPick, keepBan } = location.state || {};
  
  console.log('Draft Mode:', mode);
  console.log('Options:', { isFearless, banPick, keepBan });
  
  return(
    <>
    <DraftHeader blueTeamName='Blue' redTeamName='Red' timer={30}/>
    <div className="flex justify-between items-start space-x-4 p-4">
      <DraftTeam team={[null,null,null,null,null]} side='blue' />
      <div className="flex-1"></div>
      <DraftTeam team={[null,null,null,null,null]} side='red' />
    </div>
    </>
  )
}