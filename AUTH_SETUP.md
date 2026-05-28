# Authentication & Admin System Documentation

## Overview

This CMS now includes:
- User registration and login system
- JWT-based token authentication
- Role-based access control (Admin/User)
- Admin panel to manage users
- News creation restricted to authenticated users

## Backend Setup

### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Environment Variables
Create a `.env` file in the backend directory:
```
DATABASE_URL=sqlite:///cms.db
# or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/cms_db

SECRET_KEY=your_secret_key_here
```

### Run Backend
```bash
python -m flask --app app.app run
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## User Registration

1. Navigate to `/en/auth/register` (or your preferred locale)
2. Fill in username, email, password, and full name
3. Password must be at least 8 characters with 1 uppercase letter and 1 digit
4. After registration, you'll be automatically logged in

## User Login

1. Navigate to `/en/auth/login`
2. Enter username and password
3. You'll receive a JWT token that's stored in localStorage
4. The token is valid for 24 hours

## Creating News

Only authenticated users can create news:
1. Log in to your account
2. Navigate to `/en/editor`
3. Fill in the article title and content
4. Click "Create" to publish
5. You can edit or delete your own articles

## Admin Panel

Only admin users can access the admin panel:
1. Login with an admin account
2. Navigate to `/en/admin`
3. View all users with their:
   - Username, email, full name
   - Active/Inactive status
   - Admin status
   - Registration date

### Admin Actions
- **Activate/Deactivate** users
- **Promote/Demote** users to/from admin
- **Delete** users

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/<user_id>` - Get user info

### News (Requires Authentication for POST/PUT/DELETE)
- `GET /api/news` - Get all news
- `GET /api/news/<id>` - Get single news item
- `POST /api/news` - Create news (authenticated)
- `PUT /api/news/<id>` - Update news (author or admin)
- `DELETE /api/news/<id>` - Delete news (author or admin)

### Admin (Requires Admin Role)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/<id>` - Update user (is_active, is_admin)
- `DELETE /api/admin/users/<id>` - Delete user

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. Frontend includes token in `Authorization: Bearer <token>` header for protected requests
5. Backend verifies token on each request
6. Token expires after 24 hours

## Security Features

- Passwords hashed with PBKDF2-HMAC-SHA256
- JWT token-based authentication
- CORS enabled for frontend communication
- Role-based access control
- User can only edit/delete their own articles (or admins can)

## First Admin Setup

To create the first admin user, you need to manually update the database:

1. Register a user normally
2. Connect to your database
3. Update the user record:
   ```sql
   UPDATE users SET is_admin = true WHERE username = 'your_username';
   ```

Or you could add a script to the backend to set the first registered user as admin.

## Troubleshooting

### Token errors
- Check that token is being sent in headers correctly
- Token might be expired (24 hour limit)
- Clear localStorage and re-login if issues persist

### CORS errors
- Make sure backend is running on port 5000
- CORS is configured to accept requests from localhost

### Login failures
- Check username/password are correct
- Account might be deactivated
- Try re-registering if database was reset

## Future Enhancements

- Email verification for registration
- Password reset functionality
- User profile page
- More granular permissions
- Audit logging for admin actions
- Two-factor authentication
