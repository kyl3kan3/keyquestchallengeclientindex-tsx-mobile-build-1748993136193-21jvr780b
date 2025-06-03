import { useLocation } from "wouter";
import { Lock } from "lucide-react";

interface WorldSelectionProps {
  progress?: Array<{
    worldId: string;
    levelId: string;
    completed: boolean;
    stars: number;
  }>;
}

export default function WorldSelection({ progress = [] }: WorldSelectionProps) {
  const [, setLocation] = useLocation();

  const worlds = [
    {
      id: "jungle",
      title: "Jungle Quest",
      description: "Explore ancient temples and type your way through the wilderness!",
      image: "🌿",
      bgColor: "from-green-400 to-emerald-500",
      unlocked: true
    },
    {
      id: "space",
      title: "Cosmic Journey", 
      description: "Blast off to distant planets and type among the stars!",
      image: "🚀",
      bgColor: "from-purple-400 to-indigo-500",
      unlocked: true
    },
    {
      id: "underwater",
      title: "Ocean Deep",
      description: "Dive into underwater kingdoms and discover typing treasures!",
      image: "🌊",
      bgColor: "from-blue-400 to-cyan-500",
      unlocked: true
    },
    {
      id: "candyland",
      title: "Candy Kingdom",
      description: "Sweet adventures await! Unlock at level 10.",
      image: "🍭",
      bgColor: "from-pink-400 to-rose-500",
      unlocked: false
    }
  ];

  const getWorldProgress = (worldId: string) => {
    const worldProgress = progress.filter(p => p.worldId === worldId);
    const completed = worldProgress.filter(p => p.completed).length;
    const total = 12; // Assuming 12 levels per world
    const stars = worldProgress.reduce((sum, p) => sum + p.stars, 0);
    return { completed, total, stars };
  };

  const handleWorldClick = (worldId: string, unlocked: boolean) => {
    if (unlocked) {
      setLocation(`/lesson/${worldId}/level-1`);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-fredoka text-white mb-6 text-center">
        Choose Your Adventure!
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {worlds.map((world) => {
          const { completed, total, stars } = getWorldProgress(world.id);
          
          return (
            <div
              key={world.id}
              className={`world-card bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer ${
                !world.unlocked ? 'opacity-50' : ''
              }`}
              onClick={() => handleWorldClick(world.id, world.unlocked)}
            >
              <div className={`h-32 bg-gradient-to-r ${world.bgColor} flex items-center justify-center`}>
                <span className="text-6xl">{world.image}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-fredoka text-xl text-gray-800">{world.title}</h3>
                  {!world.unlocked && (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <p className={`text-sm mb-3 ${world.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                  {world.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${
                          i < Math.floor(stars / 3) ? 'bg-sunny' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-semibold ${
                    world.unlocked ? 'text-magic' : 'text-gray-400'
                  }`}>
                    {completed}/{total} levels
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
