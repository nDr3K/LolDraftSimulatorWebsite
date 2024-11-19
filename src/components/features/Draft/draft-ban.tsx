import classNames from "classnames";

export default function DraftBan({
    bans = [],
    version = ''
}: {bans: Array<string | null>, version: string}) {
  return(
    <div className='flex gap-2 m-4 mt-0'>
      {bans.map((ban, index) => 
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