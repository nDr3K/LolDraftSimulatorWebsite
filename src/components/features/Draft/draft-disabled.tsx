import { DraftSide } from "@/types/draft-side";
import classNames from "classnames";

export default function DraftDisabled({
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
        {displayedBans.map((ban, index) => (
          <div
            key={index}
            className="relative w-8 h-8"
          >
            <img
              className="w-full h-full object-cover grayscale"
              src={
                ban == null
                  ? '/assets/placeholder.png'
                  : `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${ban}.png`
              }
              alt={ban || 'placeholder'}
            />
          </div>
        ))}
      </div>
    )
}