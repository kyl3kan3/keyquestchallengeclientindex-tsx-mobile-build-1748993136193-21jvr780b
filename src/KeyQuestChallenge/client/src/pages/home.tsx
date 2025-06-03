import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import PlayerProfile from "@/components/player-profile";
import WorldSelection from "@/components/world-selection";
import TypingLesson from "@/components/typing-lesson";
import MiniGames from "@/components/mini-games";
import ProgressDashboard from "@/components/progress-dashboard";
import CharacterCustomization from "@/components/character-customization";
import AchievementSystem from "@/components/achievement-system";
import ParentalDashboard from "@/components/parental-dashboard";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function Home() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/user/1/progress"],
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/user/1/achievements"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user/1/stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl font-fredoka">Loading KeyQuest...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <PlayerProfile user={user} />
        <WorldSelection progress={progress} />
        <TypingLesson />
        <MiniGames />
        <AchievementSystem />
        <div id="character-customization">
          <CharacterCustomization />
        </div>
        <ParentalDashboard />
        <ProgressDashboard stats={stats} achievements={achievements} />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg"
          className="w-16 h-16 bg-gradient-to-r from-coral to-magic rounded-full shadow-2xl text-white text-xl hover:shadow-3xl transition-all duration-300 animate-bounce-gentle"
        >
          <Play className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
