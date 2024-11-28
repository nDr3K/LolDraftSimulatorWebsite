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
      {displayedBans.map((ban, index) => (
        <div
          key={index}
          className="relative w-14 h-14"
        >
          <img
            className="w-full h-full object-cover"
            src={
              ban == null || ban == 'none'
                ? 'src/assets/placeholder.png'
                : `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${ban}.png`
            }
            alt={ban || 'placeholder'}
          />

          {ban && (
            <div className="absolute inset-0 bg-transparent">
              <div
                className="w-full h-full border-t-2 border-red-700 absolute"
                style={{
                  transform: 'rotate(-45deg) translate(0, 1.75rem)',
                }}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}