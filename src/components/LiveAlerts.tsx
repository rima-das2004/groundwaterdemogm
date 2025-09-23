import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  AlertTriangle, 
  CheckCircle,
  Bell,
  BellRing,
  Clock,
  MapPin,
  Droplets,
  X,
  Eye,
  TrendingDown,
  TrendingUp,
  Zap,
  ThermometerSun
} from 'lucide-react';
import { useNotifications } from './NotificationContext';

interface LiveAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  location: string;
  timestamp: Date;
  isLive?: boolean;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface LiveAlertsProps {
  maxVisible?: number;
  autoHide?: boolean;
  position?: 'top' | 'bottom';
  compact?: boolean;
}

export const LiveAlerts: React.FC<LiveAlertsProps> = ({ 
  maxVisible = 3, 
  autoHide = true,
  position = 'top',
  compact = false 
}) => {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const { addNotification } = useNotifications();

  // Simulate live alerts arriving
  useEffect(() => {
    const liveAlertTemplates = [
      {
        type: 'critical' as const,
        title: 'Critical Water Level',
        message: 'Borewell GW1089 at Morbi Village - water level dropped to 48.3m depth',
        location: 'Rajkot District'
      },
      {
        type: 'warning' as const,
        title: 'High TDS Alert',
        message: 'Water quality sensors detect TDS at 1,180 mg/L - approaching unsafe levels',
        location: 'Ahmedabad District'
      },
      {
        type: 'critical' as const,
        title: 'Sensor Offline',
        message: 'DWLR sensor at Tube Well GW1045 not responding for 45 minutes',
        location: 'Surat District'
      },
      {
        type: 'warning' as const,
        title: 'Rapid Depletion',
        message: 'Water level declined 1.2m in 6 hours at Community Well GW1067',
        location: 'Vadodara District'
      },
      {
        type: 'info' as const,
        title: 'Heavy Rainfall Detected',
        message: 'Monsoon activity: 45mm rainfall in last 2 hours - monitor recharge rates',
        location: 'Junagadh District'
      },
      {
        type: 'success' as const,
        title: 'System Restored',
        message: 'Telemetry connection re-established at Hand Pump GW1023',
        location: 'Bhavnagar District'
      },
      {
        type: 'warning' as const,
        title: 'Extreme Heat Warning',
        message: 'Temperature 47°C - expect increased evaporation rates across all monitoring points',
        location: 'Gandhinagar District'
      },
      {
        type: 'critical' as const,
        title: 'Contamination Alert',
        message: 'Nitrate levels at 58mg/L detected in agricultural area - immediate testing required',
        location: 'Rajkot District'
      }
    ];

    const generateAlert = () => {
      const template = liveAlertTemplates[Math.floor(Math.random() * liveAlertTemplates.length)];
      
      const newAlert: LiveAlert = {
        id: `live-alert-${Date.now()}`,
        ...template,
        timestamp: new Date(),
        isLive: true,
        dismissible: true,
        action: template.type === 'critical' ? {
          label: 'View Details',
          onClick: () => console.log('Opening detailed view...')
        } : undefined
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, maxVisible - 1)]);

      // Add to notification center
      addNotification({
        title: newAlert.title,
        message: newAlert.message,
        type: newAlert.type,
        location: newAlert.location,
        source: 'Live Monitoring System'
      });

      // Auto-hide after delay if enabled
      if (autoHide) {
        setTimeout(() => {
          setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, template.type === 'critical' ? 15000 : 8000); // Critical alerts stay longer
      }
    };

    // Generate initial alerts
    generateAlert();
    
    // Set up interval for new alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new alert every interval
        generateAlert();
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [maxVisible, autoHide]);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': 
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning': 
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'success': 
        return <CheckCircle className="h-5 w-5 text-success" />;
      default: 
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-destructive/50 bg-destructive/5 text-destructive-foreground';
      case 'warning':
        return 'border-warning/50 bg-warning/5 text-warning-foreground';
      case 'success':
        return 'border-success/50 bg-success/5 text-success-foreground';
      default:
        return 'border-primary/50 bg-primary/5 text-primary-foreground';
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} right-4 z-50 w-80 space-y-2`}>
      <AnimatePresence>
        {alerts.slice(0, maxVisible).map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className={`${getAlertColors(alert.type)} border-2 shadow-lg backdrop-blur-sm`}>
              <CardContent className={`${compact ? 'p-3' : 'p-4'} relative`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <motion.div
                      animate={alert.type === 'critical' ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {getAlertIcon(alert.type)}
                    </motion.div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      <div className="flex items-center space-x-1">
                        {alert.isLive && (
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </motion.div>
                        )}
                        {alert.dismissible && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            onClick={() => dismissAlert(alert.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {alert.message}
                    </p>
                    
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    {alert.action && (
                      <div className="pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={alert.action.onClick}
                        >
                          {alert.action.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Quick Alert Banner Component for Dashboard Headers
export const AlertBanner: React.FC = () => {
  const [currentAlert, setCurrentAlert] = useState<LiveAlert | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const criticalAlerts = [
      {
        id: 'banner-1',
        type: 'critical' as const,
        title: 'System-wide Alert',
        message: '5 monitoring stations in drought-affected areas showing critical water levels',
        location: 'Multiple Districts',
        timestamp: new Date()
      },
      {
        id: 'banner-2', 
        type: 'warning' as const,
        title: 'Regional Warning',
        message: 'Groundwater depletion rate 40% above seasonal average across central Gujarat',
        location: 'Central Region',
        timestamp: new Date()
      }
    ];

    // Show banner alert occasionally
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance
        const alert = criticalAlerts[Math.floor(Math.random() * criticalAlerts.length)];
        setCurrentAlert(alert);
        setIsVisible(true);
        
        setTimeout(() => setIsVisible(false), 10000); // Hide after 10 seconds
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!currentAlert || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="w-full"
    >
      <Alert className={`${getAlertColors(currentAlert.type)} border-l-4`}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="font-semibold">{currentAlert.title}:</span> {currentAlert.message}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="ml-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

const getAlertColors = (type: string) => {
  switch (type) {
    case 'critical':
      return 'border-destructive/50 bg-destructive/5';
    case 'warning':
      return 'border-warning/50 bg-warning/5';
    case 'success':
      return 'border-success/50 bg-success/5';
    default:
      return 'border-primary/50 bg-primary/5';
  }
};