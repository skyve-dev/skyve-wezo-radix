# Wezo - Rental Property Platform Prototype

A mobile-first, single-page application prototype for a rental property platform serving villas in Ras Al Khaimah.

## Features

- **Role-based Authentication**: Three distinct user roles (Tenant, Homeowner, Administrator)
- **Mobile-first Design**: Optimized for mobile devices with responsive layouts
- **Role-specific Navigation**: Dynamic bottom tab navigation and drawer menu based on user role
- **Hero Banner Management**: Admin-configurable promotional banner
- **Featured Villas**: Grid layout showcasing selected properties
- **Interactive Dashboards**: Customized dashboards for each user role

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI components exclusively
- **Styling**: Inline style objects (no external CSS frameworks)
- **Animation**: Framer Motion for transitions and animations
- **Routing**: React Router DOM

## User Roles & Features

### Tenant
- Browse and filter villa listings
- View booking history and status
- Access to booking simulation
- Profile and payment methods management

### Homeowner
- Villa registration and management
- Booking calendar and status tracking
- Revenue and analytics dashboard
- Tiered pricing management (weekend, weekday, half-day)

### Administrator
- All homeowner capabilities
- User and property activation/deactivation
- Site-wide content management
- Hero banner and featured villas management
- System analytics and reporting

## Navigation Structure

### Bottom Tab Navigation (Role-based)

**Tenant:**
- Home/Explore
- Bookings
- Messages
- Profile

**Homeowner:**
- Dashboard
- My Villas
- Bookings
- Messages
- Profile

**Administrator:**
- Dashboard
- Properties
- Users
- Reports
- Profile

### Drawer Menu (Role-based)

**All Users:**
- User Profile
- Settings
- Notifications
- Help & Support
- Logout

**Tenant & Homeowner:**
- Payment Methods

**Homeowner:**
- Villa Management

**Administrator:**
- App Configuration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd wezo
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Demo Credentials

Use these credentials to test different user roles:

- **Tenant**: `tenant@example.com` / `password`
- **Homeowner**: `homeowner@example.com` / `password`
- **Administrator**: `admin@example.com` / `password`

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components (navigation, drawer)
│   ├── tenant/         # Tenant-specific components
│   ├── homeowner/      # Homeowner-specific components
│   └── admin/          # Admin-specific components
├── pages/
│   ├── auth/           # Authentication pages
│   ├── common/         # Shared pages
│   ├── tenant/         # Tenant dashboard and pages
│   ├── homeowner/      # Homeowner dashboard and pages
│   └── admin/          # Admin dashboard and pages
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── data/               # Mock data and constants
```

## Key Components

### Authentication
- Email-based login system with role detection
- Protected routes with role-based access control
- Mock authentication for prototype demonstration

### Layout System
- `MainLayout`: Wrapper with header, drawer, and bottom navigation
- `BottomTabNavigation`: Role-based tab navigation
- `DrawerMenu`: Slide-out menu with role-specific options

### Dashboards
- `TenantDashboard`: Booking overview and quick actions
- `HomeownerDashboard`: Property management and revenue tracking
- `AdminDashboard`: System overview and content management

### Home Page
- Hero banner with promotional content
- Featured villas in 2x2 grid layout
- Responsive design with hover animations

## Mock Data

The application uses mock data for demonstration:
- Villa listings with images, pricing, and amenities
- User bookings and transaction history
- Promotional banners and featured content
- Notification and messaging data

## Styling Approach

- **Inline Styles**: All styling using React inline style objects
- **No External CSS**: No frameworks like Tailwind or Bootstrap
- **Responsive Design**: Mobile-first with adaptive layouts
- **Consistent Theme**: Unified color palette and typography
- **Hover Effects**: Subtle animations for enhanced UX

## Development Notes

- This is a **UI-only prototype** with no backend integration
- All data is mocked and stored in local state
- Authentication is simulated for demonstration purposes
- Some routes show placeholder pages marked as "Coming Soon"

## Future Enhancements

The current prototype focuses on core navigation and role-based functionality. Future iterations could include:

- Villa listing and filtering pages
- Booking management interfaces
- Messaging and notifications system
- Admin property and user management
- Payment integration simulation
- Calendar booking system
- Review and rating system

## License

This is a prototype project for demonstration purposes.
