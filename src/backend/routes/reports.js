const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Report = require('../models/Report');
const { 
  authenticateToken, 
  requireResearcher, 
  validateOwnership,
  sensitiveOperationLimit 
} = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/reports');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `report-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

/**
 * @route   POST /api/reports/submit
 * @desc    Submit a new report/issue
 * @access  Private
 */
router.post('/submit', authenticateToken, upload.array('attachments', 5), async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      location,
      severity,
      isAnonymous,
      contactInfo
    } = req.body;

    // Input validation
    if (!type || !title || !description || !location || !severity) {
      return res.status(400).json({
        success: false,
        message: 'Type, title, description, location, and severity are required'
      });
    }

    // Parse location if it's a string
    let parsedLocation;
    try {
      parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location format'
      });
    }

    // Validate location data
    if (!parsedLocation.address || !parsedLocation.coordinates || 
        !parsedLocation.state || !parsedLocation.district) {
      return res.status(400).json({
        success: false,
        message: 'Complete location information is required'
      });
    }

    // Validate coordinates
    const { latitude, longitude } = parsedLocation.coordinates;
    if (!latitude || !longitude || 
        Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      return res.status(400).json({
        success: false,
        message: 'Valid coordinates are required'
      });
    }

    // Process uploaded files
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: `/uploads/reports/${file.filename}`,
          uploadedAt: new Date()
        });
      }
    }

    // Determine priority based on severity
    const priorityMap = {
      'low': 'low',
      'medium': 'medium', 
      'high': 'high',
      'critical': 'urgent'
    };

    // Create report
    const newReport = new Report({
      userId: req.user._id,
      type,
      title: title.trim(),
      description: description.trim(),
      location: parsedLocation,
      severity,
      priority: priorityMap[severity] || 'medium',
      attachments,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      contactInfo: contactInfo ? (typeof contactInfo === 'string' ? JSON.parse(contactInfo) : contactInfo) : {
        email: req.user.email,
        phone: req.user.phoneNumber,
        preferredContact: 'email'
      },
      metadata: {
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip || req.connection.remoteAddress,
        submissionMethod: 'web'
      }
    });

    await newReport.save();

    // Populate user information for response
    await newReport.populate('userId', 'name userType location.state location.district');

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      report: {
        reportId: newReport.reportId,
        _id: newReport._id,
        type: newReport.type,
        title: newReport.title,
        description: newReport.description,
        location: newReport.location,
        severity: newReport.severity,
        priority: newReport.priority,
        status: newReport.status,
        attachments: newReport.attachments,
        createdAt: newReport.createdAt,
        submittedBy: newReport.isAnonymous ? 'Anonymous' : newReport.userId.name
      }
    });

  } catch (error) {
    console.error('Report submission error:', error);
    
    // Clean up uploaded files if report creation failed
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Failed to clean up file:', unlinkError);
        }
      }
    }

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
      message: 'Internal server error during report submission'
    });
  }
});

/**
 * @route   GET /api/reports/my-reports
 * @desc    Get current user's reports
 * @access  Private
 */
router.get('/my-reports', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, severity } = req.query;
    
    // Build query
    const query = { userId: req.user._id };
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (severity) query.severity = severity;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get reports with pagination
    const reports = await Report.find(query)
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReports = await Report.countDocuments(query);
    const totalPages = Math.ceil(totalReports / parseInt(limit));

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalReports,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/reports/:reportId
 * @desc    Get specific report details
 * @access  Private
 */
router.get('/:reportId', authenticateToken, async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findOne({
      $or: [
        { _id: reportId },
        { reportId: reportId }
      ]
    })
    .populate('userId', 'name userType location.state location.district')
    .populate('assignedTo', 'name email')
    .populate('adminNotes.addedBy', 'name')
    .populate('resolutionDetails.resolvedBy', 'name');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user can access this report
    const canAccess = report.userId._id.equals(req.user._id) || 
                     req.user.userType === 'Admin' ||
                     (report.assignedTo && report.assignedTo._id.equals(req.user._id));

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { report }
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/reports/public/by-location
 * @desc    Get reports by location (public data for map view)
 * @access  Private
 */
router.get('/public/by-location', authenticateToken, async (req, res) => {
  try {
    const { state, district, limit = 50 } = req.query;

    if (!state || !district) {
      return res.status(400).json({
        success: false,
        message: 'State and district are required'
      });
    }

    const reports = await Report.find({
      'location.state': state,
      'location.district': district,
      status: { $ne: 'rejected' } // Exclude rejected reports
    })
    .select('reportId type title location severity priority status createdAt')
    .populate('userId', 'userType')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: { reports }
    });

  } catch (error) {
    console.error('Get reports by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/reports/:reportId/status
 * @desc    Update report status (Admin only)
 * @access  Private (Admin)
 */
router.put('/:reportId/status', authenticateToken, async (req, res) => {
  try {
    // This would require admin middleware in a real implementation
    if (req.user.userType !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { reportId } = req.params;
    const { status, note, resolutionDetails } = req.body;

    const report = await Report.findOne({
      $or: [
        { _id: reportId },
        { reportId: reportId }
      ]
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update status
    await report.updateStatus(status, req.user._id, note);

    // Add resolution details if resolving
    if (status === 'resolved' && resolutionDetails) {
      report.resolutionDetails.description = resolutionDetails.description;
      report.resolutionDetails.actions_taken = resolutionDetails.actions_taken;
      await report.save();
    }

    await report.populate('userId', 'name userType');
    await report.populate('assignedTo', 'name');

    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: { report }
    });

  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/reports/statistics/dashboard
 * @desc    Get report statistics for dashboard
 * @access  Private
 */
router.get('/statistics/dashboard', authenticateToken, async (req, res) => {
  try {
    const { timeframe = '30d', location } = req.query;

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

    // Build base query
    let baseQuery = {
      createdAt: { $gte: startDate }
    };

    // Add location filter if provided
    if (location) {
      try {
        const locationObj = JSON.parse(location);
        if (locationObj.state) baseQuery['location.state'] = locationObj.state;
        if (locationObj.district) baseQuery['location.district'] = locationObj.district;
      } catch (error) {
        console.error('Invalid location format:', error);
      }
    }

    // Get various statistics
    const [
      totalReports,
      reportsByStatus,
      reportsByType,
      reportsBySeverity,
      recentReports
    ] = await Promise.all([
      Report.countDocuments(baseQuery),
      
      Report.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      Report.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      
      Report.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      
      Report.find(baseQuery)
        .populate('userId', 'name userType')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('reportId type title severity status createdAt')
    ]);

    res.json({
      success: true,
      data: {
        totalReports,
        reportsByStatus: reportsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        reportsByType: reportsByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        reportsBySeverity: reportsBySeverity.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentReports,
        timeframe,
        dateRange: {
          start: startDate,
          end: now
        }
      }
    });

  } catch (error) {
    console.error('Get report statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/reports/export/csv
 * @desc    Export reports to CSV (Researcher only)
 * @access  Private (Researcher)
 */
router.get('/export/csv', authenticateToken, requireResearcher, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      state, 
      district, 
      type, 
      severity, 
      status 
    } = req.query;

    // Build query
    const query = {};
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;
    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('userId', 'name userType')
      .select('-attachments -adminNotes -metadata')
      .sort({ createdAt: -1 });

    // Convert to CSV format
    const csvHeaders = [
      'Report ID',
      'Type',
      'Title',
      'Description',
      'Severity',
      'Priority',
      'Status',
      'State',
      'District',
      'Address',
      'Latitude',
      'Longitude',
      'Submitted By',
      'User Type',
      'Created At',
      'Days Since Submission'
    ];

    const csvRows = reports.map(report => [
      report.reportId,
      report.type,
      `"${report.title.replace(/"/g, '""')}"`,
      `"${report.description.replace(/"/g, '""')}"`,
      report.severity,
      report.priority,
      report.status,
      report.location.state,
      report.location.district,
      `"${report.location.address.replace(/"/g, '""')}"`,
      report.location.coordinates.latitude,
      report.location.coordinates.longitude,
      report.isAnonymous ? 'Anonymous' : (report.userId ? report.userId.name : 'Unknown'),
      report.userId ? report.userId.userType : 'Unknown',
      report.createdAt.toISOString(),
      report.daysSinceSubmission
    ]);

    const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="aquawatch-reports-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Export reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during export'
    });
  }
});

module.exports = router;