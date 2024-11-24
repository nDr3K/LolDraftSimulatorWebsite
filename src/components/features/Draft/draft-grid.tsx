import { DraftChampion } from "@/types/draft-champion";
import { Role } from "@/types/role";

export default function DraftGrid({
    champions = [],
    version = '',
    filter,
    onChampionSelect
}: {champions: Array<DraftChampion>, version: string, filter: { role: Role | null; search: string }, onChampionSelect: ((champion: DraftChampion) => void)}) {

  const filteredChampions = champions.filter((champion) => {
    const matchesRole = filter.role ? champion.role.includes(filter.role) : true;
    const matchesSearch = champion.name
      .toLowerCase()
      .includes(filter.search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="flex flex-wrap gap-2 overflow-y-auto">
      {filteredChampions.map((champion) => champion.id && (
        <div
          key={champion.id}
          className="relative group cursor-pointer w-24 h-24"
          onClick={() => onChampionSelect(champion) }
        >
          <div className="aspect-square bg-zinc-800 rounded overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <img
              src={champion.id == 'none' 
                ? 'src/assets/placeholder.png' 
                : `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.id}.png`
              }
              alt={champion.name}
              className="object-cover object-center"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-white bg-black/50 py-1">
            {champion.name}
          </div>
        </div>
      ))}
    </div>
  )
}