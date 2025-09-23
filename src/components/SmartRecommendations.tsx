import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Lightbulb, 
  Home, 
  Wheat, 
  Factory,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Clock,
  Target,
  BarChart3,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'conservation' | 'quality' | 'efficiency' | 'maintenance' | 'safety';
  priority: 'high' | 'medium' | 'low';
  impact: string;
  timeframe: string;
  savings: string;
  difficulty: 'easy' | 'medium' | 'hard';
  userType: 'household' | 'agriculture' | 'industry' | 'all';
  steps: string[];
  rating: number;
  implementedBy: number;
}

export const SmartRecommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('household');
  const [ratedRecommendations, setRatedRecommendations] = useState<Record<string, boolean>>({});

  const recommendations: Recommendation[] = [
    {
      id: 'h1',
      title: 'Install Rainwater Harvesting System',
      description: 'Collect and store rainwater for household use to reduce groundwater dependency.',
      category: 'conservation',
      priority: 'high',
      impact: 'Reduce groundwater usage by 30-40%',
      timeframe: '2-3 weeks',
      savings: '₹3,000-5,000/year',
      difficulty: 'medium',
      userType: 'household',
      steps: [
        'Assess roof area and water requirements',
        'Install gutters and downspouts',
        'Set up collection tank with filtration',
        'Connect to household plumbing system'
      ],
      rating: 4.5,
      implementedBy: 1240
    },
    {
      id: 'h2',
      title: 'Fix Water Leaks Immediately',
      description: 'Repair dripping taps, leaking pipes, and running toilets to prevent water waste.',
      category: 'efficiency',
      priority: 'high',
      impact: 'Save up to 3,000 liters/month',
      timeframe: '1-2 days',
      savings: '₹500-1,000/month',
      difficulty: 'easy',
      userType: 'household',
      steps: [
        'Conduct regular leak detection checks',
        'Replace worn washers and seals',
        'Repair or replace damaged pipes',
        'Monitor water meter for unusual consumption'
      ],
      rating: 4.8,
      implementedBy: 2150
    },
    {
      id: 'a1',
      title: 'Implement Drip Irrigation',
      description: 'Switch to drip irrigation to reduce water consumption while maintaining crop yields.',
      category: 'efficiency',
      priority: 'high',
      impact: 'Reduce water usage by 50-60%',
      timeframe: '1-2 months',
      savings: '₹15,000-25,000/season',
      difficulty: 'medium',
      userType: 'agriculture',
      steps: [
        'Assess field layout and crop requirements',
        'Install main water lines and distribution network',
        'Set up drip emitters and timers',
        'Monitor soil moisture and adjust schedules'
      ],
      rating: 4.7,
      implementedBy: 850
    },
    {
      id: 'a2',
      title: 'Crop Rotation for Water Conservation',
      description: 'Rotate water-intensive crops with drought-resistant varieties.',
      category: 'conservation',
      priority: 'medium',
      impact: 'Reduce seasonal water demand by 25%',
      timeframe: 'Next planting season',
      savings: '₹8,000-12,000/season',
      difficulty: 'easy',
      userType: 'agriculture',
      steps: [
        'Research suitable drought-resistant crop varieties',
        'Plan rotation schedule based on water availability',
        'Prepare soil for new crop types',
        'Monitor yield and water consumption'
      ],
      rating: 4.2,
      implementedBy: 640
    },
    {
      id: 'i1',
      title: 'Install Water Recycling System',
      description: 'Implement closed-loop water recycling to minimize fresh water consumption.',
      category: 'efficiency',
      priority: 'high',
      impact: 'Reduce fresh water intake by 70%',
      timeframe: '3-6 months',
      savings: '₹2,00,000-5,00,000/year',
      difficulty: 'hard',
      userType: 'industry',
      steps: [
        'Conduct water audit and identify recycling opportunities',
        'Design and install treatment systems',
        'Set up monitoring and control systems',
        'Train staff on new procedures'
      ],
      rating: 4.6,
      implementedBy: 125
    },
    {
      id: 'i2',
      title: 'Real-time Water Monitoring',
      description: 'Install smart meters and monitoring systems for immediate leak detection.',
      category: 'efficiency',
      priority: 'medium',
      impact: 'Prevent 15-20% water loss',
      timeframe: '2-4 weeks',
      savings: '₹50,000-1,00,000/year',
      difficulty: 'medium',
      userType: 'industry',
      steps: [
        'Install smart water meters at key points',
        'Set up automated monitoring dashboard',
        'Configure alert systems for anomalies',
        'Establish response protocols for leaks'
      ],
      rating: 4.4,
      implementedBy: 89
    }
  ];

  const getFilteredRecommendations = (userType: string) => {
    return recommendations.filter(rec => rec.userType === userType || rec.userType === 'all');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High Priority</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>;
      default: return <Badge className="bg-green-100 text-green-800">Low Priority</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Badge className="bg-green-100 text-green-800">Easy</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      default: return <Badge className="bg-red-100 text-red-800">Hard</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'conservation': return <Droplets className="h-4 w-4" />;
      case 'efficiency': return <TrendingUp className="h-4 w-4" />;
      case 'maintenance': return <Target className="h-4 w-4" />;
      case 'safety': return <AlertTriangle className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const handleRating = (recommendationId: string, helpful: boolean) => {
    setRatedRecommendations(prev => ({
      ...prev,
      [recommendationId]: helpful
    }));
  };

  const userTypeStats = {
    household: {
      icon: Home,
      totalRecommendations: getFilteredRecommendations('household').length,
      highPriority: getFilteredRecommendations('household').filter(r => r.priority === 'high').length,
      avgSavings: '₹5,000-15,000/year'
    },
    agriculture: {
      icon: Wheat,
      totalRecommendations: getFilteredRecommendations('agriculture').length,
      highPriority: getFilteredRecommendations('agriculture').filter(r => r.priority === 'high').length,
      avgSavings: '₹20,000-50,000/season'
    },
    industry: {
      icon: Factory,
      totalRecommendations: getFilteredRecommendations('industry').length,
      highPriority: getFilteredRecommendations('industry').filter(r => r.priority === 'high').length,
      avgSavings: '₹2,00,000-10,00,000/year'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Smart Recommendations</h1>
          <p className="text-muted-foreground">
            AI-powered insights for efficient groundwater management
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium">Personalized for your area</span>
        </div>
      </div>

      {/* User Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="household" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Household
          </TabsTrigger>
          <TabsTrigger value="agriculture" className="flex items-center gap-2">
            <Wheat className="h-4 w-4" />
            Agriculture
          </TabsTrigger>
          <TabsTrigger value="industry" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
            Industry
          </TabsTrigger>
        </TabsList>

        {/* Stats Cards for Each User Type */}
        {Object.entries(userTypeStats).map(([type, stats]) => (
          <TabsContent key={type} value={type} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Recommendations</p>
                      <p className="text-2xl font-bold">{stats.totalRecommendations}</p>
                    </div>
                    <stats.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                      <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Potential Savings</p>
                      <p className="text-lg font-bold text-green-600">{stats.avgSavings}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations List */}
            <div className="space-y-4">
              {getFilteredRecommendations(type).map((recommendation) => (
                <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getCategoryIcon(recommendation.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {recommendation.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(recommendation.priority)}
                        {getDifficultyBadge(recommendation.difficulty)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Impact Metrics */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Impact</p>
                          <p className="text-xs text-muted-foreground">{recommendation.impact}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Timeframe</p>
                          <p className="text-xs text-muted-foreground">{recommendation.timeframe}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Savings</p>
                          <p className="text-xs text-muted-foreground">{recommendation.savings}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">Rating</p>
                          <p className="text-xs text-muted-foreground">{recommendation.rating}/5</p>
                        </div>
                      </div>
                    </div>

                    {/* Implementation Steps */}
                    <div>
                      <h4 className="font-medium mb-2">Implementation Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        {recommendation.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Community Stats */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{recommendation.implementedBy} users implemented this</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{recommendation.rating} rating</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Was this helpful?</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRating(recommendation.id, true)}
                          className={ratedRecommendations[recommendation.id] === true ? 'text-green-600' : ''}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRating(recommendation.id, false)}
                          className={ratedRecommendations[recommendation.id] === false ? 'text-red-600' : ''}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Insights</CardTitle>
          <CardDescription>
            Based on your location and usage patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Your area shows declining groundwater levels. Implementing rainwater harvesting 
              could reduce dependency by 35% and save ₹25,000 annually.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Good news! Your district has 15% better water quality than the state average. 
              Focus on conservation measures to maintain this advantage.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Urgent: Groundwater levels in your area are 20% below optimal. 
              Consider implementing high-priority conservation measures immediately.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};