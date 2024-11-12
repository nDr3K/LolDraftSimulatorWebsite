import { Search } from "lucide-react";

export default function DraftHeader({ 
    blueTeamName = 'Blue', 
    redTeamName = 'Red',
    timer = null
}: {blueTeamName: string, redTeamName: string, timer: number | null}) {

    return(
        <div className="flex justify-between items-center mb-4">
        <div className="bg-blue-700 text-white px-4 py-2 w-48 text-center">
          {blueTeamName}
        </div>
        <div className="flex space-x-2">
          <div className="text-white text-2xl">{timer ? timer : ''}</div>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search champion..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded"
          />
        </div>
        <div className="bg-red-700 text-white px-4 py-2 w-48 text-center">
          {redTeamName}
        </div>
      </div>
    )
}