# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root-Level Commands
```bash
npm run install:all    # Install all dependencies (root, client, and server)
npm run dev           # Start both client and server in development mode
npm run build         # Build both client and server for production
npm run start         # Start both applications in production mode
npm run lint          # Run ESLint on client code
```

### Client Commands (from root)
```bash
npm run dev:client    # Start frontend development server (port 5173)
npm run build:client  # Build frontend for production
npm run start:client  # Preview production build
```

### Server Commands (from root)
```bash
npm run dev:server    # Start backend with hot reload (port 3001)
npm run build:server  # Compile TypeScript to JavaScript
npm run start:server  # Start production server
```

### Database Commands (from server directory)
```bash
cd server
npx prisma migrate dev     # Run database migrations
npx prisma generate        # Generate Prisma client
npx prisma studio          # Open Prisma Studio GUI
```

## Architecture Overview

This is a full-stack property management application with a clear separation between client and server.

### Technology Stack

**Frontend (Client)**
- React 19 with TypeScript
- Vite as build tool
- Radix UI for accessible UI components
- React Router v7 for routing
- Framer Motion for animations
- No CSS frameworks - all styling via inline React style objects

**Backend (Server)**
- Express.js with TypeScript
- Prisma ORM for PostgreSQL database
- CORS configured for client communication
- RESTful API architecture

### Project Structure

```
skyve-wezo-radix/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components by domain
│   │   ├── contexts/      # React Context providers
│   │   ├── pages/         # Page components by role
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions and design tokens
│   └── public/
│       └── assets/        # Static assets including villa images
├── server/                # Express.js backend
│   ├── src/              # Server source code
│   └── prisma/           # Database schema and migrations
└── package.json          # Root package with orchestration scripts
```

### Key Architectural Patterns

1. **Monorepo with Workspaces**: Uses npm workspaces to manage client and server packages together

2. **Role-Based Access**: Three user roles (TENANT, HOMEOWNER, ADMIN) with different UI experiences and permissions

3. **Context Provider Hierarchy**: 
   ```
   Router → AuthProvider → UserProvider → VillasProvider → BookingsProvider → AmenitiesProvider
   ```

4. **Base Path Configuration**: Client app runs at `/wezo/` path (configured in vite.config.ts)

5. **Mock Data Architecture**: Currently uses mock authentication and data in client; server has Prisma models ready for real implementation

## Database Schema

The PostgreSQL database (via Prisma) includes:
- **User**: Authentication and role management (TENANT, HOMEOWNER, ADMIN)
- **Villa**: Property listings with amenities and availability
- **Booking**: Reservation system with status tracking (PENDING, CONFIRMED, CANCELLED, COMPLETED)

## Environment Setup

### Server Environment Variables
Create `.env` file in server directory:
```
DATABASE_URL="postgresql://user:password@localhost:5432/skyve_wezo?schema=public"
PORT=3001
CLIENT_URL="http://localhost:5173"
```

## Design System

### Styling Approach
- **No CSS frameworks**: All styling uses inline React style objects
- **Design tokens**: Centralized in `client/src/utils/design.ts`
- **Responsive utilities**: Helper functions in `client/src/utils/responsive.ts`
- **Mobile-first**: Primary target is mobile viewport

### Component Library
- Exclusively uses Radix UI primitives for accessibility
- Custom components built on top of Radix UI
- Consistent theming through design tokens

## Testing Credentials

Mock authentication credentials for development:
- **Tenant**: `tenant@example.com` / `password`
- **Homeowner**: `homeowner@example.com` / `password`
- **Admin**: `admin@example.com` / `password`

## Pre-Commit Checklist

Before committing changes:
1. **TypeScript**: Run `npm run build` to ensure both client and server compile
2. **Linting**: Run `npm run lint` to check for code style issues
3. **Database**: If schema changed, run migrations in server directory
4. **Testing**: Verify functionality works for all three user roles
5. **Responsive**: Test on both mobile and desktop viewports

## Common Development Tasks

### Adding API Endpoints
1. Define route in `server/src/index.ts`
2. Update Prisma schema if needed
3. Run `npx prisma generate` after schema changes
4. Update client to consume new endpoint

### Adding New Pages
1. Create component in `client/src/pages/[role]/`
2. Add route in `client/src/App.tsx`
3. Update navigation in `BottomTabNavigation.tsx` or `DrawerMenu.tsx`
4. Ensure role-based access is properly configured

### Modifying Database Schema
1. Edit `server/prisma/schema.prisma`
2. Run `npx prisma migrate dev` to create migration
3. Run `npx prisma generate` to update client
4. Update TypeScript types if needed

## Villa Asset Organization

Villa images stored in `client/public/assets/villas/villa-{id}/`:
- `cover.jpg` - Main listing image
- `1.jpg` to `10.jpg` - Gallery images
- `video.mp4` - Property video tour
- `index.txt` - Villa metadata

## Important Notes

- The client currently uses mock data from `client/src/data/data.ts`
- Server has database models ready but endpoints need implementation
- Authentication is mocked in client; real auth needs server implementation
- All navigation items change based on user role
- Protected routes use `ProtectedRoute` wrapper in App.tsx