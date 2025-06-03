import React from "react";
import { Keyboard, Coins, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user?: {
    id: number;
    username: string;
    coins: number;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg rounded-b-3xl mx-4 mt-4">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-coral to-magic rounded-full flex items-center justify-center">
              <Keyboard className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-fredoka text-gray-800">KeyQuest</h1>
              <p className="text-sm text-gray-600">Typing Adventure</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Coins Display */}
            <div className="flex items-center bg-sunny rounded-full px-4 py-2">
              <Coins className="text-yellow-600 mr-2 w-5 h-5" />
              <span className="font-bold text-yellow-800">{user?.coins || 0}</span>
            </div>
            
            {/* Settings */}
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
