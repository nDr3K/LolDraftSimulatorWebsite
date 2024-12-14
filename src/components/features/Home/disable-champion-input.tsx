import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from 'lucide-react'
import { DraftChampion } from '@/types/draft-champion'
import {Label} from '@/components/ui/label'

export default function DisableChampionInput({
  champions = [],
  disabledChampions,
  setDisabledChampions,
}: {champions: Array<DraftChampion>, disabledChampions: Array<string>, setDisabledChampions: React.Dispatch<React.SetStateAction<Array<string>>>}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (searchTerm) {
      const filteredSuggestions = champions.filter(champion => 
        champion.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !disabledChampions.includes(champion.id)
      )
      setSuggestions(filteredSuggestions.map(c => c.name))
    } else {
      setSuggestions([])
    }
  }, [searchTerm, disabledChampions])

  const handleSelectChampion = (champion: string) => {
    setDisabledChampions((prev) => [...prev, champion])
    setSearchTerm('')
  }

  const handleRemoveChampion = (champion: string) => {
    setDisabledChampions(prev => prev.filter(c => c !== champion))
  }

  return (
    <div className="relative">
      <div className="w-full flex justify-between items-center space-x-2 px-1">
        <Label htmlFor="disabledChampions">Disable Champions:</Label>
         <input
          type="text"
          id="disabledChampions"
          value={searchTerm}
          className="bg-zinc-800 text-white rounded px-4 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {suggestions.length > 0 && (
          <ScrollArea className="absolute z-10 max-h-60 mt-2 border rounded-md bg-background shadow-lg">
            {suggestions.map((champion) => (
              <Button
                key={champion}
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => handleSelectChampion(champion)}
              >
                {champion}
              </Button>
            ))}
          </ScrollArea>
        )}
      {disabledChampions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {disabledChampions.map((champion) => (
            <div
              key={champion}
              className="flex items-center bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
            >
              {champion}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0 text-primary-foreground hover:text-primary-foreground/80"
                onClick={() => handleRemoveChampion(champion)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove {champion}</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}