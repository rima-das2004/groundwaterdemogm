// AquaWatch Change Password Component - Secure Password Management for Authenticated Users
// Allows logged-in users to change their passwords with current password verification

import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Loader2, Shield, CheckCircle, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface ChangePasswordProps {
  onSuccess?: () => void // Callback when password change is successful
  onCancel?: () => void // Callback to cancel the change process
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ onSuccess, onCancel }) => {
  const { changePassword, user } = useAuth()
  
  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

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

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else {
      const passwordRequirements = validatePassword(formData.newPassword)
      if (passwordRequirements.length > 0) {
        newErrors.newPassword = `Password must contain ${passwordRequirements.join(', ')}`
      } else if (formData.newPassword === formData.currentPassword) {
        newErrors.newPassword = 'New password must be different from current password'
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
      console.log('Changing password for user:', user?.email)
      
      const success = await changePassword(formData.currentPassword, formData.newPassword)
      
      if (success) {
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setErrors({})
        setShowSuccessDialog(true)
        
        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess?.()
        }, 3000)
      }
    } catch (error) {
      console.error('Change password error:', error)
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

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
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
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password for enhanced security
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User info */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Changing password for: <strong>{user?.email}</strong>
              </p>
            </div>

            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Enter your current password"
                  className={errors.currentPassword ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
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
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
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
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                <br />• Different from your current password
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
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </form>

          {/* Security tips */}
          <div className="mt-6 pt-4 border-t">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Tips:</strong>
                <br />• Use a unique password for your AquaWatch account
                <br />• Consider using a password manager
                <br />• Change your password regularly
                <br />• Never share your password with anyone
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Password Changed Successfully!</span>
            </DialogTitle>
            <DialogDescription>
              Your password has been updated successfully. Your account is now more secure.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Update:</strong> Your password has been encrypted and securely stored. 
                All active sessions remain valid.
              </AlertDescription>
            </Alert>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Password change completed</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Updated on: {new Date().toLocaleString()}
              </p>
            </div>

            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                onSuccess?.()
              }}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

console.log('AquaWatch ChangePassword component loaded with secure password management features')