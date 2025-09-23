import React from 'react';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  MapPin,
  Thermometer,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const waterLevelData = [
  { month: 'Jan', level: 45, quality: 92 },
  { month: 'Feb', level: 42, quality: 89 },
  { month: 'Mar', level: 38, quality: 85 },
  { month: 'Apr', level: 35, quality: 82 },
  { month: 'May', level: 32, quality: 78 },
  { month: 'Jun', level: 30, quality: 75 },
  { month: 'Jul', level: 28, quality: 73 },
  { month: 'Aug', level: 31, quality: 76 },
  { month: 'Sep', level: 34, quality: 80 },
  { month: 'Oct', level: 37, quality: 84 },
  { month: 'Nov', level: 40, quality: 87 },
  { month: 'Dec', level: 43, quality: 90 }
];

const districtData = [
  { name: 'North District', safe: 85, warning: 12, critical: 3 },
  { name: 'South District', safe: 78, warning: 18, critical: 4 },
  { name: 'East District', safe: 92, warning: 6, critical: 2 },
  { name: 'West District', safe: 73, warning: 20, critical: 7 },
  { name: 'Central District', safe: 88, warning: 10, critical: 2 }
];

const usageData = [
  { name: 'Household', value: 45, color: '#0088FE' },
  { name: 'Agriculture', value: 35, color: '#00C49F' },
  { name: 'Industry', value: 15, color: '#FFBB28' },
  { name: 'Commercial', value: 5, color: '#FF8042' }
];

export const GroundwaterDashboard: React.FC = () => {
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'safe': return <Badge className="bg-green-100 text-green-800">Safe</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Groundwater Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights for {user?.location?.address || 'your area'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last Updated</p>
          <p className="font-medium">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Water Level</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">32.5m</p>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-xs text-muted-foreground">-2.3m from last month</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Water Quality</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">76%</p>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">+3% from last week</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">pH Level</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">7.2</p>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">Optimal range</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Thermometer className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Wells</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">147</p>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground">3 require attention</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Water Level Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Water Level & Quality Trends</CardTitle>
            <CardDescription>
              Monthly groundwater level and quality metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waterLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Water Level (m)"
                />
                <Line 
                  type="monotone" 
                  dataKey="quality" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Quality (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Water Usage Distribution</CardTitle>
            <CardDescription>
              Groundwater consumption by sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {usageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* District Status */}
      <Card>
        <CardHeader>
          <CardTitle>District-wise Water Status</CardTitle>
          <CardDescription>
            Current groundwater status across districts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {districtData.map((district) => (
              <div key={district.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{district.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(district.critical > 5 ? 'critical' : district.warning > 15 ? 'warning' : 'safe')}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-green-600">Safe</span>
                    <span className="font-medium">{district.safe}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-600">Warning</span>
                    <span className="font-medium">{district.warning}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600">Critical</span>
                    <span className="font-medium">{district.critical}%</span>
                  </div>
                </div>
                <Progress value={district.safe} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Latest groundwater monitoring alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-red-900">Critical Water Level</p>
                <p className="text-sm text-red-700">Well #234 in West District has reached critical level</p>
                <p className="text-xs text-red-600">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900">Quality Warning</p>
                <p className="text-sm text-yellow-700">Elevated TDS levels detected in North District</p>
                <p className="text-xs text-yellow-600">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900">System Normal</p>
                <p className="text-sm text-green-700">All monitoring systems operational</p>
                <p className="text-xs text-green-600">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};