import {DraftSide} from "@/types/draft-side";
import classNames from "classnames";

export default function DraftHeader({ 
    blueTeamName = 'Blue', 
    redTeamName = 'Red',
    timer = null,
    turn
}: {blueTeamName: string, redTeamName: string, timer: number | null, turn: DraftSide | 'end' | 'start'}) {

    return(
      <div className="flex justify-between items-center mb-4">
        <div className={classNames(
          "bg-blue-700 text-white px-4 py-2 w-[30%] text-center text-2xl font-bold rounded-md",
            {
              "opacity-30" : turn !== 'blue'
            }
          )}>
          {blueTeamName}
        </div>

        <div className="flex justify-center items-center w-[20%]">
          <div className="text-white text-4xl font-bold">
            {timer ? timer : ''}
          </div>
        </div>

        <div className={classNames(
          "bg-red-700 text-white px-4 py-2 w-[30%] text-center text-2xl font-bold rounded-md",
            {
              "opacity-30" : turn !== 'red'
            }
          )}>
          {redTeamName}
        </div>
      </div>
    )
}