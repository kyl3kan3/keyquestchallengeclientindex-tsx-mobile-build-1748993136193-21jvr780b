import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Header from "@/components/header";
import VirtualKeyboard from "@/components/virtual-keyboard";
import { useTyping } from "@/hooks/use-typing";
import { LESSONS } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Clock, Pause, SkipForward, Lightbulb } from "lucide-react";

export default function Lesson() {
  const { worldId, levelId } = useParams();
  const [, setLocation] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const lesson = LESSONS[worldId as string]?.[levelId as string];
  
  const {
    currentWordIndex,
    currentLetterIndex,
    correctLetters,
    incorrectLetters,
    wpm,
    accuracy,
    lives,
    timeRemaining,
    isComplete,
    handleKeyPress,
    resetLesson
  } = useTyping(lesson?.words || []);

  const updateProgressMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/user/1/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/1/progress"] });
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  useEffect(() => {
    if (isComplete) {
      updateProgressMutation.mutate({
        worldId,
        levelId,
        completed: true,
        stars: accuracy > 90 ? 3 : accuracy > 80 ? 2 : 1,
        bestWpm: wpm,
        bestAccuracy: accuracy,
      });
    }
  }, [isComplete]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl font-fredoka">Lesson not found</div>
      </div>
    );
  }

  const currentWord = lesson.words[currentWordIndex] || "";
  const progress = ((currentWordIndex / lesson.words.length) * 100);

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          {/* Lesson Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-fredoka text-gray-800">{lesson.title}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-coral" />
                <span className="text-sm text-coral font-semibold">{lives}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Lesson Progress</span>
              <span className="font-semibold text-magic">
                {currentWordIndex}/{lesson.words.length} words
              </span>
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
                <p className="text-white text-sm">{lesson.story}</p>
              </div>
            </div>
          </div>
          
          {/* Current Word Display */}
          <div className="text-center mb-6">
            <div className="text-4xl font-fredoka text-gray-800 mb-4">
              {currentWord.split('').map((letter, index) => {
                let className = "text-gray-400";
                if (index < currentLetterIndex) {
                  className = correctLetters.has(index) ? "text-mint" : "text-coral";
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
            <p className="text-lg text-gray-600 mb-4">{lesson.definitions?.[currentWord] || ""}</p>
          </div>

          {/* Virtual Keyboard */}
          <VirtualKeyboard 
            highlightKey={currentWord[currentLetterIndex]} 
            onKeyPress={handleKeyPress}
          />
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button variant="outline" className="px-6 py-3">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button variant="outline" className="px-6 py-3 text-coral border-coral">
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Word
            </Button>
            <Button className="px-6 py-3 bg-magic hover:bg-purple-600">
              <Lightbulb className="w-4 h-4 mr-2" />
              Hint
            </Button>
          </div>
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-sky">{wpm}</div>
            <div className="text-sm text-gray-600">Words per minute</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-mint">{accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-magic">{correctLetters.size}</div>
            <div className="text-sm text-gray-600">Correct letters</div>
          </div>
        </div>
      </main>
    </div>
  );
}
