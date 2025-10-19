# Production Deployment Guide

## Overview
This guide covers deploying the Elevate Intern App to production with backend API integration.

## Prerequisites

### Backend Requirements
- Node.js 18+ or Python 3.9+
- PostgreSQL 13+ or MongoDB 4.4+
- Redis 6+ (for caching and sessions)
- OpenAI API key (for AI features)
- SMTP server (for email notifications)

### Frontend Requirements
- Node.js 18+
- Vite build system
- CDN for static assets (optional)

## Backend Setup

### 1. Database Setup

#### PostgreSQL (Recommended)
```sql
-- Create database
CREATE DATABASE elevate_intern;

-- Create user
CREATE USER elevate_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE elevate_intern TO elevate_user;
```

#### MongoDB Alternative
```javascript
// Create database and collections
use elevate_intern;

// Create collections with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password_hash", "role"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        password_hash: { bsonType: "string" },
        role: { enum: ["student", "faculty", "admin", "industry"] }
      }
    }
  }
});
```

### 2. Environment Configuration

Create `.env` file:
```env
# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://elevate_user:secure_password@localhost:5432/elevate_intern
# OR for MongoDB
# MONGODB_URI=mongodb://localhost:27017/elevate_intern

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secrets
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# OpenAI API
OPENAI_API_KEY=sk-your_openai_api_key_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@elevateintern.app

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,mp4,mp3

# CORS
CORS_ORIGIN=https://elevateintern.app,https://www.elevateintern.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here
```

### 3. Backend API Implementation

#### Node.js/Express Example
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/postings', require('./routes/postings'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/logbook', require('./routes/logbook'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### 4. AI Integration

#### OpenAI Integration
```javascript
// services/aiService.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  async sendChatMessage(message, context) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for students seeking ${context}. Provide concise, actionable advice.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('AI service temporarily unavailable');
    }
  }

  async conductMockInterview(question, answer) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are conducting a mock technical/behavioral interview. Evaluate the candidate's answer and provide: 1) Brief feedback (2-3 sentences) 2) Next question 3) Score (0-100). Format: FEEDBACK: [feedback] NEXT: [question] SCORE: [number]"
          },
          {
            role: "user",
            content: `Question: ${question}\nCandidate Answer: ${answer}\n\nProvide feedback, next question, and score.`
          }
        ],
        max_tokens: 250,
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      const feedbackMatch = content.match(/FEEDBACK:\s*(.+?)(?=NEXT:|$)/s);
      const nextMatch = content.match(/NEXT:\s*(.+?)(?=SCORE:|$)/s);
      const scoreMatch = content.match(/SCORE:\s*(\d+)/);

      return {
        feedback: feedbackMatch?.[1]?.trim() || "Good answer, keep it up!",
        nextQuestion: nextMatch?.[1]?.trim() || "Can you describe a challenging project you worked on?",
        score: parseInt(scoreMatch?.[1] || "75")
      };
    } catch (error) {
      console.error('OpenAI Interview error:', error);
      throw new Error('AI interview service temporarily unavailable');
    }
  }
}

module.exports = new AIService();
```

## Frontend Deployment

### 1. Build Configuration

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

### 2. Environment Variables

Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.elevateintern.app
VITE_APP_NAME=Elevate Intern App
VITE_APP_VERSION=1.0.0
VITE_OPENAI_API_KEY=sk-your_openai_api_key_here
```

### 3. Build Process

```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Preview build
npm run preview
```

### 4. Static File Serving

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name elevateintern.app www.elevateintern.app;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name elevateintern.app www.elevateintern.app;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend
    root /var/www/elevateintern.app/dist;
    index index.html;
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static Assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security
    location ~ /\. {
        deny all;
    }
}
```

## Docker Deployment

### 1. Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start server
CMD ["npm", "start"]
```

### 2. Frontend Dockerfile
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose
```yaml
version: '3.8'

services:
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: elevate_intern
      POSTGRES_USER: elevate_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://elevate_user:secure_password@database:5432/elevate_intern
      REDIS_URL: redis://redis:6379
    depends_on:
      - database
      - redis
    ports:
      - "3001:3001"

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/elevateintern.app
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

## Monitoring and Logging

### 1. Application Monitoring
```javascript
// monitoring.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

### 2. Health Monitoring
```bash
# Health check script
#!/bin/bash
curl -f http://localhost:3001/health || exit 1
```

### 3. Log Rotation
```bash
# /etc/logrotate.d/elevate-intern
/var/www/elevateintern.app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Database credentials secured
- [ ] API keys stored in environment variables
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up

## Performance Optimization

- [ ] CDN for static assets
- [ ] Database indexing optimized
- [ ] Redis caching implemented
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Gzip compression
- [ ] HTTP/2 enabled

## Backup Strategy

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/elevate_intern"

# Database backup
pg_dump $DATABASE_URL > $BACKUP_DIR/database_$DATE.sql

# File uploads backup
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/elevateintern.app/uploads

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify database server is running
   - Check network connectivity

2. **AI Services Not Working**
   - Verify OpenAI API key
   - Check API quota and billing
   - Review error logs

3. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions
   - Review allowed file types

4. **Performance Issues**
   - Check database query performance
   - Review Redis cache hit rates
   - Monitor server resources

### Log Locations
- Application logs: `/var/www/elevateintern.app/logs/`
- Nginx logs: `/var/log/nginx/`
- Database logs: `/var/log/postgresql/`
- System logs: `/var/log/syslog`
