import { useLocation } from "wouter";
import { Trophy, Star, Gem } from "lucide-react";

export default function MiniGames() {
  const [, setLocation] = useLocation();

  const games = [
    {
      id: "race",
      title: "Typing Race",
      description: "Race against AI characters and improve your speed!",
      image: "🏎️",
      bgColor: "from-red-400 to-orange-500",
      focus: "Speed Focus",
      focusColor: "bg-coral",
      bestScore: "28 WPM",
      icon: <Trophy className="w-4 h-4" />
    },
    {
      id: "tetris",
      title: "Letter Drop",
      description: "Catch falling letters to build words before they hit the ground!",
      image: "🧩",
      bgColor: "from-blue-400 to-cyan-500",
      focus: "Accuracy Focus",
      focusColor: "bg-sky",
      bestScore: "1,240",
      icon: <Star className="w-4 h-4" />
    },
    {
      id: "treasure",
      title: "Treasure Hunt",
      description: "Type words quickly to collect gems and unlock treasure chests!",
      image: "💎",
      bgColor: "from-purple-400 to-pink-500",
      focus: "Adventure",
      focusColor: "bg-magic",
      bestScore: "47",
      icon: <Gem className="w-4 h-4" />
    }
  ];

  const handleGameClick = (gameId: string) => {
    setLocation(`/mini-game/${gameId}`);
  };

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-fredoka text-white mb-6 text-center">
        Mini Games & Challenges
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
            onClick={() => handleGameClick(game.id)}
          >
            <div className={`h-32 bg-gradient-to-r ${game.bgColor} flex items-center justify-center`}>
              <span className="text-6xl">{game.image}</span>
            </div>
            <div className="p-4">
              <h3 className="font-fredoka text-xl text-gray-800 mb-2">{game.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{game.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs text-white px-3 py-1 rounded-full ${game.focusColor}`}>
                  {game.focus}
                </span>
                <div className="flex items-center space-x-1">
                  {game.icon}
                  <span className="text-xs text-gray-600">
                    {game.id === "race" ? "Best: " : game.id === "tetris" ? "High Score: " : "Gems: "}
                    {game.bestScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
