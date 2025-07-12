# ReWear - Community Clothing Exchange

A sustainable fashion platform where users can exchange clothing using a point-based system. Built with React.js, Node.js/Express, and PostgreSQL.

## 🌍 Mission

ReWear aims to reduce textile waste and promote sustainable fashion by creating a community-driven clothing exchange platform. Users can list unused clothes, earn points, and redeem items from other community members.

## ✨ Features

### User Features
- **User Authentication**: Email/password registration and login with JWT tokens
- **Point-Based System**: Earn points by listing items, spend points to redeem items
- **Item Management**: Upload photos, add descriptions, set point values
- **Smart Filtering**: Browse items by category, size, condition, and more
- **User Dashboard**: Track your items, points, and redemption history
- **Responsive Design**: Beautiful UI that works on all devices

### Admin Features
- **Content Moderation**: Approve or reject newly listed items
- **User Management**: Monitor community members and activity
- **Platform Analytics**: View statistics and usage metrics
- **Spam Protection**: Remove inappropriate content

### Technical Features
- **Image Upload**: Secure file handling with validation
- **Rate Limiting**: Prevent spam and abuse
- **Data Validation**: Server-side and client-side validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: JWT authentication, input sanitization, CORS protection

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling and responsive design
- **Axios** - API communication
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
rewear-app/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   └── upload.js            # File upload middleware
│   ├── migrations/
│   │   └── migrate.js           # Database schema setup
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── items.js             # Item management routes
│   │   ├── admin.js             # Admin panel routes
│   │   ├── public.js            # Public API routes
│   │   └── redemptions.js       # Redemption history routes
│   ├── uploads/                 # File upload directory
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Main server file
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Header.js         # Navigation header
    │   │   ├── Footer.js         # Site footer
    │   │   ├── ItemCard.js       # Item display component
    │   │   └── LoadingSpinner.js # Loading indicator
    │   ├── contexts/
    │   │   └── AuthContext.js    # Authentication context
    │   ├── pages/
    │   │   ├── HomePage.js       # Landing page
    │   │   ├── LoginPage.js      # User login
    │   │   ├── RegisterPage.js   # User registration
    │   │   └── DashboardPage.js  # User dashboard
    │   ├── App.js               # Main app component
    │   ├── index.js             # App entry point
    │   └── index.css            # Global styles
    ├── package.json
    ├── tailwind.config.js       # Tailwind configuration
    └── postcss.config.js        # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and other settings:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=rewear_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   ```

4. **Set up database**
   ```bash
   # Create database in PostgreSQL
   createdb rewear_db
   
   # Run migrations
   npm run migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🎯 Usage

### For Users

1. **Sign Up**: Create an account and receive 50 welcome points
2. **List Items**: Upload photos and details of clothes you want to share
3. **Earn Points**: Get points when your items are approved by admins
4. **Browse & Redeem**: Find items you like and use points to redeem them
5. **Track Activity**: Monitor your listings and redemptions in the dashboard

### For Admins

1. **Login**: Use admin credentials (admin@rewear.com / admin123)
2. **Review Items**: Approve or reject newly listed items
3. **Monitor Users**: View user activity and manage accounts
4. **View Analytics**: Check platform statistics and usage metrics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Items
- `GET /api/items` - Get all approved items (with filters)
- `POST /api/items` - Create new item (authenticated)
- `GET /api/items/:id` - Get single item
- `POST /api/items/:id/redeem` - Redeem item with points

### Admin
- `GET /api/admin/pending-items` - Get items pending approval
- `POST /api/admin/approve-item/:id` - Approve item
- `POST /api/admin/reject-item/:id` - Reject item

### Public
- `GET /api/public/featured` - Get featured items
- `GET /api/public/stats` - Get platform statistics

## 🎨 Design System

The application follows a clean, modern design system with:

- **Colors**: Primary green theme with secondary grays
- **Typography**: Inter font family for readability
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first design that works on all screen sizes
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: File type and size validation
- **Rate Limiting**: Prevent spam and abuse
- **CORS Protection**: Secure cross-origin requests
- **SQL Injection Prevention**: Parameterized queries

## 🌱 Environmental Impact

ReWear contributes to sustainability by:
- **Reducing Textile Waste**: Extending the life cycle of clothing
- **Promoting Circular Fashion**: Encouraging reuse over disposal
- **Building Community**: Connecting conscious consumers
- **Raising Awareness**: Educating about sustainable fashion

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Icons**: Lucide React icon library
- **Styling**: Tailwind CSS utility framework
- **Inspiration**: The sustainable fashion community

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for a more sustainable future** 🌍
