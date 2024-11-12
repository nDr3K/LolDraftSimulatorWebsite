export default function DraftHeader({ 
    blueTeamName = 'Blue', 
    redTeamName = 'Red',
    timer = null
}: {blueTeamName: string, redTeamName: string, timer: number | null}) {

    return(
      <div className="flex justify-between items-center mb-4">
        <div className="bg-blue-700 text-white px-4 py-2 w-[25%] text-center text-2xl font-bold">
          {blueTeamName}
        </div>

        <div className="flex justify-center items-center w-[30%]">
          <div className="text-white text-4xl font-bold">
            {timer ? timer : ''}
          </div>
        </div>

        <div className="bg-red-700 text-white px-4 py-2 w-[25%] text-center text-2xl font-bold">
          {redTeamName}
        </div>
      </div>
    )
}