// AquaWatch Login Form - Enhanced with Forgot Password and Backend Integration
// Secure login with Aadhar-verified accounts and password recovery

import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Loader2, ArrowLeft, LogIn, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { WaterDropletBackground } from './WaterDropletBackground'

interface LoginFormProps {
  onSwitchToRegister: () => void
  onBack?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onBack }) => {
  const { login, forgotPassword, isLoading, isOfflineMode } = useAuth()
  
  // Login form state
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Forgot password state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'success'>('email')
  const [resetToken, setResetToken] = useState<string>('')

  // Validate login form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      console.log('Attempting login with backend authentication')
      const success = await login(formData.emailOrPhone, formData.password)
      
      if (!success) {
        setErrors({ 
          general: 'Invalid email/phone or password. Please check your credentials and try again.' 
        })
      }
    } catch (error) {
      console.error('Login submission error:', error)
      setErrors({ 
        general: 'Login failed. Please check your connection and try again.' 
      })
    }
  }

  // Handle input changes and clear errors
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
    if (errors.general) {
      setErrors({ ...errors, general: '' })
    }
  }

  // Handle forgot password submission
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!forgotPasswordEmail.trim()) {
      toast.error('Please enter your email address')
      return
    }

    if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setForgotPasswordLoading(true)
      console.log('Processing forgot password request')
      
      const result = await forgotPassword(forgotPasswordEmail)
      
      if (result.success) {
        setForgotPasswordStep('success')
        // Store reset token for demo purposes (in production, this would be sent via email)
        if (result.resetToken) {
          setResetToken(result.resetToken)
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  // Reset forgot password form
  const resetForgotPasswordForm = () => {
    setForgotPasswordOpen(false)
    setForgotPasswordEmail('')
    setForgotPasswordStep('email')
    setResetToken('')
    setForgotPasswordLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col p-4 relative">
      {/* Water Droplet Background */}
      <WaterDropletBackground intensity="medium" dropletCount={50} />
      
      {/* Header with back button */}
      {onBack && (
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Sign In</h1>
        </div>
      )}

      {/* Main login form */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto relative z-10 backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue monitoring groundwater levels
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General error alert */}
              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Email/Phone input */}
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
                <Input
                  id="emailOrPhone"
                  type="text"
                  value={formData.emailOrPhone}
                  onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
                  placeholder="Enter your email or phone number"
                  className={errors.emailOrPhone ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.emailOrPhone && (
                  <p className="text-sm text-destructive">{errors.emailOrPhone}</p>
                )}
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                    <DialogTrigger asChild>
                      <Button variant="link" size="sm" className="px-0 h-auto">
                        Forgot password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          {forgotPasswordStep === 'email' 
                            ? "Enter your email address and we'll send you a reset link."
                            : "Password reset instructions have been sent to your email."
                          }
                        </DialogDescription>
                      </DialogHeader>
                      
                      {forgotPasswordStep === 'email' ? (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="resetEmail">Email Address</Label>
                            <Input
                              id="resetEmail"
                              type="email"
                              value={forgotPasswordEmail}
                              onChange={(e) => setForgotPasswordEmail(e.target.value)}
                              placeholder="Enter your email address"
                              disabled={forgotPasswordLoading}
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={resetForgotPasswordForm}
                              disabled={forgotPasswordLoading}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={forgotPasswordLoading}
                              className="flex-1"
                            >
                              {forgotPasswordLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Reset Link
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span>Reset instructions sent!</span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            Please check your email for password reset instructions. The link will expire in 15 minutes.
                          </p>
                          
                          {/* Demo mode: Show reset token */}
                          {resetToken && (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Demo Mode:</strong> Your reset token is: <code className="bg-muted px-1 rounded">{resetToken}</code>
                                <br />
                                <small>In production, this would be sent to your email.</small>
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <Button
                            onClick={resetForgotPasswordForm}
                            className="w-full"
                          >
                            Done
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={errors.password ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Offline mode demo accounts */}
            {isOfflineMode && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Demo Mode Active</strong>
                  <br />
                  Try these demo accounts:
                  <br />
                  <small>
                    • <strong>Farmer:</strong> rajesh.kumar@example.com / password123
                    <br />
                    • <strong>Household:</strong> priya.sharma@example.com / password123
                    <br />
                    • <strong>Researcher:</strong> ankit.mehta@research.com / password123
                  </small>
                </AlertDescription>
              </Alert>
            )}

            {/* Registration link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Create one
                </button>
              </p>
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  )
}

console.log('AquaWatch LoginForm loaded with enhanced security and forgot password feature')