import React, { useState } from 'react';
import { UserHome } from './UserHome';
import { UserDashboardMain } from './UserDashboardMain';
import { AIBotAssistant } from './AIBotAssistant';
import { CommunityForum } from './CommunityForum';
import { UserProfile } from './UserProfile';
import { OfflineStatus } from './OfflineStatus';
import { Button } from './ui/button';
import { 
  Home, 
  LayoutDashboard, 
  Bot, 
  Users, 
  User,
  Bell
} from 'lucide-react';

interface UserDashboardProps {
  onLogout: () => void;
  onRoleUpgrade?: () => void;
}

type TabType = 'home' | 'dashboard' | 'aibot' | 'community' | 'profile';

export const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, onRoleUpgrade }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Debug callback on mount
  React.useEffect(() => {
    console.log('UserDashboard mounted with onRoleUpgrade callback:', onRoleUpgrade);
  }, [onRoleUpgrade]);

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'aibot' as TabType, label: 'AI Bot', icon: Bot },
    { id: 'community' as TabType, label: 'Community', icon: Users },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <UserHome />;
      case 'dashboard':
        return <UserDashboardMain />;
      case 'aibot':
        return <AIBotAssistant />;
      case 'community':
        return <CommunityForum />;
      case 'profile':
        return <UserProfile onLogout={onLogout} onRoleUpgrade={onRoleUpgrade} />;
      default:
        return <UserHome />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden pb-20">
        {renderContent()}
      </div>

      {/* Offline Status Indicator */}
      <OfflineStatus />

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="px-4 pt-3 pb-safe">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center justify-center gap-1 p-3 rounded-xl min-h-[64px] min-w-[64px] transition-all duration-300 touch-manipulation
                    ${isActive 
                      ? 'text-primary bg-primary/15 scale-110 shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:scale-105'
                    }
                  `}
                >
                  <div className="relative">
                    <Icon className={`${isActive ? 'w-6 h-6' : 'w-5 h-5'} transition-all duration-300`} />
                  </div>
                  <span className={`text-xs font-medium leading-tight transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};