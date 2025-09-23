const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'water_quality_issue',
      'infrastructure_damage',
      'illegal_drilling',
      'contamination',
      'drought_conditions',
      'flooding',
      'equipment_malfunction',
      'data_discrepancy',
      'other'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    state: { type: String, required: true },
    district: { type: String, required: true },
    pincode: { type: String, match: /^\d{6}$/ }
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'investigating', 'in_progress', 'resolved', 'rejected'],
    default: 'submitted'
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: { type: Date, default: Date.now }
  }],
  resolutionDetails: {
    description: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    actions_taken: String
  },
  followUp: {
    required: { type: Boolean, default: false },
    scheduledDate: Date,
    completedAt: Date,
    notes: String
  },
  impactAssessment: {
    affectedPopulation: Number,
    economicImpact: Number,
    environmentalImpact: {
      type: String,
      enum: ['minimal', 'moderate', 'significant', 'severe']
    }
  },
  relatedReports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  contactInfo: {
    email: String,
    phone: String,
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'none'],
      default: 'email'
    }
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    submissionMethod: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    }
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate report ID
reportSchema.pre('save', async function(next) {
  if (!this.reportId) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.reportId = `AW-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Virtual for days since submission
reportSchema.virtual('daysSinceSubmission').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to update status
reportSchema.methods.updateStatus = function(newStatus, userId, note) {
  this.status = newStatus;
  
  if (note) {
    this.adminNotes.push({
      note: note,
      addedBy: userId,
      addedAt: new Date()
    });
  }
  
  if (newStatus === 'resolved') {
    this.resolutionDetails.resolvedBy = userId;
    this.resolutionDetails.resolvedAt = new Date();
  }
  
  return this.save();
};

// Method to assign report
reportSchema.methods.assignTo = function(userId, note) {
  this.assignedTo = userId;
  this.status = 'investigating';
  
  if (note) {
    this.adminNotes.push({
      note: `Report assigned: ${note}`,
      addedBy: userId,
      addedAt: new Date()
    });
  }
  
  return this.save();
};

// Static method to get reports by location
reportSchema.statics.getByLocation = function(state, district, limit = 10) {
  return this.find({
    'location.state': state,
    'location.district': district
  })
  .populate('userId', 'name userType')
  .populate('assignedTo', 'name')
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to get reports by user
reportSchema.statics.getByUser = function(userId, limit = 10) {
  return this.find({ userId })
  .populate('assignedTo', 'name')
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to get reports by status
reportSchema.statics.getByStatus = function(status, limit = 10) {
  return this.find({ status })
  .populate('userId', 'name userType location.state location.district')
  .populate('assignedTo', 'name')
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Indexes for efficient queries
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ 'location.state': 1, 'location.district': 1 });
reportSchema.index({ severity: 1, priority: 1 });
reportSchema.index({ reportId: 1 });

module.exports = mongoose.model('Report', reportSchema);