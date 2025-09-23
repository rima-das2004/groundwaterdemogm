import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Siren,
  Phone,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  X,
  Volume2,
  VolumeX,
  MessageSquare,
  Mail,
  Shield,
  Zap
} from 'lucide-react';
import { useNotifications } from './NotificationContext';

interface EmergencyAlert {
  id: string;
  severity: 'emergency' | 'urgent' | 'high';
  title: string;
  description: string;
  location: {
    district: string;
    village: string;
    coordinates: string;
  };
  affectedPopulation: number;
  waterSources: string[];
  actionRequired: string[];
  contactInfo: {
    emergency: string;
    local: string;
    technical: string;
  };
  timestamp: Date;
  estimatedImpact: string;
  responseTeam?: string;
  isActive: boolean;
}

interface EmergencyAlertsProps {
  onAlertAction?: (alertId: string, action: string) => void;
}

export const EmergencyAlerts: React.FC<EmergencyAlertsProps> = ({ onAlertAction }) => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Simulate emergency alert scenarios
    const emergencyScenarios: Omit<EmergencyAlert, 'id' | 'timestamp' | 'isActive'>[] = [
      {
        severity: 'emergency',
        title: 'CRITICAL: Mass Groundwater Contamination',
        description: 'Heavy metal contamination detected across 15 wells serving 25,000+ residents. Lead levels at 0.15mg/L - 15x WHO safety limit.',
        location: {
          district: 'Rajkot',
          village: 'Morbi Industrial Area',
          coordinates: '22.8167°N, 70.8333°E'
        },
        affectedPopulation: 25000,
        waterSources: ['15 borewells', '8 community wells', '3 hand pumps'],
        actionRequired: [
          'STOP all water consumption immediately',
          'Distribute emergency water supplies',
          'Evacuate affected industrial area',
          'Deploy mobile water treatment units',
          'Conduct door-to-door health checks'
        ],
        contactInfo: {
          emergency: '108 (State Emergency)',
          local: '+91-281-247-8900 (District Collector)',
          technical: '+91-281-247-8901 (Water Engineer)'
        },
        estimatedImpact: 'Severe health risk - immediate action required',
        responseTeam: 'Emergency Response Team Alpha deployed'
      },
      {
        severity: 'urgent',
        title: 'URGENT: Acute Water Shortage - Drought Emergency',
        description: 'Zero groundwater availability in 45 villages. All major aquifers depleted below extractable levels.',
        location: {
          district: 'Kutch',
          village: 'Multiple villages in Abdasa Taluka',
          coordinates: '23.0000°N, 69.5000°E'
        },
        affectedPopulation: 75000,
        waterSources: ['127 borewells (dry)', '23 community wells (dry)', '15 hand pumps (non-functional)'],
        actionRequired: [
          'Deploy emergency water tankers',
          'Set up temporary reverse osmosis plants',
          'Implement strict water rationing',
          'Prepare for potential evacuation',
          'Coordinate with neighboring districts for water sharing'
        ],
        contactInfo: {
          emergency: '108 (State Emergency)',
          local: '+91-283-225-0001 (Kutch Collector)',
          technical: '+91-283-225-0002 (GWSSB Engineer)'
        },
        estimatedImpact: 'Population displacement likely within 72 hours',
        responseTeam: 'Disaster Management Team Bravo mobilized'
      },
      {
        severity: 'high',
        title: 'HIGH ALERT: Aquifer System Failure',
        description: 'Primary aquifer showing signs of structural collapse. Water levels dropped 25m in 48 hours across monitoring network.',
        location: {
          district: 'Mehsana',
          village: 'Visnagar and surrounding areas',
          coordinates: '23.7000°N, 72.5500°E'
        },
        affectedPopulation: 45000,
        waterSources: ['38 tube wells', '12 community wells', '8 industrial wells'],
        actionRequired: [
          'Immediate cessation of groundwater extraction',
          'Deploy geotechnical assessment team',
          'Install emergency monitoring sensors',
          'Establish alternative water supply routes',
          'Prepare contingency evacuation plans'
        ],
        contactInfo: {
          emergency: '108 (State Emergency)',
          local: '+91-276-252-3456 (District Emergency)',
          technical: '+91-276-252-3457 (Hydrogeologist)'
        },
        estimatedImpact: 'Infrastructure damage and long-term water security risk',
        responseTeam: 'Technical Assessment Team Charlie en route'
      }
    ];

    // Randomly trigger emergency alerts (for demo purposes)
    const interval = setInterval(() => {
      if (Math.random() > 0.95 && alerts.length < 2) { // 5% chance, max 2 active
        const scenario = emergencyScenarios[Math.floor(Math.random() * emergencyScenarios.length)];
        
        const newAlert: EmergencyAlert = {
          ...scenario,
          id: `emergency-${Date.now()}`,
          timestamp: new Date(),
          isActive: true
        };

        setAlerts(prev => [...prev, newAlert]);

        // Add to notification center
        addNotification({
          title: `🚨 EMERGENCY: ${newAlert.title}`,
          message: `${newAlert.affectedPopulation.toLocaleString()} people affected in ${newAlert.location.district}. ${newAlert.description.slice(0, 100)}...`,
          type: 'critical',
          location: `${newAlert.location.village}, ${newAlert.location.district}`,
          source: 'Emergency Response System'
        });

        // Auto-resolve after some time (demo purposes)
        setTimeout(() => {
          setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, 60000); // 1 minute for demo
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [alerts.length]);

  const handleAlertAction = (alertId: string, action: string) => {
    onAlertAction?.(alertId, action);
    
    // For demo - simulate action taken
    if (action === 'acknowledge') {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, responseTeam: `${alert.responseTeam} - Alert acknowledged by user` }
          : alert
      ));
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency':
        return 'border-red-600 bg-red-50 text-red-900';
      case 'urgent':
        return 'border-orange-500 bg-orange-50 text-orange-900';
      case 'high':
        return 'border-yellow-500 bg-yellow-50 text-yellow-900';
      default:
        return 'border-gray-400 bg-gray-50 text-gray-900';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'emergency':
        return <Siren className="h-6 w-6 text-red-600" />;
      case 'urgent':
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case 'high':
        return <Zap className="h-6 w-6 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-6 w-6" />;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <Shield className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-2 font-semibold text-green-700">No Active Emergencies</h3>
        <p className="text-sm text-muted-foreground">All systems operating normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alert Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-red-600 flex items-center space-x-2">
          <Siren className="h-5 w-5" />
          <span>EMERGENCY ALERTS</span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          
          <Badge variant="destructive" className="animate-pulse">
            {alerts.length} ACTIVE
          </Badge>
        </div>
      </div>

      {/* Emergency Alerts */}
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-2 ${getSeverityColor(alert.severity)} shadow-lg`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ 
                        scale: alert.severity === 'emergency' ? [1, 1.1, 1] : 1,
                        rotate: alert.severity === 'emergency' ? [0, 5, -5, 0] : 0 
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {getSeverityIcon(alert.severity)}
                    </motion.div>
                    
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <div className="flex items-center space-x-4 mt-1 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{alert.timestamp.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{alert.affectedPopulation.toLocaleString()} affected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="opacity-50 hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="font-medium">{alert.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Location Details</span>
                    </h4>
                    <div className="text-sm space-y-1">
                      <p><strong>District:</strong> {alert.location.district}</p>
                      <p><strong>Area:</strong> {alert.location.village}</p>
                      <p><strong>Coordinates:</strong> {alert.location.coordinates}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Affected Infrastructure</h4>
                    <div className="text-sm">
                      {alert.waterSources.map((source, index) => (
                        <p key={index}>• {source}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-red-700">IMMEDIATE ACTION REQUIRED:</h4>
                  <ul className="text-sm space-y-1">
                    {alert.actionRequired.map((action, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-3 gap-4 p-3 bg-white/50 rounded-lg">
                  <div>
                    <h5 className="font-semibold text-xs mb-1">EMERGENCY CONTACT</h5>
                    <p className="text-sm font-mono">{alert.contactInfo.emergency}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs mb-1">LOCAL AUTHORITY</h5>
                    <p className="text-sm font-mono">{alert.contactInfo.local}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs mb-1">TECHNICAL SUPPORT</h5>
                    <p className="text-sm font-mono">{alert.contactInfo.technical}</p>
                  </div>
                </div>

                {alert.responseTeam && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Response Status:</strong> {alert.responseTeam}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Acknowledge Alert
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleAlertAction(alert.id, 'contact_emergency')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Emergency
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleAlertAction(alert.id, 'notify_community')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Notify Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};