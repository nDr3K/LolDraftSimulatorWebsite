import { useLocation } from 'react-router-dom';

export default function Draft() {
  const location = useLocation();
  const { mode, isFearless, banPick, keepBan } = location.state || {};
  
  console.log('Draft Mode:', mode);
  console.log('Options:', { isFearless, banPick, keepBan });
  
  return(
    <>
    </>
  )
}