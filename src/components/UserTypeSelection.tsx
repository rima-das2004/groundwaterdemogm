import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Shield, Users, ArrowLeft } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelectType: (type: 'admin' | 'user') => void;
  onBack: () => void;
}

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelectType, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Choose Your Role</h1>
      </div>

      {/* User Type Cards */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-6">
        
        {/* Admin Card */}
        <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer group"
              onClick={() => onSelectType('admin')}>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3 text-foreground">Admin</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Access comprehensive analytics, manage user data, and oversee groundwater monitoring systems across regions.
            </p>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>System Management</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Advanced Analytics</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>User Management</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Card */}
        <Card className="border-2 border-border hover:border-secondary/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer group"
              onClick={() => onSelectType('user')}>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-secondary/25 transition-all duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3 text-foreground">User</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Monitor local groundwater levels, receive personalized recommendations, and contribute to community insights.
            </p>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                <span>Personal Dashboard</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                <span>Smart Recommendations</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                <span>Community Features</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          You can upgrade your account type later in settings
        </p>
      </div>
    </div>
  );
};