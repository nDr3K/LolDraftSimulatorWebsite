import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OptionsAccordion from "@/components/features/Home/options-accordion";
import { useLobbyService } from "@/services/lobby/lobby-utils";
import { LobbyOptions } from "@/types/draft-options";
import { CreateLobbyResponse } from "@/services/lobby/model/create-lobby-response";
import LobbyDialog from "@/components/features/Home/lobby-dialog";

export default function Home() {
  const navigate = useNavigate();
  const [draftOptions, setDraftOptions] = useState<LobbyOptions>({
    isFearless: true,
    fearlessMode: 'standard',
    tournamentBan: true,
    blueTeamName: 'Blue Team',
    redTeamName: 'Red Team'
  });
  const [lobby, setLobby] = useState<CreateLobbyResponse | null>(null);
  const { createLobby } = useLobbyService();
  
  const handleCardClick = async (mode: 'solo' | 'multiplayer') => {
    if (mode == 'solo') {
      navigate('/draft', {
        state: {
          mode,
          ...draftOptions
        }
      });
    } else {
      try {
        const lobbyResponse = await createLobby({
          blueTeamName: draftOptions.blueTeamName,
          redTeamName: draftOptions.redTeamName,
          options: {
            banPick: draftOptions.isFearless && (draftOptions.fearlessMode == 'standard' || draftOptions.fearlessMode == 'hardcore'),
            isFearless: draftOptions.isFearless,
            keepBan: draftOptions.isFearless && draftOptions.fearlessMode == 'hardcore',
            tournamentBan: draftOptions.tournamentBan
          }
        });
        
        setLobby(lobbyResponse);
      } catch(error) {
        console.error('Failed to create lobby', error);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-4xl font-bold text-center mb-8">Choose Your Draft Mode</h1>
        <div className="flex flex-wrap justify-center gap-6">
          <div 
            onClick={() => handleCardClick('solo')} 
            className="group w-full sm:w-[calc(50%-12px)] max-w-md"
          >
            <Card className="h-full transition-all duration-300 ease-in-out hover:cursor-pointer hover:border-primary hover:shadow-lg bg-gradient-to-br from-background to-background hover:from-primary/5 hover:to-background">
              <CardHeader className="text-center">
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Solo Draft</CardTitle>
                <CardDescription>Perfect your strategy, solo.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="relative z-10">Explore champion combos, draft solo, and refine your tactics at your own pace. Play offline without time limits.</p>
              </CardContent>
            </Card>
          </div>
          <div 
            onClick={() => handleCardClick('multiplayer')} 
            className="cursor-pointer group w-full sm:w-[calc(50%-12px)] max-w-md"
          >
            <Card className="h-full transition-all duration-300 ease-in-out hover:cursor-pointer hover:border-primary hover:shadow-lg bg-gradient-to-br from-background to-background hover:from-primary/5 hover:to-background">
              <CardHeader className="text-center">
                <CardTitle className="group-hover:text-primary transition-colors duration-300">Multiplayer Draft</CardTitle>
                <CardDescription>Challenge your friends or foes.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="relative z-10">Host a draft session, invite another player to test your strategies, and allow spectators to join and watch the action unfold.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <OptionsAccordion onOptionsChange={setDraftOptions}/>
      </div>

      {lobby && <LobbyDialog lobby={lobby} onClose={() => setLobby(null)} />}
    </>
  )
}