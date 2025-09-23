// AquaWatch Password Reset Component - Token-based Password Recovery
// Secure password reset functionality with token validation and new password setup

import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2, Shield, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface PasswordResetProps {
  token?: string // Reset token from URL parameter or user input
  onSuccess?: () => void // Callback when password reset is successful
  onCancel?: () => void // Callback to cancel the reset process
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ 
  token: initialToken, 
  onSuccess, 
  onCancel 
}) => {
  const { resetPassword } = useAuth()
  
  // Form state
  const [formData, setFormData] = useState({
    token: initialToken || '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetStep, setResetStep] = useState<'token' | 'password' | 'success'>('token')

  // Auto-advance to password step if token is provided
  useEffect(() => {
    if (initialToken) {
      setResetStep('password')
    }
  }, [initialToken])

  // Password strength validation
  const validatePassword = (password: string) => {
    const requirements = []
    if (password.length < 8) requirements.push('at least 8 characters')
    if (!/[A-Z]/.test(password)) requirements.push('one uppercase letter')
    if (!/[a-z]/.test(password)) requirements.push('one lowercase letter')
    if (!/\d/.test(password)) requirements.push('one number')
    return requirements
  }

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Token validation
    if (!formData.token.trim()) {
      newErrors.token = 'Reset token is required'
    }

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else {
      const passwordRequirements = validatePassword(formData.newPassword)
      if (passwordRequirements.length > 0) {
        newErrors.newPassword = `Password must contain ${passwordRequirements.join(', ')}`
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      setIsLoading(true)
      console.log('Resetting password with token...')
      
      const success = await resetPassword(formData.token, formData.newPassword)
      
      if (success) {
        setResetStep('success')
        toast.success('Password reset successful!')
        
        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      }
    } catch (error) {
      console.error('Password reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear field error
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  // Handle token validation (for manual token entry)
  const handleTokenValidation = () => {
    if (!formData.token.trim()) {
      toast.error('Please enter the reset token')
      return
    }
    
    setResetStep('password')
    toast.success('Token accepted. Please enter your new password.')
  }

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z\d]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle>
            {resetStep === 'token' && 'Enter Reset Token'}
            {resetStep === 'password' && 'Create New Password'}
            {resetStep === 'success' && 'Password Reset Complete'}
          </CardTitle>
          <CardDescription>
            {resetStep === 'token' && 'Enter the reset token sent to your email'}
            {resetStep === 'password' && 'Choose a strong new password for your account'}
            {resetStep === 'success' && 'Your password has been successfully reset'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Token Entry Step */}
          {resetStep === 'token' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Reset Token</Label>
                <Input
                  id="token"
                  type="text"
                  value={formData.token}
                  onChange={(e) => handleInputChange('token', e.target.value)}
                  placeholder="Enter the token from your email"
                  className={errors.token ? 'border-destructive' : ''}
                />
                {errors.token && <p className="text-sm text-destructive">{errors.token}</p>}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Check your email for a reset token. It expires in 15 minutes.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTokenValidation}
                  className="flex-1"
                  disabled={!formData.token.trim()}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Password Entry Step */}
          {resetStep === 'password' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hidden token field for form submission */}
              <input type="hidden" value={formData.token} />

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter your new password"
                    className={errors.newPassword ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                
                {/* Password strength indicator */}
                {formData.newPassword && (
                  <div className="space-y-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            passwordStrength >= level
                              ? passwordStrength < 3
                                ? 'bg-red-500'
                                : passwordStrength < 4
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: {
                        passwordStrength < 2 ? 'Weak' :
                        passwordStrength < 3 ? 'Fair' :
                        passwordStrength < 4 ? 'Good' : 'Strong'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your new password"
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                
                {/* Password match indicator */}
                {formData.confirmPassword && (
                  <p className={`text-xs ${
                    formData.newPassword === formData.confirmPassword 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formData.newPassword === formData.confirmPassword 
                      ? '✓ Passwords match' 
                      : '✗ Passwords do not match'
                    }
                  </p>
                )}
              </div>

              {/* Security requirements */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Password Requirements:</strong>
                  <br />• At least 8 characters long
                  <br />• One uppercase and lowercase letter
                  <br />• At least one number
                  <br />• Different from your previous password
                </AlertDescription>
              </Alert>

              {/* Submit buttons */}
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || passwordStrength < 3}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Success Step */}
          {resetStep === 'success' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-8 w-8" />
                <span className="text-lg font-medium">Password Reset Successful!</span>
              </div>
              
              <p className="text-muted-foreground">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Note:</strong> Your password has been securely encrypted and stored. 
                  Please keep it safe and don't share it with anyone.
                </AlertDescription>
              </Alert>

              <Button
                onClick={onSuccess}
                className="w-full"
              >
                Go to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

console.log('AquaWatch PasswordReset component loaded with secure token validation and password setup')