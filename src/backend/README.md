# AquaWatch Backend

A comprehensive Node.js/Express.js backend for the AquaWatch groundwater monitoring platform with MongoDB database, Aadhar verification using Verhoeff algorithm, JWT authentication, and robust security features.

## Features

### Authentication & Security
- **Aadhar Verification**: Implementation of Verhoeff algorithm for 12-digit Aadhar validation
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Account Protection**: Account locking after failed login attempts
- **Rate Limiting**: Configurable request rate limiting
- **Security Headers**: Helmet.js for HTTP security headers
- **CORS Protection**: Configurable cross-origin resource sharing

### User Management
- **User Registration**: Complete user registration with email verification
- **Role-Based Access**: Support for different user types (Farmer, Household, Policymaker, Businessman, Researcher)
- **Researcher Verification**: Google Scholar ID verification for researcher upgrades
- **Profile Management**: Complete user profile management
- **Password Reset**: Secure password reset via email

### Report Management
- **Issue Reporting**: Comprehensive report submission system
- **File Uploads**: Support for attachments with validation
- **Status Tracking**: Complete report lifecycle management
- **Location-Based Filtering**: Reports filtered by geographic location
- **Export Capabilities**: CSV export for researchers

### Dashboard & Analytics
- **Real-time Data**: Groundwater levels, weather data, and alerts
- **Historical Trends**: Time-series data for analysis
- **Community Statistics**: User engagement and location-based stats
- **Role-Specific Recommendations**: AI-powered recommendations based on user type

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd backend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**
```bash
# Start MongoDB service
mongod

# The application will automatically create collections on first run
```

4. **Start the Server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## Environment Variables

### Required
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens

### Optional
- `EMAIL_USER`: Email for sending notifications
- `EMAIL_PASS`: Email password/app-specific password
- `FRONTEND_URL`: Frontend URL for CORS and email links

## API Endpoints

### Authentication (`/api/auth`)
```
POST   /register              Register new user
POST   /login                 User login
POST   /refresh-token         Refresh access token
POST   /forgot-password       Request password reset
POST   /reset-password        Reset password with token
POST   /change-password       Change password (authenticated)
GET    /verify-email/:token   Verify email address
POST   /logout                Logout user
```

### User Management (`/api/user`)
```
GET    /profile                    Get user profile
PUT    /profile                    Update user profile
POST   /upgrade-to-researcher      Request researcher upgrade
GET    /researcher-status          Get researcher verification status
GET    /dashboard-data             Get user dashboard data
DELETE /account                    Delete user account
```

### Reports (`/api/reports`)
```
POST   /submit                     Submit new report
GET    /my-reports                 Get user's reports
GET    /:reportId                  Get specific report
GET    /public/by-location         Get reports by location
PUT    /:reportId/status           Update report status (Admin)
GET    /statistics/dashboard       Get report statistics
GET    /export/csv                 Export reports to CSV (Researcher)
```

### Dashboard (`/api/dashboard`)
```
GET    /overview                   Get dashboard overview
GET    /groundwater-levels         Get groundwater level data
GET    /water-quality              Get water quality data
GET    /alerts                     Get alerts and notifications
GET    /community-stats            Get community statistics
GET    /research-data              Get research datasets (Researcher)
```

## Aadhar Verification

The system implements the **Verhoeff algorithm** for Aadhar validation:

### Algorithm Steps
1. **Precheck**: Confirm input is exactly 12 numeric digits
2. **Reverse**: Process digits from rightmost to leftmost
3. **Initialize**: Set accumulator c = 0
4. **Process**: For each digit at position i:
   - Convert digit to number d_i
   - Look up p[i mod 8][d_i]
   - Update c = d[c][p[i mod 8][d_i]]
5. **Validate**: Number is valid if c === 0

### Usage
```javascript
const { validateAadhar, formatAadhar, maskAadhar } = require('./utils/aadharVerification');

// Validate Aadhar
const isValid = validateAadhar('123456789012');

// Format for display
const formatted = formatAadhar('123456789012'); // "1234 5678 9012"

// Mask for security
const masked = maskAadhar('123456789012'); // "XXXX XXXX 9012"
```

## Security Features

### Password Security
- bcrypt hashing with 12 salt rounds
- Minimum password length requirements
- Password change requires current password verification

### Account Protection
- Account locking after 5 failed login attempts
- 2-hour lockout period
- Automatic unlock after timeout

### Rate Limiting
- 100 requests per 15-minute window per IP
- Stricter limits on sensitive operations
- Configurable limits per endpoint

### Data Validation
- Input sanitization and validation
- MongoDB injection prevention
- XSS protection via Helmet.js

## Database Schema

### User Model
- Aadhar number (12 digits, unique)
- Email (unique, verified)
- Password (bcrypt hashed)
- User type and role information
- Location data
- Researcher verification status
- Security fields (login attempts, tokens)

### Report Model
- Unique report ID generation
- User reference and location data
- Report type, severity, and status
- File attachments support
- Admin notes and resolution tracking
- Metadata for auditing

## Error Handling

### Comprehensive Error Responses
```javascript
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error array"], // For validation errors
  "code": "ERROR_CODE" // For specific error types
}
```

### Error Types
- Validation errors
- Authentication failures
- Authorization errors
- Database errors
- File upload errors
- External API errors

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Unit tests for utility functions
- Integration tests for API endpoints
- Security tests for authentication
- Database tests for models

## Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB with authentication
- [ ] Set strong JWT secrets
- [ ] Configure email service
- [ ] Set up SSL/TLS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Monitoring and Logging

### Logging
- Morgan HTTP request logging
- Console error logging
- Configurable log levels

### Health Check
```
GET /health
```

Returns system status and timestamp.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@aquawatch.com or create an issue in the repository.