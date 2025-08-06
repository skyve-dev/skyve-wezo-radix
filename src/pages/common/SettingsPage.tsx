import React, { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../utils/colors';
import { shadows, borderRadius } from '../../utils/design';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    
    // Settings state
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [language, setLanguage] = useState('en');
    const [currency, setCurrency] = useState('AED');
    const [timezone, setTimezone] = useState('Asia/Dubai');
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    
    // Role-specific settings
    const [autoAcceptBookings, setAutoAcceptBookings] = useState(false);
    const [instantBooking, setInstantBooking] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    
    const containerStyle: React.CSSProperties = {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
    };
    
    const headerStyle: React.CSSProperties = {
        marginBottom: '32px',
    };
    
    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '8px',
    };
    
    const subtitleStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6b7280',
    };
    
    const sectionStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: '24px',
        marginBottom: '24px',
        boxShadow: shadows.sm,
    };
    
    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb',
    };
    
    const settingRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    };
    
    const settingLabelStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    };
    
    const labelStyle: React.CSSProperties = {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '4px',
    };
    
    const descriptionStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#9ca3af',
    };
    
    const switchRootStyle: React.CSSProperties = {
        width: '42px',
        height: '25px',
        backgroundColor: '#e5e7eb',
        borderRadius: '9999px',
        position: 'relative',
        cursor: 'pointer',
        border: 'none',
        padding: 0,
    };
    
    const switchThumbStyle: React.CSSProperties = {
        display: 'block',
        width: '21px',
        height: '21px',
        backgroundColor: 'white',
        borderRadius: '9999px',
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)',
        transition: 'transform 100ms',
        transform: 'translateX(2px)',
    };
    
    const selectTriggerStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '14px',
        gap: '8px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        minWidth: '150px',
        outline: 'none',
    };
    
    const selectContentStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '8px',
        boxShadow: shadows.lg,
        zIndex: 1000,
    };
    
    const selectItemStyle: React.CSSProperties = {
        fontSize: '14px',
        padding: '8px 12px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        outline: 'none',
    };
    
    const buttonStyle: React.CSSProperties = {
        padding: '12px 24px',
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    };
    
    const secondaryButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#f3f4f6',
        color: '#374151',
        marginRight: '12px',
    };
    
    const handleSaveSettings = () => {
        // Here you would typically save settings to backend
        alert('Settings saved successfully!');
    };
    
    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>Settings</h1>
                <p style={subtitleStyle}>Manage your account settings and preferences</p>
            </div>
            
            {/* Notifications Section */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Notifications</h2>
                
                <div style={settingRowStyle}>
                    <div style={settingLabelStyle}>
                        <label style={labelStyle}>Email Notifications</label>
                        <span style={descriptionStyle}>Receive booking updates via email</span>
                    </div>
                    <Switch.Root
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        style={{
                            ...switchRootStyle,
                            backgroundColor: emailNotifications ? colors.primary : '#e5e7eb',
                        }}
                    >
                        <Switch.Thumb
                            style={{
                                ...switchThumbStyle,
                                transform: emailNotifications ? 'translateX(19px)' : 'translateX(2px)',
                            }}
                        />
                    </Switch.Root>
                </div>
                
                <div style={settingRowStyle}>
                    <div style={settingLabelStyle}>
                        <label style={labelStyle}>SMS Notifications</label>
                        <span style={descriptionStyle}>Get text messages for important updates</span>
                    </div>
                    <Switch.Root
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                        style={{
                            ...switchRootStyle,
                            backgroundColor: smsNotifications ? colors.primary : '#e5e7eb',
                        }}
                    >
                        <Switch.Thumb
                            style={{
                                ...switchThumbStyle,
                                transform: smsNotifications ? 'translateX(19px)' : 'translateX(2px)',
                            }}
                        />
                    </Switch.Root>
                </div>
                
                <div style={settingRowStyle}>
                    <div style={settingLabelStyle}>
                        <label style={labelStyle}>Push Notifications</label>
                        <span style={descriptionStyle}>Receive in-app notifications</span>
                    </div>
                    <Switch.Root
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                        style={{
                            ...switchRootStyle,
                            backgroundColor: pushNotifications ? colors.primary : '#e5e7eb',
                        }}
                    >
                        <Switch.Thumb
                            style={{
                                ...switchThumbStyle,
                                transform: pushNotifications ? 'translateX(19px)' : 'translateX(2px)',
                            }}
                        />
                    </Switch.Root>
                </div>
                
                <div style={settingRowStyle}>
                    <div style={settingLabelStyle}>
                        <label style={labelStyle}>Marketing Emails</label>
                        <span style={descriptionStyle}>Receive promotional offers and updates</span>
                    </div>
                    <Switch.Root
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                        style={{
                            ...switchRootStyle,
                            backgroundColor: marketingEmails ? colors.primary : '#e5e7eb',
                        }}
                    >
                        <Switch.Thumb
                            style={{
                                ...switchThumbStyle,
                                transform: marketingEmails ? 'translateX(19px)' : 'translateX(2px)',
                            }}
                        />
                    </Switch.Root>
                </div>
            </div>
            
            {/* Preferences Section */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Preferences</h2>
                
                <div style={settingRowStyle}>
                    <div style={settingLabelStyle}>
                        <label style={labelStyle}>Language</label>
                        <span style={descriptionStyle}>Choose your preferred language</span>
                    </div>
                    <Select.Root value={language} onValueChange={setLanguage}>
                        <Select.Trigger style={selectTriggerStyle}>
                            <Select.Value />
                            <Select.Icon>
                                <ChevronDownIcon />
                            </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content style={selectContentStyle}>
                                <Select.Viewport>
                                    <Select.Item value="en" style={selectItemStyle}>
                                        <Select.ItemText>English</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="ar" style={selectItemStyle}>
                                        <Select.ItemText>العربية</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="fr" style={selectItemStyle}>
                                        <Select.ItemText>Français</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>
                
                <div style={settingRowStyle}>
                    <div style={settingLabelStyle}>
                        <label style={labelStyle}>Currency</label>
                        <span style={descriptionStyle}>Display prices in your preferred currency</span>
                    </div>
                    <Select.Root value={currency} onValueChange={setCurrency}>
                        <Select.Trigger style={selectTriggerStyle}>
                            <Select.Value />
                            <Select.Icon>
                                <ChevronDownIcon />
                            </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content style={selectContentStyle}>
                                <Select.Viewport>
                                    <Select.Item value="AED" style={selectItemStyle}>
                                        <Select.ItemText>AED (د.إ)</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="USD" style={selectItemStyle}>
                                        <Select.ItemText>USD ($)</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="EUR" style={selectItemStyle}>
                                        <Select.ItemText>EUR (€)</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="GBP" style={selectItemStyle}>
                                        <Select.ItemText>GBP (£)</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>
                
                <div style={settingRowStyle}>
                    <div style={settingLabelStyle}>
                        <label style={labelStyle}>Timezone</label>
                        <span style={descriptionStyle}>Set your local timezone</span>
                    </div>
                    <Select.Root value={timezone} onValueChange={setTimezone}>
                        <Select.Trigger style={selectTriggerStyle}>
                            <Select.Value />
                            <Select.Icon>
                                <ChevronDownIcon />
                            </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content style={selectContentStyle}>
                                <Select.Viewport>
                                    <Select.Item value="Asia/Dubai" style={selectItemStyle}>
                                        <Select.ItemText>Dubai (GMT+4)</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="Europe/London" style={selectItemStyle}>
                                        <Select.ItemText>London (GMT)</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                    <Select.Item value="America/New_York" style={selectItemStyle}>
                                        <Select.ItemText>New York (GMT-5)</Select.ItemText>
                                        <Select.ItemIndicator>
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>
            </div>
            
            {/* Security Section */}
            <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Security</h2>
                
                <div style={settingRowStyle}>
                    <div style={settingLabelStyle}>
                        <label style={labelStyle}>Two-Factor Authentication</label>
                        <span style={descriptionStyle}>Add an extra layer of security to your account</span>
                    </div>
                    <Switch.Root
                        checked={twoFactorAuth}
                        onCheckedChange={setTwoFactorAuth}
                        style={{
                            ...switchRootStyle,
                            backgroundColor: twoFactorAuth ? colors.primary : '#e5e7eb',
                        }}
                    >
                        <Switch.Thumb
                            style={{
                                ...switchThumbStyle,
                                transform: twoFactorAuth ? 'translateX(19px)' : 'translateX(2px)',
                            }}
                        />
                    </Switch.Root>
                </div>
            </div>
            
            {/* Homeowner-specific Settings */}
            {user?.role === 'homeowner' && (
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Homeowner Settings</h2>
                    
                    <div style={settingRowStyle}>
                        <div style={settingLabelStyle}>
                            <label style={labelStyle}>Auto-Accept Bookings</label>
                            <span style={descriptionStyle}>Automatically accept booking requests</span>
                        </div>
                        <Switch.Root
                            checked={autoAcceptBookings}
                            onCheckedChange={setAutoAcceptBookings}
                            style={{
                                ...switchRootStyle,
                                backgroundColor: autoAcceptBookings ? colors.primary : '#e5e7eb',
                            }}
                        >
                            <Switch.Thumb
                                style={{
                                    ...switchThumbStyle,
                                    transform: autoAcceptBookings ? 'translateX(19px)' : 'translateX(2px)',
                                }}
                            />
                        </Switch.Root>
                    </div>
                    
                    <div style={settingRowStyle}>
                        <div style={settingLabelStyle}>
                            <label style={labelStyle}>Instant Booking</label>
                            <span style={descriptionStyle}>Allow guests to book without approval</span>
                        </div>
                        <Switch.Root
                            checked={instantBooking}
                            onCheckedChange={setInstantBooking}
                            style={{
                                ...switchRootStyle,
                                backgroundColor: instantBooking ? colors.primary : '#e5e7eb',
                            }}
                        >
                            <Switch.Thumb
                                style={{
                                    ...switchThumbStyle,
                                    transform: instantBooking ? 'translateX(19px)' : 'translateX(2px)',
                                }}
                            />
                        </Switch.Root>
                    </div>
                </div>
            )}
            
            {/* Admin-specific Settings */}
            {user?.role === 'admin' && (
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Admin Settings</h2>
                    
                    <div style={settingRowStyle}>
                        <div style={settingLabelStyle}>
                            <label style={labelStyle}>Maintenance Mode</label>
                            <span style={descriptionStyle}>Enable maintenance mode for the platform</span>
                        </div>
                        <Switch.Root
                            checked={maintenanceMode}
                            onCheckedChange={setMaintenanceMode}
                            style={{
                                ...switchRootStyle,
                                backgroundColor: maintenanceMode ? colors.warning : '#e5e7eb',
                            }}
                        >
                            <Switch.Thumb
                                style={{
                                    ...switchThumbStyle,
                                    transform: maintenanceMode ? 'translateX(19px)' : 'translateX(2px)',
                                }}
                            />
                        </Switch.Root>
                    </div>
                </div>
            )}
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button
                    style={secondaryButtonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                >
                    Cancel
                </button>
                <button
                    style={buttonStyle}
                    onClick={handleSaveSettings}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;