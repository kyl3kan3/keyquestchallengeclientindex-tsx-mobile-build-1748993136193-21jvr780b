import React from "react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Flame, Target, Rocket, Crown, Medal, Zap } from "lucide-react";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'consistency' | 'exploration' | 'special';
  requirement: string;
  progress: number;
  maxProgress: number;
  coins: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export default function AchievementSystem() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'speed' | 'accuracy' | 'consistency' | 'exploration' | 'special'>('all');
  const { playAchievementSound } = useSoundEffects();
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: userAchievements } = useQuery({
    queryKey: ["/api/user/1/achievements"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user/1/stats"],
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/user/1/progress"],
  });

  const addAchievementMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      const response = await fetch("/api/user/1/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievementId }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/1/achievements"] });
      playAchievementSound();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await fetch("/api/user/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const achievements: Achievement[] = [
    // Speed Achievements
    {
      id: 'first-10-wpm',
      title: 'Getting Started',
      description: 'Reach 10 WPM for the first time',
      icon: '🚀',
      category: 'speed',
      requirement: '10+ WPM',
      progress: Math.min((user as any)?.wpm || 0, 10),
      maxProgress: 10,
      coins: 50,
      unlocked: false,
      unlockedAt: undefined
    },
    {
      id: 'speed-demon-25',
      title: 'Speed Demon',
      description: 'Type at 25 WPM or faster',
      icon: '⚡',
      category: 'speed',
      requirement: '25+ WPM',
      progress: Math.min((user as any)?.wpm || 0, 25),
      maxProgress: 25,
      coins: 100,
      unlocked: false,
      unlockedAt: undefined
    },
    {
      id: 'lightning-fast-40',
      title: 'Lightning Fast',
      description: 'Achieve 40 WPM typing speed',
      icon: '⚡',
      category: 'speed',
      requirement: '40+ WPM',
      progress: Math.min((user as any)?.wpm || 0, 40),
      maxProgress: 40,
      coins: 200,
      unlocked: false,
      unlockedAt: undefined
    },
    
    // Accuracy Achievements
    {
      id: 'accuracy-80',
      title: 'Sharp Shooter',
      description: 'Maintain 80% accuracy',
      icon: '🎯',
      category: 'accuracy',
      requirement: '80%+ accuracy',
      progress: Math.min((user as any)?.accuracy || 0, 80),
      maxProgress: 80,
      coins: 75,
      unlocked: false,
      unlockedAt: undefined
    },
    {
      id: 'accuracy-95',
      title: 'Precision Master',
      description: 'Achieve 95% accuracy',
      icon: '🎯',
      category: 'accuracy',
      requirement: '95%+ accuracy',
      progress: Math.min((user as any)?.accuracy || 0, 95),
      maxProgress: 95,
      coins: 150,
      unlocked: false,
      unlockedAt: undefined
    },
    
    // Consistency Achievements
    {
      id: 'streak-3',
      title: 'Getting Into Rhythm',
      description: 'Practice for 3 days in a row',
      icon: '🔥',
      category: 'consistency',
      requirement: '3-day streak',
      progress: Math.min((user as any)?.streakDays || 0, 3),
      maxProgress: 3,
      coins: 60,
      unlocked: false,
      unlockedAt: undefined
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Practice for 7 days straight',
      icon: '🔥',
      category: 'consistency',
      requirement: '7-day streak',
      progress: Math.min((user as any)?.streakDays || 0, 7),
      maxProgress: 7,
      coins: 120,
      unlocked: false,
      unlockedAt: undefined
    },
    {
      id: 'lessons-10',
      title: 'Dedicated Learner',
      description: 'Complete 10 typing lessons',
      icon: '📚',
      category: 'consistency',
      requirement: '10 lessons',
      progress: Math.min((user as any)?.totalLessonsCompleted || 0, 10),
      maxProgress: 10,
      coins: 100,
      unlocked: false,
      unlockedAt: undefined
    },
    
    // Exploration Achievements
    {
      id: 'jungle-explorer',
      title: 'Jungle Explorer',
      description: 'Complete all Jungle world lessons',
      icon: '🌿',
      category: 'exploration',
      requirement: 'Complete Jungle world',
      progress: 0, // This would be calculated from progress data
      maxProgress: 5,
      coins: 200,
      unlocked: false,
      unlockedAt: undefined
    },
    {
      id: 'space-cadet',
      title: 'Space Cadet',
      description: 'Complete all Space world lessons',
      icon: '🚀',
      category: 'exploration',
      requirement: 'Complete Space world',
      progress: 0,
      maxProgress: 5,
      coins: 200,
      unlocked: false,
      unlockedAt: undefined
    },
    
    // Special Achievements
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your very first lesson',
      icon: '⭐',
      category: 'special',
      requirement: 'Complete 1 lesson',
      progress: Math.min((user as any)?.totalLessonsCompleted || 0, 1),
      maxProgress: 1,
      coins: 25,
      unlocked: false,
      unlockedAt: undefined
    },
    {
      id: 'coin-collector',
      title: 'Coin Collector',
      description: 'Collect 500 coins total',
      icon: '💰',
      category: 'special',
      requirement: '500 coins',
      progress: Math.min((user as any)?.coins || 0, 500),
      maxProgress: 500,
      coins: 100,
      unlocked: false,
      unlockedAt: undefined
    }
  ];

  // Check for newly earned achievements
  useEffect(() => {
    if (!user || !userAchievements) return;

    achievements.forEach(achievement => {
      const isAlreadyUnlocked = userAchievements.some((ua: any) => ua.achievementId === achievement.id);
      const hasMetRequirement = achievement.progress >= achievement.maxProgress;
      
      if (!isAlreadyUnlocked && hasMetRequirement) {
        // Award the achievement
        addAchievementMutation.mutate(achievement.id);
        
        // Award coins
        updateUserMutation.mutate({
          coins: ((user as any)?.coins || 0) + achievement.coins
        });
        
        // Show notification
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `${achievement.title}: ${achievement.description}`,
        });
      }
    });
  }, [user, userAchievements, achievements]);

  const categories = [
    { id: 'all' as const, name: 'All', icon: Trophy },
    { id: 'speed' as const, name: 'Speed', icon: Zap },
    { id: 'accuracy' as const, name: 'Accuracy', icon: Target },
    { id: 'consistency' as const, name: 'Practice', icon: Flame },
    { id: 'exploration' as const, name: 'Adventure', icon: Rocket },
    { id: 'special' as const, name: 'Special', icon: Crown }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = userAchievements?.length || 0;
  const totalCount = achievements.length;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-fredoka text-gray-800 mb-4">Achievement Gallery</h2>
        <p className="text-lg text-gray-600 mb-4">
          Unlock badges and earn coins by completing typing challenges!
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-magic text-white px-4 py-2">
            {unlockedCount}/{totalCount} Unlocked
          </Badge>
          <Progress value={(unlockedCount / totalCount) * 100} className="w-32 h-3" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-2xl p-2 flex space-x-2 overflow-x-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <IconComponent className="w-4 h-4 inline mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
          const isUnlocked = userAchievements?.some((ua: any) => ua.achievementId === achievement.id);
          const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
          
          return (
            <Card key={achievement.id} className={`p-6 transition-all ${
              isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' : 'bg-gray-50'
            }`}>
              <div className="text-center">
                <div className={`text-4xl mb-3 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <h3 className={`font-fredoka text-lg mb-2 ${
                  isUnlocked ? 'text-yellow-800' : 'text-gray-700'
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {achievement.description}
                </p>
                
                {!isUnlocked && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Badge variant={isUnlocked ? "default" : "secondary"} className={
                    isUnlocked ? 'bg-yellow-500 text-white' : ''
                  }>
                    {isUnlocked ? '✓ Unlocked' : achievement.requirement}
                  </Badge>
                  <div className="text-sm font-semibold text-yellow-600">
                    💰 {achievement.coins}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}