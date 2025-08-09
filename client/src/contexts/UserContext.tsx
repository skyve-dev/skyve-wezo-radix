import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { UserService } from '../services';

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  searchUsers: (searchTerm: string) => User[];
  filterUsersByRole: (role: 'all' | 'tenant' | 'homeowner' | 'admin') => User[];
  getUserById: (userId: string) => User | undefined;
  getUserByEmail: (email: string) => User | undefined;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const searchUsers = (searchTerm: string): User[] => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
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
    return users.find(user => user.email === email);
  };

  const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await UserService.updateUser(userId, updates);
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const addUser = async (userData: Omit<User, 'id'>): Promise<void> => {
    try {
      const newUser = await UserService.createUser({
        ...userData,
        password: 'defaultPassword' // Should be handled by a proper registration flow
      });
      setUsers(prev => [...prev, newUser]);
    } catch (err) {
      console.error('Error adding user:', err);
      throw err;
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      await UserService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  const value = {
    users,
    loading,
    error,
    searchUsers,
    filterUsersByRole,
    getUserById,
    getUserByEmail,
    updateUser,
    addUser,
    deleteUser,
    refreshUsers: fetchUsers,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};