import React from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Header from "@/components/header";
import TypingRace from "@/components/mini-games/typing-race";
import LetterDrop from "@/components/mini-games/letter-drop";
import TreasureHunt from "@/components/mini-games/treasure-hunt";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MiniGame() {
  const { gameType } = useParams();
  const [, setLocation] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const addTypingStatsMutation = useMutation({
    mutationFn: async (data: { wpm: number; accuracy: number; lessonId: string }) => {
      const response = await fetch("/api/user/1/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/1/stats"] });
    },
  });

  const gameConfig = {
    race: {
      title: "Typing Race",
      description: "Race against AI characters and improve your speed!",
      icon: "🏎️"
    },
    tetris: {
      title: "Letter Drop",
      description: "Catch falling letters to build words before they hit the ground!",
      icon: "🧩"
    },
    treasure: {
      title: "Treasure Hunt",
      description: "Type words quickly to collect gems and unlock treasure chests!",
      icon: "💎"
    }
  };

  const game = gameConfig[gameType as keyof typeof gameConfig];

  const handleGameComplete = (score: number, accuracy: number) => {
    // Save stats
    addTypingStatsMutation.mutate({
      wpm: gameType === 'race' ? score : Math.floor(score / 10), // Convert score to approximate WPM for non-race games
      accuracy,
      lessonId: `mini-game-${gameType}`
    });

    // Return to home after a short delay
    setTimeout(() => {
      setLocation('/app');
    }, 3000);
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl font-fredoka">Game not found</div>
      </div>
    );
  }

  const renderGame = () => {
    switch (gameType) {
      case 'race':
        return <TypingRace onComplete={handleGameComplete} />;
      case 'tetris':
        return <LetterDrop onComplete={handleGameComplete} />;
      case 'treasure':
        return <TreasureHunt onComplete={handleGameComplete} />;
      default:
        return (
          <div className="bg-gray-100 rounded-2xl p-8 text-center">
            <div className="text-gray-500 mb-4">Game not implemented yet</div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/app')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            <h1 className="text-2xl font-fredoka text-gray-800">{game.title}</h1>
            <div></div>
          </div>

          {renderGame()}
        </div>
      </main>
    </div>
  );
}
