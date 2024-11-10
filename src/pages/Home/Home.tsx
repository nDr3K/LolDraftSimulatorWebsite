import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OptionsAccordion from "@/components/options-accordion";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Choose Your Draft Mode</h1>
      <div className="flex flex-wrap justify-center gap-6">
        <Link to={`/draft`} className="group w-full sm:w-[calc(50%-12px)] max-w-md">
          <Card className="h-full transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg bg-gradient-to-br from-background to-background hover:from-primary/5 hover:to-background">
            <CardHeader className="text-center">
              <CardTitle className="group-hover:text-primary transition-colors duration-300">Solo Draft</CardTitle>
              <CardDescription>Perfect your strategy, solo.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="relative z-10">Explore champion combos, draft solo, and refine your tactics at your own pace. Play offline without time limits.</p>
            </CardContent>
          </Card>
        </Link>
        <Link to={`/draft`} className="group w-full sm:w-[calc(50%-12px)] max-w-md">
          <Card className="h-full transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg bg-gradient-to-br from-background to-background hover:from-primary/5 hover:to-background">
            <CardHeader className="text-center">
              <CardTitle className="group-hover:text-primary transition-colors duration-300">Multiplayer Draft</CardTitle>
              <CardDescription>Challenge your friends or foes.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="relative z-10">Host a draft session, invite another player to test your strategies, and allow spectators to join and watch the action unfold.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <OptionsAccordion />
    </div>
  )
}