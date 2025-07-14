# replit.md

## Overview

This is a React-based web application called "Ponto Dev" - a motivational time tracking system that simulates a corporate development environment. The app helps users maintain discipline and focus by tracking programming study sessions with a minimum 3-hour daily goal. It features a corporate-style interface with login, time tracking, absence management, and progress visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: TailwindCSS with Shadcn/UI component library
- **State Management**: React hooks (useState, useEffect) with custom hooks
- **Data Persistence**: LocalStorage for client-side data storage
- **Query Management**: TanStack React Query for API state management
- **Routing**: Single-page application with conditional rendering

### Backend Architecture
- **Framework**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful endpoints with `/api` prefix
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement via Vite integration

## Key Components

### Core Features
1. **Authentication System**: Simple login with name storage
2. **Time Tracking**: Multi-session time tracking with start/stop functionality
3. **Progress Monitoring**: Daily goal tracking (3+ hours)
4. **Absence Management**: Justification system for missed days
5. **History Dashboard**: Weekly progress visualization
6. **Motivational Elements**: Dynamic messages and streak counters

### Frontend Components
- **Login Page**: Simple authentication form
- **Dashboard**: Main interface with time tracking controls
- **Time Tracker**: Session management and progress display
- **Absence Modal**: Justification dialog for missed days
- **Notification System**: Toast notifications for user feedback
- **Progress Visualization**: Charts and badges for achievements

### Backend Components
- **Route Handler**: Express route registration system
- **Storage Interface**: Abstracted CRUD operations
- **Memory Storage**: In-memory implementation for development
- **Database Schema**: User management with Drizzle ORM

## Data Flow

### Client-Side Data Flow
1. User logs in → Store user data in LocalStorage
2. Time tracking actions → Update session state and persist to LocalStorage
3. Daily records → Calculate totals and goal achievement
4. History retrieval → Process stored data for visualization
5. Absence handling → Modal workflow for justification submission

### Server-Side Data Flow
1. API requests → Express middleware processing
2. Route handling → Business logic execution
3. Database operations → Drizzle ORM queries
4. Response formatting → JSON API responses
5. Session management → PostgreSQL-backed sessions

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: TailwindCSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Form Validation**: React Hook Form with Zod resolvers
- **State Management**: TanStack React Query for server state

### Backend Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Store**: connect-pg-simple for PostgreSQL sessions
- **Development**: tsx for TypeScript execution
- **Build**: esbuild for production bundling

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite bundles React app to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command
4. **Assets**: Static files served from build directory

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Development**: Uses Vite dev server with HMR
- **Production**: Node.js server serves static files and API routes
- **Sessions**: PostgreSQL-backed session storage

### Development Workflow
- Local development with Vite dev server
- Database migrations via Drizzle Kit
- Hot reload for both frontend and backend changes
- Replit-specific development tooling integration

### Production Considerations
- Static file serving from Express server
- Database connection pooling via Neon
- Session persistence across server restarts
- Error handling and logging middleware