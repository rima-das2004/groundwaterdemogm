const mongoose = require('mongoose');
const User = require('../models/User');
const Report = require('../models/Report');
const { generateValidAadhar } = require('../utils/aadharVerification');
require('dotenv').config();

// Sample data for seeding
const sampleUsers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.farmer@example.com',
    userType: 'Farmer',
    location: { state: 'Punjab', district: 'Ludhiana', coordinates: { latitude: 30.9010, longitude: 75.8573 } },
    phoneNumber: '9876543210'
  },
  {
    name: 'Priya Sharma',
    email: 'priya.household@example.com',
    userType: 'Household',
    location: { state: 'Haryana', district: 'Gurgaon', coordinates: { latitude: 28.4595, longitude: 77.0266 } },
    phoneNumber: '9876543211'
  },
  {
    name: 'Dr. Anil Verma',
    email: 'anil.researcher@example.com',
    userType: 'Researcher',
    location: { state: 'Delhi', district: 'New Delhi', coordinates: { latitude: 28.7041, longitude: 77.1025 } },
    phoneNumber: '9876543212',
    isResearcher: true,
    googleScholarId: 'sample123',
    researcherVerificationStatus: 'approved'
  },
  {
    name: 'Sunita Patel',
    email: 'sunita.policy@example.com',
    userType: 'Policymaker',
    location: { state: 'Gujarat', district: 'Ahmedabad', coordinates: { latitude: 23.0225, longitude: 72.5714 } },
    phoneNumber: '9876543213'
  },
  {
    name: 'Ravi Businessman',
    email: 'ravi.business@example.com',
    userType: 'Businessman',
    location: { state: 'Maharashtra', district: 'Mumbai', coordinates: { latitude: 19.0760, longitude: 72.8777 } },
    phoneNumber: '9876543214'
  }
];

const sampleReports = [
  {
    type: 'water_quality_issue',
    title: 'High TDS levels in groundwater',
    description: 'Recent tests show significantly elevated Total Dissolved Solids in the local groundwater supply. This is affecting crop yield and needs immediate attention.',
    severity: 'high',
    location: {
      address: 'Village Khanna, Punjab',
      coordinates: { latitude: 30.9010, longitude: 75.8573 },
      state: 'Punjab',
      district: 'Ludhiana',
      pincode: '141001'
    }
  },
  {
    type: 'infrastructure_damage',
    title: 'Broken hand pump in community well',
    description: 'The main community hand pump has been non-functional for over a week. Approximately 50 families are affected.',
    severity: 'medium',
    location: {
      address: 'Sector 14, Gurgaon',
      coordinates: { latitude: 28.4595, longitude: 77.0266 },
      state: 'Haryana',
      district: 'Gurgaon',
      pincode: '122001'
    }
  },
  {
    type: 'illegal_drilling',
    title: 'Unauthorized borewell drilling observed',
    description: 'Unauthorized deep borewell drilling activity spotted in residential area. This could affect the local water table.',
    severity: 'high',
    location: {
      address: 'Vastrapur, Ahmedabad',
      coordinates: { latitude: 23.0225, longitude: 72.5714 },
      state: 'Gujarat',
      district: 'Ahmedabad',
      pincode: '380015'
    }
  },
  {
    type: 'contamination',
    title: 'Suspected industrial contamination',
    description: 'Unusual color and odor detected in groundwater near industrial area. Requires immediate testing and remediation.',
    severity: 'critical',
    location: {
      address: 'Andheri Industrial Area, Mumbai',
      coordinates: { latitude: 19.0760, longitude: 72.8777 },
      state: 'Maharashtra',
      district: 'Mumbai',
      pincode: '400053'
    }
  },
  {
    type: 'drought_conditions',
    title: 'Severe water shortage in rural area',
    description: 'Groundwater levels have dropped to critical levels. Community wells are drying up.',
    severity: 'critical',
    location: {
      address: 'Rajkot Rural Area',
      coordinates: { latitude: 22.3039, longitude: 70.8022 },
      state: 'Gujarat',
      district: 'Rajkot',
      pincode: '360001'
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aquawatch', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Report.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    
    for (let i = 0; i < sampleUsers.length; i++) {
      const userData = sampleUsers[i];
      
      // Generate valid Aadhar number
      const aadharNumber = generateValidAadhar();
      
      const user = new User({
        ...userData,
        aadharNumber,
        password: 'password123', // This will be hashed by the pre-save middleware
        isEmailVerified: true, // Skip email verification for seed data
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random last login within 30 days
      });

      const savedUser = await user.save();
      createdUsers.push(savedUser);
      
      console.log(`Created user: ${userData.name} (${userData.userType}) with Aadhar: ${aadharNumber}`);
    }

    // Create reports
    const createdReports = [];
    
    for (let i = 0; i < sampleReports.length; i++) {
      const reportData = sampleReports[i];
      
      // Assign random user as reporter
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      const report = new Report({
        ...reportData,
        userId: randomUser._id,
        priority: reportData.severity === 'critical' ? 'urgent' : 
                 reportData.severity === 'high' ? 'high' : 
                 reportData.severity === 'medium' ? 'medium' : 'low',
        status: ['submitted', 'under_review', 'investigating'][Math.floor(Math.random() * 3)],
        contactInfo: {
          email: randomUser.email,
          phone: randomUser.phoneNumber,
          preferredContact: 'email'
        },
        metadata: {
          userAgent: 'Mozilla/5.0 (Seed Script)',
          ipAddress: '127.0.0.1',
          submissionMethod: 'api'
        },
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) // Random creation within 60 days
      });

      const savedReport = await report.save();
      createdReports.push(savedReport);
      
      console.log(`Created report: ${reportData.title} (${savedReport.reportId}) by ${randomUser.name}`);
    }

    // Add some admin notes to random reports
    const reportsToUpdate = createdReports.slice(0, 3);
    for (const report of reportsToUpdate) {
      const adminUser = createdUsers.find(u => u.userType === 'Researcher'); // Use researcher as admin
      
      report.adminNotes.push({
        note: 'Report received and under initial review. Field team will be dispatched within 48 hours.',
        addedBy: adminUser._id,
        addedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
      });
      
      if (Math.random() > 0.5) {
        report.assignedTo = adminUser._id;
        report.status = 'investigating';
      }
      
      await report.save();
      console.log(`Added admin notes to report: ${report.reportId}`);
    }

    // Resolve one report
    if (createdReports.length > 0) {
      const reportToResolve = createdReports[0];
      const adminUser = createdUsers.find(u => u.userType === 'Researcher');
      
      reportToResolve.status = 'resolved';
      reportToResolve.resolutionDetails = {
        description: 'Water quality issue has been addressed. New filtration system installed and water quality restored to acceptable levels.',
        resolvedBy: adminUser._id,
        resolvedAt: new Date(),
        actions_taken: 'Installed advanced filtration system, conducted water quality testing, provided community training on maintenance.'
      };
      
      await reportToResolve.save();
      console.log(`Resolved report: ${reportToResolve.reportId}`);
    }

    // Print summary
    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Created ${createdUsers.length} users:`);
    createdUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.userType}): ${user.email}`);
      console.log(`    Aadhar: ${user.aadharNumber} | Location: ${user.location.district}, ${user.location.state}`);
    });
    
    console.log(`\nCreated ${createdReports.length} reports:`);
    createdReports.forEach(report => {
      console.log(`  - ${report.reportId}: ${report.title} (${report.severity})`);
      console.log(`    Status: ${report.status} | Location: ${report.location.district}, ${report.location.state}`);
    });

    console.log('\n=== DEFAULT LOGIN CREDENTIALS ===');
    console.log('All users have the password: password123');
    console.log('You can login with any of the email addresses listed above.');
    console.log('\nRecommended test accounts:');
    console.log('  Farmer: rajesh.farmer@example.com');
    console.log('  Researcher: anil.researcher@example.com (has researcher privileges)');
    console.log('  Policymaker: sunita.policy@example.com');

    console.log('\n✅ Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;