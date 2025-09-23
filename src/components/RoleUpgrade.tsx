import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Microscope, Users, Sprout, MoreHorizontal, Star, CheckCircle } from 'lucide-react';
import { WaterDropletBackground } from './WaterDropletBackground';

export type UserRole = 'researcher' | 'policymaker' | 'farmer' | 'others';

interface RoleUpgradeProps {
  onSelectRole: (role: UserRole) => void;
  onBack: () => void;
}

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

export const RoleUpgrade: React.FC<RoleUpgradeProps> = ({ onSelectRole, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roleOptions: RoleOption[] = [
    {
      id: 'researcher',
      title: 'Researcher',
      description: 'Access advanced analytics, research tools, and downloadable datasets',
      features: [
        'Download complete datasets',
        'Advanced statistical analysis',
        'Research collaboration tools',
        'Custom report generation',
        'API access for data integration'
      ],
      icon: <Microscope className="w-8 h-8" />,
      color: 'text-blue-600',
      badge: 'Most Popular'
    },
    {
      id: 'policymaker',
      title: 'Policymaker',
      description: 'Strategic insights, policy recommendations, and regional analytics',
      features: [
        'Policy impact assessments',
        'Regional trend analysis',
        'Regulatory compliance tools',
        'Stakeholder reports',
        'Government data integration'
      ],
      icon: <Users className="w-8 h-8" />,
      color: 'text-purple-600'
    },
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Crop-specific recommendations, irrigation planning, and local insights',
      features: [
        'Crop-specific water needs',
        'Irrigation optimization',
        'Weather-based alerts',
        'Local groundwater trends',
        'Agricultural best practices'
      ],
      icon: <Sprout className="w-8 h-8" />,
      color: 'text-green-600'
    },
    {
      id: 'others',
      title: 'Others',
      description: 'Custom role for specialized use cases and emerging needs',
      features: [
        'Custom feature requests',
        'Specialized analytics',
        'Priority support',
        'Beta feature access',
        'Dedicated consultation'
      ],
      icon: <MoreHorizontal className="w-8 h-8" />,
      color: 'text-gray-600'
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      <WaterDropletBackground intensity="light" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Upgrade Your Profile</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Choose a specialized role to unlock advanced features tailored to your needs
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection Grid */}
        <div className="flex-1 px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {roleOptions.map((role) => (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedRole === role.id 
                    ? 'ring-2 ring-primary shadow-lg scale-[1.02]' 
                    : 'hover:scale-[1.01]'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${role.color} p-2 rounded-lg bg-muted/50`}>
                        {role.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.title}</CardTitle>
                        {role.badge && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            {role.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {selectedRole === role.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <CardDescription className="mt-2 text-sm">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground mb-3">Key Features:</h4>
                    <ul className="space-y-1.5">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Button */}
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleContinue}
              disabled={!selectedRole}
              size="lg"
              className="px-8 py-3 text-base"
            >
              Continue with {selectedRole ? roleOptions.find(r => r.id === selectedRole)?.title : 'Selected Role'}
            </Button>
          </div>

          {/* Info Notice */}
          <div className="mt-6 max-w-2xl mx-auto">
            <Card className="bg-muted/50 border-muted">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Verification Required:</strong> Each role requires specific verification 
                      to ensure authentic use and maintain data integrity. The verification process 
                      is quick and helps us provide you with the most relevant tools and insights.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleUpgrade;