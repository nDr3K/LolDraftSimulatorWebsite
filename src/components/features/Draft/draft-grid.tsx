import { DraftChampion } from "@/types/draft-champion";

export default function DraftGrid({
    champions = [],
    version = ''
}: {champions: Array<DraftChampion>, version: string}) {
    return (
      <div className="flex flex-wrap gap-2 overflow-y-auto h-full">
        {champions.map((champion) => champion.id && (
          <div
            key={champion.id}
            className="relative group cursor-pointer"
          >
            <div className="aspect-square bg-zinc-800 rounded overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <img
                src={champion.id == 'none' 
                  ? 'src/assets/placeholder.png' 
                  : `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.id}.png`
                }
                alt={champion.name}
                className="w-24 h-24 object-cover object-center"
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