import React from "react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Sparkles, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Avatar {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  unlockLevel: number;
  category: 'explorer' | 'magical' | 'space' | 'underwater';
}

interface Accessory {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  unlockLevel: number;
  slot: 'hat' | 'glasses' | 'cape' | 'pet';
}

export default function CharacterCustomization() {
  const [selectedCategory, setSelectedCategory] = useState<'avatars' | 'accessories'>('avatars');
  const { toast } = useToast();
  
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
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
      toast({
        title: "Success!",
        description: "Your character has been updated!",
      });
    },
  });

  const avatars: Avatar[] = [
    { id: 'explorer', name: 'Explorer Maya', emoji: '🧭', cost: 0, unlockLevel: 1, category: 'explorer' },
    { id: 'adventurer', name: 'Brave Alex', emoji: '🎒', cost: 100, unlockLevel: 3, category: 'explorer' },
    { id: 'treasure-hunter', name: 'Captain Jack', emoji: '🏴‍☠️', cost: 200, unlockLevel: 5, category: 'explorer' },
    { id: 'wizard', name: 'Mystic Sam', emoji: '🧙‍♂️', cost: 300, unlockLevel: 7, category: 'magical' },
    { id: 'fairy', name: 'Luna Sparkle', emoji: '🧚‍♀️', cost: 250, unlockLevel: 6, category: 'magical' },
    { id: 'astronaut', name: 'Space Cadet', emoji: '👨‍🚀', cost: 400, unlockLevel: 10, category: 'space' },
    { id: 'alien', name: 'Zorp Friend', emoji: '👽', cost: 350, unlockLevel: 8, category: 'space' },
    { id: 'mermaid', name: 'Ocean Pearl', emoji: '🧜‍♀️', cost: 300, unlockLevel: 9, category: 'underwater' },
    { id: 'diver', name: 'Deep Sea Dan', emoji: '🤿', cost: 200, unlockLevel: 4, category: 'underwater' }
  ];

  const accessories: Accessory[] = [
    { id: 'crown', name: 'Royal Crown', emoji: '👑', cost: 150, unlockLevel: 5, slot: 'hat' },
    { id: 'wizard-hat', name: 'Wizard Hat', emoji: '🎩', cost: 100, unlockLevel: 3, slot: 'hat' },
    { id: 'pirate-hat', name: 'Pirate Hat', emoji: '🏴‍☠️', cost: 120, unlockLevel: 4, slot: 'hat' },
    { id: 'cool-glasses', name: 'Cool Glasses', emoji: '🕶️', cost: 80, unlockLevel: 2, slot: 'glasses' },
    { id: 'magic-glasses', name: 'Magic Specs', emoji: '👓', cost: 100, unlockLevel: 3, slot: 'glasses' },
    { id: 'hero-cape', name: 'Hero Cape', emoji: '🦸‍♂️', cost: 200, unlockLevel: 6, slot: 'cape' },
    { id: 'magic-cape', name: 'Magic Cloak', emoji: '🧙‍♂️', cost: 250, unlockLevel: 7, slot: 'cape' },
    { id: 'dragon-pet', name: 'Baby Dragon', emoji: '🐉', cost: 500, unlockLevel: 12, slot: 'pet' },
    { id: 'cat-pet', name: 'Typing Cat', emoji: '🐱', cost: 150, unlockLevel: 4, slot: 'pet' },
    { id: 'owl-pet', name: 'Wise Owl', emoji: '🦉', cost: 200, unlockLevel: 6, slot: 'pet' }
  ];

  const isUnlocked = (level: number) => (user?.level || 1) >= level;
  const canAfford = (cost: number) => (user?.coins || 0) >= cost;

  const handlePurchaseAvatar = (avatar: Avatar) => {
    if (!isUnlocked(avatar.unlockLevel)) {
      toast({
        title: "Locked!",
        description: `Reach level ${avatar.unlockLevel} to unlock this avatar.`,
        variant: "destructive",
      });
      return;
    }

    if (!canAfford(avatar.cost)) {
      toast({
        title: "Not enough coins!",
        description: `You need ${avatar.cost} coins to buy this avatar.`,
        variant: "destructive",
      });
      return;
    }

    updateUserMutation.mutate({
      currentAvatar: avatar.id,
      coins: (user?.coins || 0) - avatar.cost
    });
  };

  const categories = [
    { id: 'avatars' as const, name: 'Characters', icon: '👤' },
    { id: 'accessories' as const, name: 'Accessories', icon: '🎭' }
  ];

  const filtersByCategory = {
    explorer: { name: 'Explorer', color: 'bg-mint' },
    magical: { name: 'Magical', color: 'bg-magic' },
    space: { name: 'Space', color: 'bg-sky' },
    underwater: { name: 'Ocean', color: 'bg-turquoise' }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-fredoka text-gray-800 mb-4">Character Studio</h2>
        <p className="text-lg text-gray-600">Customize your typing adventure character!</p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-2xl p-2 flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-white text-gray-800 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Character Preview */}
      <div className="text-center mb-8">
        <div className="w-32 h-32 bg-gradient-to-r from-coral to-magic rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-6xl">
            {avatars.find(a => a.id === user?.currentAvatar)?.emoji || '🧭'}
          </span>
        </div>
        <h3 className="text-xl font-fredoka text-gray-800">
          {avatars.find(a => a.id === user?.currentAvatar)?.name || 'Explorer Maya'}
        </h3>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <Coins className="w-5 h-5 text-yellow-600" />
          <span className="font-bold text-yellow-800">{user?.coins || 0} coins</span>
        </div>
      </div>

      {selectedCategory === 'avatars' && (
        <div>
          {/* Category Filters */}
          <div className="flex justify-center mb-6 space-x-2">
            {Object.entries(filtersByCategory).map(([key, filter]) => (
              <Badge key={key} className={`${filter.color} text-white px-3 py-1`}>
                {filter.name}
              </Badge>
            ))}
          </div>

          {/* Avatars Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {avatars.map((avatar) => {
              const unlocked = isUnlocked(avatar.unlockLevel);
              const affordable = canAfford(avatar.cost);
              const isOwned = user?.currentAvatar === avatar.id;

              return (
                <Card key={avatar.id} className={`p-4 text-center transition-all cursor-pointer hover:shadow-lg ${
                  isOwned ? 'ring-2 ring-coral bg-coral/5' : ''
                }`}>
                  <div className="text-4xl mb-2 opacity-75">
                    {unlocked ? avatar.emoji : '🔒'}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{avatar.name}</h4>
                  
                  {!unlocked ? (
                    <div className="text-xs text-gray-500 mb-2">
                      <Lock className="w-3 h-3 inline mr-1" />
                      Level {avatar.unlockLevel}
                    </div>
                  ) : isOwned ? (
                    <Badge className="bg-mint text-white mb-2">Equipped</Badge>
                  ) : (
                    <div className="text-sm text-gray-600 mb-2 flex items-center justify-center">
                      <Coins className="w-3 h-3 mr-1 text-yellow-600" />
                      {avatar.cost}
                    </div>
                  )}

                  {!isOwned && (
                    <Button
                      size="sm"
                      onClick={() => handlePurchaseAvatar(avatar)}
                      disabled={!unlocked || !affordable}
                      className={`w-full ${
                        unlocked && affordable
                          ? 'bg-coral hover:bg-red-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      {!unlocked ? 'Locked' : !affordable ? 'Too Expensive' : avatar.cost === 0 ? 'Select' : 'Buy'}
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {selectedCategory === 'accessories' && (
        <div>
          <div className="text-center mb-6">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-magic" />
            <p className="text-gray-600">Accessories coming soon! Complete more lessons to unlock amazing gear!</p>
          </div>
          
          {/* Preview of upcoming accessories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {accessories.slice(0, 10).map((accessory) => (
              <Card key={accessory.id} className="p-4 text-center opacity-50">
                <div className="text-3xl mb-2">🔒</div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{accessory.name}</h4>
                <div className="text-xs text-gray-500">
                  Level {accessory.unlockLevel}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}