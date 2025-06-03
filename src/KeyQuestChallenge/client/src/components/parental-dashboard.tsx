import React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, Calendar, Target, TrendingUp, Book, Trophy, 
  Download, Mail, Settings, User, BarChart3 
} from "lucide-react";

export default function ParentalDashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [selectedChild] = useState('alex'); // In a real app, this would allow switching between children

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user/1/stats", { days: timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365 }],
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/user/1/progress"],
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/user/1/achievements"],
  });

  // Mock data for demonstration - in real app this would come from API
  const sessionData = [
    { date: '2024-01-20', duration: 25, wpm: 23, accuracy: 87, lessonsCompleted: 2 },
    { date: '2024-01-21', duration: 30, wpm: 25, accuracy: 89, lessonsCompleted: 3 },
    { date: '2024-01-22', duration: 20, wpm: 22, accuracy: 85, lessonsCompleted: 1 },
    { date: '2024-01-23', duration: 35, wpm: 26, accuracy: 91, lessonsCompleted: 2 },
    { date: '2024-01-24', duration: 28, wpm: 24, accuracy: 88, lessonsCompleted: 2 },
    { date: '2024-01-25', duration: 32, wpm: 27, accuracy: 92, lessonsCompleted: 3 },
    { date: '2024-01-26', duration: 22, wpm: 25, accuracy: 86, lessonsCompleted: 1 }
  ];

  const weeklyStats = {
    totalTime: sessionData.reduce((sum, session) => sum + session.duration, 0),
    averageWpm: Math.round(sessionData.reduce((sum, session) => sum + session.wpm, 0) / sessionData.length),
    averageAccuracy: Math.round(sessionData.reduce((sum, session) => sum + session.accuracy, 0) / sessionData.length),
    lessonsCompleted: sessionData.reduce((sum, session) => sum + session.lessonsCompleted, 0),
    practiceStreak: (user as any)?.streakDays || 7
  };

  const generateReport = () => {
    const reportData = {
      child: (user as any)?.username || 'alex',
      period: timeframe,
      stats: weeklyStats,
      sessions: sessionData,
      achievements: achievements || [],
      recommendations: [
        'Continue practicing daily to maintain the excellent 7-day streak',
        'Focus on accuracy exercises to improve from 88% to 90%+',
        'Try the Space Adventure world to keep engagement high',
        'Consider 15-20 minute sessions for optimal learning'
      ]
    };

    // In a real app, this would generate and download a PDF
    console.log('Generated report:', reportData);
    alert('Progress report downloaded! Check your Downloads folder.');
  };

  const exportData = () => {
    const csvData = sessionData.map(session => 
      `${session.date},${session.duration},${session.wpm},${session.accuracy},${session.lessonsCompleted}`
    ).join('\n');
    
    const header = 'Date,Duration (min),WPM,Accuracy (%),Lessons Completed\n';
    const fullCsv = header + csvData;
    
    // In a real app, this would create a downloadable CSV
    console.log('CSV Data:', fullCsv);
    alert('Data exported to CSV! Check your Downloads folder.');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-fredoka text-gray-800 mb-2">Parent Dashboard</h2>
          <p className="text-lg text-gray-600">Track your child's typing progress and achievements</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coral"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <Button onClick={generateReport} className="bg-coral hover:bg-red-500">
            <Download className="w-4 h-4 mr-2" />
            Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="p-6 text-center bg-gradient-to-r from-mint to-turquoise text-white">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{weeklyStats.totalTime}m</div>
          <div className="text-sm opacity-90">Practice Time</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-r from-sky to-blue-500 text-white">
          <TrendingUp className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{weeklyStats.averageWpm}</div>
          <div className="text-sm opacity-90">Average WPM</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-r from-magic to-purple-500 text-white">
          <Target className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{weeklyStats.averageAccuracy}%</div>
          <div className="text-sm opacity-90">Accuracy</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-r from-sunny to-yellow-400 text-white">
          <Book className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{weeklyStats.lessonsCompleted}</div>
          <div className="text-sm opacity-90">Lessons Done</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-r from-coral to-red-500 text-white">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{weeklyStats.practiceStreak}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-sky" />
            Weekly Progress
          </h3>
          <div className="space-y-3">
            {sessionData.slice(-7).map((session, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm text-gray-600 w-20">
                  {new Date(session.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="flex-1 mx-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{session.wpm} WPM</span>
                    <span>{session.accuracy}%</span>
                  </div>
                  <Progress value={session.accuracy} className="h-2" />
                </div>
                <div className="text-sm font-semibold text-gray-700 w-16">
                  {session.duration}min
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Achievements */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-sunny" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Speed Demon', description: 'Reached 25 WPM!', date: '2 days ago', icon: '⚡' },
              { title: 'Week Warrior', description: '7-day practice streak', date: '1 day ago', icon: '🔥' },
              { title: 'Accuracy Master', description: '90% accuracy achieved', date: '3 days ago', icon: '🎯' }
            ].map((achievement, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {achievement.date}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Insights */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-mint" />
            Learning Insights
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-mint rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-800">Optimal Practice Time</h4>
                <p className="text-sm text-gray-600">Alex performs best during 20-30 minute sessions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-sky rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-800">Strength Areas</h4>
                <p className="text-sm text-gray-600">Excels at home row keys (A-L) with 95% accuracy</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-coral rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-800">Growth Opportunities</h4>
                <p className="text-sm text-gray-600">Could improve on number keys and punctuation</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-magic rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-800">Engagement</h4>
                <p className="text-sm text-gray-600">Shows high interest in adventure-themed lessons</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Goals & Recommendations */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-magic" />
            Goals & Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Daily Practice Goal
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coral">
                <option value="15">15 minutes</option>
                <option value="20" selected>20 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-coral">
                <option value="adaptive" selected>Adaptive (Recommended)</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={exportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data (CSV)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Email Weekly Report
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}