import DraftHeader from '@/components/features/Draft/draft-header';
import { useLocation } from 'react-router-dom';

export default function Draft() {
  const location = useLocation();
  const { mode, isFearless, banPick, keepBan } = location.state || {};
  
  console.log('Draft Mode:', mode);
  console.log('Options:', { isFearless, banPick, keepBan });
  
  return(
    <>
    <DraftHeader blueTeamName='Blue' redTeamName='Red' timer={30}/>
    </>
  )
}