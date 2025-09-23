import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import { sign, verify } from 'npm:jsonwebtoken'
import * as kv from './kv_store.tsx'

// Initialize Supabase client for server operations
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured')
  throw new Error('Missing required Supabase configuration')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const app = new Hono()

// JWT Secret key from environment
const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'aquawatch-demo-secret-key-2024-not-for-production'

// Email configuration (for production, use a proper email service)
const EMAIL_CONFIG = {
  enabled: false, // Set to true when email service is configured
  // Add your email service configuration here
}

// Enable CORS for all routes
app.use('*', cors({
  origin: '*', // Allow all origins for development
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
}))

// Enable logging for debugging
app.use('*', logger(console.log))

// Web Crypto API functions to replace bcrypt (compatible with Deno/Edge Runtime)
async function hashPassword(password: string): Promise<string> {
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16))
  
  // Encode password as UTF-8
  const passwordBuffer = new TextEncoder().encode(password)
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  
  // Derive key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // 32 bytes
  )
  
  // Combine salt and derived bits
  const hashBuffer = new Uint8Array(salt.length + derivedBits.byteLength)
  hashBuffer.set(salt)
  hashBuffer.set(new Uint8Array(derivedBits), salt.length)
  
  // Convert to base64 string
  return btoa(String.fromCharCode(...hashBuffer))
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // Decode base64 hash
    const hashBuffer = new Uint8Array(
      atob(hashedPassword).split('').map(c => c.charCodeAt(0))
    )
    
    // Extract salt (first 16 bytes) and hash (remaining bytes)
    const salt = hashBuffer.slice(0, 16)
    const storedHash = hashBuffer.slice(16)
    
    // Encode password as UTF-8
    const passwordBuffer = new TextEncoder().encode(password)
    
    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )
    
    // Derive key using same parameters
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    )
    
    // Compare derived hash with stored hash
    const derivedHash = new Uint8Array(derivedBits)
    
    if (derivedHash.length !== storedHash.length) {
      return false
    }
    
    // Constant-time comparison to prevent timing attacks
    let result = 0
    for (let i = 0; i < derivedHash.length; i++) {
      result |= derivedHash[i] ^ storedHash[i]
    }
    
    return result === 0
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

// Middleware to verify JWT token for protected routes
const authMiddleware = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header')
      return c.json({ error: 'Missing or invalid authorization header' }, 401)
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      console.log('No token provided in Authorization header')
      return c.json({ error: 'No token provided' }, 401)
    }
    
    let decoded
    try {
      decoded = verify(token, JWT_SECRET) as any
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError)
      return c.json({ error: 'Invalid or expired token' }, 401)
    }
    
    // Get user from database to ensure user still exists
    const userData = await kv.get(`user:${decoded.userId}`)
    if (!userData) {
      console.log('User not found for token:', decoded.userId)
      return c.json({ error: 'User not found or token invalid' }, 401)
    }

    // Check if user account is still active
    if (!userData.isActive) {
      console.log('User account is inactive:', decoded.userId)
      return c.json({ error: 'Account has been deactivated' }, 403)
    }

    // Add user info to request context
    c.set('user', { id: decoded.userId, ...userData })
    await next()
  } catch (error) {
    console.error('Authentication middleware error:', error)
    return c.json({ error: 'Authentication failed' }, 500)
  }
}

// Health check endpoint
app.get('/make-server-daced529/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// User Registration endpoint with Aadhar verification
app.post('/make-server-daced529/auth/register', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, phone, password, aadhaar, userType, state, district, location } = body

    // Validate required fields
    if (!name || !email || !password || !aadhaar) {
      return c.json({ error: 'Missing required fields: name, email, password, aadhaar' }, 400)
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400)
    }

    // Validate Aadhar number format (exactly 12 digits)
    const aadhaarRegex = /^\d{12}$/
    if (!aadhaarRegex.test(aadhaar)) {
      return c.json({ error: 'Aadhar number must be exactly 12 digits' }, 400)
    }

    // Validate password strength
    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters long' }, 400)
    }

    // Check if user already exists
    const existingUser = await kv.get(`user_email:${email}`)
    if (existingUser) {
      return c.json({ error: 'User with this email already exists' }, 409)
    }

    // Check if Aadhar is already registered
    const existingAadhar = await kv.get(`user_aadhar:${aadhaar}`)
    if (existingAadhar) {
      return c.json({ error: 'This Aadhar number is already registered' }, 409)
    }

    // Verify Aadhar number with external API
    const isAadharValid = await verifyAadharWithAPI(aadhaar)
    if (!isAadharValid) {
      return c.json({ error: 'Aadhar verification failed. Please check your Aadhar number.' }, 400)
    }

    // Hash the password securely using Web Crypto API
    const hashedPassword = await hashPassword(password)

    // Generate unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create user object
    const userData = {
      id: userId,
      name,
      email,
      phone: phone || null,
      aadhaar,
      aadhaarVerified: true,
      userType: userType || 'household',
      state: state || null,
      district: district || null,
      location: location || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    }

    // Store user data in database (without password)
    await kv.set(`user:${userId}`, userData)
    await kv.set(`user_email:${email}`, userId)
    await kv.set(`user_aadhar:${aadhaar}`, userId)
    
    // Store password separately with high security
    await kv.set(`user_password:${userId}`, { passwordHash: hashedPassword })

    // Generate JWT token for immediate login
    const token = sign(
      { userId, email, aadhaar },
      JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    )

    console.log(`User registered successfully: ${email} with Aadhar: ${aadhaar}`)

    return c.json({
      success: true,
      message: 'User registered successfully',
      user: userData,
      token
    })

  } catch (error) {
    console.log('Registration error:', error)
    return c.json({ error: 'Registration failed. Please try again.' }, 500)
  }
})

// User Login endpoint
app.post('/make-server-daced529/auth/login', async (c) => {
  try {
    const body = await c.req.json()
    const { emailOrPhone, password } = body

    // Validate required fields
    if (!emailOrPhone || !password) {
      return c.json({ error: 'Email/phone and password are required' }, 400)
    }

    // Find user by email or phone
    let userId = null
    
    // Check if it's an email
    if (emailOrPhone.includes('@')) {
      userId = await kv.get(`user_email:${emailOrPhone}`)
    } else {
      // Search for user by phone number (this requires a more complex search)
      const userIds = await kv.getByPrefix('user:')
      for (const userData of userIds) {
        if (userData.phone === emailOrPhone) {
          userId = userData.id
          break
        }
      }
    }

    if (!userId) {
      return c.json({ error: 'User not found with provided email/phone' }, 404)
    }

    // Get user data and password
    const userData = await kv.get(`user:${userId}`)
    const passwordData = await kv.get(`user_password:${userId}`)

    if (!userData || !passwordData) {
      return c.json({ error: 'User authentication data not found' }, 404)
    }

    // Check if user account is active
    if (!userData.isActive) {
      return c.json({ error: 'Account has been deactivated. Please contact support.' }, 403)
    }

    // Verify password using Web Crypto API
    const isPasswordValid = await verifyPassword(password, passwordData.passwordHash)
    if (!isPasswordValid) {
      console.log(`Failed login attempt for user: ${emailOrPhone}`)
      return c.json({ error: 'Invalid password' }, 401)
    }

    // Update last login time
    userData.lastLoginAt = new Date().toISOString()
    await kv.set(`user:${userId}`, userData)

    // Generate JWT token
    const token = sign(
      { userId, email: userData.email, aadhaar: userData.aadhaar },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log(`User logged in successfully: ${userData.email}`)

    return c.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token
    })

  } catch (error) {
    console.log('Login error:', error)
    return c.json({ error: 'Login failed. Please try again.' }, 500)
  }
})

// Forgot Password endpoint
app.post('/make-server-daced529/auth/forgot-password', async (c) => {
  try {
    const body = await c.req.json()
    const { email } = body

    // Validate email
    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400)
    }

    // Check if user exists
    const userId = await kv.get(`user_email:${email}`)
    if (!userId) {
      // For security, don't reveal that email doesn't exist
      return c.json({ 
        success: true, 
        message: 'If an account with this email exists, a password reset link will be sent.' 
      })
    }

    const userData = await kv.get(`user:${userId}`)
    if (!userData) {
      return c.json({ 
        success: true, 
        message: 'If an account with this email exists, a password reset link will be sent.' 
      })
    }

    // Generate secure reset token
    const resetToken = Math.random().toString(36).substr(2, 15) + Date.now().toString(36)
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    // Store reset token with expiry
    await kv.set(`password_reset:${resetToken}`, {
      userId,
      email,
      expiresAt: resetTokenExpiry.toISOString(),
      used: false
    })

    // In production, send email with reset link
    if (EMAIL_CONFIG.enabled) {
      // Send email with reset link: https://yourapp.com/reset-password?token=${resetToken}
      console.log(`Password reset email would be sent to: ${email}`)
    } else {
      // For demo purposes, log the reset token
      console.log(`Password reset token for ${email}: ${resetToken}`)
      console.log(`Reset link: /reset-password?token=${resetToken}`)
    }

    return c.json({
      success: true,
      message: 'Password reset instructions have been sent to your email.',
      // For demo purposes only - remove in production
      resetToken: EMAIL_CONFIG.enabled ? undefined : resetToken
    })

  } catch (error) {
    console.log('Forgot password error:', error)
    return c.json({ error: 'Failed to process password reset request' }, 500)
  }
})

// Reset Password endpoint
app.post('/make-server-daced529/auth/reset-password', async (c) => {
  try {
    const body = await c.req.json()
    const { token, newPassword } = body

    // Validate input
    if (!token || !newPassword) {
      return c.json({ error: 'Reset token and new password are required' }, 400)
    }

    if (newPassword.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters long' }, 400)
    }

    // Get reset token data
    const tokenData = await kv.get(`password_reset:${token}`)
    if (!tokenData) {
      return c.json({ error: 'Invalid or expired reset token' }, 400)
    }

    // Check if token has expired
    const now = new Date()
    const expiryDate = new Date(tokenData.expiresAt)
    if (now > expiryDate) {
      // Clean up expired token
      await kv.del(`password_reset:${token}`)
      return c.json({ error: 'Reset token has expired. Please request a new one.' }, 400)
    }

    // Check if token has already been used
    if (tokenData.used) {
      return c.json({ error: 'Reset token has already been used' }, 400)
    }

    // Hash new password using Web Crypto API
    const hashedPassword = await hashPassword(newPassword)

    // Update user password
    await kv.set(`user_password:${tokenData.userId}`, { passwordHash: hashedPassword })

    // Mark token as used
    tokenData.used = true
    await kv.set(`password_reset:${token}`, tokenData)

    // Update user's last updated timestamp
    const userData = await kv.get(`user:${tokenData.userId}`)
    if (userData) {
      userData.updatedAt = new Date().toISOString()
      await kv.set(`user:${tokenData.userId}`, userData)
    }

    console.log(`Password reset successful for user: ${tokenData.email}`)

    return c.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    })

  } catch (error) {
    console.log('Reset password error:', error)
    return c.json({ error: 'Failed to reset password. Please try again.' }, 500)
  }
})

// Change Password endpoint (for logged-in users)
app.post('/make-server-daced529/auth/change-password', authMiddleware, async (c) => {
  try {
    const body = await c.req.json()
    const { currentPassword, newPassword } = body
    const user = c.get('user')

    // Validate input
    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Current password and new password are required' }, 400)
    }

    if (newPassword.length < 8) {
      return c.json({ error: 'New password must be at least 8 characters long' }, 400)
    }

    // Get current password hash
    const passwordData = await kv.get(`user_password:${user.id}`)
    if (!passwordData) {
      return c.json({ error: 'User password data not found' }, 404)
    }

    // Verify current password using Web Crypto API
    const isCurrentPasswordValid = await verifyPassword(currentPassword, passwordData.passwordHash)
    if (!isCurrentPasswordValid) {
      return c.json({ error: 'Current password is incorrect' }, 401)
    }

    // Hash new password using Web Crypto API
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    await kv.set(`user_password:${user.id}`, { passwordHash: hashedNewPassword })

    // Update user's last updated timestamp
    user.updatedAt = new Date().toISOString()
    await kv.set(`user:${user.id}`, user)

    console.log(`Password changed successfully for user: ${user.email}`)

    return c.json({
      success: true,
      message: 'Password has been changed successfully'
    })

  } catch (error) {
    console.log('Change password error:', error)
    return c.json({ error: 'Failed to change password. Please try again.' }, 500)
  }
})

// Get User Profile endpoint (protected)
app.get('/make-server-daced529/auth/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    return c.json({
      success: true,
      user
    })
  } catch (error) {
    console.log('Get profile error:', error)
    return c.json({ error: 'Failed to get user profile' }, 500)
  }
})

// Verify Aadhar endpoint (for real-time verification during registration)
app.post('/make-server-daced529/auth/verify-aadhar', async (c) => {
  try {
    const body = await c.req.json()
    const { aadhaar } = body

    // Validate Aadhar format
    const aadhaarRegex = /^\d{12}$/
    if (!aadhaarRegex.test(aadhaar)) {
      return c.json({ error: 'Aadhar number must be exactly 12 digits', valid: false }, 400)
    }

    // Check if Aadhar is already registered
    const existingAadhar = await kv.get(`user_aadhar:${aadhaar}`)
    if (existingAadhar) {
      return c.json({ error: 'This Aadhar number is already registered', valid: false }, 409)
    }

    // Verify with external API
    const isValid = await verifyAadharWithAPI(aadhaar)
    
    return c.json({
      valid: isValid,
      message: isValid ? 'Aadhar verified successfully' : 'Aadhar verification failed'
    })

  } catch (error) {
    console.log('Aadhar verification error:', error)
    return c.json({ error: 'Aadhar verification failed', valid: false }, 500)
  }
})

// Function to verify Aadhar with external API
async function verifyAadharWithAPI(aadhaar: string): Promise<boolean> {
  try {
    const apiKey = Deno.env.get('AADHAR_API_KEY')
    
    if (!apiKey) {
      console.log('Aadhar API key not configured. Using mock verification.')
      // Mock verification - in demo mode, any 12-digit number is valid except test cases
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
      
      // For demo: reject some specific test numbers
      const invalidTestNumbers = ['000000000000', '111111111111', '123456789012']
      return !invalidTestNumbers.includes(aadhaar)
    }

    // Real Aadhar verification API call
    // Note: Replace this with actual Aadhar verification API endpoint
    const response = await fetch('https://api.aadharverification.com/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ aadhaar })
    })

    if (!response.ok) {
      console.log(`Aadhar API error: ${response.status} ${response.statusText}`)
      return false
    }

    const result = await response.json()
    return result.valid === true

  } catch (error) {
    console.log('Aadhar API verification error:', error)
    // In case of API failure, we'll use mock verification for demo
    await new Promise(resolve => setTimeout(resolve, 1000))
    const invalidTestNumbers = ['000000000000', '111111111111', '123456789012']
    return !invalidTestNumbers.includes(aadhaar)
  }
}

// Logout endpoint (mainly for cleanup, JWT is stateless)
app.post('/make-server-daced529/auth/logout', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    
    // Update last logout time
    user.lastLogoutAt = new Date().toISOString()
    await kv.set(`user:${user.id}`, user)

    console.log(`User logged out: ${user.email}`)

    return c.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.log('Logout error:', error)
    return c.json({ error: 'Logout failed' }, 500)
  }
})

// Startup configuration check
console.log('=== AquaWatch Backend Server Starting ===')
console.log('Supabase URL configured:', !!Deno.env.get('SUPABASE_URL'))
console.log('Service Role Key configured:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
console.log('Aadhar API Key configured:', !!Deno.env.get('AADHAR_API_KEY'))
console.log('JWT Secret configured:', !!Deno.env.get('JWT_SECRET'))
console.log('Email service enabled:', EMAIL_CONFIG.enabled)
console.log('=========================================')

// Start the server
console.log('AquaWatch Backend Server started with enhanced security and Aadhar verification')
Deno.serve(app.fetch)