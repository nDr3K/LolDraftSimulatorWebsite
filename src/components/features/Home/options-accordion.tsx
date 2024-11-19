import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label} from "@/components/ui/label";
import { DraftOptions } from "@/types/draft-options";

export default function OptionsAccordion({ onOptionsChange }: { onOptionsChange: (options: DraftOptions) => void}) {
  const [isFearless, setIsFearless] = useState(true);
  const [banPick, setBanPick] = useState(true);
  const [keepBan, setKeepBan] = useState(false);
  const [tournamentBan, setTournamentBan] = useState(true);

  const handleOptionChange = (option: keyof DraftOptions, value: boolean) => {
    let _isFearless = isFearless;
    let _banPick = banPick;
    let _keepBan = keepBan;
    let _tournamentBan = tournamentBan;

    if (option === 'isFearless') {
      _isFearless = value;
      setIsFearless(value);
      if (!value) {
        setBanPick(false);
        setKeepBan(false);
        _banPick = false;
        _keepBan = false;
      }
    } else if (option === 'banPick') {
      setBanPick(value);
      _banPick = value;
    } else if (option === 'keepBan') {
      setKeepBan(value);
      _keepBan = value;
    } else if (option === 'tournamentBan') {
      setTournamentBan(value);
      _tournamentBan = value;
    }

    onOptionsChange({
      isFearless: _isFearless,
      banPick: _banPick,
      keepBan: _keepBan,
      tournamentBan: _tournamentBan
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
                checked={!isFearless} 
                onCheckedChange={(checked) => handleOptionChange('isFearless', !checked)}
              />
              <Label htmlFor="normal">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="fearless" 
                checked={isFearless} 
                onCheckedChange={(checked) => handleOptionChange('isFearless', checked as boolean)}
               />
              <Label htmlFor="fearless">Fearless</Label>
            </div>
          </div>
          {isFearless && (
            <div className="pl-4 space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ban-pick" 
                  checked={banPick}
                  onCheckedChange={(checked) => handleOptionChange('banPick', checked as boolean)}
                />
                <Label htmlFor="ban-pick">Ban pick for both teams</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keep-ban" 
                  checked={keepBan}
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
                checked={tournamentBan} 
                onCheckedChange={(checked) => handleOptionChange('tournamentBan', checked as boolean)}
              />
              <Label htmlFor="tournamentBan">Tournament Bans</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="draftBan" 
                checked={!tournamentBan} 
                onCheckedChange={(checked) => handleOptionChange('tournamentBan', !checked)}
              />
              <Label htmlFor="draftBan">Draft Bans</Label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}