import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Gem, MapPin, Clock, Coins } from "lucide-react";

interface Treasure {
  id: string;
  word: string;
  x: number;
  y: number;
  gems: number;
  discovered: boolean;
}

interface TreasureHuntProps {
  onComplete: (gems: number, accuracy: number) => void;
}

export default function TreasureHunt({ onComplete }: TreasureHuntProps) {
  const [gameState, setGameState] = useState<'waiting' | 'hunting' | 'finished'>('waiting');
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [currentInput, setCurrentInput] = useState('');
  const [totalGems, setTotalGems] = useState(0);
  const [discoveredTreasures, setDiscoveredTreasures] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [currentTarget, setCurrentTarget] = useState<Treasure | null>(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);

  const treasureWords = [
    { word: 'gold', gems: 50 },
    { word: 'ruby', gems: 75 },
    { word: 'pearl', gems: 30 },
    { word: 'diamond', gems: 100 },
    { word: 'emerald', gems: 80 },
    { word: 'sapphire', gems: 90 },
    { word: 'crystal', gems: 40 },
    { word: 'jewel', gems: 60 },
    { word: 'treasure', gems: 120 },
    { word: 'coin', gems: 25 }
  ];

  const generateTreasures = useCallback(() => {
    const newTreasures: Treasure[] = [];
    for (let i = 0; i < 8; i++) {
      const treasureData = treasureWords[Math.floor(Math.random() * treasureWords.length)];
      newTreasures.push({
        id: `treasure-${i}`,
        word: treasureData.word,
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 80 + 10,
        gems: treasureData.gems,
        discovered: false
      });
    }
    setTreasures(newTreasures);
    setCurrentTarget(newTreasures[0]);
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'hunting' && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setGameState('finished');
    }
    return () => clearTimeout(timer);
  }, [gameState, timeRemaining]);

  const movePlayer = useCallback((direction: string) => {
    if (gameState !== 'hunting') return;

    setPlayerPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      const moveDistance = 8;

      switch (direction) {
        case 'ArrowUp':
          newY = Math.max(5, prev.y - moveDistance);
          break;
        case 'ArrowDown':
          newY = Math.min(95, prev.y + moveDistance);
          break;
        case 'ArrowLeft':
          newX = Math.max(5, prev.x - moveDistance);
          break;
        case 'ArrowRight':
          newX = Math.min(95, prev.x + moveDistance);
          break;
      }

      return { x: newX, y: newY };
    });
  }, [gameState]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'hunting') return;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      movePlayer(e.key);
    }
  }, [gameState, movePlayer]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleInputSubmit = () => {
    if (!currentTarget || currentInput.trim() === '') return;

    setTotalAttempts(prev => prev + 1);
    
    if (currentInput.trim().toLowerCase() === currentTarget.word.toLowerCase()) {
      setCorrectAttempts(prev => prev + 1);
      
      // Check if player is close enough to treasure
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - currentTarget.x, 2) + 
        Math.pow(playerPosition.y - currentTarget.y, 2)
      );
      
      if (distance < 15) { // Within range
        setTotalGems(prev => prev + currentTarget.gems);
        setDiscoveredTreasures(prev => prev + 1);
        
        // Mark treasure as discovered
        setTreasures(prev => 
          prev.map(t => 
            t.id === currentTarget.id ? { ...t, discovered: true } : t
          )
        );
        
        // Find next undiscovered treasure
        const remainingTreasures = treasures.filter(t => !t.discovered && t.id !== currentTarget.id);
        if (remainingTreasures.length > 0) {
          setCurrentTarget(remainingTreasures[0]);
        } else {
          setGameState('finished');
        }
      }
    }
    
    setCurrentInput('');
  };

  const startGame = () => {
    setGameState('hunting');
    generateTreasures();
    setPlayerPosition({ x: 50, y: 50 });
    setCurrentInput('');
    setTotalGems(0);
    setDiscoveredTreasures(0);
    setTimeRemaining(120);
    setTotalAttempts(0);
    setCorrectAttempts(0);
  };

  const resetGame = () => {
    setGameState('waiting');
    setTreasures([]);
    setPlayerPosition({ x: 50, y: 50 });
    setCurrentInput('');
    setTotalGems(0);
    setDiscoveredTreasures(0);
    setTimeRemaining(120);
    setCurrentTarget(null);
    setTotalAttempts(0);
    setCorrectAttempts(0);
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;

  if (gameState === 'waiting') {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">💎</div>
        <h2 className="text-3xl font-fredoka text-gray-800">Treasure Hunt Adventure</h2>
        <p className="text-lg text-gray-600">
          Navigate the map using arrow keys and type words to collect treasures!
        </p>
        <Button 
          onClick={startGame}
          size="lg"
          className="bg-magic hover:bg-purple-600 text-white px-8 py-4"
        >
          Start Hunt!
        </Button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-fredoka text-gray-800">Hunt Complete!</h2>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-magic to-purple-500 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{totalGems}</div>
            <div className="text-sm">Gems</div>
          </div>
          <div className="bg-gradient-to-r from-sunny to-yellow-400 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{discoveredTreasures}</div>
            <div className="text-sm">Treasures</div>
          </div>
          <div className="bg-gradient-to-r from-mint to-turquoise rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{accuracy}%</div>
            <div className="text-sm">Accuracy</div>
          </div>
        </div>
        <div className="space-x-4">
          <Button onClick={resetGame} variant="outline">
            Hunt Again
          </Button>
          <Button onClick={() => onComplete(totalGems, accuracy)} className="bg-magic">
            Continue Adventure
          </Button>
        </div>
      </div>
    );
  }

  const distanceToTarget = currentTarget ? Math.sqrt(
    Math.pow(playerPosition.x - currentTarget.x, 2) + 
    Math.pow(playerPosition.y - currentTarget.y, 2)
  ) : 100;

  const isInRange = distanceToTarget < 15;

  return (
    <div className="space-y-4">
      {/* Game Header */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <Gem className="w-6 h-6 mx-auto mb-2 text-magic" />
          <div className="text-lg font-bold text-magic">{totalGems}</div>
          <div className="text-xs text-gray-600">Gems</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <MapPin className="w-6 h-6 mx-auto mb-2 text-coral" />
          <div className="text-lg font-bold text-coral">{discoveredTreasures}/8</div>
          <div className="text-xs text-gray-600">Found</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-sky" />
          <div className="text-lg font-bold text-sky">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-600">Time</div>
        </div>
      </div>

      {/* Current Target */}
      {currentTarget && (
        <div className={`rounded-xl p-4 text-center ${isInRange ? 'bg-gradient-to-r from-mint to-turquoise' : 'bg-gray-100'}`}>
          <div className={`text-lg font-semibold ${isInRange ? 'text-white' : 'text-gray-600'}`}>
            {isInRange ? 'Type to collect:' : 'Move closer to treasure:'}
          </div>
          <div className={`text-2xl font-fredoka ${isInRange ? 'text-white' : 'text-gray-800'}`}>
            {currentTarget.word}
          </div>
          <div className={`text-sm ${isInRange ? 'text-white' : 'text-gray-600'}`}>
            Worth {currentTarget.gems} gems
          </div>
        </div>
      )}

      {/* Game Map */}
      <div className="relative bg-gradient-to-br from-green-100 to-yellow-100 rounded-xl h-80 overflow-hidden border-4 border-green-300">
        {/* Treasures */}
        {treasures.map(treasure => (
          <div
            key={treasure.id}
            className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
              treasure.discovered 
                ? 'bg-gray-300 opacity-50' 
                : treasure.id === currentTarget?.id
                  ? 'bg-yellow-400 animate-pulse shadow-lg'
                  : 'bg-yellow-500 shadow-md'
            }`}
            style={{
              left: `${treasure.x}%`,
              top: `${treasure.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {treasure.discovered ? '✓' : '💎'}
          </div>
        ))}
        
        {/* Player */}
        <div
          className="absolute w-10 h-10 bg-coral rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-200"
          style={{
            left: `${playerPosition.x}%`,
            top: `${playerPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          🧭
        </div>
        
        {/* Range indicator when near target */}
        {currentTarget && isInRange && (
          <div
            className="absolute border-4 border-mint rounded-full opacity-50"
            style={{
              left: `${currentTarget.x}%`,
              top: `${currentTarget.y}%`,
              width: '120px',
              height: '120px',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-4">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-2">Use arrow keys to move</div>
          {isInRange ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="flex-1 text-center border-2 border-mint rounded-lg px-3 py-2 focus:outline-none focus:border-turquoise"
                placeholder="Type the word..."
                onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                autoFocus
              />
              <Button 
                onClick={handleInputSubmit}
                className="bg-mint hover:bg-turquoise text-white"
              >
                Collect!
              </Button>
            </div>
          ) : (
            <div className="text-gray-500">Move closer to the glowing treasure to collect it!</div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          <div></div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => movePlayer('ArrowUp')}
            className="h-8"
          >
            ↑
          </Button>
          <div></div>
          <div></div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => movePlayer('ArrowLeft')}
            className="h-8"
          >
            ←
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => movePlayer('ArrowDown')}
            className="h-8"
          >
            ↓
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => movePlayer('ArrowRight')}
            className="h-8"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
}