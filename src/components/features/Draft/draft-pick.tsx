import { DraftChampion } from "@/types/draft-champion";
import { DraftSide } from "@/types/draft-side";
import classNames from "classnames";

export default function DraftPick({champion = null, side = 'blue', picking = false}: {champion: DraftChampion | null, side: DraftSide, picking: boolean}) {
    const imageUrl = champion?.id
    ? `https://ddragon.leagueoflegends.com/cdn/img/champion/centered/${champion.id == 'Fiddlesticks' ? 'FiddleSticks' : champion.id}_0.jpg`
    : '/src/assets/placeholder.png';
    return(
      <div 
        className={classNames(
          'w-80 h-28 rounded overflow-hidden bg-cover bg-center relative',
          {
            'border-r-4 border-blue-500': side === 'blue',
            'border-l-4 border-red-500': side === 'red',
            'animate-pulse': champion && champion.status === 'hover'
          }
        )}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <div className={classNames(
          'absolute inset-0 bg-opacity-30',
          {
            'bg-black' : !champion,
            'bg-white' : champion && champion.status === 'hover'
          }
        )}>
          {picking && (
            <span 
              className={classNames(
                'absolute text-zinc-300 text-2xl', 
                {
                  'bottom-2 right-2': side === 'blue',
                  'bottom-2 left-2': side === 'red',
                }
              )}
            >
              Picking...
            </span>
          )}
        </div>
      </div>
    )
}