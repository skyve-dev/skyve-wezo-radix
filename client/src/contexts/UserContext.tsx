import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface UserContextType {
  users: User[];
  searchUsers: (searchTerm: string) => User[];
  filterUsersByRole: (role: 'all' | 'tenant' | 'homeowner' | 'admin') => User[];
  getUserById: (userId: string) => User | undefined;
  getUserByEmail: (email: string) => User | undefined;
  updateUser: (userId: string, updates: Partial<User>) => void;
  addUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock users data - extended from AuthContext mock users
const initialUsers: User[] = [
  {
    id: '1',
    email: 'tenant@example.com',
    name: 'John Tenant',
    role: 'tenant',
    isActive: true,
  },
  {
    id: '2',
    email: 'homeowner@example.com',
    name: 'Jane Owner',
    role: 'homeowner',
    isActive: true,
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    isActive: true,
  },
  {
    id: '4',
    email: 'sarah.wilson@example.com',
    name: 'Sarah Wilson',
    role: 'tenant',
    isActive: true,
  },
  {
    id: '5',
    email: 'michael.brown@example.com',
    name: 'Michael Brown',
    role: 'tenant',
    isActive: true,
  },
  {
    id: '6',
    email: 'emma.davis@example.com',
    name: 'Emma Davis',
    role: 'homeowner',
    isActive: true,
  },
  {
    id: '7',
    email: 'james.miller@example.com',
    name: 'James Miller',
    role: 'homeowner',
    isActive: false,
  },
  {
    id: '8',
    email: 'olivia.johnson@example.com',
    name: 'Olivia Johnson',
    role: 'tenant',
    isActive: true,
  },
  {
    id: '9',
    email: 'william.garcia@example.com',
    name: 'William Garcia',
    role: 'tenant',
    isActive: true,
  },
  {
    id: '10',
    email: 'sophia.martinez@example.com',
    name: 'Sophia Martinez',
    role: 'homeowner',
    isActive: true,
  },
  {
    id: '11',
    email: 'alexander.rodriguez@example.com',
    name: 'Alexander Rodriguez',
    role: 'admin',
    isActive: true,
  },
  {
    id: '12',
    email: 'isabella.lee@example.com',
    name: 'Isabella Lee',
    role: 'tenant',
    isActive: true,
  },
  {
    id: '13',
    email: 'daniel.walker@example.com',
    name: 'Daniel Walker',
    role: 'homeowner',
    isActive: false,
  },
  {
    id: '14',
    email: 'mia.hall@example.com',
    name: 'Mia Hall',
    role: 'tenant',
    isActive: true,
  },
  {
    id: '15',
    email: 'ethan.allen@example.com',
    name: 'Ethan Allen',
    role: 'tenant',
    isActive: true,
  },
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const searchUsers = (searchTerm: string): User[] => {
    if (!searchTerm) return users;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm)
    );
  };

  const filterUsersByRole = (role: 'all' | 'tenant' | 'homeowner' | 'admin'): User[] => {
    if (role === 'all') return users;
    return users.filter(user => user.role === role);
  };

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  const getUserByEmail = (email: string): User | undefined => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const addUser = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const value = {
    users,
    searchUsers,
    filterUsersByRole,
    getUserById,
    getUserByEmail,
    updateUser,
    addUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};