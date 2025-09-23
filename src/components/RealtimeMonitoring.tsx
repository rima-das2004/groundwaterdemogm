import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Droplets, 
  RefreshCw, 
  MapPin, 
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  Thermometer,
  Gauge
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WellData {
  id: string;
  name: string;
  location: string;
  district: string;
  waterLevel: number;
  quality: number;
  ph: number;
  tds: number;
  temperature: number;
  status: 'safe' | 'warning' | 'critical';
  lastUpdated: Date;
  trend: 'up' | 'down' | 'stable';
}

export const RealtimeMonitoring: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedWell, setSelectedWell] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realtimeData, setRealtimeData] = useState<number[]>([]);
  const [wells, setWells] = useState<WellData[]>([]);

  // Generate mock real-time data
  useEffect(() => {
    const generateMockWells = (): WellData[] => {
      const districts = ['North District', 'South District', 'East District', 'West District', 'Central District'];
      const wells: WellData[] = [];
      
      for (let i = 1; i <= 20; i++) {
        const waterLevel = Math.random() * 50 + 10;
        const quality = Math.random() * 100;
        let status: 'safe' | 'warning' | 'critical' = 'safe';
        
        if (waterLevel < 20 || quality < 70) status = 'critical';
        else if (waterLevel < 30 || quality < 85) status = 'warning';
        
        wells.push({
          id: `well-${i}`,
          name: `Well ${i.toString().padStart(3, '0')}`,
          location: `Location ${i}`,
          district: districts[Math.floor(Math.random() * districts.length)],
          waterLevel: Number(waterLevel.toFixed(1)),
          quality: Number(quality.toFixed(1)),
          ph: Number((Math.random() * 3 + 6).toFixed(1)), // pH 6-9
          tds: Math.floor(Math.random() * 1000 + 100), // TDS 100-1100
          temperature: Number((Math.random() * 10 + 20).toFixed(1)), // 20-30°C
          status,
          lastUpdated: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
        });
      }
      
      return wells.sort((a, b) => a.name.localeCompare(b.name));
    };

    setWells(generateMockWells());

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealtimeData(prev => {
        const newData = [...prev, Math.random() * 50 + 20];
        return newData.slice(-50); // Keep last 50 data points
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update well data with small random changes
    setWells(prevWells => 
      prevWells.map(well => ({
        ...well,
        waterLevel: Math.max(0, well.waterLevel + (Math.random() - 0.5) * 2),
        quality: Math.max(0, Math.min(100, well.quality + (Math.random() - 0.5) * 5)),
        lastUpdated: new Date()
      }))
    );
    
    setIsRefreshing(false);
  };

  const filteredWells = wells.filter(well => 
    selectedDistrict === 'all' || well.district === selectedDistrict
  );

  const criticalWells = filteredWells.filter(well => well.status === 'critical').length;
  const warningWells = filteredWells.filter(well => well.status === 'warning').length;
  const safeWells = filteredWells.filter(well => well.status === 'safe').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const chartData = realtimeData.map((value, index) => ({
    time: index,
    value: Number(value.toFixed(1))
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Real-time Monitoring</h1>
          <p className="text-muted-foreground">
            Live groundwater data from DWLR sensors
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Wells</p>
                <p className="text-2xl font-bold">{filteredWells.length}</p>
              </div>
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Safe</p>
                <p className="text-2xl font-bold text-green-600">{safeWells}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold text-yellow-600">{warningWells}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalWells}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Real-time Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Water Level Monitoring</CardTitle>
              <CardDescription>
                Real-time data stream from selected monitoring station
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Time: ${value}s`}
                    formatter={(value) => [`${value}m`, 'Water Level']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0088FE" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Filter Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">District</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    <SelectItem value="North District">North District</SelectItem>
                    <SelectItem value="South District">South District</SelectItem>
                    <SelectItem value="East District">East District</SelectItem>
                    <SelectItem value="West District">West District</SelectItem>
                    <SelectItem value="Central District">Central District</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {criticalWells > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {criticalWells} well{criticalWells > 1 ? 's' : ''} in critical condition require immediate attention.
                  </AlertDescription>
                </Alert>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Data Update Status</h4>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live monitoring active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last update: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wells List */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Wells</CardTitle>
          <CardDescription>
            Current status of all groundwater monitoring wells
            {selectedDistrict !== 'all' && ` in ${selectedDistrict}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredWells.map((well) => (
              <div
                key={well.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedWell(selectedWell === well.id ? null : well.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(well.status)}
                    <div>
                      <h4 className="font-medium">{well.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{well.location}, {well.district}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{well.waterLevel}m</p>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(well.trend)}
                        <span className="text-xs text-muted-foreground">Level</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">{well.quality}%</p>
                      <span className="text-xs text-muted-foreground">Quality</span>
                    </div>
                    
                    {getStatusBadge(well.status)}
                  </div>
                </div>

                {selectedWell === well.id && (
                  <div className="mt-4 pt-4 border-t grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">pH Level</p>
                        <p className="text-lg">{well.ph}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">TDS</p>
                        <p className="text-lg">{well.tds} ppm</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Temperature</p>
                        <p className="text-lg">{well.temperature}°C</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Update</p>
                        <p className="text-sm">{well.lastUpdated.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};