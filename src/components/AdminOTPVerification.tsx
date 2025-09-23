import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { ArrowLeft, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AdminOTPVerificationProps {
  onVerified: () => void;
  onBack: () => void;
}

export const AdminOTPVerification: React.FC<AdminOTPVerificationProps> = ({ onVerified, onBack }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Mock OTP for demo purposes
  const DEMO_OTP = '123456';

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otp === DEMO_OTP) {
      toast.success('Admin verification successful');
      onVerified();
    } else {
      toast.error('Invalid OTP. Please try again.');
      setOtp('');
    }
    
    setIsLoading(false);
  };

  const handleResend = () => {
    setTimeLeft(60);
    setCanResend(false);
    toast.success('OTP resent successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Admin Verification</h1>
      </div>

      {/* OTP Card */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <Card className="border-2 border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">Enter Verification Code</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              We've sent a 6-digit code to your registered admin email
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Demo Info */}
            <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-primary">
              <p className="text-xs text-muted-foreground">
                <strong>Demo:</strong> Use OTP <span className="font-mono font-semibold">123456</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
                className="w-full justify-center"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Timer and Resend */}
            <div className="text-center">
              {!canResend ? (
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Resend code in {timeLeft}s</span>
                </div>
              ) : (
                <Button variant="link" onClick={handleResend} className="text-sm p-0 h-auto">
                  Resend verification code
                </Button>
              )}
            </div>

            {/* Verify Button */}
            <Button 
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Having trouble? Contact system administrator
        </p>
      </div>
    </div>
  );
};