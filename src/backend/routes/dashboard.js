const express = require('express');
const Report = require('../models/Report');
const User = require('../models/User');
const { 
  authenticateToken, 
  requireResearcher,
  optionalAuth 
} = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/dashboard/overview
 * @desc    Get dashboard overview data
 * @access  Private
 */
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { timeframe = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Base query for user's location
    const locationQuery = {
      'location.state': user.location.state,
      'location.district': user.location.district,
      createdAt: { $gte: startDate }
    };

    // Get reports statistics
    const [
      totalReports,
      myReports,
      reportsByStatus,
      reportsBySeverity,
      recentReports
    ] = await Promise.all([
      Report.countDocuments(locationQuery),
      Report.countDocuments({ userId: user._id, createdAt: { $gte: startDate } }),
      
      Report.aggregate([
        { $match: locationQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      Report.aggregate([
        { $match: locationQuery },
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      
      Report.find(locationQuery)
        .populate('userId', 'name userType')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('reportId type title severity status createdAt')
    ]);

    // Generate groundwater data for user's location
    const groundwaterData = generateGroundwaterData(user.location.state, user.location.district);
    
    // Generate weather data
    const weatherData = generateWeatherData(user.location.state, user.location.district);
    
    // Generate role-specific recommendations
    const recommendations = generateRecommendations(user.userType, user.location, groundwaterData);

    res.json({
      success: true,
      data: {
        summary: {
          totalReports,
          myReports,
          location: `${user.location.district}, ${user.location.state}`,
          timeframe
        },
        reports: {
          byStatus: reportsByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          bySeverity: reportsBySeverity.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          recent: recentReports
        },
        groundwater: groundwaterData,
        weather: weatherData,
        recommendations
      }
    });

  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/dashboard/groundwater-levels
 * @desc    Get detailed groundwater level data
 * @access  Private
 */
router.get('/groundwater-levels', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { period = '12m', wellId } = req.query;

    // Generate mock DWLR (Deep Water Level Recording) data
    const dwlrData = generateDWLRData(user.location, period, wellId);
    
    res.json({
      success: true,
      data: dwlrData
    });

  } catch (error) {
    console.error('Groundwater levels error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/dashboard/water-quality
 * @desc    Get water quality data
 * @access  Private
 */
router.get('/water-quality', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { timeframe = '30d' } = req.query;

    // Generate mock water quality data
    const waterQualityData = generateWaterQualityData(user.location, timeframe);
    
    res.json({
      success: true,
      data: waterQualityData
    });

  } catch (error) {
    console.error('Water quality error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/dashboard/alerts
 * @desc    Get alerts and notifications
 * @access  Private
 */
router.get('/alerts', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { type, severity, limit = 10 } = req.query;

    // Generate alerts based on user location and preferences
    const alerts = generateAlerts(user.location, user.userType, { type, severity, limit });
    
    res.json({
      success: true,
      data: { alerts }
    });

  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/dashboard/community-stats
 * @desc    Get community engagement statistics
 * @access  Private
 */
router.get('/community-stats', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { timeframe = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get community statistics
    const [
      totalUsers,
      activeUsers,
      usersByType,
      locationStats
    ] = await Promise.all([
      User.countDocuments({
        'location.state': user.location.state,
        'location.district': user.location.district
      }),
      
      User.countDocuments({
        'location.state': user.location.state,
        'location.district': user.location.district,
        lastLogin: { $gte: startDate }
      }),
      
      User.aggregate([
        { 
          $match: { 
            'location.state': user.location.state,
            'location.district': user.location.district
          } 
        },
        { $group: { _id: '$userType', count: { $sum: 1 } } }
      ]),
      
      Report.aggregate([
        { 
          $match: { 
            'location.state': user.location.state,
            'location.district': user.location.district,
            createdAt: { $gte: startDate }
          } 
        },
        { $group: { _id: '$location.district', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        community: {
          totalUsers,
          activeUsers,
          usersByType: usersByType.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          locationStats: locationStats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        engagement: {
          timeframe,
          activeUserPercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
        }
      }
    });

  } catch (error) {
    console.error('Community stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/dashboard/research-data
 * @desc    Get research datasets (Researcher only)
 * @access  Private (Researcher)
 */
router.get('/research-data', authenticateToken, requireResearcher, async (req, res) => {
  try {
    const { 
      state, 
      district, 
      startDate, 
      endDate, 
      dataType = 'all',
      format = 'json' 
    } = req.query;

    // Build query based on filters
    const query = {};
    
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get aggregated research data
    const [
      reports,
      users,
      groundwaterTrends,
      waterQualityTrends
    ] = await Promise.all([
      dataType === 'all' || dataType === 'reports' ? 
        Report.find(query)
          .populate('userId', 'userType location.state location.district')
          .select('-attachments -adminNotes')
          .sort({ createdAt: -1 }) : [],
      
      dataType === 'all' || dataType === 'users' ?
        User.find(state || district ? {
          'location.state': state || { $exists: true },
          'location.district': district || { $exists: true }
        } : {})
          .select('userType location createdAt isResearcher')
          .sort({ createdAt: -1 }) : [],
      
      dataType === 'all' || dataType === 'groundwater' ?
        generateResearchGroundwaterData(state, district, startDate, endDate) : [],
      
      dataType === 'all' || dataType === 'water-quality' ?
        generateResearchWaterQualityData(state, district, startDate, endDate) : []
    ]);

    const researchData = {
      metadata: {
        exportDate: new Date(),
        filters: { state, district, startDate, endDate, dataType },
        recordCounts: {
          reports: reports.length,
          users: users.length,
          groundwaterPoints: groundwaterTrends.length,
          waterQualityPoints: waterQualityTrends.length
        }
      },
      data: {
        reports,
        users,
        groundwaterTrends,
        waterQualityTrends
      }
    };

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(researchData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="aquawatch-research-data-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvData);
    } else {
      res.json({
        success: true,
        data: researchData
      });
    }

  } catch (error) {
    console.error('Research data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Helper Functions
 */

function generateGroundwaterData(state, district) {
  const baseLevel = getStaticGroundwaterLevel(state, district);
  const seasonalVariation = Math.sin((new Date().getMonth() / 12) * 2 * Math.PI) * 3;
  const currentLevel = baseLevel + seasonalVariation + (Math.random() - 0.5) * 2;
  
  return {
    currentLevel: Math.round(currentLevel * 100) / 100,
    staticLevel: baseLevel,
    trend: seasonalVariation > 0 ? 'increasing' : 'decreasing',
    quality: getWaterQuality(currentLevel),
    lastUpdated: new Date(),
    historicalData: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      level: baseLevel + Math.sin(((11 - i) / 12) * 2 * Math.PI) * 3 + (Math.random() - 0.5),
      quality: Math.random() > 0.8 ? 'poor' : Math.random() > 0.3 ? 'good' : 'excellent'
    }))
  };
}

function generateWeatherData(state, district) {
  const baseTemp = getRegionalBaseTemperature(state);
  const seasonalTemp = Math.sin((new Date().getMonth() / 12) * 2 * Math.PI) * 10;
  
  return {
    current: {
      temperature: Math.round(baseTemp + seasonalTemp + (Math.random() - 0.5) * 5),
      humidity: Math.round(60 + (Math.random() - 0.5) * 30),
      rainfall: Math.max(0, Math.random() * 15),
      windSpeed: Math.round(Math.random() * 20),
      condition: getWeatherCondition()
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      temperature: Math.round(baseTemp + seasonalTemp + (Math.random() - 0.5) * 8),
      humidity: Math.round(60 + (Math.random() - 0.5) * 30),
      rainfall: Math.max(0, Math.random() * 15),
      condition: getWeatherCondition()
    }))
  };
}

function generateRecommendations(userType, location, groundwaterData) {
  const recommendations = [];
  
  // Base recommendations for all users
  if (groundwaterData.currentLevel < groundwaterData.staticLevel - 2) {
    recommendations.push({
      id: 'low_groundwater',
      title: 'Groundwater Level Alert',
      description: 'Groundwater levels are below normal. Implement water conservation measures.',
      priority: 'high',
      category: 'alert',
      actionable: true,
      estimatedImpact: 'High'
    });
  }

  // Role-specific recommendations
  const roleRecommendations = {
    'Farmer': [
      {
        id: 'drip_irrigation',
        title: 'Switch to Drip Irrigation',
        description: 'Reduce water usage by 30-50% with efficient irrigation systems.',
        priority: 'high',
        category: 'efficiency',
        actionable: true,
        estimatedImpact: 'High'
      },
      {
        id: 'crop_rotation',
        title: 'Implement Crop Rotation',
        description: 'Use drought-resistant crops during low groundwater periods.',
        priority: 'medium',
        category: 'adaptation',
        actionable: true,
        estimatedImpact: 'Medium'
      }
    ],
    'Household': [
      {
        id: 'rainwater_harvesting',
        title: 'Install Rainwater Harvesting',
        description: 'Collect and store rainwater for future use.',
        priority: 'medium',
        category: 'harvesting',
        actionable: true,
        estimatedImpact: 'Medium'
      },
      {
        id: 'water_efficient_appliances',
        title: 'Use Water-Efficient Appliances',
        description: 'Upgrade to low-flow fixtures and efficient appliances.',
        priority: 'low',
        category: 'efficiency',
        actionable: true,
        estimatedImpact: 'Low'
      }
    ],
    'Policymaker': [
      {
        id: 'water_management_policy',
        title: 'Implement Water Management Policies',
        description: 'Develop comprehensive groundwater management strategies.',
        priority: 'high',
        category: 'policy',
        actionable: true,
        estimatedImpact: 'Very High'
      }
    ],
    'Businessman': [
      {
        id: 'industrial_recycling',
        title: 'Industrial Water Recycling',
        description: 'Implement closed-loop water systems in operations.',
        priority: 'high',
        category: 'recycling',
        actionable: true,
        estimatedImpact: 'High'
      }
    ],
    'Researcher': [
      {
        id: 'data_driven_insights',
        title: 'Advanced Analytics',
        description: 'Use machine learning for groundwater level prediction.',
        priority: 'high',
        category: 'research',
        actionable: true,
        estimatedImpact: 'Very High'
      }
    ]
  };

  recommendations.push(...(roleRecommendations[userType] || []));
  
  return recommendations;
}

function generateDWLRData(location, period, wellId) {
  const periodMap = {
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '12m': 365
  };
  
  const days = periodMap[period] || 365;
  const baseLevel = getStaticGroundwaterLevel(location.state, location.district);
  
  return {
    wellId: wellId || `WELL_${location.state}_${location.district}_001`,
    location,
    period,
    data: Array.from({ length: Math.min(days, 365) }, (_, i) => {
      const date = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000);
      const seasonalVariation = Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 3;
      const randomVariation = (Math.random() - 0.5) * 2;
      
      return {
        date: date.toISOString().slice(0, 10),
        level: Math.round((baseLevel + seasonalVariation + randomVariation) * 100) / 100,
        quality: getWaterQuality(baseLevel + seasonalVariation + randomVariation),
        temperature: Math.round(25 + (Math.random() - 0.5) * 10)
      };
    })
  };
}

function generateWaterQualityData(location, timeframe) {
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  
  return {
    location,
    timeframe,
    parameters: {
      pH: {
        current: Math.round((7 + (Math.random() - 0.5) * 2) * 100) / 100,
        acceptable_range: [6.5, 8.5],
        status: 'normal'
      },
      tds: {
        current: Math.round(300 + Math.random() * 200),
        acceptable_range: [0, 500],
        status: 'normal',
        unit: 'ppm'
      },
      chloride: {
        current: Math.round(50 + Math.random() * 100),
        acceptable_range: [0, 250],
        status: 'normal',
        unit: 'mg/L'
      },
      fluoride: {
        current: Math.round((0.5 + Math.random() * 1) * 100) / 100,
        acceptable_range: [0, 1.5],
        status: 'normal',
        unit: 'mg/L'
      }
    },
    historicalData: Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().slice(0, 10),
        pH: Math.round((7 + (Math.random() - 0.5) * 2) * 100) / 100,
        tds: Math.round(300 + Math.random() * 200),
        chloride: Math.round(50 + Math.random() * 100),
        fluoride: Math.round((0.5 + Math.random() * 1) * 100) / 100,
        overallQuality: Math.random() > 0.8 ? 'poor' : Math.random() > 0.3 ? 'good' : 'excellent'
      };
    })
  };
}

function generateAlerts(location, userType, filters) {
  const alerts = [];
  const alertTypes = ['water_level', 'water_quality', 'weather', 'policy', 'maintenance'];
  
  alertTypes.forEach(type => {
    if (Math.random() > 0.7) { // 30% chance for each alert type
      alerts.push({
        id: `alert_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        title: getAlertTitle(type),
        message: getAlertMessage(type, location),
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        isRead: Math.random() > 0.5,
        actionRequired: Math.random() > 0.6,
        relatedTo: userType
      });
    }
  });
  
  return alerts.slice(0, parseInt(filters.limit) || 10);
}

// Utility functions
function getStaticGroundwaterLevel(state, district) {
  const stateLevels = {
    'Punjab': 8,
    'Haryana': 12,
    'Rajasthan': 25,
    'Gujarat': 18,
    'Maharashtra': 15,
    'Karnataka': 20,
    'Tamil Nadu': 16,
    'Andhra Pradesh': 14,
    'Kerala': 10,
    'West Bengal': 6
  };
  
  return stateLevels[state] || 15 + (Math.random() - 0.5) * 10;
}

function getRegionalBaseTemperature(state) {
  const stateTemps = {
    'Punjab': 25,
    'Haryana': 26,
    'Rajasthan': 30,
    'Gujarat': 28,
    'Maharashtra': 27,
    'Karnataka': 26,
    'Tamil Nadu': 29,
    'Kerala': 28,
    'West Bengal': 27
  };
  
  return stateTemps[state] || 26;
}

function getWaterQuality(level) {
  if (level < 5) return 'poor';
  if (level < 15) return 'good';
  return 'excellent';
}

function getWeatherCondition() {
  const conditions = ['sunny', 'partly_cloudy', 'cloudy', 'rainy', 'stormy'];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

function getAlertTitle(type) {
  const titles = {
    'water_level': 'Groundwater Level Alert',
    'water_quality': 'Water Quality Warning',
    'weather': 'Weather Advisory',
    'policy': 'Policy Update',
    'maintenance': 'System Maintenance'
  };
  
  return titles[type] || 'General Alert';
}

function getAlertMessage(type, location) {
  const messages = {
    'water_level': `Groundwater levels in ${location.district} are below seasonal average`,
    'water_quality': `Water quality parameters require attention in your area`,
    'weather': `Unusual weather patterns detected in ${location.state}`,
    'policy': `New water management policies announced for ${location.state}`,
    'maintenance': `Scheduled maintenance for monitoring equipment in your area`
  };
  
  return messages[type] || 'Important notification for your area';
}

function generateResearchGroundwaterData(state, district, startDate, endDate) {
  // Generate synthetic research data
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    location: { state: state || 'Sample State', district: district || 'Sample District' },
    date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    level: Math.round((15 + Math.random() * 20) * 100) / 100,
    quality: Math.random() > 0.8 ? 'poor' : Math.random() > 0.3 ? 'good' : 'excellent',
    temperature: Math.round(25 + (Math.random() - 0.5) * 10),
    pH: Math.round((7 + (Math.random() - 0.5) * 2) * 100) / 100
  }));
}

function generateResearchWaterQualityData(state, district, startDate, endDate) {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    location: { state: state || 'Sample State', district: district || 'Sample District' },
    date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    pH: Math.round((7 + (Math.random() - 0.5) * 2) * 100) / 100,
    tds: Math.round(300 + Math.random() * 200),
    chloride: Math.round(50 + Math.random() * 100),
    fluoride: Math.round((0.5 + Math.random() * 1) * 100) / 100,
    overallQuality: Math.random() > 0.8 ? 'poor' : Math.random() > 0.3 ? 'good' : 'excellent'
  }));
}

function convertToCSV(data) {
  // Simple CSV conversion - in a real app you'd want a proper CSV library
  const csvRows = [];
  
  // Add reports data
  if (data.data.reports.length > 0) {
    csvRows.push('--- REPORTS ---');
    csvRows.push('Report ID,Type,Title,Severity,Status,State,District,Created At');
    data.data.reports.forEach(report => {
      csvRows.push([
        report.reportId,
        report.type,
        `"${report.title.replace(/"/g, '""')}"`,
        report.severity,
        report.status,
        report.location.state,
        report.location.district,
        report.createdAt
      ].join(','));
    });
    csvRows.push('');
  }
  
  return csvRows.join('\n');
}

module.exports = router;