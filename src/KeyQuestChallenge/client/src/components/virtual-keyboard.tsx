import { Button } from "@/components/ui/button";

interface VirtualKeyboardProps {
  highlightKey?: string;
  onKeyPress?: (key: string) => void;
}

export default function VirtualKeyboard({ highlightKey, onKeyPress }: VirtualKeyboardProps) {
  const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const handleKeyClick = (key: string) => {
    onKeyPress?.(key.toLowerCase());
  };

  const getKeyClassName = (key: string) => {
    const baseClasses = "typing-key bg-white rounded border-2 p-2 text-center text-sm font-semibold transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg";
    
    if (highlightKey?.toLowerCase() === key.toLowerCase()) {
      return `${baseClasses} bg-sunny border-yellow-400 shadow-lg transform -translate-y-1`;
    }
    
    return `${baseClasses} border-gray-200 hover:border-gray-300`;
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-10 gap-2 mb-2">
        {topRow.map((key) => (
          <Button
            key={key}
            variant="ghost"
            className={getKeyClassName(key)}
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-9 gap-2 mb-2 ml-4">
        {middleRow.map((key) => (
          <Button
            key={key}
            variant="ghost"
            className={getKeyClassName(key)}
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 ml-8">
        {bottomRow.map((key) => (
          <Button
            key={key}
            variant="ghost"
            className={getKeyClassName(key)}
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        {highlightKey ? `Press the highlighted key: ${highlightKey.toUpperCase()}` : 'Click keys or use your keyboard'}
      </p>
    </div>
  );
}
