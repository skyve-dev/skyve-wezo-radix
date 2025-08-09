# Skyve Wezo Radix - Full Stack Application

A modern property management application with separate client and server architecture.

## Project Structure

```
skyve-wezo-radix/
├── client/           # React frontend application
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   └── package.json # Client dependencies
├── server/          # Express.js backend server
│   ├── src/         # Server source code
│   ├── prisma/      # Database schema
│   └── package.json # Server dependencies
└── package.json     # Root package with build scripts
```

## Quick Start

### Install Dependencies
```bash
# Install all dependencies (root, client, and server)
npm run install:all
```

### Development
```bash
# Run both client and server in development mode
npm run dev

# Or run individually:
npm run dev:client  # Frontend only (port 5173)
npm run dev:server  # Backend only (port 3001)
```

### Production Build
```bash
# Build both client and server
npm run build

# Or build individually:
npm run build:client
npm run build:server
```

### Start Production
```bash
# Start both client and server
npm run start
```

## Client Application

The client is a React application with:
- React 19 with TypeScript
- Vite build tool
- Radix UI components
- React Router v7
- Framer Motion animations

Access at: http://localhost:5173

## Server Application

The server is an Express.js API with:
- Express.js with TypeScript
- Prisma ORM for database
- CORS configured for client
- RESTful API endpoints

Access at: http://localhost:3001

### Database Setup

1. Copy `.env.example` to `.env` in the server directory
2. Update DATABASE_URL with your PostgreSQL connection
3. Run migrations:
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

## Available Scripts

### Root Level
- `npm run dev` - Start both client and server in development
- `npm run build` - Build both applications
- `npm run install:all` - Install dependencies for all packages
- `npm run lint` - Run linting on client code
- `npm run start` - Start both applications in production mode

### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Lint the codebase
- `npm run preview` - Preview production build

### Server Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Environment Variables

### Server (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/skyve_wezo?schema=public"
PORT=3001
CLIENT_URL="http://localhost:5173"
```