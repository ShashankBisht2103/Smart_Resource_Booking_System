# DBMS Project

A Database Management System with React frontend and Python backend.

## Project Structure

```
dbms-main/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Third-party service integrations
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── supabase/               # Supabase configuration and migrations
├── backend/                # Backend documentation and extensions
├── components.json         # ShadCN UI component configuration
└── README.md               # This file
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: ShadCN UI + Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Backend**: Python Flask API
- **Database**: SQLite

## Features

- User Authentication (Sign Up, Sign In, Sign Out)
- Role-based Access Control (User/Admin)
- Resource Booking System
- Notification System
- Profile Management
- Admin Dashboard

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dbms-main
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

The project uses a Python Flask backend. See [backend documentation](./backend/README.md) for more details.

To start the Python backend:
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Initialize the database: `python init_db.py`
4. Start the server: `python api.py`

The backend API will be available at `http://localhost:5000`

For a complete overview of the backend implementation, see [backend summary](./backend/SUMMARY.md).

For instructions on managing data through SQL files, see [SQL usage guide](./backend/SQL_USAGE.md).

### Environment Variables

The frontend connects to the Python backend using the client in [/src/integrations/backend/client.ts](file:///c:/dbms-main/dbms-main/src/integrations/backend/client.ts).

## Project Structure Details

### Frontend ([src/](file:///c:/dbms-main/dbms-main/src))

- **Components**: Reusable UI components including ShadCN UI components
- **Hooks**: Custom hooks like [useAuth](file:///c:/dbms-main/dbms-main/src/hooks/useAuth.tsx) for authentication
- **Integrations**: Third-party service connections (backend API)
- **Pages**: Route-specific components
- **Lib**: Utility functions

### Backend ([backend/](file:///c:/dbms-main/dbms-main/backend))

- **Documentation**: Backend architecture and setup guides
- **API**: Python Flask REST API server
- **Database**: SQLite database with SQL schema files

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Authentication

The application uses a simple token-based authentication system. Two roles are supported:
- **User**: Regular users who can book resources
- **Admin**: Administrators who can manage bookings and users

Authentication is handled through the [useAuth](file:///c:/dbms-main/dbms-main/src/hooks/useAuth.tsx) hook which provides:
- User session management
- Role checking
- Sign out functionality

## Routing

The application uses React Router with protected routes:
- Public routes: Home, Auth
- Protected routes: Dashboard, Bookings, etc.
- Admin routes: Admin dashboard and management pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.