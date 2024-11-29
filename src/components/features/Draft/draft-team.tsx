import { DraftChampion } from "@/types/draft-champion";
import { DraftSide } from "@/types/draft-side";
import DraftPick from "./draft-pick";

export default function DraftTeam({
    team = [],
    side = 'blue',
    picking = false
}: {team: Array<DraftChampion | null>, side: DraftSide, picking: boolean}) {
    return(
        <div className="flex flex-col space-y-4">
            {team.map((champion, index) => (
                <DraftPick
                    key={index}
                    champion={champion}
                    side={side}
                    picking={picking && index == (team.findIndex(c => !c || c.status == 'hover'))}
                />
            ))}
        </div>
    )
}