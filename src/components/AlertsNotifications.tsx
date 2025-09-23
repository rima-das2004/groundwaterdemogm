import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Bell,
  BellOff,
  Clock,
  MapPin,
  Settings,
  Trash2,
  Eye,
  Filter,
  Download
} from 'lucide-react';

interface AlertData {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  location: string;
  district: string;
  timestamp: Date;
  isRead: boolean;
  source: string;
  priority: 'high' | 'medium' | 'low';
  category: 'water_level' | 'quality' | 'system' | 'maintenance';
}

interface NotificationSettings {
  criticalAlerts: boolean;
  warningAlerts: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  quietHours: boolean;
}

export const AlertsNotifications: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    criticalAlerts: true,
    warningAlerts: true,
    systemUpdates: true,
    emailNotifications: false,
    smsNotifications: false,
    quietHours: false
  });

  // Generate mock alerts
  useEffect(() => {
    const generateMockAlerts = (): AlertData[] => {
      const districts = ['Rajkot', 'Ahmedabad', 'Surat', 'Vadodara', 'Junagadh', 'Bhavnagar', 'Gandhinagar'];
      const villages = ['Morbi', 'Palanpur', 'Anand', 'Nadiad', 'Mehsana', 'Surendranagar', 'Jamnagar'];
      const wellTypes = ['Borewell', 'Open Well', 'Tube Well', 'Hand Pump', 'Community Well'];
      const alerts: AlertData[] = [];

      const comprehensiveAlertTemplates = [
        // Critical Water Level Alerts
        {
          type: 'critical' as const,
          title: 'Critical Water Depletion Alert',
          message: 'Water level dropped to 45.2m depth - approaching historic low. Immediate conservation measures required.',
          priority: 'high' as const,
          category: 'water_level' as const
        },
        {
          type: 'critical' as const,
          title: 'Rapid Water Table Decline',
          message: 'Water level declined by 3.8m in 72 hours - emergency protocols activated.',
          priority: 'high' as const,
          category: 'water_level' as const
        },
        {
          type: 'critical' as const,
          title: 'Well Running Dry',
          message: 'Groundwater level below pump intake depth. Immediate relocation of pumping equipment needed.',
          priority: 'high' as const,
          category: 'water_level' as const
        },

        // Water Quality Alerts  
        {
          type: 'critical' as const,
          title: 'Contamination Detected',
          message: 'Heavy metal contamination (Lead: 0.08mg/L) exceeds WHO standards. Stop consumption immediately.',
          priority: 'high' as const,
          category: 'quality' as const
        },
        {
          type: 'warning' as const,
          title: 'High TDS Levels',
          message: 'Total Dissolved Solids at 1,250 mg/L - approaching unsafe levels for drinking water.',
          priority: 'medium' as const,
          category: 'quality' as const
        },
        {
          type: 'warning' as const,
          title: 'pH Imbalance Alert',
          message: 'pH level at 8.9 - alkalinity increasing. Consider water treatment solutions.',
          priority: 'medium' as const,
          category: 'quality' as const
        },
        {
          type: 'critical' as const,
          title: 'Bacterial Contamination',
          message: 'E.coli detected (15 CFU/100ml). Water requires immediate disinfection before use.',
          priority: 'high' as const,
          category: 'quality' as const
        },
        {
          type: 'warning' as const,
          title: 'Nitrate Concentration Rising',
          message: 'Nitrate levels at 42mg/L - monitor agricultural runoff sources in catchment area.',
          priority: 'medium' as const,
          category: 'quality' as const
        },

        // System & Equipment Alerts
        {
          type: 'critical' as const,
          title: 'DWLR Sensor Failure',
          message: 'Data Water Level Recorder offline for 6 hours. Critical monitoring data unavailable.',
          priority: 'high' as const,
          category: 'system' as const
        },
        {
          type: 'warning' as const,
          title: 'Telemetry Signal Weak',
          message: 'Communication signal at 15% strength. Weather conditions affecting data transmission.',
          priority: 'medium' as const,
          category: 'system' as const
        },
        {
          type: 'critical' as const,
          title: 'Power Supply Interrupted',
          message: 'Solar panel system not charging batteries. Backup power at 20% - maintenance required.',
          priority: 'high' as const,
          category: 'system' as const
        },
        {
          type: 'warning' as const,
          title: 'Sensor Calibration Drift',
          message: 'Water level readings showing 0.5m variance from manual measurements. Recalibration needed.',
          priority: 'medium' as const,
          category: 'system' as const
        },

        // Maintenance Alerts
        {
          type: 'info' as const,
          title: 'Scheduled DWLR Maintenance',
          message: 'Quarterly maintenance due for sensors at 5 monitoring stations. Schedule technician visit.',
          priority: 'low' as const,
          category: 'maintenance' as const
        },
        {
          type: 'warning' as const,
          title: 'Filter Replacement Due',
          message: 'Water treatment filters operational for 8 months. Replace within 2 weeks to maintain quality.',
          priority: 'medium' as const,
          category: 'maintenance' as const
        },
        {
          type: 'info' as const,
          title: 'Annual Equipment Inspection',
          message: 'Due for annual safety and performance inspection of pumping and monitoring equipment.',
          priority: 'low' as const,
          category: 'maintenance' as const
        },

        // Environmental & Weather Alerts
        {
          type: 'warning' as const,
          title: 'Drought Conditions Detected',
          message: 'No significant rainfall for 45 days. Groundwater recharge severely limited.',
          priority: 'medium' as const,
          category: 'water_level' as const
        },
        {
          type: 'info' as const,
          title: 'Monsoon Season Beginning',
          message: 'Heavy rainfall predicted. Prepare rainwater harvesting systems and monitor recharge rates.',
          priority: 'low' as const,
          category: 'water_level' as const
        },
        {
          type: 'warning' as const,
          title: 'Extreme Heat Warning',
          message: 'Temperature >45°C for 7 consecutive days. Expect increased evaporation and water demand.',
          priority: 'medium' as const,
          category: 'water_level' as const
        },

        // Conservation & Usage Alerts
        {
          type: 'warning' as const,
          title: 'High Usage Alert',
          message: 'Daily water extraction 300% above sustainable yield. Implement rationing immediately.',
          priority: 'medium' as const,
          category: 'water_level' as const
        },
        {
          type: 'info' as const,
          title: 'Conservation Target Met',
          message: 'Community achieved 25% reduction in water usage this month. Excellent progress!',
          priority: 'low' as const,
          category: 'water_level' as const
        },

        // Positive Alerts
        {
          type: 'success' as const,
          title: 'Water Level Recovery',
          message: 'Groundwater level increased by 2.1m following recent rainfall. Recharge systems effective.',
          priority: 'low' as const,
          category: 'water_level' as const
        },
        {
          type: 'success' as const,
          title: 'Quality Improved',
          message: 'Water treatment system reduced TDS to 350mg/L - now within safe drinking water standards.',
          priority: 'low' as const,
          category: 'quality' as const
        },
        {
          type: 'success' as const,
          title: 'System Upgrade Complete',
          message: 'New IoT sensors installed and calibrated. Real-time monitoring accuracy improved by 95%.',
          priority: 'low' as const,
          category: 'system' as const
        },
        {
          type: 'success' as const,
          title: 'Backup Systems Tested',
          message: 'Emergency protocols successfully tested. All backup monitoring systems operational.',
          priority: 'low' as const,
          category: 'system' as const
        }
      ];

      // Generate recent alerts with realistic timing patterns
      const now = new Date();
      const alertCount = 35;

      for (let i = 0; i < alertCount; i++) {
        const template = comprehensiveAlertTemplates[i % comprehensiveAlertTemplates.length];
        const district = districts[Math.floor(Math.random() * districts.length)];
        const village = villages[Math.floor(Math.random() * villages.length)];
        const wellType = wellTypes[Math.floor(Math.random() * wellTypes.length)];
        
        // Create more realistic timestamps - more recent alerts
        let hoursAgo: number;
        if (i < 5) hoursAgo = Math.random() * 2; // Very recent
        else if (i < 15) hoursAgo = Math.random() * 24; // Today
        else if (i < 25) hoursAgo = 24 + Math.random() * 48; // Last 2 days  
        else hoursAgo = 72 + Math.random() * 120; // Last week

        const wellId = `GW${(1000 + i).toString()}`;
        const coordinates = `${(20 + Math.random() * 5).toFixed(4)}°N, ${(70 + Math.random() * 8).toFixed(4)}°E`;
        
        alerts.push({
          id: `alert-${i + 1}`,
          ...template,
          location: `${village} Village`,
          district: `${district} District`,
          timestamp: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
          isRead: Math.random() > 0.4, // 60% read
          source: `${wellType} ${wellId} (${coordinates})`
        });
      }

      return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setAlerts(generateMockAlerts());
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filterType !== 'all' && alert.type !== filterType) return false;
    if (filterDistrict !== 'all' && alert.district !== filterDistrict) return false;
    if (showOnlyUnread && alert.isRead) return false;
    return true;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.type === 'critical' && !alert.isRead).length;

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, isRead: true }))
    );
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'success': return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      default: return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>;
      default: return <Badge variant="secondary" className="text-xs">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            Real-time alerts and system notifications
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <BellOff className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">
                  {alerts.filter(alert => 
                    alert.timestamp.toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Settings */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Alert Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">District</label>
                  <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="All districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      <SelectItem value="Rajkot District">Rajkot District</SelectItem>
                      <SelectItem value="Ahmedabad District">Ahmedabad District</SelectItem>
                      <SelectItem value="Surat District">Surat District</SelectItem>
                      <SelectItem value="Vadodara District">Vadodara District</SelectItem>
                      <SelectItem value="Junagadh District">Junagadh District</SelectItem>
                      <SelectItem value="Bhavnagar District">Bhavnagar District</SelectItem>
                      <SelectItem value="Gandhinagar District">Gandhinagar District</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="unread-only"
                    checked={showOnlyUnread}
                    onCheckedChange={setShowOnlyUnread}
                  />
                  <label htmlFor="unread-only" className="text-sm font-medium">
                    Unread only
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="critical" className="text-sm font-medium">Critical Alerts</label>
                <Switch
                  id="critical"
                  checked={settings.criticalAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, criticalAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="warning" className="text-sm font-medium">Warning Alerts</label>
                <Switch
                  id="warning"
                  checked={settings.warningAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, warningAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="system" className="text-sm font-medium">System Updates</label>
                <Switch
                  id="system"
                  checked={settings.systemUpdates}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, systemUpdates: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="email" className="text-sm font-medium">Email Notifications</label>
                <Switch
                  id="email"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="sms" className="text-sm font-medium">SMS Notifications</label>
                <Switch
                  id="sms"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, smsNotifications: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No alerts match your filters</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    !alert.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium ${!alert.isRead ? 'text-blue-900' : ''}`}>
                            {alert.title}
                          </h4>
                          {!alert.isRead && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(alert.priority)}
                          {getAlertBadge(alert.type)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{alert.location}, {alert.district}</span>
                          </div>
                          <span>Source: {alert.source}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{alert.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!alert.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(alert.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};