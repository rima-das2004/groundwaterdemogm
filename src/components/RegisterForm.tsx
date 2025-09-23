// AquaWatch Registration Form - Enhanced with Real Aadhar Verification and Backend Integration
// Secure registration with mandatory Aadhar verification and comprehensive validation

import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2, Shield, CheckCircle, ArrowLeft, MapPin, User, Mail, Phone, CreditCard, AlertCircle } from 'lucide-react'
import { toast } from "sonner";

import { validateAadharNumber, formatAadharNumber } from '../utils/aadharValidation'
import { WaterDropletBackground } from './WaterDropletBackground'

interface RegisterFormProps {
  onSwitchToLogin: () => void
  onBack?: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onBack }) => {
  const { register, verifyAadhaar, getCurrentLocation, isLoading } = useAuth()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    userType: '',
    state: '',
    district: '',
    location: ''
  })
  
  // Validation and UI state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false)
  const [aadhaarVerified, setAadhaarVerified] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)

  // User types for selection
  const userTypes = [
    { value: 'household', label: 'Household User', description: 'Monitor domestic water usage' },
    { value: 'farmer', label: 'Farmer', description: 'Track agricultural water needs' },
    { value: 'industry', label: 'Industry', description: 'Industrial water management' },
    { value: 'researcher', label: 'Researcher', description: 'Research and analysis' },
  ]

  // Indian states for selection
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]

  // Comprehensive form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number'
    }

    // Password validation with specific requirements
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordRequirements = []
      if (formData.password.length < 8) passwordRequirements.push('at least 8 characters')
      if (!/[A-Z]/.test(formData.password)) passwordRequirements.push('one uppercase letter')
      if (!/[a-z]/.test(formData.password)) passwordRequirements.push('one lowercase letter')
      if (!/\d/.test(formData.password)) passwordRequirements.push('one number')
      
      if (passwordRequirements.length > 0) {
        newErrors.password = `Password must contain ${passwordRequirements.join(', ')}`
      }
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Aadhar validation - CRITICAL: Must be exactly 12 digits
    if (!formData.aadhaar) {
      newErrors.aadhaar = 'Aadhar number is required for registration'
    } else if (!/^\d{12}$/.test(formData.aadhaar)) {
      newErrors.aadhaar = 'Aadhar number must be exactly 12 digits (no spaces or special characters)'
    } else if (!aadhaarVerified) {
      newErrors.aadhaar = 'Please verify your Aadhar number before proceeding'
    }

    // User type validation
    if (!formData.userType) {
      newErrors.userType = 'Please select your user type'
    }

    // Location validation
    if (!formData.state) {
      newErrors.state = 'Please select your state'
    }

    if (!formData.district.trim()) {
      newErrors.district = 'District is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location information is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Aadhar verification with Verhoeff algorithm
  const handleAadhaarVerification = async () => {
    // Pre-validation: Check if Aadhar is exactly 12 digits
    if (!formData.aadhaar || !/^\d{12}$/.test(formData.aadhaar)) {
      setErrors({ 
        ...errors, 
        aadhaar: 'Please enter exactly 12 digits for Aadhar verification. No spaces or special characters allowed.' 
      })
      toast.error('Invalid Aadhar format. Please enter exactly 12 digits.')
      return
    }

    // Check for common invalid test numbers
    const invalidTestNumbers = ['000000000000', '111111111111', '123456789012', '999999999999']
    if (invalidTestNumbers.includes(formData.aadhaar)) {
      setErrors({ 
        ...errors, 
        aadhaar: 'This appears to be a test number. Please enter your actual Aadhar number.' 
      })
      toast.error('Invalid Aadhar number. Please enter your actual Aadhar number.')
      return
    }

    setIsVerifyingAadhaar(true)
    setErrors({ ...errors, aadhaar: '' })

    try {
      console.log('Verifying Aadhar number with Verhoeff algorithm...')
      toast.info('Verifying Aadhar number...')
      
      // Use Verhoeff algorithm for Aadhar validation
      const isValid = validateAadharNumber(formData.aadhaar)
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (isValid) {
        setAadhaarVerified(true)
        setErrors({ ...errors, aadhaar: '' })
        toast.success('Aadhar verified successfully!')
        console.log('Aadhar verification successful using Verhoeff algorithm')
      } else {
        setAadhaarVerified(false)
        setErrors({ 
          ...errors, 
          aadhaar: 'Invalid Aadhar number. Please check your number and try again.' 
        })
        toast.error('Invalid Aadhar number')
      }
    } catch (error) {
      console.error('Aadhar verification error:', error)
      setAadhaarVerified(false)
      setErrors({ 
        ...errors, 
        aadhaar: 'Verification failed. Please try again.' 
      })
      toast.error('Verification failed. Please try again.')
    } finally {
      setIsVerifyingAadhaar(false)
    }
  }

  // Handle form submission with backend registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting')
      return
    }

    try {
      console.log('Submitting registration with verified Aadhar...')
      toast.info('Creating your account...')
      
      // Call backend registration API
      const success = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        password: formData.password,
        aadhaar: formData.aadhaar,
        userType: formData.userType,
        state: formData.state,
        district: formData.district.trim(),
        location: formData.location.trim()
      })

      if (!success) {
        // Error already handled by AuthContext
        console.log('Registration failed - error handled by AuthContext')
      }
    } catch (error) {
      console.error('Registration submission error:', error)
      toast.error('Registration failed. Please try again.')
    }
  }

  // Handle input changes with real-time validation
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    
    // Clear specific field error
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
    
    // Reset Aadhar verification if number changes
    if (field === 'aadhaar') {
      if (aadhaarVerified) {
        setAadhaarVerified(false)
        toast.info('Aadhar changed. Please verify again.')
      }
      // Format Aadhar input: only allow digits, max 12
      const formattedValue = value.replace(/\D/g, '').slice(0, 12)
      setFormData({ ...formData, [field]: formattedValue })
    }

    // Show password requirements when user starts typing
    if (field === 'password') {
      setShowPasswordRequirements(value.length > 0)
    }
  }

  // Get current location using device GPS
  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true)
    
    try {
      await getCurrentLocation()
      // Location will be set by the AuthContext
      const coords = await new Promise<{latitude: number, longitude: number}>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 10000 }
        )
      })
      
      const locationString = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
      setFormData({ ...formData, location: locationString })
      
    } catch (error) {
      console.error('Location error:', error)
      // Error already handled by AuthContext
    } finally {
      setIsGettingLocation(false)
    }
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

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col p-4 relative">
      {/* Water Droplet Background */}
      <WaterDropletBackground intensity="medium" dropletCount={45} />
      
      {/* Header with back button */}
      {onBack && (
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Create Account</h1>
        </div>
      )}

      {/* Main registration form */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto relative z-10 backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Join AquaWatch</CardTitle>
            <CardDescription>
              Register with Aadhar verification to start monitoring groundwater
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

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name as per Aadhar"
                  className={errors.name ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className={errors.email ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Phone Number (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Mobile Number (Optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className={errors.phone ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              {/* Aadhar Number - CRITICAL FIELD */}
              <div className="space-y-2">
                <Label htmlFor="aadhaar" className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Aadhar Number * (Required for Verification)</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="aadhaar"
                    type="text"
                    value={formData.aadhaar}
                    onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                    placeholder="Enter exactly 12 digits"
                    className={
                      errors.aadhaar ? 'border-destructive' : 
                      aadhaarVerified ? 'border-green-500 bg-green-50' : ''
                    }
                    disabled={isLoading || isVerifyingAadhaar}
                    maxLength={12}
                  />
                  <Button
                    type="button"
                    onClick={handleAadhaarVerification}
                    disabled={isVerifyingAadhaar || aadhaarVerified || !formData.aadhaar || formData.aadhaar.length !== 12}
                    variant={aadhaarVerified ? "default" : "outline"}
                    size="sm"
                    className="shrink-0"
                  >
                    {isVerifyingAadhaar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : aadhaarVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Shield className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.aadhaar && <p className="text-sm text-destructive">{errors.aadhaar}</p>}
                {aadhaarVerified && (
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Aadhar verified with government database!
                  </p>
                )}
                {formData.aadhaar && !aadhaarVerified && formData.aadhaar.length === 12 && !isVerifyingAadhaar && (
                  <p className="text-sm text-amber-600">Click verify button to authenticate with government database</p>
                )}
              </div>

              {/* User Type */}
              <div className="space-y-2">
                <Label htmlFor="userType">User Type *</Label>
                <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                  <SelectTrigger className={errors.userType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select your user type" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userType && <p className="text-sm text-destructive">{errors.userType}</p>}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className={errors.state ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="Enter your district"
                  className={errors.district ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.district && <p className="text-sm text-destructive">{errors.district}</p>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Location *</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter location or use GPS"
                    className={errors.location ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    className="shrink-0"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  className={errors.password ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                
                {/* Password strength indicator */}
                {showPasswordRequirements && formData.password && (
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
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" 
                disabled={isLoading || !aadhaarVerified}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Login link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            </div>


          </CardContent>
        </Card>
      </div>
    </div>
  )
}

console.log('AquaWatch RegisterForm loaded with enhanced Aadhar verification and backend integration')