import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label} from "@/components/ui/label";
import { DraftOptions } from "@/types/draft-options";

export default function OptionsAccordion({ onOptionsChange }: { onOptionsChange: (options: DraftOptions) => void}) {
  const [isFearless, setIsFearless] = useState(true);
  const [banPick, setBanPick] = useState(true);
  const [keepBan, setKeepBan] = useState(false);

  const handleOptionChange = (option: keyof DraftOptions, value: boolean) => {
    let _isFearless = isFearless;
    let _banPick = banPick;
    let _keepBan = keepBan;

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
      _keepBan = value
    }

    onOptionsChange({
      isFearless: _isFearless,
      banPick: _banPick,
      keepBan: _keepBan
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}