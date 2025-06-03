import React from "react";
import { Clock, Heart, Pause, SkipForward, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import VirtualKeyboard from "./virtual-keyboard";

export default function TypingLesson() {
  // Demo lesson state
  const currentWord = "adventure";
  const currentLetterIndex = 3;
  const progress = 70;
  const timeRemaining = 332; // 5:32 in seconds
  const lives = 3;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-fredoka text-gray-800">Current Lesson: Jungle Temple</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-coral" />
            <span className="text-sm text-coral font-semibold">{lives}</span>
          </div>
        </div>
      </div>
      
      {/* Lesson Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Lesson Progress</span>
          <span className="font-semibold text-magic">7/10 words</span>
        </div>
        <Progress value={progress} className="h-4" />
      </div>
      
      {/* Story Context */}
      <div className="bg-gradient-to-r from-mint to-turquoise rounded-2xl p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl">🧭</span>
          </div>
          <div>
            <h3 className="font-fredoka text-white text-lg mb-2">Explorer Maya says:</h3>
            <p className="text-white text-sm">
              "Help me unlock the ancient door by typing the magic words correctly! 
              Each word you type powers up the temple crystals."
            </p>
          </div>
        </div>
      </div>
      
      {/* Typing Exercise */}
      <div className="text-center mb-6">
        <div className="text-4xl font-fredoka text-gray-800 mb-4">
          {currentWord.split('').map((letter, index) => {
            let className = "text-gray-400";
            if (index < currentLetterIndex) {
              className = "text-mint";
            } else if (index === currentLetterIndex) {
              className = "bg-sunny px-1 rounded animate-pulse";
            }
            return (
              <span key={index} className={className}>
                {letter}
              </span>
            );
          })}
        </div>
        <p className="text-lg text-gray-600 mb-4">
          A fun and exciting experience or journey
        </p>
        
        <VirtualKeyboard highlightKey={currentWord[currentLetterIndex]} />
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" className="px-6 py-3">
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </Button>
        <Button variant="outline" className="px-6 py-3 text-coral border-coral hover:bg-coral hover:text-white">
          <SkipForward className="w-4 h-4 mr-2" />
          Skip Word
        </Button>
        <Button className="px-6 py-3 bg-magic hover:bg-purple-600">
          <Lightbulb className="w-4 h-4 mr-2" />
          Hint
        </Button>
      </div>
    </section>
  );
}
