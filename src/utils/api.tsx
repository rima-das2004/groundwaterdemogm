// AquaWatch API Service - Frontend to Backend Communication
// This service handles all API calls to the Node.js/Express backend with proper error handling and security

import { API_CONFIG, ERROR_MESSAGES, STORAGE_KEYS } from './config'

const API_BASE_URL = API_CONFIG.BACKEND_URL

// Interface for API response structure
interface ApiResponse<T = any> {
  success: boolean
  message?: string
  user?: any
  token?: string
  error?: string
  data?: T
}

// Get stored authentication token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
}

// Store authentication token in localStorage
const setAuthToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
}

// Remove authentication token from localStorage
const removeAuthToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER_DATA)
}

// Generic API call function with error handling and authentication
const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<ApiResponse<T>> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    }

    // Add user authentication token for protected routes
    if (requireAuth) {
      const authToken = getAuthToken()
      if (authToken && !authToken.startsWith('offline-token-')) {
        headers['Authorization'] = `Bearer ${authToken}`
      } else if (!authToken) {
        throw new Error('Authentication required but no token found')
      }
      // For offline tokens, skip authorization header as it will be handled offline
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'include', // Include cookies for session-based auth
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Check if response is ok first
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If JSON parsing fails, use the status text
        }
        console.error(`API Error (${response.status}):`, errorMessage)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Store auth token if provided (for login/register responses)
      if (data.token) {
        setAuthToken(data.token)
      }

      return data

    } catch (error: any) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: Server took too long to respond')
      }
      
      throw error
    }

  } catch (error: any) {
    // Provide more specific network error handling
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      // This is a network connectivity issue - backend is likely not running
      console.log(`Backend service unavailable at ${endpoint} - switching to offline mode`)
      throw new Error('Backend service unavailable')
    }
    
    // Only log other errors in development mode to avoid console spam
    if (process.env.NODE_ENV === 'development') {
      console.error(`API call failed for ${endpoint}:`, error)
    }
    
    throw error
  }
}

// Authentication API calls
export const authAPI = {
  // User registration with Aadhar verification
  register: async (userData: {
    name: string
    email: string
    phone?: string
    password: string
    aadhaar: string
    userType: string
    state: string
    district: string
    location: string
  }): Promise<ApiResponse> => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        aadharNumber: userData.aadhaar,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password,
        name: userData.name,
        userType: userData.userType,
        location: {
          state: userData.state,
          district: userData.district,
          coordinates: {}
        },
        phoneNumber: userData.phone
      })
    })
  },

  // User login
  login: async (emailOrPhone: string, password: string): Promise<ApiResponse> => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: emailOrPhone, password })
    })
  },

  // Forgot password request
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    return apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    return apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ 
        token, 
        password: newPassword, 
        confirmPassword: newPassword 
      })
    })
  },

  // Change password (for logged-in users)
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    return apiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ 
        currentPassword, 
        newPassword, 
        confirmPassword: newPassword 
      })
    }, true) // Requires authentication
  },

  // Note: Aadhar verification is now handled locally using Verhoeff algorithm
  // This endpoint is removed as we use client-side validation

  // Get user profile (protected route)
  getProfile: async (): Promise<ApiResponse> => {
    return apiCall('/user/profile', {
      method: 'GET'
    }, true) // Requires authentication
  },

  // User logout
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await apiCall('/auth/logout', {
        method: 'POST'
      }, true) // Requires authentication
      
      // Clear local storage on successful logout
      removeAuthToken()
      
      return response
    } catch (error) {
      // Even if API call fails, clear local storage
      removeAuthToken()
      throw error
    }
  }
}

// Utility functions for token management
export const tokenUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = getAuthToken()
    return token !== null
  },

  // Get stored user data
  getStoredUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    return userStr ? JSON.parse(userStr) : null
  },

  // Store user data
  setStoredUser: (user: any) => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
  },

  // Clear all authentication data
  clearAuthData: () => {
    removeAuthToken()
  },

  // Get the raw auth token
  getToken: () => getAuthToken()
}

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.message) {
    // Handle specific HTTP errors
    if (error.message.includes('401')) {
      return ERROR_MESSAGES.AUTHENTICATION_FAILED
    }
    if (error.message.includes('403')) {
      return ERROR_MESSAGES.ACCESS_DENIED
    }
    if (error.message.includes('404')) {
      return 'Resource not found. Please check your request.'
    }
    if (error.message.includes('500')) {
      return ERROR_MESSAGES.SERVER_ERROR
    }
    if (error.message.includes('timeout') || error.message.includes('Request timeout')) {
      return 'Request timed out. Please check your connection and try again.'
    }
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR
}

// Network connectivity check
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    // Try to ping a simple endpoint or just check if server responds
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.HEALTH_CHECK_TIMEOUT)

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Empty body will get 400 but server is responsive
      mode: 'cors',
      credentials: 'include',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    // Any response (even error) means server is reachable
    return true
  } catch (error: any) {
    // Only log in development mode to avoid console spam
    if (process.env.NODE_ENV === 'development') {
      console.log('Backend connectivity check failed - running in offline mode')
    }
    return false
  }
}

console.log('AquaWatch API Service initialized with secure authentication and Aadhar verification')