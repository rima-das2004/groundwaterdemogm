import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { 
  MapPin, 
  TrendingDown, 
  AlertTriangle, 
  Calendar,
  ArrowRight,
  BookOpen,
  Users,
  Droplets,
  Activity
} from 'lucide-react';

interface UserLandingPageProps {
  onContinue: () => void;
}

export const UserLandingPage: React.FC<UserLandingPageProps> = ({ onContinue }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'blogs'>('overview');

  // Mock India groundwater data
  const indiaGroundwaterData = [
    { state: 'Punjab', level: 45, status: 'critical' },
    { state: 'Haryana', level: 52, status: 'warning' },
    { state: 'Gujarat', level: 68, status: 'safe' },
    { state: 'Rajasthan', level: 38, status: 'critical' },
    { state: 'Maharashtra', level: 62, status: 'safe' },
    { state: 'Karnataka', level: 58, status: 'safe' },
    { state: 'Tamil Nadu', level: 48, status: 'warning' },
    { state: 'Kerala', level: 72, status: 'safe' },
  ];

  const yearlyTrend = [
    { year: '2019', level: 65 },
    { year: '2020', level: 62 },
    { year: '2021', level: 58 },
    { year: '2022', level: 55 },
    { year: '2023', level: 52 },
    { year: '2024', level: 48 },
  ];

  const blogs = [
    {
      id: 1,
      title: "Understanding Groundwater Depletion in North India",
      excerpt: "Explore the causes and impacts of rapidly declining groundwater levels in Punjab and Haryana...",
      author: "Dr. Priya Sharma",
      date: "2024-03-15",
      readTime: "5 min read",
      category: "Research",
      image: "🌊"
    },
    {
      id: 2,
      title: "Water Conservation Techniques for Farmers",
      excerpt: "Practical methods to reduce water usage while maintaining crop yields through smart irrigation...",
      author: "Agricultural Dept.",
      date: "2024-03-12",
      readTime: "8 min read",
      category: "Agriculture",
      image: "🌾"
    },
    {
      id: 3,
      title: "Community Success Story: Rainwater Harvesting in Kerala",
      excerpt: "How a village in Kerala successfully reversed groundwater depletion through community action...",
      author: "Community Team",
      date: "2024-03-10",
      readTime: "6 min read",
      category: "Success Story",
      image: "🏘️"
    },
    {
      id: 4,
      title: "Climate Change Impact on Indian Groundwater",
      excerpt: "Understanding how changing rainfall patterns affect groundwater recharge across different regions...",
      author: "Dr. Raj Kumar",
      date: "2024-03-08",
      readTime: "10 min read",
      category: "Climate",
      image: "🌡️"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'safe': return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Safe</Badge>;
      case 'warning': return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case 'critical': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">India's Groundwater Status</h1>
          <p className="text-muted-foreground">Real-time monitoring across the nation</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'overview' 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
              activeTab === 'blogs' 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">Blogs & Awareness</span>
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 pb-20">
          {activeTab === 'overview' && (
            <>
              {/* National Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">National Avg</p>
                        <p className="text-lg font-semibold">52.4m</p>
                        <p className="text-xs text-destructive flex items-center">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          -8% this year
                        </p>
                      </div>
                      <Droplets className="w-6 h-6 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Critical Areas</p>
                        <p className="text-lg font-semibold">147</p>
                        <p className="text-xs text-destructive flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          High risk
                        </p>
                      </div>
                      <MapPin className="w-6 h-6 text-destructive" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Yearly Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">National Groundwater Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={yearlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}m`, 'Water Level']} />
                      <Area 
                        type="monotone" 
                        dataKey="level" 
                        stroke="#0891b2" 
                        fill="#0891b2" 
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Awareness Section */}
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="text-center p-3">
                  <Droplets className="w-8 h-8 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Water Crisis Awareness</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    India's groundwater levels are declining rapidly. Your contribution to monitoring can make a difference.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="font-semibold text-primary">70%</p>
                      <p className="text-xs text-muted-foreground">Irrigation</p>
                    </div>
                    <div>
                      <p className="font-semibold text-warning">40%</p>
                      <p className="text-xs text-muted-foreground">Depletion</p>
                    </div>
                    <div>
                      <p className="font-semibold text-secondary">600M</p>
                      <p className="text-xs text-muted-foreground">Affected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
              {/* State-wise Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">State-wise Water Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {indiaGroundwaterData.map((state, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{state.state}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`font-semibold ${getStatusColor(state.status)}`}>
                            {state.level}m
                          </span>
                          {getStatusBadge(state.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

          {activeTab === 'blogs' && (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <Card key={blog.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="text-2xl">{blog.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {blog.category}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{blog.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{blog.author}</span>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>{blog.date}</span>
                            <span>•</span>
                            <span>{blog.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <Button 
          onClick={onContinue}
          className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          Continue to Personal Dashboard
        </Button>
      </div>
    </div>
  );
};