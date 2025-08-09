# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
```bash
npm run dev       # Start development server with host access (port 5173)
npm run build     # Run TypeScript compiler and build for production
npm run lint      # Run ESLint on the codebase
npm run preview   # Preview production build
```

### TypeScript
The project uses TypeScript with strict type checking. Run `npm run build` to verify types before committing changes.

## Architecture Overview

### Technology Stack
- **React 19** with TypeScript
- **Vite** as build tool and dev server
- **Radix UI** components exclusively for UI primitives
- **Framer Motion** for animations
- **React Router v7** for routing
- **Swiper** for carousel functionality

### Key Architectural Decisions

1. **Styling Approach**: All styling uses inline React style objects. No external CSS frameworks (Tailwind, Bootstrap, etc.) are used.

2. **Component Library**: Exclusively uses Radix UI components for accessibility and consistency.

3. **Routing Structure**: Role-based routing with protected routes for authenticated users. The app supports three user roles: tenant, homeowner, and admin.

4. **Base Path Configuration**: The app is configured to run at `/wezo/` path. This is set in `vite.config.ts` and handled dynamically in routing.

## Project Structure

### Context Providers Hierarchy
The app uses multiple context providers wrapped in a specific order:
```
Router → AuthProvider → UserProvider → VillasProvider → BookingsProvider → AmenitiesProvider
```

### Component Organization
- `src/components/` - Reusable components organized by domain (auth, admin, tenant, homeowner, common, layout)
- `src/pages/` - Page components organized by user role and common pages
- `src/contexts/` - React Context providers for global state
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions including design tokens, filters, and responsive helpers

### Mock Data
The application uses mock authentication and data located in:
- `src/data/mockData.ts` - Villa listings, bookings, and other mock data
- `src/contexts/AuthContext.tsx` - Mock user credentials

### Authentication
Mock credentials for testing:
- Tenant: `tenant@example.com` / `password`
- Homeowner: `homeowner@example.com` / `password`
- Admin: `admin@example.com` / `password`

## Design System

### Design Tokens
Reusable design constants are centralized in `src/utils/design.ts` including:
- Color palette
- Typography scales
- Spacing units
- Border radius values
- Shadow definitions

### Responsive Design
Mobile-first approach with responsive utilities in `src/utils/responsive.ts`.

## Testing and Quality

Before committing changes:
1. Run `npm run build` to ensure TypeScript compilation succeeds
2. Run `npm run lint` to check for linting issues
3. Test on mobile viewport (primary target) and desktop
4. Verify role-based navigation works correctly

## Important Patterns

### Dynamic Navigation
Bottom tab navigation and drawer menu items change based on user role. Implementation in:
- `src/components/layout/BottomTabNavigation.tsx`
- `src/components/layout/DrawerMenu.tsx`

### Villa Asset Images
Villa images are stored in `public/assets/villas/villa-{id}/` with standardized naming:
- `cover.jpg` - Main cover image
- `1.jpg` to `10.jpg` - Gallery images
- `video.mp4` - Property video
- `index.txt` - Villa metadata

### Protected Routes
All authenticated routes use the `ProtectedRoute` component wrapper defined in `src/App.tsx`.

## Common Tasks

### Adding a New Page
1. Create component in appropriate `src/pages/` subdirectory
2. Add route in `src/App.tsx`
3. Update navigation if needed in `BottomTabNavigation.tsx` or `DrawerMenu.tsx`

### Adding a New Villa
1. Add villa data to `src/data/mockData.ts`
2. Place assets in `public/assets/villas/villa-{id}/`
3. Ensure cover image and at least 3 gallery images exist

### Modifying Navigation
1. Edit role-specific tabs in `src/components/layout/BottomTabNavigation.tsx`
2. Update drawer items in `src/components/layout/DrawerMenu.tsx`
3. Keep navigation consistent with user role permissions