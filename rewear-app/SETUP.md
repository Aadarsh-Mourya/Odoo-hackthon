# ReWear Development Setup

## Quick Start Guide

### 1. Prerequisites Installation

**Install Node.js and PostgreSQL:**
- Download Node.js (v16+) from https://nodejs.org/
- Download PostgreSQL from https://www.postgresql.org/download/

**Verify installations:**
```bash
node --version
npm --version
psql --version
```

### 2. Database Setup

**Create PostgreSQL database:**
```bash
# Login to PostgreSQL (Windows)
psql -U postgres

# Create database
CREATE DATABASE rewear_db;
CREATE USER rewear_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rewear_db TO rewear_user;
\q
```

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
copy .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### 4. Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: admin@rewear.com / admin123

## Project Features Status

### ✅ Completed Features
- User authentication (register/login)
- JWT-based security
- User dashboard with statistics
- Database schema with relationships
- Point-based system architecture
- Responsive UI components
- Error handling and validation

### 🚧 Next Implementation Steps
1. **Item Browsing Page** - Browse all available items with filters
2. **Add Item Page** - Upload items with image handling
3. **Item Detail Page** - View individual items and redeem
4. **Admin Panel** - Approve/reject items and manage users
5. **Profile Management** - Edit user profile and settings

### 🎯 Core Functionality
- **Point System**: Users earn points for approved items, spend points to redeem
- **Image Upload**: Secure file handling with validation
- **Admin Moderation**: All items require approval before being visible
- **Community Focus**: Users can see who listed items and build connections

## Development Commands

### Backend Commands
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run migrate  # Run database migrations
```

### Frontend Commands
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

## Database Schema

### Tables
- **users** - User accounts with points and admin flags
- **categories** - Clothing categories (Tops, Bottoms, etc.)
- **items** - Listed clothing items with approval status
- **redemptions** - Track point-based exchanges

### Key Relationships
- Users can have many items
- Items belong to categories
- Redemptions track item exchanges between users

## Security Implementation

- **Authentication**: JWT tokens with 24-hour expiration
- **Authorization**: Protected routes and admin-only endpoints
- **File Upload**: Type and size validation for images
- **Rate Limiting**: Prevent spam item creation
- **Input Validation**: Server-side validation with express-validator

## Tech Stack Details

### Backend Stack
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **Helmet** - Security headers

### Frontend Stack
- **React.js** - UI framework
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rewear_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Authentication
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5000
NODE_ENV=development

# Admin
ADMIN_EMAIL=admin@rewear.com
ADMIN_PASSWORD=admin123

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
```

## Deployment Notes

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure PostgreSQL for production
- [ ] Set up file storage (AWS S3 or similar)
- [ ] Configure CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure environment variables
- [ ] Set up database backups

### Recommended Hosting
- **Backend**: Heroku, Railway, or DigitalOcean
- **Frontend**: Vercel, Netlify, or AWS S3
- **Database**: Railway PostgreSQL, AWS RDS, or Heroku Postgres
- **File Storage**: AWS S3, Cloudinary, or similar

---

**Happy coding! 🚀**
