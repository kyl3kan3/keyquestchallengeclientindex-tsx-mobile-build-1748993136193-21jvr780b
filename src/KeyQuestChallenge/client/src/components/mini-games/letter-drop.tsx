import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Star, Zap, Target } from "lucide-react";

interface FallingLetter {
  id: string;
  letter: string;
  x: number;
  y: number;
  speed: number;
}

interface LetterDropProps {
  onComplete: (score: number, accuracy: number) => void;
}

export default function LetterDrop({ onComplete }: LetterDropProps) {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentWord, setCurrentWord] = useState('');
  const [targetWord, setTargetWord] = useState('CAT');
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gameTime, setGameTime] = useState(60); // 60 seconds
  
  const words = ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'FISH', 'BIRD', 'CAKE', 'BOOK'];
  
  const generateLetter = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    
    const newLetter: FallingLetter = {
      id: Date.now().toString(),
      letter: randomLetter,
      x: Math.random() * 80 + 10, // 10% to 90% from left
      y: -5,
      speed: 1 + Math.random() * 2 // Speed between 1-3
    };
    
    setFallingLetters(prev => [...prev, newLetter]);
  }, [gameState]);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && gameTime > 0) {
      timer = setTimeout(() => {
        setGameTime(prev => prev - 1);
      }, 1000);
    } else if (gameTime === 0) {
      setGameState('finished');
    }
    return () => clearTimeout(timer);
  }, [gameState, gameTime]);

  // Generate falling letters
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(generateLetter, 1500); // New letter every 1.5 seconds
    }
    return () => clearInterval(interval);
  }, [gameState, generateLetter]);

  // Move letters down
  useEffect(() => {
    let animationFrame: number;
    
    const moveLetters = () => {
      if (gameState === 'playing') {
        setFallingLetters(prev => {
          const updated = prev.map(letter => ({
            ...letter,
            y: letter.y + letter.speed
          }));
          
          // Remove letters that hit the bottom and reduce lives
          const stillFalling = updated.filter(letter => {
            if (letter.y > 100) {
              setLives(current => Math.max(0, current - 1));
              return false;
            }
            return true;
          });
          
          return stillFalling;
        });
        
        animationFrame = requestAnimationFrame(moveLetters);
      }
    };
    
    if (gameState === 'playing') {
      animationFrame = requestAnimationFrame(moveLetters);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [gameState]);

  // Check for game over
  useEffect(() => {
    if (lives === 0 && gameState === 'playing') {
      setGameState('finished');
    }
  }, [lives, gameState]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    const key = e.key.toUpperCase();
    if (!/^[A-Z]$/.test(key)) return;
    
    setTotalAttempts(prev => prev + 1);
    
    // Check if this letter is needed for current word
    const nextLetterNeeded = targetWord[currentWord.length];
    
    if (key === nextLetterNeeded) {
      // Find and remove the matching falling letter
      setFallingLetters(prev => {
        const letterIndex = prev.findIndex(letter => letter.letter === key);
        if (letterIndex !== -1) {
          const newLetters = [...prev];
          newLetters.splice(letterIndex, 1);
          return newLetters;
        }
        return prev;
      });
      
      const newCurrentWord = currentWord + key;
      setCurrentWord(newCurrentWord);
      setScore(prev => prev + 10);
      
      // Check if word is complete
      if (newCurrentWord === targetWord) {
        setWordsCompleted(prev => prev + 1);
        setScore(prev => prev + 50); // Bonus for completing word
        setCurrentWord('');
        
        // Get next word
        const nextWord = words[Math.floor(Math.random() * words.length)];
        setTargetWord(nextWord);
      }
    }
  }, [gameState, currentWord, targetWord]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startGame = () => {
    setGameState('playing');
    setFallingLetters([]);
    setScore(0);
    setLives(3);
    setCurrentWord('');
    setTargetWord('CAT');
    setWordsCompleted(0);
    setTotalAttempts(0);
    setGameTime(60);
  };

  const resetGame = () => {
    setGameState('waiting');
    setFallingLetters([]);
    setScore(0);
    setLives(3);
    setCurrentWord('');
    setTargetWord('CAT');
    setWordsCompleted(0);
    setTotalAttempts(0);
    setGameTime(60);
  };

  const accuracy = totalAttempts > 0 ? Math.round((wordsCompleted * targetWord.length / totalAttempts) * 100) : 100;

  if (gameState === 'waiting') {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🧩</div>
        <h2 className="text-3xl font-fredoka text-gray-800">Letter Drop Challenge</h2>
        <p className="text-lg text-gray-600">
          Catch falling letters to spell words! Press keys to catch the right letters.
        </p>
        <Button 
          onClick={startGame}
          size="lg"
          className="bg-sky hover:bg-blue-600 text-white px-8 py-4"
        >
          Start Game!
        </Button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl font-fredoka text-gray-800">Game Over!</h2>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-sky to-blue-500 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-sm">Score</div>
          </div>
          <div className="bg-gradient-to-r from-mint to-turquoise rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{wordsCompleted}</div>
            <div className="text-sm">Words</div>
          </div>
          <div className="bg-gradient-to-r from-sunny to-yellow-400 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{accuracy}%</div>
            <div className="text-sm">Accuracy</div>
          </div>
        </div>
        <div className="space-x-4">
          <Button onClick={resetGame} variant="outline">
            Play Again
          </Button>
          <Button onClick={() => onComplete(score, accuracy)} className="bg-magic">
            Continue Adventure
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Game Header */}
      <div className="flex justify-between items-center bg-white rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-sky">Score: {score}</div>
          <div className="text-lg text-gray-600">Lives: {'❤️'.repeat(lives)}</div>
        </div>
        <div className="text-lg font-semibold text-magic">
          Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Target Word */}
      <div className="bg-gradient-to-r from-mint to-turquoise rounded-xl p-6 text-center">
        <div className="text-white text-lg mb-2">Spell the word:</div>
        <div className="text-4xl font-fredoka text-white mb-2">
          {targetWord.split('').map((letter, index) => (
            <span 
              key={index} 
              className={index < currentWord.length ? 'text-sunny' : 'text-white opacity-70'}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="text-white text-sm">
          Next letter needed: <span className="font-bold text-sunny">{targetWord[currentWord.length] || '✓'}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 rounded-xl h-96 overflow-hidden">
        {/* Falling Letters */}
        {fallingLetters.map(letter => (
          <div
            key={letter.id}
            className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-xl text-gray-800 shadow-lg transition-all duration-100"
            style={{
              left: `${letter.x}%`,
              top: `${letter.y}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {letter.letter}
          </div>
        ))}
        
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-coral"></div>
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-4 text-sm text-gray-600">
          Press keys to catch letters!
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <Star className="w-6 h-6 mx-auto mb-2 text-sunny" />
          <div className="text-lg font-bold text-sunny">{score}</div>
          <div className="text-xs text-gray-600">Score</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-sky" />
          <div className="text-lg font-bold text-sky">{wordsCompleted}</div>
          <div className="text-xs text-gray-600">Words</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-mint" />
          <div className="text-lg font-bold text-mint">{accuracy}%</div>
          <div className="text-xs text-gray-600">Accuracy</div>
        </div>
      </div>
    </div>
  );
}