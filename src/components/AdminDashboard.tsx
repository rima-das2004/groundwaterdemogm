import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Users, 
  Droplets, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Activity,
  Download,
  RefreshCw,
  Settings,
  LogOut,
  Shield,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for charts
  const groundwaterData = [
    { month: 'Jan', level: 45, rainfall: 120, temperature: 28 },
    { month: 'Feb', level: 42, rainfall: 80, temperature: 32 },
    { month: 'Mar', level: 38, rainfall: 60, temperature: 35 },
    { month: 'Apr', level: 35, rainfall: 40, temperature: 38 },
    { month: 'May', level: 32, rainfall: 20, temperature: 42 },
    { month: 'Jun', level: 28, rainfall: 180, temperature: 38 },
    { month: 'Jul', level: 35, rainfall: 220, temperature: 35 },
    { month: 'Aug', level: 42, rainfall: 200, temperature: 33 },
    { month: 'Sep', level: 40, rainfall: 150, temperature: 31 },
    { month: 'Oct', level: 38, rainfall: 100, temperature: 29 },
    { month: 'Nov', level: 36, rainfall: 80, temperature: 26 },
    { month: 'Dec', level: 40, rainfall: 110, temperature: 24 },
  ];

  const stateData = [
    { state: 'Gujarat', safe: 65, warning: 25, critical: 10 },
    { state: 'Rajasthan', safe: 45, warning: 35, critical: 20 },
    { state: 'Maharashtra', safe: 70, warning: 20, critical: 10 },
    { state: 'Karnataka', safe: 60, warning: 30, critical: 10 },
    { state: 'Tamil Nadu', safe: 55, warning: 30, critical: 15 },
  ];

  const userDistribution = [
    { category: 'Farmers', count: 12500, color: '#22c55e' },
    { category: 'Households', count: 8400, color: '#0891b2' },
    { category: 'Industries', count: 2100, color: '#3b82f6' },
    { category: 'Researchers', count: 650, color: '#8b5cf6' },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Groundwater Management System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-semibold">23,650</p>
                      <p className="text-xs text-success flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12.5% this month
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Monitors</p>
                      <p className="text-2xl font-semibold">1,247</p>
                      <p className="text-xs text-success flex items-center mt-1">
                        <Activity className="w-3 h-3 mr-1" />
                        98.5% uptime
                      </p>
                    </div>
                    <Droplets className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Critical Areas</p>
                      <p className="text-2xl font-semibold">47</p>
                      <p className="text-xs text-destructive flex items-center mt-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Requires attention
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Coverage</p>
                      <p className="text-2xl font-semibold">28 States</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        740 districts
                      </p>
                    </div>
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Groundwater Levels Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={groundwaterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="level" 
                        stroke="#0891b2" 
                        fill="#0891b2" 
                        fillOpacity={0.2}
                        name="Water Level (m)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} users`]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {userDistribution.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-muted-foreground">{item.category}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>State-wise Water Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stateData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="state" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="safe" stackId="a" fill="#22c55e" name="Safe" />
                    <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning" />
                    <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5" />
                    <span>User Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Pending Researcher Applications</p>
                        <p className="text-sm text-muted-foreground">15 applications awaiting approval</p>
                      </div>
                      <Badge variant="outline">15 Pending</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Active Users (24h)</p>
                        <p className="text-sm text-muted-foreground">Users who accessed the system today</p>
                      </div>
                      <Badge variant="outline">4,247 Active</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Data Contributions</p>
                        <p className="text-sm text-muted-foreground">User-submitted reports this week</p>
                      </div>
                      <Badge variant="outline">1,156 Reports</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Generate Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <p className="font-medium">Monthly Groundwater Report</p>
                      <p className="text-sm text-muted-foreground">Comprehensive analysis of groundwater levels across India</p>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <p className="font-medium">User Activity Report</p>
                      <p className="text-sm text-muted-foreground">User engagement and contribution statistics</p>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <p className="font-medium">Critical Areas Assessment</p>
                      <p className="text-sm text-muted-foreground">Detailed analysis of areas requiring immediate attention</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};