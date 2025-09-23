// AquaWatch Authentication Context - Enhanced with Offline Mode
// Provides secure authentication with graceful fallback to offline mode

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, tokenUtils, handleApiError } from '../utils/api'
import { verifyAadharWithAPI } from '../utils/aadharValidation'
import { toast } from "sonner";


// User interface definition
interface User {
  id: string
  name: string
  email: string
  phone?: string
  aadhaar: string
  aadhaarVerified: boolean
  userType: string
  state?: string
  district?: string
  location?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  lastLoginAt?: string
}

// Authentication context interface
interface AuthContextType {
  user: User | null
  login: (emailOrPhone: string, password: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    phone?: string
    password: string
    aadhaar: string
    userType: string
    state: string
    district: string
    location: string
  }) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  verifyAadhaar: (aadhaar: string) => Promise<boolean>
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; resetToken?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  getCurrentLocation: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateUserRole: (newRole: string) => Promise<boolean>
  isOfflineMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [hasShownOfflineNotice, setHasShownOfflineNotice] = useState(false)

  // Initialize demo users if not present
  const initializeDemoUsers = () => {
    const existingUsers = localStorage.getItem('demo_users')
    if (!existingUsers) {
      const demoUsers = [
        {
          id: 'demo_user_1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@example.com',
          phone: '9876543210',
          password: 'password123',
          aadhaar: '123456789012',
          aadhaarVerified: true,
          userType: 'farmer',
          state: 'Punjab',
          district: 'Ludhiana',
          location: 'Village Kharar',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 'demo_user_2',
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '9876543211',
          password: 'password123',
          aadhaar: '234567890123',
          aadhaarVerified: true,
          userType: 'household',
          state: 'Gujarat',
          district: 'Ahmedabad',
          location: 'Satellite Area',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 'demo_user_3',
          name: 'Dr. Ankit Mehta',
          email: 'ankit.mehta@research.com',
          phone: '9876543212',
          password: 'password123',
          aadhaar: '345678901234',
          aadhaarVerified: true,
          userType: 'researcher',
          state: 'Maharashtra',
          district: 'Mumbai',
          location: 'IIT Bombay',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        }
      ]
      localStorage.setItem('demo_users', JSON.stringify(demoUsers))
      console.log('Demo users initialized for offline mode')
    }
  }

  // Check authentication status on app start
  useEffect(() => {
    initializeDemoUsers()
    
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth check timeout, switching to offline mode')
        setIsOfflineMode(true)
        const storedUser = tokenUtils.getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        }
        setIsLoading(false)
      }
    }, 2000) // Reduced to 2 seconds for faster fallback

    checkAuthStatus().catch((error) => {
      console.log('Auth check failed, switching to offline mode:', error)
      setIsOfflineMode(true)
      const storedUser = tokenUtils.getStoredUser()
      if (storedUser) {
        setUser(storedUser)
      }
      setIsLoading(false)
    }).finally(() => {
      clearTimeout(timeoutId)
    })

    return () => clearTimeout(timeoutId)
  }, [])

  // Check if user is authenticated and restore session
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)

      // Check if we have a stored token
      const token = tokenUtils.getToken()
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      // Check if it's a mock token (offline mode)
      if (token.startsWith('offline-token-') || token.startsWith('mock-token-')) {
        setIsOfflineMode(true)
        const storedUser = tokenUtils.getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        } else {
          tokenUtils.clearAuthData()
          setUser(null)
        }
        setIsLoading(false)
        return
      }

      // Try to verify token with backend
      try {
        const response = await authAPI.getProfile()
        
        if (response.success && response.data && response.data.user) {
          const userData = response.data.user
          // Transform backend user data to frontend format
          const frontendUser = {
            id: userData._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phoneNumber,
            aadhaar: userData.aadharNumber,
            aadhaarVerified: userData.isEmailVerified, // Using email verification as proxy
            userType: userData.userType,
            state: userData.location?.state,
            district: userData.location?.district,
            location: userData.location?.district + ', ' + userData.location?.state,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            isActive: !userData.isLocked,
            lastLoginAt: userData.lastLogin
          }
          setUser(frontendUser)
          tokenUtils.setStoredUser(frontendUser)
          setIsOfflineMode(false)
        } else {
          // Invalid response, switch to offline mode
          console.log('Invalid backend response, switching to offline mode')
          setIsOfflineMode(true)
          const storedUser = tokenUtils.getStoredUser()
          if (storedUser) {
            setUser(storedUser)
          } else {
            tokenUtils.clearAuthData()
            setUser(null)
          }
        }
      } catch (apiError: any) {
        // Backend unavailable, switch to offline mode
        console.log('Backend unavailable, switching to offline mode:', apiError)
        setIsOfflineMode(true)
        const storedUser = tokenUtils.getStoredUser()
        if (storedUser) {
          // Create offline token
          localStorage.setItem('authToken', `offline-token-${storedUser.id}`)
          setUser(storedUser)
        } else {
          tokenUtils.clearAuthData()
          setUser(null)
        }
      }

    } catch (error) {
      console.error('Auth status check failed:', error)
      setIsOfflineMode(true)
      const storedUser = tokenUtils.getStoredUser()
      if (storedUser) {
        setUser(storedUser)
      } else {
        tokenUtils.clearAuthData()
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // User login with backend authentication and offline fallback
  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Input validation
      if (!emailOrPhone.trim() || !password) {
        toast.error('Please enter both email/phone and password')
        return false
      }

      console.log('Attempting login for:', emailOrPhone)

      // Try backend authentication first
      try {
        if (!isOfflineMode) {
          const response = await authAPI.login(emailOrPhone, password)

          if (response.success && response.user && response.token) {
            // Transform backend user data to frontend format
            const frontendUser = {
              id: response.user._id,
              name: response.user.name,
              email: response.user.email,
              phone: response.user.phoneNumber,
              aadhaar: response.user.aadharNumber,
              aadhaarVerified: response.user.isEmailVerified,
              userType: response.user.userType,
              state: response.user.location?.state,
              district: response.user.location?.district,
              location: response.user.location?.district + ', ' + response.user.location?.state,
              createdAt: response.user.createdAt,
              updatedAt: response.user.updatedAt,
              isActive: !response.user.isLocked,
              lastLoginAt: response.user.lastLogin
            }
            setUser(frontendUser)
            tokenUtils.setStoredUser(frontendUser)
            setIsOfflineMode(false)
            toast.success('Login successful!')
            return true
          } else {
            toast.error(response.message || 'Invalid credentials')
            return false
          }
        }
      } catch (error: any) {
        // Handle different types of API errors gracefully
        console.log('Backend authentication unavailable, switching to offline mode')
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          console.log('Network error detected - backend server may not be running')
        }
        
        setIsOfflineMode(true)
      }

      // Offline mode authentication
      console.log('Using offline authentication...')
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const foundUser = demoUsers.find((u: any) => 
        (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
      )
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        tokenUtils.setStoredUser(userWithoutPassword)
        localStorage.setItem('authToken', `offline-token-${foundUser.id}`)
        toast.success('Login successful (offline mode)')
        return true
      } else {
        toast.error('Invalid credentials. Try the demo accounts:\n• rajesh.kumar@example.com / password123\n• priya.sharma@example.com / password123')
        return false
      }

    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // User registration with Aadhar verification and offline fallback
  const register = async (userData: {
    name: string
    email: string
    phone?: string
    password: string
    aadhaar: string
    userType: string
    state: string
    district: string
    location: string
  }): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Client-side validation
      if (!userData.name.trim()) {
        toast.error('Name is required')
        return false
      }

      if (!userData.email.trim() || !/\S+@\S+\.\S+/.test(userData.email)) {
        toast.error('Valid email is required')
        return false
      }

      if (!userData.password || userData.password.length < 8) {
        toast.error('Password must be at least 8 characters long')
        return false
      }

      if (!userData.aadhaar || !/^\d{12}$/.test(userData.aadhaar)) {
        toast.error('Aadhar number must be exactly 12 digits')
        return false
      }

      console.log('Attempting registration for:', userData.email)

      // Try backend registration first
      try {
        if (!isOfflineMode) {
          const response = await authAPI.register(userData)

          if (response.success && response.user && response.token) {
            // Transform backend user data to frontend format
            const frontendUser = {
              id: response.user._id,
              name: response.user.name,
              email: response.user.email,
              phone: response.user.phoneNumber,
              aadhaar: response.user.aadharNumber,
              aadhaarVerified: response.user.isEmailVerified,
              userType: response.user.userType,
              state: response.user.location?.state,
              district: response.user.location?.district,
              location: response.user.location?.district + ', ' + response.user.location?.state,
              createdAt: response.user.createdAt,
              updatedAt: response.user.updatedAt,
              isActive: !response.user.isLocked,
              lastLoginAt: response.user.lastLogin
            }
            setUser(frontendUser)
            tokenUtils.setStoredUser(frontendUser)
            setIsOfflineMode(false)
            toast.success('Registration successful! Welcome to AquaWatch!')
            return true
          } else {
            toast.error(response.message || 'Registration failed')
            return false
          }
        }
      } catch (error: any) {
        console.log('Backend registration unavailable, switching to offline mode')
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          console.log('Network error detected - backend server may not be running')
        }
        
        setIsOfflineMode(true)
      }

      // Offline mode registration
      console.log('Using offline registration...')
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const existingUser = demoUsers.find((u: any) => 
        u.email === userData.email || u.aadhaar === userData.aadhaar
      )
      
      if (existingUser) {
        if (existingUser.email === userData.email) {
          toast.error('User with this email already exists')
        } else {
          toast.error('This Aadhar number is already registered')
        }
        return false
      }
      
      // Create new user for offline mode
      const newUser = {
        id: `offline_user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        aadhaar: userData.aadhaar,
        aadhaarVerified: true,
        userType: userData.userType,
        state: userData.state,
        district: userData.district,
        location: userData.location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      }
      
      // Save to offline storage
      demoUsers.push(newUser)
      localStorage.setItem('demo_users', JSON.stringify(demoUsers))
      
      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      tokenUtils.setStoredUser(userWithoutPassword)
      localStorage.setItem('authToken', `offline-token-${newUser.id}`)
      
      toast.success('Registration successful (offline mode)! Welcome to AquaWatch!')
      return true

    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // User logout
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)

      // Try backend logout if not in offline mode
      if (!isOfflineMode) {
        try {
          await authAPI.logout()
        } catch (error) {
          console.log('Backend logout failed:', error)
        }
      }
      
      // Clear local state
      setUser(null)
      tokenUtils.clearAuthData()
      setIsOfflineMode(false)
      toast.success('Logged out successfully')

    } catch (error) {
      console.error('Logout error:', error)
      // Even if API call fails, clear local state
      setUser(null)
      tokenUtils.clearAuthData()
      setIsOfflineMode(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Verify Aadhar number using Verhoeff algorithm
  const verifyAadhaar = async (aadhaar: string): Promise<boolean> => {
    try {
      // Client-side validation first
      if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
        toast.error('Aadhar number must be exactly 12 digits')
        return false
      }

      console.log('Verifying Aadhar number using Verhoeff algorithm:', aadhaar)

      // Check if Aadhar is already registered
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const existingUser = demoUsers.find((u: any) => u.aadhaar === aadhaar)
      if (existingUser) {
        toast.error('This Aadhar number is already registered')
        return false
      }

      // Use Verhoeff algorithm for validation
      const isValid = await verifyAadharWithAPI(aadhaar)
      
      if (isValid) {
        toast.success('Aadhar verified successfully!')
        return true
      } else {
        toast.error('Invalid Aadhar number - checksum verification failed')
        return false
      }

    } catch (error) {
      console.error('Aadhar verification error:', error)
      toast.error('Aadhar verification failed')
      return false
    }
  }

  // Forgot password functionality
  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string; resetToken?: string }> => {
    try {
      // Input validation
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        const error = 'Valid email is required'
        toast.error(error)
        return { success: false, message: error }
      }

      console.log('Processing forgot password for:', email)

      // Try backend API if not in offline mode
      if (!isOfflineMode) {
        try {
          const response = await authAPI.forgotPassword(email)

          if (response.success) {
            toast.success(response.message || 'Password reset instructions sent!')
            return { 
              success: true, 
              message: response.message || 'Password reset instructions sent!',
              resetToken: response.resetToken
            }
          } else {
            toast.error(response.error || 'Failed to process password reset')
            return { success: false, message: response.error || 'Failed to process password reset' }
          }
        } catch (error) {
          console.log('Backend forgot password failed, using offline mode:', error)
          setIsOfflineMode(true)
        }
      }

      // Offline mode
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const foundUser = demoUsers.find((u: any) => u.email === email)
      
      if (foundUser) {
        const resetToken = `offline-reset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        // Store reset token in localStorage for demo
        localStorage.setItem(`reset_token_${resetToken}`, JSON.stringify({
          email,
          userId: foundUser.id,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }))
        
        toast.success('Password reset token generated (offline mode)')
        return { 
          success: true, 
          message: 'Password reset token generated. In a real app, this would be sent via email.',
          resetToken 
        }
      } else {
        toast.success('If an account with this email exists, a password reset link will be sent.')
        return { success: true, message: 'If an account with this email exists, a password reset link will be sent.' }
      }

    } catch (error) {
      console.error('Forgot password error:', error)
      const errorMessage = 'Failed to process password reset request'
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    }
  }

  // Reset password with token
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // Input validation
      if (!token.trim()) {
        toast.error('Reset token is required')
        return false
      }

      if (!newPassword || newPassword.length < 8) {
        toast.error('Password must be at least 8 characters long')
        return false
      }

      console.log('Resetting password with token')

      // Try backend API if not in offline mode
      if (!isOfflineMode && !token.startsWith('offline-reset-')) {
        try {
          const response = await authAPI.resetPassword(token, newPassword)

          if (response.success) {
            toast.success(response.message || 'Password reset successful!')
            return true
          } else {
            toast.error(response.error || 'Password reset failed')
            return false
          }
        } catch (error) {
          console.log('Backend reset password failed, using offline mode:', error)
          setIsOfflineMode(true)
        }
      }

      // Offline mode
      const tokenData = localStorage.getItem(`reset_token_${token}`)
      if (!tokenData) {
        toast.error('Invalid or expired reset token')
        return false
      }

      const parsedToken = JSON.parse(tokenData)
      
      // Check if token has expired
      if (new Date() > new Date(parsedToken.expiresAt)) {
        localStorage.removeItem(`reset_token_${token}`)
        toast.error('Reset token has expired')
        return false
      }

      // Update password in offline storage
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const userIndex = demoUsers.findIndex((u: any) => u.id === parsedToken.userId)
      
      if (userIndex !== -1) {
        demoUsers[userIndex].password = newPassword
        demoUsers[userIndex].updatedAt = new Date().toISOString()
        localStorage.setItem('demo_users', JSON.stringify(demoUsers))
        localStorage.removeItem(`reset_token_${token}`)
        
        toast.success('Password reset successful (offline mode)!')
        return true
      } else {
        toast.error('User not found')
        return false
      }

    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Password reset failed')
      return false
    }
  }

  // Change password for logged-in users
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Input validation
      if (!currentPassword || !newPassword) {
        toast.error('Both current and new passwords are required')
        return false
      }

      if (newPassword.length < 8) {
        toast.error('New password must be at least 8 characters long')
        return false
      }

      if (currentPassword === newPassword) {
        toast.error('New password must be different from current password')
        return false
      }

      console.log('Changing password for user:', user?.email)

      // Try backend API if not in offline mode
      if (!isOfflineMode) {
        try {
          const response = await authAPI.changePassword(currentPassword, newPassword)

          if (response.success) {
            toast.success(response.message || 'Password changed successfully!')
            return true
          } else {
            toast.error(response.error || 'Failed to change password')
            return false
          }
        } catch (error) {
          console.log('Backend change password failed, using offline mode:', error)
          setIsOfflineMode(true)
        }
      }

      // Offline mode
      if (!user) {
        toast.error('User not found')
        return false
      }

      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const userIndex = demoUsers.findIndex((u: any) => u.id === user.id)
      
      if (userIndex !== -1) {
        // Verify current password
        if (demoUsers[userIndex].password !== currentPassword) {
          toast.error('Current password is incorrect')
          return false
        }
        
        // Update password
        demoUsers[userIndex].password = newPassword
        demoUsers[userIndex].updatedAt = new Date().toISOString()
        localStorage.setItem('demo_users', JSON.stringify(demoUsers))
        
        toast.success('Password changed successfully (offline mode)!')
        return true
      } else {
        toast.error('User not found')
        return false
      }

    } catch (error) {
      console.error('Change password error:', error)
      toast.error('Failed to change password')
      return false
    }
  }

  // Get current location using browser geolocation
  const getCurrentLocation = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'Geolocation is not supported by this browser'
        console.warn('Geolocation not supported:', error)
        reject(new Error(error))
        return
      }

      console.log('Requesting location access...')

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          
          // Update user object with location if user is logged in
          if (user) {
            const updatedUser = {
              ...user,
              location: locationString,
              updatedAt: new Date().toISOString()
            }
            setUser(updatedUser)
            tokenUtils.setStoredUser(updatedUser)
            
            // Also update in offline storage if in offline mode
            if (isOfflineMode) {
              const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
              const userIndex = demoUsers.findIndex((u: any) => u.id === user.id)
              if (userIndex !== -1) {
                demoUsers[userIndex] = { ...demoUsers[userIndex], ...updatedUser }
                localStorage.setItem('demo_users', JSON.stringify(demoUsers))
              }
            }
          }

          toast.success('Location detected successfully!')
          console.log('Current location:', locationString)
          resolve()
        },
        (error) => {
          let errorMessage = 'Failed to get location'
          let logMessage = 'Geolocation error'
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied'
              logMessage = 'User denied location access - this is normal'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable'
              logMessage = 'Location position unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              logMessage = 'Location request timed out'
              break
          }
          
          // Only show toast for non-permission errors to avoid annoying users
          if (error.code !== error.PERMISSION_DENIED) {
            toast.error(errorMessage)
          }
          
          console.log(logMessage, errorMessage)
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    })
  }

  // Refresh user profile data
  const refreshProfile = async (): Promise<void> => {
    try {
      console.log('Refreshing user profile...')
      
      // Try backend API if not in offline mode
      if (!isOfflineMode && user) {
        try {
          const response = await authAPI.getProfile()
          
          if (response.success && response.data && response.data.user) {
            const userData = response.data.user
            // Transform backend user data to frontend format
            const frontendUser = {
              id: userData._id,
              name: userData.name,
              email: userData.email,
              phone: userData.phoneNumber,
              aadhaar: userData.aadharNumber,
              aadhaarVerified: userData.isEmailVerified,
              userType: userData.userType,
              state: userData.location?.state,
              district: userData.location?.district,
              location: userData.location?.district + ', ' + userData.location?.state,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
              isActive: !userData.isLocked,
              lastLoginAt: userData.lastLogin
            }
            setUser(frontendUser)
            tokenUtils.setStoredUser(frontendUser)
            console.log('Profile refreshed successfully from backend')
            return
          }
        } catch (error) {
          console.log('Backend profile refresh failed, using stored data:', error)
        }
      }

      // In offline mode or if backend fails, just use stored data
      if (user) {
        console.log('Profile refresh completed (offline mode)')
      }

    } catch (error) {
      console.error('Profile refresh error:', error)
    }
  }

  // Update user role (for role upgrades)
  const updateUserRole = async (newRole: string): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('User not found')
        return false
      }

      console.log(`Updating user role from ${user.userType} to ${newRole}`)

      // Try backend API if not in offline mode
      if (!isOfflineMode) {
        try {
          // In a real app, you would call an API to update the role
          // const response = await authAPI.updateUserRole(newRole)
          
          // For now, we'll just update locally
          console.log('Backend role update would be called here')
        } catch (error) {
          console.log('Backend role update failed, using offline mode:', error)
          setIsOfflineMode(true)
        }
      }

      // Update role locally (both online and offline mode)
      const updatedUser = {
        ...user,
        userType: newRole,
        updatedAt: new Date().toISOString()
      }

      // Update current user state
      setUser(updatedUser)
      tokenUtils.setStoredUser(updatedUser)

      // Update in offline storage
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const userIndex = demoUsers.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        demoUsers[userIndex] = { ...demoUsers[userIndex], ...updatedUser }
        localStorage.setItem('demo_users', JSON.stringify(demoUsers))
      }

      toast.success(`Role successfully updated to ${newRole}!`)
      console.log('User role updated successfully:', updatedUser)
      return true

    } catch (error) {
      console.error('Role update error:', error)
      toast.error('Failed to update role')
      return false
    }
  }

  // Context value
  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    verifyAadhaar,
    forgotPassword,
    resetPassword,
    changePassword,
    getCurrentLocation,
    refreshProfile,
    updateUserRole,
    isOfflineMode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext