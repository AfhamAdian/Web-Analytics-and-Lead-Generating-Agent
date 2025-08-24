# Backend Architecture Documentation

## Overview
This backend has been modularized for better maintainability, readability, and scalability. The architecture follows a clean separation of concerns with logical grouping of functionality.

## Directory Structure

```
Backend/
├── config/              # Configuration files
│   ├── app.js           # Application configuration
│   └── database.js      # Database connection setup
├── controllers/         # Business logic handlers
│   ├── analyticsController.js    # Analytics tracking logic
│   ├── authController.js         # Authentication logic
│   ├── dashboardController.js    # Dashboard and site management logic
│   └── leadController.js         # Lead capture logic
├── middlewares/         # Express middlewares
│   └── auth.js          # JWT authentication middleware
├── routes/              # API route definitions
│   ├── analytics.js     # Analytics tracking routes
│   ├── auth.js          # Authentication routes
│   ├── dashboard.js     # Dashboard routes
│   └── leads.js         # Lead capture routes
├── services/            # Data access layer
│   ├── eventService.js    # Event-related database operations
│   ├── sessionService.js  # Session-related database operations
│   ├── siteService.js     # Site-related database operations
│   ├── userService.js     # User-related database operations
│   └── visitorService.js  # Visitor-related database operations
├── utils/               # Utility functions
│   ├── analyticsUtils.js  # Analytics calculation utilities
│   └── idUtils.js         # ID sanitization and validation utilities
├── server.js            # Main application entry point
├── server_original.js   # Backup of original monolithic server
└── supabaseClient.js    # Legacy client (for backward compatibility)
```

## Architecture Layers

### 1. Configuration Layer (`config/`)
- **`app.js`**: Central application configuration (CORS, JWT, environment settings)
- **`database.js`**: Database connection and Supabase client setup

### 2. Routes Layer (`routes/`)
- **Purpose**: Define API endpoints and map them to controllers
- **Responsibility**: HTTP routing, basic request validation
- **Files**:
  - `analytics.js`: Analytics tracking endpoints
  - `auth.js`: Authentication endpoints  
  - `dashboard.js`: Dashboard and site management endpoints
  - `leads.js`: Lead capture endpoints

### 3. Controllers Layer (`controllers/`)
- **Purpose**: Handle business logic and coordinate between services
- **Responsibility**: Request/response handling, data validation, error handling
- **Files**:
  - `analyticsController.js`: Analytics tracking logic
  - `authController.js`: User authentication logic
  - `dashboardController.js`: Dashboard data aggregation and site management
  - `leadController.js`: Lead capture and form submission logic

### 4. Services Layer (`services/`)
- **Purpose**: Data access and business operations
- **Responsibility**: Database operations, external API calls, data transformation
- **Files**:
  - `eventService.js`: Event creation and retrieval
  - `sessionService.js`: Session management
  - `siteService.js`: Site CRUD operations
  - `userService.js`: User management and authentication
  - `visitorService.js`: Visitor tracking and lead management

### 5. Utilities Layer (`utils/`)
- **Purpose**: Reusable helper functions
- **Responsibility**: Data processing, calculations, validations
- **Files**:
  - `analyticsUtils.js`: Lead scoring, traffic analysis, statistics calculation
  - `idUtils.js`: UUID sanitization, timezone parsing

### 6. Middlewares Layer (`middlewares/`)
- **Purpose**: Request processing and validation
- **Files**:
  - `auth.js`: JWT token verification

## Key Improvements

### 1. **Separation of Concerns**
- Each layer has a single responsibility
- Business logic separated from data access
- Route handling separated from business logic

### 2. **Modularity**
- Each module can be tested independently
- Easy to add new features without affecting existing code
- Reusable components across different parts of the application

### 3. **Maintainability**
- Clear file organization makes it easy to locate functionality
- Consistent naming conventions
- Comprehensive documentation and comments

### 4. **Scalability**
- Easy to add new routes, controllers, and services
- Database operations are centralized and can be optimized
- Configuration is centralized and environment-aware

### 5. **Error Handling**
- Consistent error handling across all layers
- Proper HTTP status codes
- Detailed error messages for debugging

## API Endpoints

### Analytics Tracking
- `POST /api/user-system-info` - Collect user system information
- `POST /api/pageviews` - Track page views
- `POST /api/scroll-depth` - Track scroll behavior
- `POST /api/sessiontime` - Track session duration
- `POST /api/click-events` - Track click events

### Lead Management
- `POST /api/user-detail-informations` - Capture user details (Fabricx specific)
- `POST /api/form-submit` - Handle form submissions
- `POST /api/identify-visitor` - Identify and qualify visitors

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `PUT /api/profile` - Update user profile
- `PUT /api/change-password` - Change user password

### Dashboard & Analytics
- `GET /api/dashboard` - Get dashboard overview
- `POST /api/addSite` - Add new site
- `GET /api/sites/:siteId` - Get site analytics
- `GET /api/sites/:siteId/visitors` - Get site visitors with lead scores

## Database Services

### User Service
- User registration and authentication
- Profile management
- Password management

### Site Service
- Site creation and management
- Site analytics retrieval
- Owner verification

### Visitor Service
- Visitor tracking and identification
- Lead capture and qualification
- Visitor analytics

### Session Service
- Session creation and management
- System information tracking
- Duration tracking

### Event Service
- Event creation and tracking
- Multiple event types (page views, clicks, forms, etc.)
- Event analytics and reporting

## Usage Examples

### Adding a New Analytics Event
1. Add event creation method to `eventService.js`
2. Add handler method to `analyticsController.js`
3. Add route to `analytics.js`
4. Update utility functions if needed

### Adding a New Dashboard Widget
1. Add data retrieval logic to appropriate service
2. Add aggregation logic to `dashboardController.js`
3. Add route to `dashboard.js` if needed
4. Update analytics utilities if calculations are needed

## Environment Configuration

The application uses centralized configuration in `config/app.js`:

```javascript
module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '24h',
  corsOptions: { /* CORS settings */ },
  environment: process.env.NODE_ENV || 'development',
  trackingScriptUrl: 'http://localhost:8080/track.js'
};
```

## Migration from Original Server

The original monolithic `server.js` has been:
1. Backed up as `server_original.js`
2. Replaced with a clean, modular version
3. All functionality preserved and enhanced
4. Improved error handling and logging
5. Better organization and documentation

## Testing

Each module can be tested independently:
- Services can be unit tested with mocked database calls
- Controllers can be tested with mocked services
- Routes can be integration tested
- Utilities can be unit tested with various inputs

## Future Enhancements

The modular architecture makes it easy to add:
- Rate limiting middleware
- Input validation schemas
- Caching layers
- Background job processing
- Real-time features with WebSockets
- API versioning
- Automated testing suites
- Performance monitoring
