/**
 * AquaWatch Application Configuration
 * Centralized configuration for API endpoints, environment settings, and feature flags
 */

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// Backend API Configuration
export const API_CONFIG = {
  // Backend URLs
  BACKEND_URL: isDevelopment 
    ? 'http://localhost:5000/api'  // Local development server
    : 'https://your-backend-domain.com/api', // Production backend URL - UPDATE THIS
    
  // Request timeout settings
  REQUEST_TIMEOUT: 3000, // Reduced to 3 seconds for faster fallback
  
  // Health check settings
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  HEALTH_CHECK_TIMEOUT: 2000,   // Reduced to 2 seconds
}

// Application Features
export const FEATURES = {
  // Authentication features
  OFFLINE_MODE_ENABLED: true,
  AADHAR_VERIFICATION: true,
  GOOGLE_SCHOLAR_VERIFICATION: true,
  
  // UI features
  DARK_MODE_ENABLED: true,
  NOTIFICATIONS_ENABLED: true,
  REAL_TIME_UPDATES: true,
  
  // Data features
  MOCK_DATA_ENABLED: true, // Use mock data when backend is unavailable
  CACHE_ENABLED: true,
  
  // Debug features (development only)
  DEBUG_MODE: isDevelopment,
  CONSOLE_LOGGING: isDevelopment,
  ERROR_REPORTING: isProduction,
}

// Validation Rules
export const VALIDATION = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: false,
  PASSWORD_REQUIRE_LOWERCASE: false,
  PASSWORD_REQUIRE_NUMBERS: false,
  PASSWORD_REQUIRE_SYMBOLS: false,
  
  // Aadhar validation
  AADHAR_LENGTH: 12,
  AADHAR_PATTERN: /^\d{12}$/,
  
  // Phone validation
  PHONE_LENGTH: 10,
  PHONE_PATTERN: /^\d{10}$/,
  
  // Email validation
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

// UI Constants
export const UI_CONFIG = {
  // Toast notification settings
  TOAST_DURATION: 4000, // 4 seconds
  TOAST_POSITION: 'top-right' as const,
  
  // Loading states
  SPLASH_SCREEN_DURATION: 3000, // 3 seconds
  
  // Polling intervals
  DATA_REFRESH_INTERVAL: 60000, // 1 minute
  NOTIFICATION_CHECK_INTERVAL: 30000, // 30 seconds
  
  // Animation settings
  ANIMATION_DURATION: 300, // milliseconds
  
  // Mobile settings
  MOBILE_BREAKPOINT: 768, // pixels
}

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
  DEMO_USERS: 'demo_users',
  USER_PREFERENCES: 'user_preferences',
  CACHE_TIMESTAMP: 'cache_timestamp',
  OFFLINE_DATA: 'offline_data',
  THEME_PREFERENCE: 'theme_preference',
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error: Unable to connect to server. Please check your internet connection.',
  AUTHENTICATION_FAILED: 'Authentication failed. Please log in again.',
  ACCESS_DENIED: 'Access denied. You do not have permission to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  
  // Auth specific
  INVALID_CREDENTIALS: 'Invalid email/phone or password.',
  ACCOUNT_LOCKED: 'Account is temporarily locked due to multiple failed login attempts.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before continuing.',
  
  // Aadhar specific
  INVALID_AADHAR: 'Invalid Aadhar number. Please check the number and try again.',
  AADHAR_ALREADY_EXISTS: 'This Aadhar number is already registered.',
  AADHAR_VERIFICATION_FAILED: 'Aadhar verification failed. Please try again.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Welcome back.',
  REGISTRATION_SUCCESS: 'Registration successful! Welcome to AquaWatch.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  PASSWORD_RESET_SENT: 'Password reset instructions sent to your email.',
  PASSWORD_RESET_SUCCESS: 'Password reset successful.',
  AADHAR_VERIFIED: 'Aadhar number verified successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
}

// Demo Data Configuration
export const DEMO_CONFIG = {
  // Demo user credentials
  DEMO_USERS: [
    {
      email: 'rajesh.kumar@example.com',
      phone: '9876543210',
      password: 'password123',
      userType: 'farmer',
      state: 'Punjab',
      district: 'Ludhiana',
    },
    {
      email: 'priya.sharma@example.com', 
      phone: '9876543211',
      password: 'password123',
      userType: 'household',
      state: 'Gujarat',
      district: 'Ahmedabad',
    },
    {
      email: 'ankit.mehta@research.com',
      phone: '9876543212', 
      password: 'password123',
      userType: 'researcher',
      state: 'Maharashtra',
      district: 'Mumbai',
    }
  ],
  
  // Demo admin credentials
  ADMIN_OTP: '123456',
  
  // Valid demo Aadhar numbers (these pass Verhoeff algorithm)
  VALID_DEMO_AADHARS: [
    '234123412347',
    '123456789016', 
    '999999990019',
  ],
}

// Export a function to get current configuration
export const getConfig = () => ({
  API_CONFIG,
  FEATURES,
  VALIDATION,
  UI_CONFIG,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEMO_CONFIG,
  isDevelopment,
  isProduction,
})

// Helper function to check if feature is enabled
export const isFeatureEnabled = (feature: keyof typeof FEATURES): boolean => {
  return FEATURES[feature] === true
}

// Helper function to get API URL
export const getApiUrl = (): string => {
  return API_CONFIG.BACKEND_URL
}

// Helper function to get storage key
export const getStorageKey = (key: keyof typeof STORAGE_KEYS): string => {
  return STORAGE_KEYS[key]
}

console.log('AquaWatch configuration loaded:', {
  environment: isDevelopment ? 'development' : 'production',
  apiUrl: API_CONFIG.BACKEND_URL,
  features: Object.keys(FEATURES).filter(key => FEATURES[key as keyof typeof FEATURES])
})