import { DraftChampion } from "@/types/draft-champion";
import { DraftSide } from "@/types/draft-side";
import DraftPick from "./draft-pick";

export default function DraftTeam({
    team = [],
    side = 'blue'
}: {team: Array<DraftChampion | null>, side: DraftSide}) {
    return(
        <div className="flex flex-col space-y-4">
            {team.map((champion, index) => (
                <DraftPick
                    key={index}
                    champion={champion}
                    side={side}
                />
            ))}
        </div>
    )
}