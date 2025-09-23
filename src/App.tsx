import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { NotificationProvider } from './components/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashScreen } from './components/SplashScreen';
import { UserTypeSelection } from './components/UserTypeSelection';
import { AdminOTPVerification } from './components/AdminOTPVerification';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { UserLandingPage } from './components/UserLandingPage';
import { UserDashboard } from './components/UserDashboard';
import { RoleUpgrade } from './components/RoleUpgrade';
import { RoleAuthentication } from './components/RoleAuthentication';
import { RoleLandingPage } from './components/RoleLandingPage';
import { UserRole } from './components/RoleUpgrade';

import { Loader2 } from 'lucide-react';

type AppFlow = 'splash' | 'userType' | 'adminOTP' | 'adminDashboard' | 'userAuth' | 'userLanding' | 'userApp' | 'roleUpgrade' | 'roleAuth' | 'roleLanding';
type UserType = 'admin' | 'user' | null;
type AuthMode = 'login' | 'register';

const AuthenticatedApp: React.FC = React.memo(() => {
  const { user, isLoading, isOfflineMode } = useAuth();
  const [currentFlow, setCurrentFlow] = useState<AppFlow>('splash');
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [forceShowApp, setForceShowApp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isRoleVerified, setIsRoleVerified] = useState(false);

  // Debug flow changes
  React.useEffect(() => {
    console.log('App flow changed to:', currentFlow);
  }, [currentFlow]);

  // Debug role upgrade callback
  const handleRoleUpgrade = React.useCallback(() => {
    console.log('Role upgrade callback triggered, changing flow to roleUpgrade');
    setCurrentFlow('roleUpgrade');
  }, []);

  // Force show app after 15 seconds if still loading
  React.useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.warn('Loading timeout reached, forcing app to show');
        setForceShowApp(true);
      }, 15000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (isLoading && !forceShowApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading AquaWatch...</p>
          <p className="mt-4 text-xs text-muted-foreground">
            Taking longer than usual? We'll continue in a moment...
          </p>
        </div>
      </div>
    );
  }



  // If user is logged in and verified as admin, show admin dashboard
  if (user && selectedUserType === 'admin' && isAdminVerified) {
    return (
      <AdminDashboard onLogout={() => {
        setCurrentFlow('splash');
        setSelectedUserType(null);
        setIsAdminVerified(false);
      }} />
    );
  }

  // If user is logged in as regular user, show appropriate screen
  if (user && selectedUserType === 'user' && !['roleUpgrade', 'roleAuth', 'roleLanding'].includes(currentFlow)) {
    // Show role landing page if user just completed role verification
    if (currentFlow === 'roleLanding' && selectedRole && isRoleVerified) {
      return (
        <RoleLandingPage 
          role={selectedRole}
          onContinue={() => setCurrentFlow('userApp')} 
        />
      );
    }
    
    // Show landing page first, then dashboard
    if (currentFlow === 'userAuth' || currentFlow === 'userLanding') {
      return (
        <UserLandingPage onContinue={() => setCurrentFlow('userApp')} />
      );
    }
    return (
      <UserDashboard 
        onLogout={() => {
          setCurrentFlow('splash');
          setSelectedUserType(null);
          setSelectedRole(null);
          setIsRoleVerified(false);
        }}
        onRoleUpgrade={handleRoleUpgrade}
      />
    );
  }

  // Handle different flows
  switch (currentFlow) {
    case 'splash':
      return (
        <SplashScreen 
          onGetStarted={() => setCurrentFlow('userType')} 
        />
      );

    case 'userType':
      return (
        <UserTypeSelection
          onSelectType={(type) => {
            setSelectedUserType(type);
            if (type === 'admin') {
              setCurrentFlow('adminOTP');
            } else {
              setCurrentFlow('userAuth');
            }
          }}
          onBack={() => setCurrentFlow('splash')}
        />
      );

    case 'adminOTP':
      return (
        <AdminOTPVerification
          onVerified={() => {
            setIsAdminVerified(true);
            setCurrentFlow('adminDashboard');
          }}
          onBack={() => {
            setSelectedUserType(null);
            setCurrentFlow('userType');
          }}
        />
      );

    case 'adminDashboard':
      return (
        <AdminDashboard 
          onLogout={() => {
            setCurrentFlow('splash');
            setSelectedUserType(null);
            setIsAdminVerified(false);
          }} 
        />
      );

    case 'userAuth':
      return (
        <>
          {authMode === 'login' ? (
            <LoginForm 
              onSwitchToRegister={() => setAuthMode('register')} 
              onBack={() => {
                setSelectedUserType(null);
                setCurrentFlow('userType');
              }}
            />
          ) : (
            <RegisterForm 
              onSwitchToLogin={() => setAuthMode('login')} 
              onBack={() => {
                setSelectedUserType(null);
                setCurrentFlow('userType');
              }}
            />
          )}
        </>
      );

    case 'userLanding':
      return (
        <UserLandingPage 
          onContinue={() => setCurrentFlow('userApp')} 
        />
      );

    case 'userApp':
      return (
        <UserDashboard 
          onLogout={() => {
            setCurrentFlow('splash');
            setSelectedUserType(null);
            setSelectedRole(null);
            setIsRoleVerified(false);
          }}
          onRoleUpgrade={handleRoleUpgrade}
        />
      );

    case 'roleUpgrade':
      return (
        <RoleUpgrade
          onSelectRole={(role) => {
            setSelectedRole(role);
            setCurrentFlow('roleAuth');
          }}
          onBack={() => setCurrentFlow('userApp')}
        />
      );

    case 'roleAuth':
      return (
        <RoleAuthentication
          role={selectedRole!}
          onVerified={() => {
            setIsRoleVerified(true);
            setCurrentFlow('roleLanding');
          }}
          onBack={() => {
            setSelectedRole(null);
            setCurrentFlow('roleUpgrade');
          }}
        />
      );

    case 'roleLanding':
      return (
        <RoleLandingPage
          role={selectedRole!}
          onContinue={() => setCurrentFlow('userApp')}
        />
      );

    default:
      return (
        <SplashScreen 
          onGetStarted={() => setCurrentFlow('userType')} 
        />
      );
  }
});

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <AuthenticatedApp />
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}