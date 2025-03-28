import { DraftChampion } from "@/types/draft-champion";
import { Role } from "@/types/role";
import classNames from "classnames";

export default function DraftGrid({
    champions = [],
    version = '',
    filter,
    onChampionSelect,
    selectedChampion,
    state
}: {
  champions: Array<DraftChampion>,
   version: string, 
   filter: { role: Role | null; search: string }, 
   onChampionSelect: ((champion: DraftChampion) => void),
   selectedChampion: DraftChampion | null,
   state: string
  }) {

  const filteredChampions = champions.filter((champion) => {
    const matchesRole = filter.role ? champion.role.includes(filter.role) : true;
    const matchesSearch = champion.name
      .toLowerCase()
      .includes(filter.search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="flex flex-wrap gap-2 overflow-y-auto p-1">
      {filteredChampions.map((champion) => champion.id && (
        <div
          key={champion.id}
          className="relative group cursor-pointer w-24 h-24"
          onClick={() => {
              if (state == 'ready' || state == 'end') return;
              if (champion.status !== 'disabled') {
                onChampionSelect(champion);
              }
            } 
          }
        >
          <div className={classNames(
            "aspect-square bg-zinc-800 rounded overflow-hidden transition-transform duration-200 group-hover:scale-105",
            {
              'grayscale' : champion.status == 'disabled',
              'border-2 border-red-500' : selectedChampion?.id == champion.id
            }
          )}>
            <img
              src={champion.id == 'none' 
                ? '/assets/placeholder.png' 
                : `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.id}.png`
              }
              alt={champion.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          {champion.name !== 'none' && (
            <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-white bg-black/50 py-1 transition-transform duration-200 group-hover:scale-105">
              {champion.name}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}