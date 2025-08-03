import React from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {CalendarIcon, EyeOpenIcon} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';
import {useBookings} from '../../contexts/BookingsContext';
import {useVillas} from '../../contexts/VillasContext';
import {colors} from '../../utils/colors';

const BookingListPage: React.FC = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const {getBookingsByTenant} = useBookings();
    const {getVillaById} = useVillas();

    const userBookings = user ? getBookingsByTenant(user.id) : [];
    const sortedBookings = userBookings.sort((a, b) =>
        new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );

    const containerStyle: React.CSSProperties = {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
    };

    const pageHeaderStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        margin: 0,
    };

    const newBookingButtonStyle: React.CSSProperties = {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: colors.primary,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    };

    const emptyStateStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '80px 20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    };

    const emptyIconStyle: React.CSSProperties = {
        width: '80px',
        height: '80px',
        margin: '0 auto 24px',
        color: '#9ca3af',
    };

    const emptyTitleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '12px',
    };

    const emptyMessageStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '24px',
    };

    const bookingCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s',
    };


    const villaInfoStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection:'column',
    };


    const villaDetailsStyle: React.CSSProperties = {
        boxSizing:'border-box'
    };

    const villaNameStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px',
    };

    const villaLocationStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '8px',
    };

    const bookingIdStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#9ca3af',
    };

    const statusBadgeStyle = (status: string): React.CSSProperties => ({
        fontSize: '12px',
        padding: '6px 12px',
        borderRadius: '6px',
        fontWeight: '600',
        backgroundColor: status === 'confirmed' ? '#DCFCE7' :
            status === 'pending' ? '#FEF3C7' :
                status === 'cancelled' ? '#FEE2E2' : '#F3F4F6',
        color: status === 'confirmed' ? '#166534' :
            status === 'pending' ? '#92400E' :
                status === 'cancelled' ? '#DC2626' : '#4B5563',
    });

    const bookingDetailsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        gap: '16px',
        marginBottom: '16px',
    };

    const detailItemStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
    };

    const detailLabelStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '4px',
        fontWeight: '500',
    };

    const detailValueStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#1a1a1a',
        fontWeight: '600',
    };

    const actionsStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
    };

    const viewButtonStyle: React.CSSProperties = {
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        color: colors.primary,
        backgroundColor: 'transparent',
        border: `1px solid ${colors.primary}`,
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    };

    const calculateNights = (checkIn: Date, checkOut: Date): number => {
        return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    };

    if (sortedBookings.length === 0) {
        return (
            <motion.div
                style={containerStyle}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
            >
                <div style={headerStyle}>
                    <h1 style={pageHeaderStyle}>My Bookings</h1>
                </div>

                <div style={emptyStateStyle}>
                    <CalendarIcon style={emptyIconStyle}/>
                    <h2 style={emptyTitleStyle}>No Bookings Yet</h2>
                    <p style={emptyMessageStyle}>
                        You haven't made any bookings yet. Start exploring our amazing villas and make your first
                        booking!
                    </p>
                    <motion.button
                        style={newBookingButtonStyle}
                        onClick={() => navigate('/listings')}
                        whileHover={{backgroundColor: colors.primaryHover}}
                        whileTap={{scale: 0.98}}
                    >
                        Browse Villas
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            style={containerStyle}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <div style={headerStyle}>
                <h1 style={pageHeaderStyle}>My Bookings ({sortedBookings.length})</h1>
                <motion.button
                    style={newBookingButtonStyle}
                    onClick={() => navigate('/bookings/new')}
                    whileHover={{backgroundColor: colors.primaryHover}}
                    whileTap={{scale: 0.98}}
                >
                    New Booking
                </motion.button>
            </div>

            {sortedBookings.map((booking) => {
                const villa = getVillaById(booking.villaId);
                const nights = calculateNights(booking.checkInDate, booking.checkOutDate);

                if (!villa) return null;

                return (
                    <motion.div
                        key={booking.id}
                        style={bookingCardStyle}
                        whileHover={{
                            scale: 1.01,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                        }}
                        whileTap={{scale: 0.99}}
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                    >
                        <div style={villaInfoStyle}>
                            <div style={{
                                width: '100%',
                                paddingTop:'100%',
                                borderRadius : '10px',
                                boxSizing:'border-box',
                                backgroundImage: `url(${villa.images[0]})`,
                                backgroundSize: 'cover',
                                backgroundOrigin: 'center'
                            }}></div>
                            <div style={villaDetailsStyle}>
                                <h3 style={villaNameStyle}>{villa.name}</h3>
                                <p style={villaLocationStyle}>{villa.location}</p>
                                <p style={bookingIdStyle}>Booking ID: {booking.id}</p>
                            </div>
                            <div style={{marginBottom:'16px'}}>
                            <span style={statusBadgeStyle(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
                            </div>
                        </div>


                        <div style={bookingDetailsGridStyle}>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Check-in</span>
                                <span style={detailValueStyle}>{booking.checkInDate.toLocaleDateString()}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Check-out</span>
                                <span style={detailValueStyle}>{booking.checkOutDate.toLocaleDateString()}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Nights</span>
                                <span style={detailValueStyle}>{nights}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Guests</span>
                                <span style={detailValueStyle}>{booking.numberOfGuests}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Total Amount</span>
                                <span style={detailValueStyle}>AED {booking.totalPrice}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Payment</span>
                                <span style={detailValueStyle}>
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </span>
                            </div>
                        </div>

                        <div style={actionsStyle}>
                            <motion.button
                                style={viewButtonStyle}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/bookings/${booking.id}`);
                                }}
                                whileHover={{
                                    backgroundColor: colors.primaryLight,
                                    borderColor: colors.primaryHover
                                }}
                                whileTap={{scale: 0.98}}
                            >
                                <EyeOpenIcon width={14} height={14}/>
                                View Details
                            </motion.button>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default BookingListPage;