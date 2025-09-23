const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const User = require('../models/User');
const { 
  authenticateToken, 
  requireResearcher,
  sensitiveOperationLimit,
  validateOwnership 
} = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/user/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mask Aadhar number for security
    const userProfile = {
      ...user.toObject(),
      aadharNumber: user.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX XXXX $3')
    };

    res.json({
      success: true,
      data: { user: userProfile }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      location,
      preferences
    } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    if (name) user.name = name.trim();
    
    if (phoneNumber) {
      if (!/^\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number format'
        });
      }
      user.phoneNumber = phoneNumber;
    }

    if (location) {
      if (location.state) user.location.state = location.state.trim();
      if (location.district) user.location.district = location.district.trim();
      if (location.coordinates) {
        user.location.coordinates = location.coordinates;
      }
    }

    if (preferences) {
      if (preferences.notifications) {
        user.preferences.notifications = {
          ...user.preferences.notifications,
          ...preferences.notifications
        };
      }
      if (preferences.theme) {
        const validThemes = ['light', 'dark', 'auto'];
        if (validThemes.includes(preferences.theme)) {
          user.preferences.theme = preferences.theme;
        }
      }
      if (preferences.language) {
        user.preferences.language = preferences.language;
      }
    }

    await user.save();

    // Return updated profile (without password)
    const updatedUser = await User.findById(user._id).select('-password');
    const userProfile = {
      ...updatedUser.toObject(),
      aadharNumber: updatedUser.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX XXXX $3')
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: userProfile }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/user/upgrade-to-researcher
 * @desc    Request upgrade to researcher role
 * @access  Private
 */
router.post('/upgrade-to-researcher', authenticateToken, sensitiveOperationLimit(), async (req, res) => {
  try {
    const { googleScholarId } = req.body;

    if (!googleScholarId) {
      return res.status(400).json({
        success: false,
        message: 'Google Scholar ID is required'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isResearcher) {
      return res.status(400).json({
        success: false,
        message: 'User is already a researcher'
      });
    }

    if (user.researcherVerificationStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Researcher verification is already pending'
      });
    }

    // Verify Google Scholar ID (basic validation)
    if (!/^[A-Za-z0-9_-]+$/.test(googleScholarId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google Scholar ID format'
      });
    }

    // Optional: Verify Google Scholar profile exists
    try {
      const scholarUrl = `https://scholar.google.com/citations?user=${googleScholarId}`;
      const response = await axios.get(scholarUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AquaWatch/1.0)'
        }
      });
      
      if (response.status !== 200) {
        return res.status(400).json({
          success: false,
          message: 'Google Scholar profile not found or not accessible'
        });
      }
    } catch (scholarError) {
      console.warn('Google Scholar verification failed:', scholarError.message);
      // Continue with the process even if verification fails
      // as Google Scholar might block automated requests
    }

    // Update user status
    user.googleScholarId = googleScholarId;
    user.researcherVerificationStatus = 'approved'; // Auto-approve for demo
    user.isResearcher = true;
    user.researcherVerificationDate = new Date();
    
    await user.save();

    // Return updated profile
    const updatedUser = await User.findById(user._id).select('-password');
    const userProfile = {
      ...updatedUser.toObject(),
      aadharNumber: updatedUser.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX XXXX $3')
    };

    res.json({
      success: true,
      message: 'Researcher upgrade approved successfully',
      data: { user: userProfile }
    });

  } catch (error) {
    console.error('Researcher upgrade error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during researcher upgrade'
    });
  }
});

/**
 * @route   GET /api/user/researcher-status
 * @desc    Get researcher verification status
 * @access  Private
 */
router.get('/researcher-status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('isResearcher googleScholarId researcherVerificationStatus researcherVerificationDate');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        isResearcher: user.isResearcher,
        googleScholarId: user.googleScholarId,
        verificationStatus: user.researcherVerificationStatus,
        verificationDate: user.researcherVerificationDate
      }
    });

  } catch (error) {
    console.error('Get researcher status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/user/dashboard-data
 * @desc    Get user dashboard data
 * @access  Private
 */
router.get('/dashboard-data', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's location-based data
    const { state, district } = user.location;
    
    // Mock groundwater data based on location
    const mockGroundwaterData = generateMockGroundwaterData(state, district);
    
    // Mock weather data
    const mockWeatherData = generateMockWeatherData(state, district);
    
    // Mock recommendations based on user type and location
    const recommendations = generateMockRecommendations(user.userType, state, district);

    // User statistics
    const userStats = {
      accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)),
      lastLogin: user.lastLogin,
      profileCompletion: calculateProfileCompletion(user),
      isResearcher: user.isResearcher,
      researcherStatus: user.researcherVerificationStatus
    };

    res.json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          aadharNumber: user.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX XXXX $3')
        },
        groundwaterData: mockGroundwaterData,
        weatherData: mockWeatherData,
        recommendations,
        userStats
      }
    });

  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   DELETE /api/user/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticateToken, sensitiveOperationLimit(), async (req, res) => {
  try {
    const { password, confirmation } = req.body;

    if (!password || confirmation !== 'DELETE_ACCOUNT') {
      return res.status(400).json({
        success: false,
        message: 'Password and confirmation required'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // In a real application, you might want to anonymize reports instead of deleting them
    // For now, we'll just delete the user account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Helper function to generate mock groundwater data
 */
function generateMockGroundwaterData(state, district) {
  const baseLevel = Math.random() * 20 + 5; // 5-25 meters
  const trend = Math.random() > 0.5 ? 'increasing' : 'decreasing';
  
  return {
    currentLevel: baseLevel,
    trend,
    lastUpdated: new Date(),
    historicalData: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      level: baseLevel + (Math.random() - 0.5) * 5,
      quality: Math.random() > 0.8 ? 'poor' : Math.random() > 0.3 ? 'good' : 'excellent'
    })),
    alerts: Math.random() > 0.7 ? [
      {
        type: 'water_level_low',
        message: 'Groundwater level is below normal for this season',
        severity: 'medium',
        timestamp: new Date()
      }
    ] : []
  };
}

/**
 * Helper function to generate mock weather data
 */
function generateMockWeatherData(state, district) {
  return {
    current: {
      temperature: Math.round(Math.random() * 20 + 15), // 15-35°C
      humidity: Math.round(Math.random() * 40 + 40), // 40-80%
      rainfall: Math.random() * 10, // 0-10mm
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)]
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      temperature: Math.round(Math.random() * 20 + 15),
      humidity: Math.round(Math.random() * 40 + 40),
      rainfall: Math.random() * 10,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)]
    }))
  };
}

/**
 * Helper function to generate mock recommendations
 */
function generateMockRecommendations(userType, state, district) {
  const commonRecommendations = [
    {
      id: 'water_conservation',
      title: 'Water Conservation Tips',
      description: 'Simple ways to reduce water consumption in daily activities',
      priority: 'medium',
      category: 'conservation'
    },
    {
      id: 'groundwater_monitoring',
      title: 'Monitor Groundwater Levels',
      description: 'Regular monitoring helps in early detection of issues',
      priority: 'high',
      category: 'monitoring'
    }
  ];

  const roleSpecificRecommendations = {
    'Farmer': [
      {
        id: 'irrigation_efficiency',
        title: 'Improve Irrigation Efficiency',
        description: 'Switch to drip irrigation to reduce water wastage',
        priority: 'high',
        category: 'agriculture'
      },
      {
        id: 'crop_selection',
        title: 'Drought-Resistant Crops',
        description: 'Consider crops that require less water',
        priority: 'medium',
        category: 'agriculture'
      }
    ],
    'Household': [
      {
        id: 'rainwater_harvesting',
        title: 'Rainwater Harvesting',
        description: 'Install systems to collect and store rainwater',
        priority: 'medium',
        category: 'harvesting'
      }
    ],
    'Policymaker': [
      {
        id: 'policy_implementation',
        title: 'Water Management Policies',
        description: 'Implement comprehensive water management strategies',
        priority: 'high',
        category: 'policy'
      }
    ],
    'Businessman': [
      {
        id: 'industrial_recycling',
        title: 'Industrial Water Recycling',
        description: 'Implement water recycling systems in operations',
        priority: 'high',
        category: 'industrial'
      }
    ],
    'Researcher': [
      {
        id: 'data_analysis',
        title: 'Advanced Data Analysis',
        description: 'Use AI/ML techniques for groundwater prediction',
        priority: 'high',
        category: 'research'
      }
    ]
  };

  return [
    ...commonRecommendations,
    ...(roleSpecificRecommendations[userType] || [])
  ];
}

/**
 * Helper function to calculate profile completion percentage
 */
function calculateProfileCompletion(user) {
  let completion = 0;
  const fields = [
    user.name,
    user.email,
    user.phoneNumber,
    user.location.state,
    user.location.district,
    user.isEmailVerified
  ];

  fields.forEach(field => {
    if (field) completion += 100 / fields.length;
  });

  return Math.round(completion);
}

module.exports = router;