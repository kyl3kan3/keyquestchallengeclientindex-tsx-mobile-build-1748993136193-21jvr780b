import React from "react";
import { Star, Trophy, Rocket, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PlayerProfileProps {
  user?: {
    id: number;
    username: string;
    level: number;
    wpm: number;
    accuracy: number;
    currentAvatar: string;
  };
}

export default function PlayerProfile({ user }: PlayerProfileProps) {
  if (!user) return null;

  const speedProgress = (user.wpm / 50) * 100; // Assuming 50 WPM is max for display
  const accuracyProgress = user.accuracy;

  return (
    <section className="bg-white rounded-3xl shadow-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-fredoka text-gray-800">
          Welcome back, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Level</span>
          <div className="bg-magic text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {user.level}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar */}
        <div className="text-center">
          <div className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-coral shadow-lg bg-gradient-to-r from-sky to-turquoise flex items-center justify-center">
            <span className="text-3xl">
              {user?.currentAvatar === 'adventurer' ? '🎒' :
               user?.currentAvatar === 'treasure-hunter' ? '🏴‍☠️' :
               user?.currentAvatar === 'wizard' ? '🧙‍♂️' :
               user?.currentAvatar === 'fairy' ? '🧚‍♀️' :
               user?.currentAvatar === 'astronaut' ? '👨‍🚀' :
               user?.currentAvatar === 'alien' ? '👽' :
               user?.currentAvatar === 'mermaid' ? '🧜‍♀️' :
               user?.currentAvatar === 'diver' ? '🤿' :
               '🧭'}
            </span>
          </div>
          <Button 
            className="bg-coral text-white hover:bg-red-500"
            onClick={() => {
              const customizeSection = document.getElementById('character-customization');
              customizeSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Customize
          </Button>
        </div>
        
        {/* Progress Stats */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Typing Speed</span>
              <span className="font-semibold text-sky">{user.wpm} WPM</span>
            </div>
            <Progress value={speedProgress} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-semibold text-mint">{user.accuracy}%</span>
            </div>
            <Progress value={accuracyProgress} className="h-3" />
          </div>
        </div>
        
        {/* Recent Achievements */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Recent Badges</h3>
          <div className="flex space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-sunny to-yellow-400 rounded-full flex items-center justify-center">
              <Star className="text-white w-6 h-6" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-magic to-purple-500 rounded-full flex items-center justify-center">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-coral to-red-500 rounded-full flex items-center justify-center">
              <Trophy className="text-white w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
