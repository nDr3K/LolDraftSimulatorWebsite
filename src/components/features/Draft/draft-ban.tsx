import { DraftSide } from "@/types/draft-side";
import classNames from "classnames";

export default function DraftBan({
    bans = [],
    version = '',
    side
}: {bans: Array<string | null>, version: string, side: DraftSide}) {
  const displayedBans = side === 'red' ? bans.toReversed() : bans;
  return(
    <div 
      className={classNames(
        'flex mb-4 mt-0 gap-2',
        {
          'justify-start': side === 'blue',
          'justify-end': side === 'red',
        }
      )}
    >
      {displayedBans.map((ban, index) => 
        <img
          key={index}
          className={classNames('w-14 h-14',
            {
              'object-cover': ban == null
            }
          )}
          src={ban == null 
            ? 'src/assets/placeholder.png' 
            : `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${ban}.png`
          }
          alt={ban || 'placeholder'}
         />
      )}
    </div>
  )
}