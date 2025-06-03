import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Target } from "lucide-react";

interface TypingRaceProps {
  onComplete: (wpm: number, accuracy: number) => void;
}

export default function TypingRace({ onComplete }: TypingRaceProps) {
  const [raceWords] = useState([
    'speed', 'fast', 'quick', 'rapid', 'swift', 'zoom', 'dash', 'rush', 'race', 'boost',
    'turbo', 'lightning', 'rocket', 'flash', 'bolt', 'blast', 'zoom', 'fly', 'soar', 'sprint'
  ]);
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [gameState, setGameState] = useState<'waiting' | 'racing' | 'finished'>('waiting');
  const [playerWpm, setPlayerWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctWords, setCorrectWords] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const currentWord = raceWords[currentWordIndex];
  const totalWords = raceWords.length;

  // AI opponent speed (gradually increases)
  const aiSpeed = 15 + Math.floor(currentWordIndex / 4); // 15-20 WPM range

  useEffect(() => {
    let aiInterval: NodeJS.Timeout;
    
    if (gameState === 'racing') {
      aiInterval = setInterval(() => {
        setAiProgress(prev => {
          const newProgress = Math.min(prev + (aiSpeed / 300), 100); // Simulate AI typing
          if (newProgress >= 100 && gameState === 'racing') {
            setGameState('finished');
          }
          return newProgress;
        });
      }, 200);
    }

    return () => {
      if (aiInterval) clearInterval(aiInterval);
    };
  }, [gameState, aiSpeed]);

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime.getTime()) / 1000 / 60; // minutes
    const wpm = Math.round(correctWords / timeElapsed) || 0;
    const acc = totalAttempts > 0 ? Math.round((correctWords / totalAttempts) * 100) : 100;
    
    setPlayerWpm(wpm);
    setAccuracy(acc);
  }, [startTime, correctWords, totalAttempts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);

    if (value.endsWith(' ') || value === currentWord) {
      const cleanInput = value.trim();
      setTotalAttempts(prev => prev + 1);
      
      if (cleanInput === currentWord) {
        setCorrectWords(prev => prev + 1);
        const newWordIndex = currentWordIndex + 1;
        const progress = (newWordIndex / totalWords) * 100;
        
        setPlayerProgress(progress);
        setCurrentWordIndex(newWordIndex);
        setCurrentInput('');
        
        if (newWordIndex >= totalWords) {
          setGameState('finished');
          calculateStats();
          onComplete(playerWpm, accuracy);
        }
      } else {
        // Wrong word, just clear input
        setCurrentInput('');
      }
      
      calculateStats();
    }
  };

  const startRace = () => {
    setGameState('racing');
    setStartTime(new Date());
    setCurrentWordIndex(0);
    setCurrentInput('');
    setPlayerProgress(0);
    setAiProgress(0);
    setCorrectWords(0);
    setTotalAttempts(0);
    setPlayerWpm(0);
    setAccuracy(100);
  };

  const resetRace = () => {
    setGameState('waiting');
    setStartTime(null);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setPlayerProgress(0);
    setAiProgress(0);
    setCorrectWords(0);
    setTotalAttempts(0);
    setPlayerWpm(0);
    setAccuracy(100);
  };

  if (gameState === 'waiting') {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🏎️</div>
        <h2 className="text-3xl font-fredoka text-gray-800">Ready to Race?</h2>
        <p className="text-lg text-gray-600">
          Type words as fast as you can to beat the AI racer!
        </p>
        <Button 
          onClick={startRace}
          size="lg"
          className="bg-coral hover:bg-red-500 text-white px-8 py-4"
        >
          Start Race!
        </Button>
      </div>
    );
  }

  if (gameState === 'finished') {
    const playerWon = playerProgress >= aiProgress;
    
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">{playerWon ? '🏆' : '😅'}</div>
        <h2 className="text-3xl font-fredoka text-gray-800">
          {playerWon ? 'You Won!' : 'Good Try!'}
        </h2>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-mint to-turquoise rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{playerWpm}</div>
            <div className="text-sm">Your WPM</div>
          </div>
          <div className="bg-gradient-to-r from-sunny to-yellow-400 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{accuracy}%</div>
            <div className="text-sm">Accuracy</div>
          </div>
        </div>
        <div className="space-x-4">
          <Button onClick={resetRace} variant="outline">
            Race Again
          </Button>
          <Button onClick={() => onComplete(playerWpm, accuracy)} className="bg-magic">
            Continue Adventure
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Race Track */}
      <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-6">
        <div className="space-y-4">
          {/* Player Track */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center text-white font-bold">
              YOU
            </div>
            <div className="flex-1 bg-white rounded-full h-8 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-coral to-magic h-full transition-all duration-300"
                style={{ width: `${playerProgress}%` }}
              />
              <div className="absolute right-2 top-1 text-xs font-semibold text-gray-600">
                {Math.round(playerProgress)}%
              </div>
            </div>
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          
          {/* AI Track */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <div className="flex-1 bg-white rounded-full h-8 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-gray-400 to-gray-600 h-full transition-all duration-300"
                style={{ width: `${aiProgress}%` }}
              />
              <div className="absolute right-2 top-1 text-xs font-semibold text-gray-600">
                {Math.round(aiProgress)}%
              </div>
            </div>
            <Trophy className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Current Word */}
      <div className="text-center space-y-4">
        <div className="text-4xl font-fredoka text-gray-800">
          Type: <span className="text-coral">{currentWord}</span>
        </div>
        <input
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          className="text-2xl text-center border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-coral focus:outline-none"
          placeholder="Type here..."
          autoFocus
        />
        <div className="text-sm text-gray-600">
          Word {currentWordIndex + 1} of {totalWords}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-sky" />
          <div className="text-lg font-bold text-sky">{playerWpm}</div>
          <div className="text-xs text-gray-600">WPM</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-mint" />
          <div className="text-lg font-bold text-mint">{accuracy}%</div>
          <div className="text-xs text-gray-600">Accuracy</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-sunny" />
          <div className="text-lg font-bold text-sunny">{correctWords}</div>
          <div className="text-xs text-gray-600">Correct</div>
        </div>
      </div>
    </div>
  );
}