import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVillas } from '../../contexts/VillasContext';
import { useBookings } from '../../contexts/BookingsContext';
import { colors } from '../../utils/colors';
import { shadows, borderRadius } from '../../utils/design';
import { 
    BarChartIcon, 
    CalendarIcon, 
    HomeIcon,
    PersonIcon,
    EyeOpenIcon,
    ClockIcon
} from '@radix-ui/react-icons';

interface ChartData {
    label: string;
    value: number;
    color: string;
}

const ReportsPage: React.FC = () => {
    const { user } = useAuth();
    const { villas } = useVillas();
    const { bookings } = useBookings();
    const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    
    // Filter data based on user role
    const filteredData = useMemo(() => {
        if (!user) return { villas: [], bookings: [] };
        
        if (user.role === 'admin') {
            // Admin sees all data
            return { villas, bookings };
        } else if (user.role === 'homeowner') {
            // Homeowner sees only their properties and related bookings
            const userVillas = villas.filter(villa => villa.ownerId === user.id);
            const userBookings = bookings.filter(booking => 
                userVillas.some(villa => villa.id === booking.villaId)
            );
            return { villas: userVillas, bookings: userBookings };
        } else {
            // Tenant has no access to reports
            return { villas: [], bookings: [] };
        }
    }, [user, villas, bookings]);
    
    // Calculate metrics based on filtered data
    const metrics = useMemo(() => {
        const { villas: userVillas, bookings: userBookings } = filteredData;
        
        const totalProperties = userVillas.length;
        const activeProperties = userVillas.filter(v => v.isActive).length;
        const totalBookings = userBookings.length;
        const confirmedBookings = userBookings.filter(b => b.status === 'confirmed').length;
        const pendingBookings = userBookings.filter(b => b.status === 'pending').length;
        
        // Calculate revenue (mock calculation)
        const totalRevenue = userBookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, booking) => {
                const villa = userVillas.find(v => v.id === booking.villaId);
                if (!villa) return sum;
                
                const checkIn = new Date(booking.checkInDate);
                const checkOut = new Date(booking.checkOutDate);
                const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                
                return sum + (villa.pricing.weekday * nights);
            }, 0);
        
        const occupancyRate = totalProperties > 0 
            ? Math.round((confirmedBookings / (totalProperties * 30)) * 100) // Simplified calculation
            : 0;
        
        if (user?.role === 'admin') {
            return [
                {
                    label: 'Total Properties',
                    value: totalProperties,
                    change: '+12%',
                    trend: 'up' as const,
                    icon: <HomeIcon style={{ width: '20px', height: '20px' }} />
                },
                {
                    label: 'Total Bookings',
                    value: totalBookings,
                    change: '+8%',
                    trend: 'up' as const,
                    icon: <CalendarIcon style={{ width: '20px', height: '20px' }} />
                },
                {
                    label: 'Total Revenue',
                    value: `AED ${totalRevenue.toLocaleString()}`,
                    change: '+15%',
                    trend: 'up' as const,
                    icon: <span style={{ width: '20px', height: '20px', fontSize: '16px' }}>💰</span>
                },
                {
                    label: 'Active Users',
                    value: 245, // Mock data
                    change: '+5%',
                    trend: 'up' as const,
                    icon: <PersonIcon style={{ width: '20px', height: '20px' }} />
                },
                {
                    label: 'Avg Occupancy',
                    value: `${occupancyRate}%`,
                    change: '+3%',
                    trend: 'up' as const,
                    icon: <span style={{ width: '20px', height: '20px', fontSize: '16px' }}>📈</span>
                },
                {
                    label: 'Pending Bookings',
                    value: pendingBookings,
                    change: '-2%',
                    trend: 'down' as const,
                    icon: <ClockIcon style={{ width: '20px', height: '20px' }} />
                }
            ];
        } else {
            return [
                {
                    label: 'My Properties',
                    value: totalProperties,
                    change: activeProperties === totalProperties ? 'All Active' : `${activeProperties} Active`,
                    trend: 'neutral' as const,
                    icon: <HomeIcon style={{ width: '20px', height: '20px' }} />
                },
                {
                    label: 'Total Bookings',
                    value: totalBookings,
                    change: `${confirmedBookings} Confirmed`,
                    trend: 'up' as const,
                    icon: <CalendarIcon style={{ width: '20px', height: '20px' }} />
                },
                {
                    label: 'My Earnings',
                    value: `AED ${totalRevenue.toLocaleString()}`,
                    change: '+10%',
                    trend: 'up' as const,
                    icon: <span style={{ width: '20px', height: '20px', fontSize: '16px' }}>💰</span>
                },
                {
                    label: 'Occupancy Rate',
                    value: `${occupancyRate}%`,
                    change: '+5%',
                    trend: 'up' as const,
                    icon: <span style={{ width: '20px', height: '20px', fontSize: '16px' }}>📈</span>
                },
                {
                    label: 'Pending Requests',
                    value: pendingBookings,
                    change: pendingBookings > 0 ? 'Needs Action' : 'All Clear',
                    trend: pendingBookings > 0 ? 'down' as const : 'up' as const,
                    icon: <ClockIcon style={{ width: '20px', height: '20px' }} />
                },
                {
                    label: 'Property Views',
                    value: 1240, // Mock data
                    change: '+18%',
                    trend: 'up' as const,
                    icon: <EyeOpenIcon style={{ width: '20px', height: '20px' }} />
                }
            ];
        }
    }, [filteredData, user]);
    
    // Generate chart data for bookings by status
    const bookingStatusData: ChartData[] = useMemo(() => {
        const { bookings: userBookings } = filteredData;
        const confirmed = userBookings.filter(b => b.status === 'confirmed').length;
        const pending = userBookings.filter(b => b.status === 'pending').length;
        const cancelled = userBookings.filter(b => b.status === 'cancelled').length;
        
        return [
            { label: 'Confirmed', value: confirmed, color: '#10B981' },
            { label: 'Pending', value: pending, color: '#F59E0B' },
            { label: 'Cancelled', value: cancelled, color: '#EF4444' }
        ].filter(item => item.value > 0);
    }, [filteredData]);
    
    // Generate chart data for properties by location (for admin) or booking trends (for homeowner)
    const secondaryChartData: ChartData[] = useMemo(() => {
        const { villas: userVillas, bookings: userBookings } = filteredData;
        
        if (user?.role === 'admin') {
            // Properties by location
            const locationCounts = userVillas.reduce((acc, villa) => {
                const location = villa.location.split(',')[0].trim(); // Get city/area
                acc[location] = (acc[location] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            
            const colors = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B'];
            return Object.entries(locationCounts)
                .map(([location, count], index) => ({
                    label: location,
                    value: count,
                    color: colors[index % colors.length]
                }))
                .slice(0, 5); // Top 5 locations
        } else {
            // Monthly bookings trend (simplified)
            const monthlyBookings = userBookings.reduce((acc, booking) => {
                const month = new Date(booking.checkInDate).toLocaleString('default', { month: 'short' });
                acc[month] = (acc[month] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            
            const colors = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#06B6D4'];
            return Object.entries(monthlyBookings)
                .map(([month, count], index) => ({
                    label: month,
                    value: count,
                    color: colors[index % colors.length]
                }))
                .slice(0, 6); // Last 6 months
        }
    }, [filteredData, user]);
    
    if (!user || user.role === 'tenant') {
        return (
            <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto',
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                    marginBottom: '16px',
                }}>
                    Access Restricted
                </h1>
                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                }}>
                    Reports are only available for Admin and Property Owner accounts.
                </p>
            </div>
        );
    }
    
    const containerStyle: React.CSSProperties = {
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
    };
    
    const headerStyle: React.CSSProperties = {
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
    };
    
    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    };
    
    const periodFilterStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
    };
    
    const periodButtonStyle: React.CSSProperties = {
        padding: '8px 16px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    };
    
    const activePeriodButtonStyle: React.CSSProperties = {
        ...periodButtonStyle,
        backgroundColor: colors.primary,
        color: 'white',
    };
    
    const metricsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
    };
    
    const metricCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: '24px',
        boxShadow: shadows.sm,
        border: '1px solid #f3f4f6',
    };
    
    const metricHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
    };
    
    const metricIconStyle: React.CSSProperties = {
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#f0f9ff',
        color: colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    
    const metricValueStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '8px',
    };
    
    const metricChangeStyle = (trend: 'up' | 'down' | 'neutral'): React.CSSProperties => ({
        fontSize: '14px',
        fontWeight: '500',
        color: trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#6B7280',
    });
    
    const chartsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
        gap: '24px',
        marginTop: '32px',
    };
    
    const chartCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: '24px',
        boxShadow: shadows.sm,
        border: '1px solid #f3f4f6',
    };
    
    const chartTitleStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '20px',
    };
    
    const chartBarStyle: React.CSSProperties = {
        height: '24px',
        borderRadius: '12px',
        marginBottom: '12px',
        position: 'relative',
        backgroundColor: '#f3f4f6',
        overflow: 'hidden',
    };
    
    const chartBarFillStyle = (width: number, color: string): React.CSSProperties => ({
        height: '100%',
        width: `${width}%`,
        backgroundColor: color,
        borderRadius: '12px',
        transition: 'width 0.8s ease-out',
    });
    
    const chartLabelStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#4b5563',
        marginBottom: '8px',
    };
    
    const getRoleTitle = () => {
        if (user?.role === 'admin') {
            return 'Platform Analytics';
        } else if (user?.role === 'homeowner') {
            return 'Property Performance';
        }
        return 'Reports';
    };
    
    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>
                        <BarChartIcon style={{ width: '28px', height: '28px' }} />
                        {getRoleTitle()}
                    </h1>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        {user?.role === 'admin' 
                            ? 'Overview of platform-wide metrics and performance'
                            : 'Track your property performance and earnings'
                        }
                    </p>
                </div>
                
                <div style={periodFilterStyle}>
                    <button
                        style={selectedPeriod === '7d' ? activePeriodButtonStyle : periodButtonStyle}
                        onClick={() => setSelectedPeriod('7d')}
                    >
                        7 Days
                    </button>
                    <button
                        style={selectedPeriod === '30d' ? activePeriodButtonStyle : periodButtonStyle}
                        onClick={() => setSelectedPeriod('30d')}
                    >
                        30 Days
                    </button>
                    <button
                        style={selectedPeriod === '90d' ? activePeriodButtonStyle : periodButtonStyle}
                        onClick={() => setSelectedPeriod('90d')}
                    >
                        90 Days
                    </button>
                    <button
                        style={selectedPeriod === '1y' ? activePeriodButtonStyle : periodButtonStyle}
                        onClick={() => setSelectedPeriod('1y')}
                    >
                        1 Year
                    </button>
                </div>
            </div>
            
            {/* Metrics Grid */}
            <div style={metricsGridStyle}>
                {metrics.map((metric, index) => (
                    <div key={index} style={metricCardStyle}>
                        <div style={metricHeaderStyle}>
                            <div style={metricIconStyle}>
                                {metric.icon}
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: '500', color: '#6b7280' }}>
                                {metric.label}
                            </span>
                        </div>
                        <div style={metricValueStyle}>{metric.value}</div>
                        <div style={metricChangeStyle(metric.trend || 'neutral')}>
                            {metric.change}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Charts */}
            <div style={chartsGridStyle}>
                {/* Booking Status Chart */}
                <div style={chartCardStyle}>
                    <h3 style={chartTitleStyle}>Booking Status Overview</h3>
                    {bookingStatusData.length > 0 ? (
                        bookingStatusData.map((item, index) => {
                            const maxValue = Math.max(...bookingStatusData.map(d => d.value));
                            const percentage = (item.value / maxValue) * 100;
                            
                            return (
                                <div key={index}>
                                    <div style={chartLabelStyle}>
                                        <span>{item.label}</span>
                                        <span style={{ fontWeight: '600' }}>{item.value}</span>
                                    </div>
                                    <div style={chartBarStyle}>
                                        <div style={chartBarFillStyle(percentage, item.color)} />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
                            No booking data available
                        </p>
                    )}
                </div>
                
                {/* Secondary Chart */}
                <div style={chartCardStyle}>
                    <h3 style={chartTitleStyle}>
                        {user?.role === 'admin' ? 'Properties by Location' : 'Monthly Booking Trends'}
                    </h3>
                    {secondaryChartData.length > 0 ? (
                        secondaryChartData.map((item, index) => {
                            const maxValue = Math.max(...secondaryChartData.map(d => d.value));
                            const percentage = (item.value / maxValue) * 100;
                            
                            return (
                                <div key={index}>
                                    <div style={chartLabelStyle}>
                                        <span>{item.label}</span>
                                        <span style={{ fontWeight: '600' }}>{item.value}</span>
                                    </div>
                                    <div style={chartBarStyle}>
                                        <div style={chartBarFillStyle(percentage, item.color)} />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
                            No data available for analysis
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;