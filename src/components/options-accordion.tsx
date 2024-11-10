import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label} from "@/components/ui/label";

export default function OptionsAccordion() {
    const [isFearless, setIsFearless] = useState(true)

    return(
        <Accordion type="single" collapsible className="w-full max-w-md mx-auto mt-10">
        <AccordionItem value="advanced-options">
          <AccordionTrigger>Advanced Options</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-10">
              <div className="flex items-center space-x-2">
                <Checkbox id="normal" checked={!isFearless} onCheckedChange={(checked) => setIsFearless(!checked as boolean)}/>
                <Label htmlFor="normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fearless" checked={isFearless} onCheckedChange={(checked) => setIsFearless(checked as boolean)} />
                <Label htmlFor="fearless">Fearless</Label>
              </div>
            </div>
            {isFearless && (
                <div className="pl-4 space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ban-pick" />
                    <Label htmlFor="ban-pick">Ban pick for both teams</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="keep-ban" />
                    <Label htmlFor="keep-ban">Keep ban</Label>
                  </div>
                </div>
              )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
}