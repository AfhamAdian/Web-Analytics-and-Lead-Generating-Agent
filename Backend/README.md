# Web Analytics and Lead Generating Agent

A comprehensive full-stack web analytics platform that tracks user behavior, captures leads, and provides detailed insights through an intuitive dashboard. Built with modern technologies including Node.js, React, Next.js, and PostgreSQL.

## 🚀 Features

### Analytics & Tracking
- **Real-time User Tracking**: Monitor visitor behavior, page views, session duration, and click events
- **Lead Scoring**: Intelligent lead qualification based on user interaction patterns
- **Session Management**: Track user sessions with detailed browser, OS, and device information
- **Event Tracking**: Comprehensive event system for clicks, form submissions, page views, and custom events
- **Geolocation Tracking**: Regional and country-based visitor analytics

### Dashboard & Reporting
- **Interactive Dashboard**: Real-time analytics with charts and metrics
- **Multi-site Management**: Manage multiple websites from a single dashboard
- **Lead Management**: Capture, track, and qualify leads with detailed information
- **Performance Metrics**: Traffic analysis, conversion rates, and user engagement metrics

### Technical Features
- **JWT Authentication**: Secure user authentication and authorization
- **RESTful API**: Well-structured API endpoints for all operations
- **Database Integration**: PostgreSQL with Supabase for scalable data management
- **Responsive Design**: Mobile-first design with TailwindCSS
- **TypeScript Support**: Type-safe development with TypeScript

## 🏗️ Project Structure

```
Web-Analytics-and-Lead-Generating-Agent/
├── Backend/                 # Node.js Express API Server
│   ├── controllers/         # Business logic handlers
│   ├── routes/             # API route definitions
│   ├── services/           # Data access layer
│   ├── middlewares/        # Express middlewares
│   ├── utils/              # Utility functions
│   ├── config.js           # Application configuration
│   ├── server.js           # Main server entry point
│   └── supabaseClient.js   # Database client setup
├── Frontend/               # React Dashboard Application
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── Fabricx_Website_new/    # Next.js Sample Website with Analytics
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── lib/                # Utility libraries
│   └── public/             # Static assets
├── schema.sql              # Database schema
└── package.json            # Root project configuration
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Primary database
- **Supabase** - Database hosting and management
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend (Dashboard)
- **React 18** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization and charts
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Sample Website (Fabricx)
- **Next.js 15** - React framework with SSR/SSG
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS 4** - Latest utility-first CSS
- **Flowbite React** - UI component library
- **Radix UI** - Accessible component primitives

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Supabase** account (or local PostgreSQL setup)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Web-Analytics-and-Lead-Generating-Agent
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Database Setup
```bash
# Run the SQL schema to create tables
psql -U your_username -d your_database -f schema.sql
```

### 4. Backend Setup
```bash
cd Backend
npm install
npm start
```
The backend server will run on `http://localhost:5000`

### 5. Frontend Dashboard Setup
```bash
cd Frontend
npm install
npm start
```
The dashboard will run on `http://localhost:3000`

### 6. Sample Website Setup (Optional)
```bash
cd Fabricx_Website_new
npm install
npm run dev
```
The sample website will run on `http://localhost:3000` (or next available port)

## 📊 Database Schema

The application uses a PostgreSQL database with the following main tables:

- **`owners`** - Website owners/users
- **`sites`** - Tracked websites
- **`visitors`** - Unique visitors with lead information
- **`sessions`** - User sessions with device/browser info
- **`events`** - All tracked events (clicks, page views, etc.)

## 🔌 API Endpoints

### Authentication
```
POST /api/signup          # User registration
POST /api/login           # User login
PUT  /api/profile         # Update user profile
PUT  /api/change-password # Change password
```

### Analytics & Tracking
```
POST /api/user-system-info     # Track user system information
POST /api/pageviews            # Track page views
POST /api/scroll-depth         # Track scroll behavior
POST /api/sessiontime          # Track session duration
POST /api/click-events         # Track click events
```

### Lead Management
```
POST /api/user-detail-informations # Capture user details
POST /api/form-submit              # Handle form submissions
POST /api/identify-visitor         # Identify and qualify visitors
```

### Dashboard & Analytics
```
GET  /api/dashboard               # Dashboard overview
POST /api/addSite                 # Add new site
GET  /api/sites/:siteId           # Get site analytics
GET  /api/sites/:siteId/visitors  # Get site visitors with lead scores
```

## 🎯 Usage

### 1. Analytics Integration
Add the tracking script to any website:
```html
<script 
  src="http://localhost:8080/track.js" 
  site-id="your-site-id"
  async>
</script>
```

### 2. Dashboard Access
1. Register/Login at the dashboard
2. Add your website(s)
3. Get the site ID and integrate the tracking script
4. View real-time analytics and leads

### 3. Lead Capture
The system automatically captures leads when users:
- Fill out forms
- Spend significant time on pages
- Interact with specific elements
- Meet custom scoring criteria

## 🏃‍♂️ Development

### Project Scripts

**Root Level:**
```bash
npm install  # Install root dependencies
```

**Backend:**
```bash
npm start    # Start development server with nodemon
```

**Frontend Dashboard:**
```bash
npm start    # Start React development server
npm run build # Build for production
```

**Sample Website:**
```bash
npm run dev   # Start Next.js development server
npm run build # Build for production
npm start     # Start production server
```

### Architecture Overview

The application follows a modular architecture:

1. **Backend** - RESTful API with Express.js
   - Controllers handle business logic
   - Services manage data operations
   - Routes define API endpoints
   - Middlewares handle authentication and validation

2. **Frontend Dashboard** - React SPA
   - Components for different views
   - Services for API communication
   - Context for state management

3. **Sample Website** - Next.js with analytics integration
   - Demonstrates tracking implementation
   - Shows lead capture forms
   - Example of real-world usage

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **CORS Protection** - Configurable cross-origin policies
- **Input Validation** - Data sanitization and validation
- **SQL Injection Prevention** - Parameterized queries

## 📈 Analytics Features

### Metrics Tracked
- Page views and unique visitors
- Session duration and bounce rate
- Click-through rates and user flow
- Device, browser, and OS statistics
- Geographic distribution
- Lead conversion rates

### Lead Scoring Algorithm
The system uses an intelligent scoring algorithm based on:
- Time spent on site
- Pages visited
- Form interactions
- Download activities
- Return visits
- Engagement patterns
