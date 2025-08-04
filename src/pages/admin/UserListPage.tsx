import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, PersonIcon, CheckIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';
import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../contexts/UserContext';
import { colors } from '../../utils/colors';

const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { users, searchUsers, filterUsersByRole, updateUser } = useUsers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'tenant' | 'homeowner' | 'admin'>('all');

  // Redirect if not admin
  if (!currentUser || currentUser.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  // Apply filters
  const filteredUsers = searchTerm 
    ? searchUsers(searchTerm).filter(user => roleFilter === 'all' || user.role === roleFilter)
    : filterUsersByRole(roleFilter);

  // Toggle user active status
  const toggleUserStatus = (userId: string, currentStatus: boolean) => {
    updateUser(userId, { isActive: !currentStatus });
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: '0 0 8px 0',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
  };

  const filtersContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const searchContainerStyle: React.CSSProperties = {
    position: 'relative',
    flex: '1',
    minWidth: '250px',
  };

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    width: '20px',
    height: '20px',
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px 10px 40px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    boxSizing:'border-box'
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  };

  const statCardStyle: React.CSSProperties = {
    flex: '1',
    minWidth: '150px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    textAlign: 'center',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: '0',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  };

  const tdStyle: React.CSSProperties = {
    padding: '16px',
    fontSize: '14px',
    color: '#1a1a1a',
    borderBottom: '1px solid #f3f4f6',
  };

  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primaryLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primary,
    fontWeight: '600',
    fontSize: '16px',
  };

  const userDetailsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const userNameStyle: React.CSSProperties = {
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0',
  };

  const userEmailStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0',
  };

  const roleBadgeStyle: React.CSSProperties = {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    borderRadius: '12px',
    textTransform: 'capitalize',
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'homeowner':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'tenant':
      default:
        return { backgroundColor: '#e0e7ff', color: '#4338ca' };
    }
  };

  const statusBadgeStyle: React.CSSProperties = {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    borderRadius: '12px',
  };

  const activeStatusStyle: React.CSSProperties = {
    ...statusBadgeStyle,
    backgroundColor: '#dcfce7',
    color: '#166534',
  };

  const inactiveStatusStyle: React.CSSProperties = {
    ...statusBadgeStyle,
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const toggleButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
  };

  // Select trigger styles
  const selectTriggerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '150px',
  };

  // Select content styles
  const selectContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '8px',
    boxShadow: '0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2)',
    zIndex: 1000,
  };

  const selectItemStyle: React.CSSProperties = {
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  // Calculate stats
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter(u => u.isActive).length;
  const tenantCount = filteredUsers.filter(u => u.role === 'tenant').length;
  const homeownerCount = filteredUsers.filter(u => u.role === 'homeowner').length;
  const adminCount = filteredUsers.filter(u => u.role === 'admin').length;

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={headerStyle}>
        <h1 style={titleStyle}>User Management</h1>
        <p style={subtitleStyle}>Manage all users in the system</p>
      </div>

      {/* Filters */}
      <div style={filtersContainerStyle}>
        <div style={searchContainerStyle}>
          <MagnifyingGlassIcon style={searchIconStyle} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        <Select.Root value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
          <Select.Trigger style={selectTriggerStyle}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content style={selectContentStyle}>
              <Select.Viewport>
                <Select.Item value="all" style={selectItemStyle}>
                  <Select.ItemText>All Roles</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="tenant" style={selectItemStyle}>
                  <Select.ItemText>Tenant</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="homeowner" style={selectItemStyle}>
                  <Select.ItemText>Homeowner</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="admin" style={selectItemStyle}>
                  <Select.ItemText>Admin</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <p style={statValueStyle}>{totalUsers}</p>
          <p style={statLabelStyle}>Total Users</p>
        </div>
        <div style={statCardStyle}>
          <p style={statValueStyle}>{activeUsers}</p>
          <p style={statLabelStyle}>Active Users</p>
        </div>
        <div style={statCardStyle}>
          <p style={statValueStyle}>{tenantCount}</p>
          <p style={statLabelStyle}>Tenants</p>
        </div>
        <div style={statCardStyle}>
          <p style={statValueStyle}>{homeownerCount}</p>
          <p style={statLabelStyle}>Homeowners</p>
        </div>
        <div style={statCardStyle}>
          <p style={statValueStyle}>{adminCount}</p>
          <p style={statLabelStyle}>Admins</p>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div style={emptyStateStyle}>
          <PersonIcon style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#9ca3af' }} />
          <h3>No users found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td style={tdStyle}>
                    <div style={userInfoStyle}>
                      <div style={avatarStyle}>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div style={userDetailsStyle}>
                        <p style={userNameStyle}>{user.name}</p>
                        <p style={userEmailStyle}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ ...roleBadgeStyle, ...getRoleBadgeColor(user.role) }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={user.isActive ? activeStatusStyle : inactiveStatusStyle}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <motion.button
                      style={toggleButtonStyle}
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      whileHover={{ backgroundColor: '#e5e7eb' }}
                      whileTap={{ scale: 0.95 }}
                      disabled={user.id === currentUser.id}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UserListPage;