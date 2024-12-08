import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label} from "@/components/ui/label";
import { LobbyOptions } from "@/types/draft-options";

export default function OptionsAccordion({ onOptionsChange }: { onOptionsChange: (options: LobbyOptions) => void}) {
  const [options, setOptions] = useState<LobbyOptions>({
    isFearless: true,
    banPick: true,
    keepBan: false,
    tournamentBan: true,
    blueTeamName: 'Blue Team',
    redTeamName: 'Red Team',
  });

  const handleOptionChange = (option: keyof LobbyOptions, value: boolean | string) => {
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        [option]: value,
        ...(option === 'isFearless' && typeof value === 'boolean' && !value
          ? { banPick: false, keepBan: false }
          : {}),
      };
      onOptionsChange(updatedOptions);
      return updatedOptions;
    });
  };

  return(
    <Accordion type="single" collapsible className="w-full max-w-md mx-auto mt-10">
      <AccordionItem value="advanced-options">
        <AccordionTrigger>Advanced Options</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="normal" 
                checked={!options.isFearless} 
                onCheckedChange={(checked) => handleOptionChange('isFearless', !checked)}
              />
              <Label htmlFor="normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="fearless" 
                checked={options.isFearless} 
                onCheckedChange={(checked) => handleOptionChange('isFearless', checked as boolean)}
               />
              <Label htmlFor="fearless">Fearless</Label>
            </div>
          </div>
          {options.isFearless && (
            <div className="pl-4 space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ban-pick" 
                  checked={options.banPick}
                  onCheckedChange={(checked) => handleOptionChange('banPick', checked as boolean)}
                />
                <Label htmlFor="ban-pick">Ban pick for both teams</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keep-ban" 
                  checked={options.keepBan}
                  onCheckedChange={(checked) => handleOptionChange('keepBan', checked as boolean)}
                />
                <Label htmlFor="keep-ban">Keep ban</Label>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-10 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tournamentBan" 
                checked={options.tournamentBan} 
                onCheckedChange={(checked) => handleOptionChange('tournamentBan', checked as boolean)}
              />
              <Label htmlFor="tournamentBan">Tournament Bans</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="draftBan" 
                checked={!options.tournamentBan} 
                onCheckedChange={(checked) => handleOptionChange('tournamentBan', !checked)}
              />
              <Label htmlFor="draftBan">Draft Bans</Label>
            </div>
          </div>
          <div className="flex flex-col mt-4 gap-2">
            <div className="w-full flex justify-between items-center space-x-2 pe-4">
              <Label htmlFor="blueTeamName">Blue Team Name:</Label>
              <input
                type="text"
                value={options.blueTeamName}
                className="bg-zinc-800 text-white rounded px-4 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                onChange={(e) => handleOptionChange('blueTeamName', e.target.value)}
              />
            </div>
            <div className="w-full flex justify-between items-center space-x-2 pe-4">
              <Label htmlFor="redTeamName">Red Team Name:</Label>
              <input
                type="text"
                value={options.redTeamName}
                className="bg-zinc-800 text-white rounded px-4 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                onChange={(e) => handleOptionChange('redTeamName' ,e.target.value)}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}