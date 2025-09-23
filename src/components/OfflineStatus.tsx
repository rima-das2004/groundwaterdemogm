import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  WifiOff, 
  Wifi, 
  Server, 
  Play, 
  Terminal, 
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { checkNetworkConnectivity } from '../utils/api';
import { toast } from 'sonner';

export const OfflineStatus: React.FC = () => {
  const { isOfflineMode } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const isOnline = await checkNetworkConnectivity();
      if (isOnline) {
        toast.success('Backend is now available! Please refresh the page.');
      } else {
        toast.info('Backend is still unavailable. Using demo mode.');
      }
    } catch (error) {
      toast.error('Unable to check connection status.');
    } finally {
      setIsChecking(false);
    }
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success('Command copied to clipboard!');
  };

  if (!isOfflineMode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-warning bg-warning/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 text-warning" />
              <CardTitle className="text-sm">Demo Mode</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Backend Offline
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 space-y-3">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                The backend server is not running. You're using demo mode with sample data.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-xs font-medium">To start the backend:</p>
              
              <div className="space-y-2">
                <div className="bg-muted p-2 rounded text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span>cd backend</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCommand('cd backend')}
                      className="h-4 w-4 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted p-2 rounded text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span>npm install</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCommand('npm install')}
                      className="h-4 w-4 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted p-2 rounded text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span>npm run dev</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCommand('npm run dev')}
                      className="h-4 w-4 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium">Demo Accounts:</p>
              <div className="space-y-1 text-xs">
                <div className="bg-muted p-2 rounded">
                  <p><strong>Farmer:</strong> rajesh.kumar@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p><strong>Household:</strong> priya.sharma@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={checkConnection} 
              disabled={isChecking}
              size="sm"
              className="w-full text-xs"
            >
              {isChecking ? (
                <>
                  <Server className="w-3 h-3 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 mr-2" />
                  Check Connection
                </>
              )}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};