const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  aadharNumber: {
    type: String,
    required: true,
    unique: true,
    length: 12,
    match: /^\d{12}$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: String,
    enum: ['Farmer', 'Household', 'Policymaker', 'Businessman', 'Researcher'],
    required: true
  },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isResearcher: {
    type: Boolean,
    default: false
  },
  googleScholarId: {
    type: String,
    default: null
  },
  researcherVerificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: null
  },
  researcherVerificationDate: {
    type: Date,
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    match: /^\d{10}$/
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Virtual for account locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to check if user is researcher
userSchema.methods.isResearcherRole = function() {
  return this.userType === 'Researcher' || this.isResearcher;
};

// Method to upgrade to researcher
userSchema.methods.upgradeToResearcher = function(googleScholarId) {
  this.isResearcher = true;
  this.googleScholarId = googleScholarId;
  this.researcherVerificationStatus = 'approved';
  this.researcherVerificationDate = new Date();
  return this.save();
};

// Index for efficient queries
userSchema.index({ aadharNumber: 1 });
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ 'location.state': 1, 'location.district': 1 });

module.exports = mongoose.model('User', userSchema);