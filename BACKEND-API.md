# Backend API Documentation

## Overview
This document outlines the backend API endpoints required for the Elevate Intern App production deployment.

## Base URL
```
Production: https://api.elevateintern.app
Development: http://localhost:3001/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication

#### POST /auth/login
Login user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "student"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2024-01-15T12:00:00Z"
  },
  "success": true
}
```

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "student",
  "department": "Computer Science",
  "company": "TechCorp"
}
```

#### POST /auth/refresh
Refresh JWT token using refresh token.

#### POST /auth/logout
Logout user and invalidate tokens.

### User Management

#### GET /users
Get all users (admin only).

#### GET /users/:id
Get user by ID.

#### PUT /users/:id
Update user information.

#### DELETE /users/:id
Delete user (admin only).

### Internship Postings

#### GET /postings
Get all internship postings.

**Query Parameters:**
- `verified` (boolean): Filter by verification status
- `company` (string): Filter by company name
- `skills` (string[]): Filter by required skills

#### POST /postings
Create new internship posting.

**Request Body:**
```json
{
  "title": "Software Developer Intern",
  "company": "TechCorp",
  "location": "Remote",
  "duration": "3 months",
  "stipend": "₹15,000/month",
  "description": "Work on exciting projects...",
  "skills": ["React", "Node.js", "MongoDB"],
  "verified": false
}
```

#### PUT /postings/:id
Update internship posting.

#### DELETE /postings/:id
Delete internship posting.

#### POST /postings/:id/approve
Approve internship posting (admin only).

### Applications

#### GET /applications
Get all applications.

**Query Parameters:**
- `status` (string): Filter by application status
- `student` (string): Filter by student name
- `company` (string): Filter by company

#### POST /applications
Submit new application.

**Request Body:**
```json
{
  "studentName": "John Doe",
  "internshipId": "posting_123",
  "internshipTitle": "Software Developer Intern",
  "company": "TechCorp",
  "status": "pending",
  "readinessScore": 85
}
```

#### PUT /applications/:id/status
Update application status.

**Request Body:**
```json
{
  "status": "accepted"
}
```

### Logbook

#### GET /logbook
Get logbook entries.

**Query Parameters:**
- `student` (string): Filter by student name
- `verified` (boolean): Filter by verification status

#### POST /logbook
Create logbook entry.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "hours": 8,
  "summary": "Worked on project documentation",
  "verified": false,
  "studentName": "John Doe"
}
```

#### POST /logbook/:id/verify
Verify logbook entry (mentor/admin only).

### Company Verification

#### GET /company-verifications
Get company verification requests.

#### POST /company-verifications
Submit company verification request.

**Request Body:**
```json
{
  "companyName": "TechCorp",
  "contactName": "Jane Smith",
  "email": "jane@techcorp.com"
}
```

#### PUT /company-verifications/:id
Update verification status.

**Request Body:**
```json
{
  "status": "approved"
}
```

### Events

#### GET /events
Get all events.

#### POST /events
Create new event.

**Request Body:**
```json
{
  "title": "React Workshop",
  "description": "Learn React fundamentals",
  "date": "2024-01-20T10:00:00Z",
  "type": "workshop",
  "company": "TechCorp",
  "attendees": 0
}
```

### Feedback

#### GET /feedback/industry
Get industry feedback.

#### POST /feedback/industry
Submit industry feedback.

**Request Body:**
```json
{
  "studentName": "John Doe",
  "company": "TechCorp",
  "rating": 5,
  "feedback": "Excellent performance",
  "category": "performance"
}
```

### Notifications

#### GET /notifications
Get user notifications.

#### POST /notifications
Create notification.

**Request Body:**
```json
{
  "userRole": "student",
  "title": "Application Approved",
  "body": "Your internship application has been approved"
}
```

#### POST /notifications/:id/read
Mark notification as read.

### AI Services

#### POST /ai/chat
Send message to AI chatbot.

**Request Body:**
```json
{
  "message": "How to prepare for interviews?",
  "context": "internship guidance"
}
```

#### POST /ai/interview
Conduct mock interview.

**Request Body:**
```json
{
  "question": "Tell me about yourself",
  "answer": "I am a computer science student..."
}
```

**Response:**
```json
{
  "data": {
    "feedback": "Good answer, consider adding more specific examples",
    "nextQuestion": "What's your biggest weakness?",
    "score": 75
  }
}
```

#### GET /ai/company/:name
Get company information.

#### POST /ai/skills/recommendations
Get skill recommendations.

**Request Body:**
```json
{
  "skills": ["React", "JavaScript"]
}
```

#### POST /ai/validate
AI-assisted validation.

**Request Body:**
```json
{
  "itemId": "posting_123",
  "type": "posting"
}
```

### Analytics

#### GET /analytics
Get platform analytics.

#### GET /analytics/department/:department
Get department-specific analytics.

### File Upload

#### POST /upload
Upload files (resources, documents, images).

**Request Body:** FormData
- `file`: File to upload
- `type`: File type (resource, document, image)

### Export

#### POST /export/report
Export reports in various formats.

**Request Body:**
```json
{
  "format": "pdf",
  "studentName": "John Doe",
  "reportType": "logbook"
}
```

### Sync

#### POST /sync/pending
Sync pending offline changes.

**Request Body:**
```json
{
  "changes": [
    {
      "id": "change_123",
      "type": "create",
      "entity": "logbook",
      "data": {...},
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### GET /sync/last-sync
Get last sync timestamp.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

API endpoints are rate limited:
- Authentication: 5 requests per minute
- General API: 100 requests per minute
- AI endpoints: 20 requests per minute

## Security

- All passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- Refresh tokens expire after 7 days
- CORS is configured for allowed origins
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'admin', 'industry') NOT NULL,
  department VARCHAR(255),
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Postings Table
```sql
CREATE TABLE postings (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  stipend VARCHAR(100),
  description TEXT,
  skills JSON,
  verified BOOLEAN DEFAULT FALSE,
  applications INT DEFAULT 0,
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Applications Table
```sql
CREATE TABLE applications (
  id VARCHAR(36) PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  internship_id VARCHAR(36) NOT NULL,
  internship_title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'shortlisted') DEFAULT 'pending',
  readiness_score INT,
  rejection_reason TEXT,
  rejection_category VARCHAR(100),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (internship_id) REFERENCES postings(id)
);
```

## Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/elevate_intern
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
OPENAI_API_KEY=your_openai_api_key
REDIS_URL=redis://localhost:6379
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Health Check
```bash
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0.0"
}
```
