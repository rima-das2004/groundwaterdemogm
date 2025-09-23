import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  Plus, 
  Send, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Brain,
  FileText,
  Camera,
  MapPin,
  Calendar,
  Star,
  Download,
  Lightbulb,
  Target,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

export const UserDashboardMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'predictions' | 'submit' | 'reports' | 'recommendations'>('predictions');
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for user reports and predictions
  const userReports = [
    {
      id: 1,
      type: 'Water Quality',
      description: 'Noticed unusual color in well water',
      status: 'resolved',
      date: '2024-03-10',
      location: 'Well #3, Village Center'
    },
    {
      id: 2,
      type: 'Low Water Level',
      description: 'Water level dropped significantly after dry spell',
      status: 'investigating',
      date: '2024-03-12',
      location: 'Borewell #1, Farm Area'
    },
    {
      id: 3,
      type: 'Equipment Issue',
      description: 'Pump making unusual noise',
      status: 'pending',
      date: '2024-03-14',
      location: 'Community Well'
    }
  ];

  const aiPredictions = [
    {
      metric: 'Water Level',
      current: 42.5,
      predicted: 38.2,
      timeframe: '30 days',
      confidence: 87,
      trend: 'declining',
      factors: ['Reduced rainfall', 'Increased usage', 'High temperature']
    },
    {
      metric: 'Rainfall',
      current: 45,
      predicted: 78,
      timeframe: '15 days',
      confidence: 92,
      trend: 'increasing',
      factors: ['Monsoon approach', 'Weather patterns', 'Cloud formation']
    },
    {
      metric: 'Usage Demand',
      current: 150,
      predicted: 180,
      timeframe: '7 days',
      confidence: 74,
      trend: 'increasing',
      factors: ['Agricultural season', 'Population growth', 'Industrial demand']
    }
  ];

  const predictionChartData = [
    { week: 'Week 1', actual: 42.5, predicted: 41.2 },
    { week: 'Week 2', actual: null, predicted: 40.1 },
    { week: 'Week 3', actual: null, predicted: 39.3 },
    { week: 'Week 4', actual: null, predicted: 38.2 },
  ];

  const historicalWaterData = [
    { month: 'Jan', level: 45.2, usage: 120, quality: 92 },
    { month: 'Feb', level: 44.8, usage: 115, quality: 89 },
    { month: 'Mar', level: 43.1, usage: 135, quality: 85 },
    { month: 'Apr', level: 41.5, usage: 150, quality: 82 },
    { month: 'May', level: 39.2, usage: 180, quality: 78 },
    { month: 'Jun', level: 37.8, usage: 195, quality: 75 },
    { month: 'Jul', level: 38.5, usage: 175, quality: 73 },
    { month: 'Aug', level: 40.2, usage: 160, quality: 76 },
    { month: 'Sep', level: 41.8, usage: 145, quality: 80 },
    { month: 'Oct', level: 42.9, usage: 130, quality: 84 },
    { month: 'Nov', level: 43.5, usage: 125, quality: 87 },
    { month: 'Dec', level: 42.5, usage: 120, quality: 90 },
  ];

  const waterUsageDistribution = [
    { name: 'Household', value: 45, color: '#0891b2' },
    { name: 'Agriculture', value: 35, color: '#22c55e' },
    { name: 'Industry', value: 15, color: '#f59e0b' },
    { name: 'Commercial', value: 5, color: '#ef4444' }
  ];

  const improvementData = [
    { metric: 'Water Saved', current: 1250, target: 2000, improvement: 62.5 },
    { metric: 'Efficiency', current: 78, target: 90, improvement: 86.7 },
    { metric: 'Quality Score', current: 85, target: 95, improvement: 89.5 },
    { metric: 'Conservation', current: 145, target: 200, improvement: 72.5 }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Install Drip Irrigation',
      category: 'Water Conservation',
      priority: 'high',
      impact: 'High',
      description: 'Switch to drip irrigation to reduce water usage by 40-50%',
      savings: '500L/day',
      implementation: '2-3 weeks'
    },
    {
      id: 2,
      title: 'Rainwater Harvesting',
      category: 'Collection',
      priority: 'medium',
      impact: 'Medium',
      description: 'Install rainwater collection system for non-potable uses',
      savings: '300L/day',
      implementation: '1-2 weeks'
    },
    {
      id: 3,
      title: 'Fix Water Leaks',
      category: 'Maintenance',
      priority: 'high',
      impact: 'High',
      description: 'Repair identified leaks in pipeline and storage systems',
      savings: '200L/day',
      implementation: '3-5 days'
    },
    {
      id: 4,
      title: 'Soil Moisture Monitoring',
      category: 'Technology',
      priority: 'medium',
      impact: 'Medium',
      description: 'Use sensors to optimize irrigation timing and quantity',
      savings: '150L/day',
      implementation: '1 week'
    }
  ];

  const issueTypes = [
    'Water Quality',
    'Low Water Level',
    'High Water Level',
    'Equipment Issue',
    'Contamination',
    'Access Problem',
    'Other'
  ];

  const handleSubmitIssue = async () => {
    if (!issueType || !issueDescription.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Issue submitted successfully! We\'ll investigate and get back to you.');
    setIssueType('');
    setIssueDescription('');
    setIsSubmitting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-success/10 text-success border-success/20">Resolved</Badge>;
      case 'investigating':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Investigating</Badge>;
      case 'pending':
        return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'investigating':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Submit reports and view AI predictions</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('predictions')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'predictions' 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Brain className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">AI Insights</span>
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'submit' 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plus className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">Submit</span>
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'recommendations' 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Lightbulb className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">Recommendations</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'reports' 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">My Reports</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* AI Insights Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            {/* Water Level & Quality Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Historical Water Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={historicalWaterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="level" 
                      stackId="1"
                      stroke="#0891b2" 
                      fill="#0891b2"
                      fillOpacity={0.3}
                      name="Water Level (m)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="quality" 
                      stackId="2"
                      stroke="#22c55e" 
                      fill="#22c55e"
                      fillOpacity={0.3}
                      name="Quality (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Usage Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Water Usage Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={waterUsageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {waterUsageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Improvement Metrics Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span>Improvement Progress</span>
                </CardTitle>  
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={improvementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="current" fill="#0891b2" name="Current" />
                    <Bar dataKey="target" fill="#22c55e" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Prediction Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span>AI Water Level Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={predictionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#0891b2" 
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AI Predictions */}
            {aiPredictions.map((prediction, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{prediction.metric}</h4>
                      <p className="text-sm text-muted-foreground">Next {prediction.timeframe}</p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center space-x-1 ${
                        prediction.trend === 'increasing' ? 'text-success' : 'text-destructive'
                      }`}>
                        {prediction.trend === 'increasing' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-semibold">{prediction.predicted}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">from {prediction.current}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence</span>
                      <span>{prediction.confidence}%</span>
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Key factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {prediction.factors.map((factor, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-1">AI-Powered Insights</p>
                <p className="text-sm">These predictions are generated using machine learning models trained on historical data, weather patterns, and usage trends. Use them as guidance for planning and conservation efforts.</p>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Submit Tab */}
        {activeTab === 'submit' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <span>Report an Issue</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Type</label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photo
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    Add Location
                  </Button>
                </div>

                <Button 
                  onClick={handleSubmitIssue}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex flex-col items-center space-y-1">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs">Submit Reading</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center space-y-1">
                    <Star className="w-5 h-5" />
                    <span className="text-xs">Rate Service</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center space-y-1">
                    <FileText className="w-5 h-5" />
                    <span className="text-xs">Request Report</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center space-y-1">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-xs">Emergency Alert</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recommendations for You</h3>
              <Badge variant="outline">{recommendations.length} actions</Badge>
            </div>

            {recommendations.map((rec) => (
              <Card key={rec.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={rec.priority === 'high' ? 'text-destructive border-destructive/20' : 'text-warning border-warning/20'}
                        >
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground">Expected Savings</p>
                          <p className="font-medium text-success">{rec.savings}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Implementation</p>
                          <p className="font-medium">{rec.implementation}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <Badge variant="outline" className="text-xs">{rec.category}</Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Impact</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${rec.impact === 'High' ? 'text-success border-success/20' : 'text-warning border-warning/20'}`}
                          >
                            {rec.impact}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-secondary">
                      Start Implementation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-1">Personalized Recommendations</p>
                <p className="text-sm">These recommendations are generated based on your usage patterns, location, and conservation goals. Implementing these actions can significantly improve your water efficiency.</p>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Submissions</h3>
              <Badge variant="outline">{userReports.length} reports</Badge>
            </div>

            {userReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <h4 className="font-medium">{report.type}</h4>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{report.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{report.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};