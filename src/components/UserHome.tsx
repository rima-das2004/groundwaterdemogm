import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Droplets, 
  MapPin, 
  TrendingDown, 
  TrendingUp,
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Thermometer,
  Cloud,
  Eye,
  RefreshCw,
  Bell,
  MessageCircle,
  X,
  Lightbulb,
  Target,
  Clock
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { LiveAlerts, AlertBanner } from './LiveAlerts';
import { NotificationBell } from './NotificationBell';
import { useNotifications } from './NotificationContext';

export const UserHome: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'bot' | 'user', message: string}>>([
    { type: 'bot', message: `Hello! I'm here to help you understand your water management recommendations. How can I assist you today?` }
  ]);

  // Memoized data to prevent unnecessary recalculations
  const localData = useMemo(() => ({
    currentLevel: 42.5,
    lastWeekLevel: 45.2,
    status: 'warning',
    district: user?.district || 'Your District',
    state: user?.state || 'Your State',
    location: user?.location || 'Your Location',
    lastUpdated: '2024-03-15 14:30'
  }), [user?.district, user?.state, user?.location]);

  const weeklyData = useMemo(() => [
    { day: 'Mon', level: 45.2, rainfall: 0 },
    { day: 'Tue', level: 44.8, rainfall: 0 },
    { day: 'Wed', level: 44.1, rainfall: 5 },
    { day: 'Thu', level: 43.6, rainfall: 12 },
    { day: 'Fri', level: 43.0, rainfall: 8 },
    { day: 'Sat', level: 42.8, rainfall: 0 },
    { day: 'Sun', level: 42.5, rainfall: 0 },
  ], []);

  const insights = useMemo(() => [
    {
      type: 'trend',
      title: 'Water Level Declining',
      description: 'Your local groundwater has dropped by 2.7m this week',
      impact: 'moderate',
      action: 'Consider water conservation measures'
    },
    {
      type: 'weather',
      title: 'Rainfall Expected',
      description: 'Moderate rainfall predicted for next 3 days',
      impact: 'positive',
      action: 'Good opportunity for rainwater harvesting'
    },
    {
      type: 'comparison',
      title: 'Below State Average',
      description: 'Your area is 8m below state average',
      impact: 'concerning',
      action: 'Join community conservation efforts'
    }
  ], []);

  const recommendations = useMemo(() => [
    {
      category: user?.userType || 'household',
      title: user?.userType === 'farmer' ? 'Drip Irrigation Systems' : 'Water-Saving Fixtures',
      description: user?.userType === 'farmer' ? 'Reduce water usage by 40% with modern drip irrigation' : 'Install low-flow faucets and dual-flush toilets',
      priority: 'high'
    },
    {
      category: 'general',
      title: 'Rainwater Harvesting',
      description: 'Collect and store rainwater for non-potable uses',
      priority: 'medium'
    }
  ], [user?.userType]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  }, []);

  const getStatusInfo = useCallback((status: string) => {
    switch (status) {
      case 'safe':
        return { color: 'text-success', bg: 'bg-success/10', icon: CheckCircle, label: 'Safe' };
      case 'warning':
        return { color: 'text-warning', bg: 'bg-warning/10', icon: AlertTriangle, label: 'Warning' };
      case 'critical':
        return { color: 'text-destructive', bg: 'bg-destructive/10', icon: AlertTriangle, label: 'Critical' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted/10', icon: Droplets, label: 'Unknown' };
    }
  }, []);

  const statusInfo = useMemo(() => getStatusInfo(localData.status), [getStatusInfo, localData.status]);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Live Alerts Overlay */}
      <LiveAlerts maxVisible={2} autoHide={true} position="top" />
      
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Good morning, {user?.name?.split(' ')[0] || 'User'}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{localData.district}, {localData.state}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <NotificationBell />
          </div>
        </div>
        
        {/* Alert Banner */}
        <div className="mt-3">
          <AlertBanner />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Current Status Card */}
        <Card className={`border-l-4 ${statusInfo.bg} border-l-current`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${statusInfo.bg}`}>
                  <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Current Water Level</h3>
                  <p className="text-sm text-muted-foreground">Last updated: {localData.lastUpdated}</p>
                </div>
              </div>
              <Badge variant="outline" className={`${statusInfo.bg} ${statusInfo.color} border-current`}>
                {statusInfo.label}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{localData.currentLevel}m</p>
                <p className="text-sm text-muted-foreground">Current depth</p>
              </div>
              <div>
                <div className={`flex items-center space-x-1 ${localData.currentLevel < localData.lastWeekLevel ? 'text-destructive' : 'text-success'}`}>
                  {localData.currentLevel < localData.lastWeekLevel ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  <span className="font-semibold">
                    {Math.abs(localData.currentLevel - localData.lastWeekLevel).toFixed(1)}m
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-primary" />
              <span>7-Day Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'level' ? `${value}m` : `${value}mm`,
                  name === 'level' ? 'Water Level' : 'Rainfall'
                ]} />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  stroke="#0891b2" 
                  strokeWidth={2}
                  name="level"
                />
                <Line 
                  type="monotone" 
                  dataKey="rainfall" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="rainfall"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center space-x-2">
            <Eye className="w-5 h-5 text-primary" />
            <span>Local Insights</span>
          </h3>
          
          {insights.map((insight, index) => (
            <Alert key={index} className={`
              ${insight.impact === 'positive' ? 'border-success/20 bg-success/5' : 
                insight.impact === 'concerning' ? 'border-destructive/20 bg-destructive/5' : 
                'border-warning/20 bg-warning/5'}
            `}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-sm">{insight.description}</p>
                  <p className="text-xs text-muted-foreground italic">{insight.action}</p>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>

        {/* Personalized Recommendations */}
        <div className="space-y-3">
          <h3 className="font-semibold">Recommendations for You</h3>
          
          {/* Clickable Recommendations Summary Card */}
          <Card 
            className="border-l-4 border-l-primary cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-primary/5 to-secondary/5"
            onClick={() => setShowRecommendations(true)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">View Personalized Recommendations</h4>
                    <Badge variant="outline" className="text-primary border-primary/20">
                      {recommendations.length} actions
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get AI-powered insights and actions tailored to your water management needs
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span>{recommendations.filter(r => r.priority === 'high').length} High Priority</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span>{recommendations.filter(r => r.priority === 'medium').length} Medium Priority</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Eye className="w-4 h-4 mr-1" />
                    View All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center space-y-1"
                onClick={() => {
                  const reading = prompt('Enter your water level reading (in meters):');
                  if (reading && !isNaN(Number(reading))) {
                    addNotification({
                      title: 'Reading Submitted',
                      message: `Water level reading of ${reading}m has been submitted successfully`,
                      type: 'success',
                      location: `${localData.district}, ${localData.state}`,
                      source: 'User Submission'
                    });
                  }
                }}
              >
                <Thermometer className="w-5 h-5" />
                <span className="text-xs">Submit Reading</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center space-y-1"
                onClick={() => {
                  const alertTypes = ['Rainfall Alert', 'Drought Warning', 'Temperature Alert', 'Monsoon Update'];
                  const selectedAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
                  addNotification({
                    title: 'Weather Alert Activated',
                    message: `${selectedAlert}: You will now receive notifications about weather conditions affecting groundwater in your area`,
                    type: 'info',
                    location: `${localData.district}, ${localData.state}`,
                    source: 'Weather Service'
                  });
                }}
              >
                <Cloud className="w-5 h-5" />
                <span className="text-xs">Weather Alert</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center space-y-1"
                onClick={() => {
                  const checkTypes = ['Daily Water Level', 'Weekly Quality Check', 'Monthly Assessment', 'Seasonal Review'];
                  const selectedCheck = checkTypes[Math.floor(Math.random() * checkTypes.length)];
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + Math.floor(Math.random() * 7) + 1);
                  addNotification({
                    title: 'Monitoring Check Scheduled',
                    message: `${selectedCheck} scheduled for ${tomorrow.toLocaleDateString()}. You will receive a reminder notification.`,
                    type: 'info',
                    location: `${localData.district}, ${localData.state}`,
                    source: 'Automated Scheduler'
                  });
                }}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Schedule Check</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Modal */}
    <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            <span>Personalized Recommendations</span>
          </DialogTitle>
          <DialogDescription>
            AI-powered insights and actions tailored for {user?.userType || 'your'} role in water management
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {recommendations.map((rec, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <h4 className="font-medium">{rec.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={rec.priority === 'high' ? 'text-destructive border-destructive/20' : 'text-warning border-warning/20'}
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Estimated impact: 2-4 weeks</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Difficulty: {rec.priority === 'high' ? 'Medium' : 'Easy'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowChatbot(true);
                        setChatMessages(prev => [...prev, 
                          { type: 'user', message: `Tell me more about: ${rec.title}` },
                          { type: 'bot', message: `${rec.title} is crucial for your area because ${rec.description}. As a ${user?.userType || 'user'}, you can implement this by taking the following steps: 1) Monitor your current water usage patterns, 2) Implement conservation measures, 3) Track improvements over time. Would you like specific guidance on any of these steps?` }
                        ]);
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Ask AI
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>

    {/* Floating Chatbot */}
    {showChatbot && (
      <div className="fixed bottom-20 right-4 w-80 h-96 bg-card border border-border rounded-lg shadow-2xl z-50 flex flex-col">
        <div className="p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">AquaWatch Assistant</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowChatbot(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Ask about recommendations..."
              className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    setChatMessages(prev => [...prev, 
                      { type: 'user', message: input.value },
                      { type: 'bot', message: `I understand you're asking about "${input.value}". Based on your ${user?.userType || 'user'} role and current water data, I recommend focusing on immediate conservation actions. Your area shows ${localData.status} water levels, so implementing water-saving measures will have the most impact. Would you like specific steps for your situation?` }
                    ]);
                    input.value = '';
                  }
                }
              }}
            />
            <Button size="sm" className="px-3">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )}

    {/* Floating Chatbot Toggle Button */}
    {!showChatbot && (
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-2xl z-40 bg-primary hover:bg-primary/90"
        onClick={() => setShowChatbot(true)}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )}
    </div>
  );
};