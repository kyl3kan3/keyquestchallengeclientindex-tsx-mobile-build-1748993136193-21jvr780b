import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Star, Trophy, Users, BookOpen, Gamepad2, 
  Target, Zap, Heart, Sparkles, ChevronRight, Download
} from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGetStarted = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setLocation('/auth');
    }, 500);
  };

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-mint" />,
      title: "Story-Based Lessons",
      description: "Join Explorer Maya on adventures through magical worlds while learning to type!"
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-coral" />,
      title: "Interactive Mini-Games",
      description: "Race cars, catch falling letters, and hunt for treasure in exciting typing challenges!"
    },
    {
      icon: <Target className="w-8 h-8 text-sky" />,
      title: "Adaptive Learning",
      description: "Smart difficulty adjustment that grows with your child's typing skills and progress."
    },
    {
      icon: <Trophy className="w-8 h-8 text-sunny" />,
      title: "Achievement System",
      description: "Unlock badges, earn coins, and celebrate milestones with rewarding achievements!"
    },
    {
      icon: <Users className="w-8 h-8 text-magic" />,
      title: "Character Customization",
      description: "Choose from 9+ unique avatars and customize your typing adventure character!"
    },
    {
      icon: <Heart className="w-8 h-8 text-coral" />,
      title: "Parent Dashboard",
      description: "Track progress, view detailed analytics, and support your child's learning journey."
    }
  ];

  const worlds = [
    { name: "Jungle Quest", emoji: "🌿", color: "from-green-400 to-emerald-500" },
    { name: "Space Journey", emoji: "🚀", color: "from-purple-400 to-indigo-500" },
    { name: "Ocean Deep", emoji: "🌊", color: "from-blue-400 to-cyan-500" },
    { name: "Candy Kingdom", emoji: "🍭", color: "from-pink-400 to-rose-500" }
  ];

  const achievements = [
    { emoji: "⚡", name: "Speed Demon" },
    { emoji: "🎯", name: "Accuracy Master" },
    { emoji: "🔥", name: "Week Warrior" },
    { emoji: "👑", name: "Typing Champion" }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : ''}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-400 via-cyan-400 to-turquoise-500 min-h-screen flex items-center">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-16 h-16 bg-white/20 rounded-full animate-bounce-gentle"></div>
          <div className="absolute top-40 right-20 w-12 h-12 bg-coral/30 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-32 left-20 w-20 h-20 bg-sunny/25 rounded-full animate-wiggle"></div>
          <div className="absolute top-60 left-1/2 w-14 h-14 bg-magic/20 rounded-full animate-bounce-gentle"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2 text-sm">
                🎮 Gamified Learning Experience
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-fredoka text-white mb-6 leading-tight">
                KeyQuest
                <span className="block text-4xl lg:text-5xl text-sunny">
                  Typing Adventure
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                Transform typing practice into an epic adventure! Kids learn keyboard skills through 
                exciting stories, interactive games, and magical worlds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-coral hover:bg-red-500 text-white text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Adventure
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-800 text-lg px-8 py-4 backdrop-blur-sm"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Free Download
                </Button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-sunny" />
                  <span>Ages 5-12</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-mint" />
                  <span>10,000+ Kids</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-sunny" />
                  <span>Award Winning</span>
                </div>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {worlds.map((world, index) => (
                    <div key={index} className={`bg-gradient-to-r ${world.color} rounded-2xl p-4 text-center text-white transition-transform hover:scale-105`}>
                      <div className="text-3xl mb-2">{world.emoji}</div>
                      <div className="font-semibold text-sm">{world.name}</div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-3">🧭</div>
                  <h3 className="font-fredoka text-xl text-gray-800 mb-2">Explorer Maya</h3>
                  <div className="flex justify-center space-x-2 mb-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-sm">
                        {achievement.emoji}
                      </div>
                    ))}
                  </div>
                  <Badge className="bg-mint text-white">Level 7 • 1,250 coins</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-fredoka text-gray-800 mb-6">
              Why Kids Love KeyQuest
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our app combines education with entertainment, making typing practice 
              feel like playing their favorite video game!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-fredoka text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-r from-magic to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl lg:text-5xl font-fredoka mb-6">
                See It In Action
              </h2>
              <p className="text-xl mb-8 text-purple-100">
                Watch how KeyQuest transforms boring typing practice into an engaging adventure 
                that kids actually want to do every day!
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-sunny rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-800">✓</span>
                  </div>
                  <span>Interactive virtual keyboard with finger placement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-sunny rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-800">✓</span>
                  </div>
                  <span>Real-time WPM and accuracy tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-sunny rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-800">✓</span>
                  </div>
                  <span>Sound effects and visual feedback</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-sunny rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-800">✓</span>
                  </div>
                  <span>Adaptive difficulty progression</span>
                </div>
              </div>
              
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-sunny hover:bg-yellow-400 text-gray-800 font-semibold"
              >
                Try Demo Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <div className="bg-gradient-to-r from-mint to-turquoise rounded-2xl p-4 mb-4 text-white text-center">
                  <div className="text-2xl mb-2">🌿</div>
                  <h4 className="font-fredoka">Jungle Temple Adventure</h4>
                  <p className="text-sm opacity-90">Type magic words to unlock the ancient door!</p>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-fredoka text-gray-800 mb-2">
                    <span className="text-mint">adv</span><span className="bg-sunny px-1 rounded animate-pulse">e</span><span className="text-gray-400">nture</span>
                  </div>
                  <p className="text-sm text-gray-600">An exciting journey or experience</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-sky/10 rounded-lg p-3">
                    <Zap className="w-5 h-5 mx-auto mb-1 text-sky" />
                    <div className="text-lg font-bold text-sky">24</div>
                    <div className="text-xs text-gray-600">WPM</div>
                  </div>
                  <div className="bg-mint/10 rounded-lg p-3">
                    <Target className="w-5 h-5 mx-auto mb-1 text-mint" />
                    <div className="text-lg font-bold text-mint">89%</div>
                    <div className="text-xs text-gray-600">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-magic" />
            <h2 className="text-4xl lg:text-5xl font-fredoka text-gray-800 mb-6">
              Ready to Start the Adventure?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of kids who've already discovered the magic of typing through KeyQuest. 
              Start your child's journey to keyboard mastery today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-coral to-magic hover:from-red-500 hover:to-purple-600 text-white text-lg px-12 py-4 shadow-2xl"
              >
                <Play className="w-6 h-6 mr-2" />
                Begin Your Quest
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-12 py-4"
              >
                Learn More
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-coral mb-2">100%</div>
                <div className="text-gray-600">Free to Start</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-mint mb-2">5-12</div>
                <div className="text-gray-600">Perfect Age Range</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky mb-2">24/7</div>
                <div className="text-gray-600">Learn Anytime</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}