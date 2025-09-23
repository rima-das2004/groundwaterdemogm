import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  Bell, 
  Lightbulb, 
  Users, 
  BookOpen, 
  TrendingUp,
  Home,
  Droplets 
} from 'lucide-react';
import { Badge } from './ui/badge';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  notificationCount?: number;
}

export const Navigation: React.FC<NavigationProps> = React.memo(({ 
  activeSection, 
  onSectionChange, 
  notificationCount = 0 
}) => {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & Analytics'
    },
    {
      id: 'monitoring',
      label: 'Real-time Monitoring',
      icon: Droplets,
      description: 'Live Water Data'
    },
    {
      id: 'visualization',
      label: 'Data Visualization',
      icon: BarChart3,
      description: 'Charts & Graphs'
    },
    {
      id: 'maps',
      label: 'Interactive Maps',
      icon: MapPin,
      description: 'Geographic View'
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      description: 'Notifications',
      badge: notificationCount > 0 ? notificationCount : undefined
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: Lightbulb,
      description: 'Smart Insights'
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      description: 'Forums & Discussions'
    },
    {
      id: 'knowledge',
      label: 'Knowledge Hub',
      icon: BookOpen,
      description: 'Articles & Resources'
    },
    {
      id: 'reports',
      label: 'Progress Reports',
      icon: TrendingUp,
      description: 'Impact Tracking'
    }
  ];

  return (
    <nav className="bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary rounded-lg">
            <Droplets className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-lg truncate">AquaWatch</h2>
            <p className="text-sm text-muted-foreground truncate">Groundwater Monitor</p>
          </div>
        </div>

        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg transition-colors text-left touch-manipulation
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs opacity-75 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});