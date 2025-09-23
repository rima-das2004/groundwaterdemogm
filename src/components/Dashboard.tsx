import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Navigation } from './Navigation';
import { GroundwaterDashboard } from './GroundwaterDashboard';
import { RealtimeMonitoring } from './RealtimeMonitoring';
import { AlertsNotifications } from './AlertsNotifications';
import { SmartRecommendations } from './SmartRecommendations';
import { 
  LogOut, 
  User, 
  Settings,
  Menu,
  X
} from 'lucide-react';

// Placeholder components for sections not yet implemented
const DataVisualization: React.FC = () => (
  <div className="space-y-6">
    <h1>Data Visualization</h1>
    <p className="text-muted-foreground">Interactive charts and graphs coming soon...</p>
  </div>
);

const InteractiveMaps: React.FC = () => (
  <div className="space-y-6">
    <h1>Interactive Maps</h1>
    <p className="text-muted-foreground">Geographic visualization coming soon...</p>
  </div>
);

const Community: React.FC = () => (
  <div className="space-y-6">
    <h1>Community Forums</h1>
    <p className="text-muted-foreground">Discussion forums coming soon...</p>
  </div>
);

const KnowledgeHub: React.FC = () => (
  <div className="space-y-6">
    <h1>Knowledge Hub</h1>
    <p className="text-muted-foreground">Articles and resources coming soon...</p>
  </div>
);

const ProgressReports: React.FC = () => (
  <div className="space-y-6">
    <h1>Progress Reports</h1>
    <p className="text-muted-foreground">Impact tracking coming soon...</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notificationCount] = useState(5); // Mock notification count
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when section changes on mobile
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <GroundwaterDashboard />;
      case 'monitoring':
        return <RealtimeMonitoring />;
      case 'visualization':
        return <DataVisualization />;
      case 'maps':
        return <InteractiveMaps />;
      case 'alerts':
        return <AlertsNotifications />;
      case 'recommendations':
        return <SmartRecommendations />;
      case 'community':
        return <Community />;
      case 'knowledge':
        return <KnowledgeHub />;
      case 'reports':
        return <ProgressReports />;
      default:
        return <GroundwaterDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        w-64 h-full border-r border-border bg-card transition-transform duration-300 ease-in-out z-50
        ${isMobile ? 'top-0 left-0' : ''}
      `}>
        <Navigation 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          notificationCount={notificationCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="border-b border-border bg-card px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden"
                >
                  {isSidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              )}
              
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold truncate">Welcome back, {user.name}</h2>
                <p className="text-sm text-muted-foreground truncate">
                  {user.location?.address || 'Location not set'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <User className="h-4 w-4" />
              </Button>
              
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};