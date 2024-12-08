import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Label} from "@/components/ui/label";
import { LobbyOptions } from "@/types/draft-options";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function OptionsAccordion({ onOptionsChange }: { onOptionsChange: (options: LobbyOptions) => void}) {
  const [options, setOptions] = useState<LobbyOptions>({
    isFearless: true,
    fearlessMode: 'standard',
    tournamentBan: true,
    blueTeamName: 'Blue Team',
    redTeamName: 'Red Team',
  });

  const handleOptionChange = (option: keyof LobbyOptions, value: boolean | string) => {
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        [option]: value,
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="fearless">Fearless</Label>
              <Switch 
                id="fearless" 
                checked={options.isFearless} 
                onCheckedChange={(checked) => handleOptionChange('isFearless', checked)}
              />
            </div>
            
            <div className={options.isFearless ? '' : 'opacity-50'}>
              <Label className="mb-2 block">Fearless Mode:</Label>
              <RadioGroup 
                className="flex space-x-4" 
                value={options.fearlessMode} 
                onValueChange={(value) => handleOptionChange('fearlessMode', value)}
                disabled={!options.isFearless}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="soft" id="soft" />
                  <Label htmlFor="soft">Soft</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hardcore" id="hardcore" />
                  <Label htmlFor="hardcore">Hardcore</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="tournamentBan">Tournament Bans</Label>
              <Switch 
                id="tournamentBan" 
                checked={options.tournamentBan} 
                onCheckedChange={(checked) => handleOptionChange('tournamentBan', checked)}
              />
            </div>

            <div className="w-full flex justify-between items-center space-x-2">
              <Label htmlFor="blueTeamName">Blue Team Name:</Label>
              <input
                type="text"
                id="blueTeamName"
                value={options.blueTeamName}
                className="bg-zinc-800 text-white rounded px-4 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                onChange={(e) => handleOptionChange('blueTeamName', e.target.value)}
              />
            </div>

            <div className="w-full flex justify-between items-center space-x-2">
              <Label htmlFor="redTeamName">Red Team Name:</Label>
              <input
                type="text"
                id="redTeamName"
                value={options.redTeamName}
                className="bg-zinc-800 text-white rounded px-4 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                onChange={(e) => handleOptionChange('redTeamName', e.target.value)}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}