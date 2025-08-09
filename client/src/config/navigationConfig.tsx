import React from 'react';
import {
  BarChartIcon,
  CalendarIcon,
  ChatBubbleIcon,
  DashboardIcon,
  HomeIcon,
  PersonIcon,
  EnterIcon,
  AvatarIcon,
  QuestionMarkCircledIcon,
  GearIcon, MagnifyingGlassIcon,
} from '@radix-ui/react-icons';

export interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  showInTop?: boolean;
  showInBottom?: boolean;
  showInDrawer?: boolean;
  drawerOnly?: boolean; // For items that only appear in drawer
  onClick?: () => void; // For custom actions like logout
}

export interface NavigationConfig {
  anonymous: NavigationItem[];
  tenant: NavigationItem[];
  homeowner: NavigationItem[];
  admin: NavigationItem[];
}

// Central source of truth for all navigation items
// Using bottom navigation as the reference as requested
export const navigationConfig: NavigationConfig = {
  anonymous: [
    { 
      path: '/', 
      label: 'Explore', 
      icon: <HomeIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/listings',
      label: 'Listings',
      icon: <MagnifyingGlassIcon/>,
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/login', 
      label: 'Login', 
      icon: <EnterIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: false 
    },
  ],
  tenant: [
    { 
      path: '/', 
      label: 'Explore', 
      icon: <HomeIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    {
      path: '/listings',
      label: 'Listings',
      icon: <MagnifyingGlassIcon/>,
      showInTop: true,
      showInBottom: true,
      showInDrawer: true
    },
    { 
      path: '/bookings', 
      label: 'Bookings', 
      icon: <CalendarIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/messages', 
      label: 'Messages', 
      icon: <ChatBubbleIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: <PersonIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
  ],
  homeowner: [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <DashboardIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/bookings', 
      label: 'Bookings', 
      icon: <CalendarIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/villa-management', 
      label: 'My Villas', 
      icon: <HomeIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: <BarChartIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    {
      path: '/listings',
      label: 'Listings',
      icon: <MagnifyingGlassIcon/>,
      showInTop: false,
      showInBottom: false,
      showInDrawer: true
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: <PersonIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
  ],
  admin: [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <DashboardIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/bookings', 
      label: 'Bookings', 
      icon: <CalendarIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/users', 
      label: 'Users', 
      icon: <PersonIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: <BarChartIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
    {
      path: '/listings',
      label: 'Listings',
      icon: <MagnifyingGlassIcon/>,
      showInTop: false,
      showInBottom: false,
      showInDrawer: true
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: <AvatarIcon />, 
      showInTop: true, 
      showInBottom: true, 
      showInDrawer: true 
    },
  ],
};

// Common drawer-only items for all users
const commonDrawerItems: NavigationItem[] = [
  { 
    path: '/help', 
    label: 'Help & Support', 
    icon: <QuestionMarkCircledIcon />, 
    showInTop: false, 
    showInBottom: false, 
    showInDrawer: true, 
    drawerOnly: true 
  },
  { 
    path: '/settings', 
    label: 'Settings', 
    icon: <GearIcon />, 
    showInTop: false, 
    showInBottom: false, 
    showInDrawer: true, 
    drawerOnly: true 
  },
];

// Helper function to get navigation items for a specific user role and location
export const getNavigationItems = (
  userRole: 'anonymous' | 'tenant' | 'homeowner' | 'admin' | null,
  location: 'top' | 'bottom' | 'drawer'
): NavigationItem[] => {
  const role = userRole || 'anonymous';
  let items = navigationConfig[role] || navigationConfig.anonymous;
  
  // Add common drawer items if this is for the drawer
  if (location === 'drawer') {
    items = [...items, ...commonDrawerItems];
  }
  
  return items.filter(item => {
    switch (location) {
      case 'top':
        return item.showInTop;
      case 'bottom':
        return item.showInBottom;
      case 'drawer':
        return item.showInDrawer;
      default:
        return true;
    }
  });
};

// Helper function to determine user role from user object
export const getUserRole = (user: { role?: string } | null | undefined): 'anonymous' | 'tenant' | 'homeowner' | 'admin' => {
  if (!user) return 'anonymous';
  
  switch (user.role) {
    case 'homeowner':
      return 'homeowner';
    case 'admin':
      return 'admin';
    case 'tenant':
    default:
      return 'tenant';
  }
};