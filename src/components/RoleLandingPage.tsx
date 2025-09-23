import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  Download, 
  BarChart3, 
  Users, 
  FileText, 
  Zap,
  Microscope,
  Building,
  Sprout,
  TrendingUp,
  Shield,
  Droplets,
  Leaf,
  Cloud,
  Calendar,
  MapPin,
  Bell
} from 'lucide-react';
import { WaterDropletBackground } from './WaterDropletBackground';
import { UserRole } from './RoleUpgrade';

interface RoleLandingPageProps {
  role: UserRole;
  onContinue: () => void;
}

export const RoleLandingPage: React.FC<RoleLandingPageProps> = ({ role, onContinue }) => {
  const roleConfig = {
    researcher: {
      title: 'Welcome, Researcher!',
      subtitle: 'Your research toolkit is now activated',
      icon: <Microscope className="w-8 h-8 text-blue-600" />,
      color: 'blue',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      features: [
        {
          icon: <Download className="w-5 h-5" />,
          title: 'Download Datasets',
          description: 'Access complete groundwater datasets in CSV, JSON, or XML formats'
        },
        {
          icon: <BarChart3 className="w-5 h-5" />,
          title: 'Advanced Analytics',
          description: 'Statistical analysis tools with trend prediction and correlation studies'
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: 'Research Reports',
          description: 'Generate comprehensive reports with citations and methodology'
        },
        {
          icon: <Zap className="w-5 h-5" />,
          title: 'API Access',
          description: 'Direct API access for data integration with your research tools'
        }
      ],
      quickActions: [
        'Download Latest Dataset',
        'View Research Dashboard', 
        'Generate Analysis Report',
        'Access API Documentation'
      ]
    },
    policymaker: {
      title: 'Welcome, Policymaker!',
      subtitle: 'Your policy insights platform is ready',
      icon: <Building className="w-8 h-8 text-purple-600" />,
      color: 'purple',
      gradient: 'from-purple-500/20 to-indigo-500/20',
      features: [
        {
          icon: <TrendingUp className="w-5 h-5" />,
          title: 'Policy Impact Analysis',
          description: 'Assess the impact of water policies on groundwater levels and sustainability'
        },
        {
          icon: <Users className="w-5 h-5" />,
          title: 'Regional Insights',
          description: 'Comprehensive regional analysis with demographic and usage patterns'
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: 'Compliance Monitoring',
          description: 'Track regulatory compliance and identify areas needing intervention'
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: 'Stakeholder Reports',
          description: 'Generate reports for government stakeholders and public disclosure'
        }
      ],
      quickActions: [
        'View Regional Dashboard',
        'Generate Policy Report',
        'Monitor Compliance Status',
        'Access Government Data'
      ]
    },
    farmer: {
      title: 'Welcome, Farmer!',
      subtitle: 'Your agricultural water management tools are active',
      icon: <Sprout className="w-8 h-8 text-green-600" />,
      color: 'green',
      gradient: 'from-green-500/20 to-emerald-500/20',
      features: [
        {
          icon: <Droplets className="w-5 h-5" />,
          title: 'Irrigation Optimization',
          description: 'Smart irrigation recommendations based on groundwater levels and weather'
        },
        {
          icon: <Leaf className="w-5 h-5" />,
          title: 'Crop-Specific Insights',
          description: 'Water requirements and recommendations tailored to your specific crops'
        },
        {
          icon: <Cloud className="w-5 h-5" />,
          title: 'Weather Integration',
          description: 'Real-time weather data integration for optimal farming decisions'
        },
        {
          icon: <Bell className="w-5 h-5" />,
          title: 'Smart Alerts',
          description: 'Receive alerts about optimal irrigation times and water conservation tips'
        }
      ],
      quickActions: [
        'Check Water Levels',
        'View Irrigation Schedule',
        'Get Crop Recommendations',
        'Set Weather Alerts'
      ]
    },
    others: {
      title: 'Welcome!',
      subtitle: 'Your specialized features are being prepared',
      icon: <Zap className="w-8 h-8 text-gray-600" />,
      color: 'gray',
      gradient: 'from-gray-500/20 to-slate-500/20',
      features: [
        {
          icon: <Calendar className="w-5 h-5" />,
          title: 'Custom Analytics',
          description: 'Specialized analytics tools tailored to your unique requirements'
        },
        {
          icon: <MapPin className="w-5 h-5" />,
          title: 'Location-Based Insights',
          description: 'Geospatial analysis and location-specific groundwater insights'
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: 'Custom Reports',
          description: 'Generate reports based on your specific use case and requirements'
        },
        {
          icon: <Users className="w-5 h-5" />,
          title: 'Priority Support',
          description: 'Dedicated support for your specialized groundwater monitoring needs'
        }
      ],
      quickActions: [
        'Explore General Features',
        'Contact Support',
        'Request Custom Features',
        'View Documentation'
      ]
    }
  };

  const config = roleConfig[role];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.gradient} relative overflow-hidden`}>
      <WaterDropletBackground intensity="light" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <div className="text-6xl mb-4">🎉</div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {config.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {config.subtitle}
            </p>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <span className="flex items-center space-x-2">
                {config.icon}
                <span>{role.charAt(0).toUpperCase() + role.slice(1)} Account Verified</span>
              </span>
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="flex-1 px-4 sm:px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-center mb-6">
                Your New Capabilities
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.features.map((feature, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${config.color}-100 text-${config.color}-600`}>
                          {feature.icon}
                        </div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Quick Actions</CardTitle>
                  <CardDescription className="text-center">
                    Get started with these commonly used features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.quickActions.map((action, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="justify-start h-auto py-3 px-4"
                        onClick={() => {
                          // Handle quick action click
                          console.log(`Quick action: ${action}`);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-sm">{action}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <Button 
                onClick={onContinue}
                size="lg"
                className="px-8 py-3 text-base"
              >
                Continue to Dashboard
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <Card className="bg-muted/50 border-muted max-w-2xl mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">
                        <strong>Your account has been successfully upgraded!</strong> You now have access to 
                        specialized tools and features designed for your role. Explore your new capabilities 
                        and make the most of AquaWatch's advanced groundwater monitoring platform.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLandingPage;