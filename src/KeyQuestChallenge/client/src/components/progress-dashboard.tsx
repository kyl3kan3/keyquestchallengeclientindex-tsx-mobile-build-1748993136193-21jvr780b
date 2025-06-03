import React from "react";
import { Medal, Target, Flame, Rocket, Unlock, Crown } from "lucide-react";

interface ProgressDashboardProps {
  stats?: Array<{
    date: Date;
    wpm: number;
  }>;
  achievements?: Array<{
    achievementId: string;
    unlockedAt: Date;
  }>;
}

export default function ProgressDashboard({ stats = [], achievements = [] }: ProgressDashboardProps) {
  // Demo data for the chart
  const weeklyData = [
    { day: 'Mon', wpm: 20 },
    { day: 'Tue', wpm: 22 },
    { day: 'Wed', wpm: 18 },
    { day: 'Thu', wpm: 25 },
    { day: 'Fri', wpm: 24 },
    { day: 'Sat', wpm: 26 },
    { day: 'Sun', wpm: 28 },
  ];

  const maxWpm = Math.max(...weeklyData.map(d => d.wpm));

  const recentAchievements = [
    {
      id: "speed-demon",
      title: "Speed Demon",
      description: "Reached 25 WPM for the first time!",
      icon: <Medal className="text-white w-6 h-6" />,
      bgColor: "from-sunny to-yellow-400",
      timeAgo: "2 days ago"
    },
    {
      id: "accuracy-master",
      title: "Accuracy Master", 
      description: "90% accuracy in Jungle Quest level 3!",
      icon: <Target className="text-white w-6 h-6" />,
      bgColor: "from-magic to-purple-500",
      timeAgo: "4 days ago"
    },
    {
      id: "streak-7",
      title: "7-Day Streak",
      description: "Practiced typing for 7 days in a row!",
      icon: <Flame className="text-white w-6 h-6" />,
      bgColor: "from-coral to-red-500",
      timeAgo: "1 week ago"
    }
  ];

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-fredoka text-gray-800 mb-6 text-center">
        Your Progress Journey
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weekly Progress Chart */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-4">This Week's Typing Speed</h3>
          <div className="bg-gradient-to-r from-sky to-turquoise rounded-2xl p-6 text-white">
            <div className="flex items-end justify-between space-x-2 h-32">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-white bg-opacity-70 rounded-t w-8"
                    style={{ height: `${(data.wpm / maxWpm) * 100}%` }}
                  />
                  <span className="text-xs mt-2">{data.day}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm mt-4">
              Average: 23 WPM (+3 from last week!)
            </p>
          </div>
        </div>
        
        {/* Achievement Gallery */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4 bg-gray-50 rounded-xl p-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${achievement.bgColor} rounded-full flex items-center justify-center`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <span className="text-xs text-gray-500">{achievement.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Next Goals */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4 text-center">Next Goals to Unlock</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-mint to-turquoise rounded-xl text-white">
            <Rocket className="w-8 h-8 mx-auto mb-2" />
            <h4 className="font-semibold">30 WPM Goal</h4>
            <p className="text-sm opacity-90">7 WPM to go!</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-lavender to-magic rounded-xl text-white">
            <Unlock className="w-8 h-8 mx-auto mb-2" />
            <h4 className="font-semibold">Candy Kingdom</h4>
            <p className="text-sm opacity-90">3 levels to unlock!</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-sunny to-yellow-400 rounded-xl text-white">
            <Crown className="w-8 h-8 mx-auto mb-2" />
            <h4 className="font-semibold">Level 10</h4>
            <p className="text-sm opacity-90">Complete 5 more lessons!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
