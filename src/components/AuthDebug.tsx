import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { tokenUtils } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Trash2, RefreshCw } from 'lucide-react';

export const AuthDebug: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authData, setAuthData] = useState<any>({});

  useEffect(() => {
    const updateAuthData = () => {
      setAuthData({
        hasToken: !!tokenUtils.getToken(),
        token: tokenUtils.getToken(),
        hasStoredUser: !!tokenUtils.getStoredUser(),
        storedUser: tokenUtils.getStoredUser(),
        isAuthenticated: tokenUtils.isAuthenticated(),
        localStorage: {
          authToken: localStorage.getItem('authToken'),
          user: localStorage.getItem('user'),
          users: localStorage.getItem('users')
        }
      });
    };

    updateAuthData();
    const interval = setInterval(updateAuthData, 1000);
    return () => clearInterval(interval);
  }, []);

  const clearAllAuth = () => {
    tokenUtils.clearAuthData();
    localStorage.removeItem('users');
    window.location.reload();
  };

  const clearAuthToken = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="bg-background">
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            Auth Debug
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Card className="w-80 max-h-96 overflow-y-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Authentication Status
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearAuthToken}>
                    Clear Token
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearAllAuth}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span>Loading:</span>
                <Badge variant={isLoading ? "default" : "secondary"}>
                  {isLoading ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>User:</span>
                <Badge variant={user ? "default" : "secondary"}>
                  {user ? "Logged In" : "Not Logged In"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Has Token:</span>
                <Badge variant={authData.hasToken ? "default" : "secondary"}>
                  {authData.hasToken ? "Yes" : "No"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Token Type:</span>
                <Badge variant="outline">
                  {authData.token?.startsWith('mock-token-') ? "Mock" : 
                   authData.token ? "Real" : "None"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Stored User:</span>
                <Badge variant={authData.hasStoredUser ? "default" : "secondary"}>
                  {authData.hasStoredUser ? "Yes" : "No"}
                </Badge>
              </div>

              {user && (
                <div className="mt-3 p-2 bg-muted rounded text-xs">
                  <div><strong>Name:</strong> {user.name}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Type:</strong> {user.userType}</div>
                </div>
              )}

              {authData.token && (
                <div className="mt-3 p-2 bg-muted rounded text-xs">
                  <strong>Token:</strong>
                  <div className="break-all">
                    {authData.token.substring(0, 50)}...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AuthDebug;