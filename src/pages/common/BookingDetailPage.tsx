import React from 'react';
import {motion} from 'framer-motion';
import {useNavigate, useParams} from 'react-router-dom';
import {ArrowLeftIcon, CalendarIcon, CardStackIcon, HomeIcon, PersonIcon} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';
import {useBookings} from '../../contexts/BookingsContext';
import {useVillas} from '../../contexts/VillasContext';
import {colors} from '../../utils/colors';

const BookingDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const {user} = useAuth();
    const {bookings} = useBookings();
    const {getVillaById} = useVillas();

    const booking = bookings.find(b => b.id === id);
    const villa = booking ? getVillaById(booking.villaId) : null;

    if (!booking || !villa) {
        return (
            <div style={{padding: '20px', textAlign: 'center'}}>
                <h1>Booking not found</h1>
                <button onClick={() => navigate('/bookings')}>Back to Bookings</button>
            </div>
        );
    }

    const nights = Math.ceil((booking.checkOutDate.getTime() - booking.checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    // Get tenant info for display in homeowner/admin views
    const getTenantName = () => {
        // In a real app, this would fetch from users context or API
        if (user?.role === 'tenant') {
            return user.name;
        }
        return `Tenant (ID: ${booking.tenantId})`;
    };

    const getTenantEmail = () => {
        // In a real app, this would fetch from users context or API
        if (user?.role === 'tenant') {
            return user.email;
        }
        return `tenant-${booking.tenantId}@example.com`;
    };

    const containerStyle: React.CSSProperties = {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '32px',
        gap: '16px',
    };

    const backButtonStyle: React.CSSProperties = {
        padding: '8px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const pageHeaderStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        margin: 0,
    };

    const statusBadgeStyle = (status: string): React.CSSProperties => ({
        fontSize: '14px',
        padding: '8px 16px',
        borderRadius: '8px',
        fontWeight: '600',
        backgroundColor: status === 'confirmed' ? '#DCFCE7' :
            status === 'pending' ? '#FEF3C7' :
                status === 'cancelled' ? '#FEE2E2' : '#F3F4F6',
        color: status === 'confirmed' ? '#166534' :
            status === 'pending' ? '#92400E' :
                status === 'cancelled' ? '#DC2626' : '#4B5563',
        marginLeft: 'auto',
    });

    const contentGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px',
        marginBottom: '32px',
    };

    const sectionStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column'
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const villaImagesStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: '8px',
        marginBottom: '20px',
    };


    const sideImagesContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    };


    const villaNameStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '8px',
    };

    const villaLocationStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#6b7280',
        margin: 0,
    };

    const villaDescriptionStyle: React.CSSProperties = {
        fontSize: '15px',
        color: '#4b5563',
        lineHeight: '1.6',
    };

    const detailsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        gap: '20px',
        marginBottom: '20px',
    };

    const detailItemStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
    };

    const detailLabelStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '6px',
        fontWeight: '500',
    };

    const detailValueStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#1a1a1a',
        fontWeight: '600',
    };

    const summaryRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '15px',
        color: '#4b5563',
    };

    const totalRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px',
        marginTop: '16px',
    };

    const paymentInfoStyle: React.CSSProperties = {
        backgroundColor: '#f8fafc',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
    };

    const maskedCardStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#4b5563',
        fontFamily: 'monospace',
    };

    const actionButtonStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '600',
        color: colors.primary,
        backgroundColor: 'transparent',
        border: `1px solid ${colors.primary}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '12px',
    };

    const primaryButtonStyle: React.CSSProperties = {
        ...actionButtonStyle,
        color: 'white',
        backgroundColor: colors.primary,
        border: 'none',
    };

    const bookingInfoStyle: React.CSSProperties = {
        backgroundColor: '#f0f9ff',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e0f2fe',
        marginBottom: '16px',
    };

    const bookingInfoItemStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '14px',
    };

    const ownerInfoStyle: React.CSSProperties = {
        backgroundColor: '#fef3c7',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #fde68a',
        marginBottom: '16px',
    };

    return (
        <motion.div
            style={containerStyle}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <style>
                {`
          @media (max-width: 770px) {
            .content-grid {
              grid-template-columns: 1fr !important;
            }
            .villa-images {
              grid-template-columns: 2fr 1fr !important;
            }
            .side-images-3rd {
              display: none !important;
            }
          }
          
        `}
            </style>

            {/* Header */}
            <div style={headerStyle}>
                <motion.button
                    style={backButtonStyle}
                    onClick={() => navigate('/bookings')}
                    whileHover={{backgroundColor: '#f3f4f6'}}
                    whileTap={{scale: 0.95}}
                >
                    <ArrowLeftIcon width={20} height={20}/>
                </motion.button>
                <h1 style={pageHeaderStyle}>Booking Details</h1>
                <span style={statusBadgeStyle(booking.status)}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
            </div>

            <div style={contentGridStyle} className="content-grid">
                {/* Left Column - Villa Details */}
                <div>
                    {/* Villa Images */}
                    <div style={sectionStyle}>
                        <h2 style={sectionTitleStyle}>
                            <HomeIcon width={20} height={20}/>
                            Villa Information
                        </h2>
                        <div style={villaImagesStyle} className={'villa-images'}>
                            <div style={{backgroundColor:colors.gray200,borderRadius: '12px'}}>
                                <div style={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    paddingTop: '100%',
                                    backgroundImage: `url(${villa.images[0]})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover'
                                }}></div>
                            </div>
                            <div style={sideImagesContainerStyle} className={'side-images-2nd'}>
                                <div style={{backgroundColor:colors.gray200,borderRadius: '12px'}}>
                                    <div style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        paddingTop: '100%',
                                        backgroundImage: `url(${villa.images[1] || villa.images[0]})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover'
                                    }}></div>
                                </div>
                                <div style={{backgroundColor:colors.gray200,borderRadius: '12px'}}>
                                    <div style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        paddingTop: '100%',
                                        backgroundImage: `url(${villa.images[2] || villa.images[0]})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover'
                                    }}></div>
                                </div>
                            </div>
                            <div style={sideImagesContainerStyle} className={'side-images-3rd'}>
                                <div style={{backgroundColor:colors.gray200,borderRadius: '12px'}}>
                                    <div style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        paddingTop: '100%',
                                        backgroundImage: `url(${villa.images[3] || villa.images[0]})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover'
                                    }}></div>
                                </div>
                                <div style={{backgroundColor:colors.gray200,borderRadius: '12px'}}>
                                    <div style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        paddingTop: '100%',
                                        backgroundImage: `url(${villa.images[4] || villa.images[0]})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover'
                                    }}></div>
                                </div>
                            </div>
                        </div>

                        <h3 style={villaNameStyle}>{villa.name}</h3>
                        <p style={villaLocationStyle}>{villa.location}</p>
                        <p style={villaDescriptionStyle}>{villa.description}</p>

                        {/* Show owner info for admin */}
                        {user?.role === 'admin' && (
                            <div style={ownerInfoStyle}>
                                <div style={bookingInfoItemStyle}>
                                    <span style={detailLabelStyle}>Property Owner ID:</span>
                                    <span>{villa.ownerId}</span>
                                </div>
                            </div>
                        )}

                        <div style={detailsGridStyle}>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Bedrooms</span>
                                <span style={detailValueStyle}>{villa.numberOfBedrooms}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Bathrooms</span>
                                <span style={detailValueStyle}>{villa.numberOfBathrooms}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Max Guests</span>
                                <span style={detailValueStyle}>{villa.maxVisitors}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Beds</span>
                                <span style={detailValueStyle}>{villa.numberOfBeds}</span>
                            </div>
                        </div>

                        <motion.button
                            style={primaryButtonStyle}
                            onClick={() => navigate(`/villas/${villa.id}`)}
                            whileHover={{backgroundColor: colors.primaryHover}}
                            whileTap={{scale: 0.98}}
                        >
                            View Villa Details
                        </motion.button>
                    </div>

                    {/* Booking Information */}
                    <div style={sectionStyle}>
                        <h2 style={sectionTitleStyle}>
                            <CalendarIcon width={20} height={20}/>
                            Booking Information
                        </h2>

                        <div style={bookingInfoStyle}>
                            <div style={bookingInfoItemStyle}>
                                <span style={detailLabelStyle}>Booking ID:</span>
                                <span style={{fontSize: '14px', fontFamily: 'monospace'}}>{booking.id}</span>
                            </div>
                            <div style={bookingInfoItemStyle}>
                                <span style={detailLabelStyle}>Booked by:</span>
                                <span>{getTenantName()}</span>
                            </div>
                            {user?.role !== 'tenant' && (
                                <div style={bookingInfoItemStyle}>
                                    <span style={detailLabelStyle}>Tenant ID:</span>
                                    <span>{booking.tenantId}</span>
                                </div>
                            )}
                        </div>

                        <div style={detailsGridStyle}>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Check-in Date</span>
                                <span style={detailValueStyle}>{booking.checkInDate.toLocaleDateString()}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Check-out Date</span>
                                <span style={detailValueStyle}>{booking.checkOutDate.toLocaleDateString()}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Number of Nights</span>
                                <span style={detailValueStyle}>{nights}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Number of Guests</span>
                                <span style={detailValueStyle}>{booking.numberOfGuests}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Booking Summary */}
                <div>
                    {/* Payment Summary */}
                    <div style={sectionStyle}>
                        <h2 style={sectionTitleStyle}>
                            <CardStackIcon width={20} height={20}/>
                            Payment Summary
                        </h2>

                        <div style={summaryRowStyle}>
                            <span>Price per night (avg)</span>
                            <span>AED {Math.round(booking.totalPrice / nights)}</span>
                        </div>
                        <div style={summaryRowStyle}>
                            <span>Number of nights</span>
                            <span>{nights}</span>
                        </div>
                        <div style={summaryRowStyle}>
                            <span>Number of guests</span>
                            <span>{booking.numberOfGuests}</span>
                        </div>
                        <div style={totalRowStyle}>
                            <span>Total Amount</span>
                            <span>AED {booking.totalPrice}</span>
                        </div>

                        <div style={paymentInfoStyle}>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Payment Status</span>
                                <span style={{
                                    ...detailValueStyle,
                                    color: booking.paymentStatus === 'paid' ? '#059669' : '#d97706'
                                }}>
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </span>
                            </div>
                            <div style={detailItemStyle}>
                                <span style={detailLabelStyle}>Payment Method</span>
                                <span style={maskedCardStyle}>•••• •••• •••• 3456</span>
                            </div>
                        </div>
                    </div>

                    {/* Guest Information */}
                    <div style={sectionStyle}>
                        <h2 style={sectionTitleStyle}>
                            <PersonIcon width={20} height={20}/>
                            Guest Information
                        </h2>

                        <div style={detailItemStyle}>
                            <span style={detailLabelStyle}>Primary Guest</span>
                            <span style={detailValueStyle}>{getTenantName()}</span>
                        </div>
                        <div style={detailItemStyle}>
                            <span style={detailLabelStyle}>Email</span>
                            <span style={detailValueStyle}>{getTenantEmail()}</span>
                        </div>
                        <div style={detailItemStyle}>
                            <span style={detailLabelStyle}>Total Guests</span>
                            <span style={detailValueStyle}>{booking.numberOfGuests}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={sectionStyle}>
                        <h2 style={sectionTitleStyle}>Actions</h2>

                        <motion.button
                            style={actionButtonStyle}
                            onClick={() => navigate(`/villas/${villa.id}`)}
                            whileHover={{
                                backgroundColor: colors.primaryLight,
                                borderColor: colors.primaryHover
                            }}
                            whileTap={{scale: 0.98}}
                        >
                            View Villa Details
                        </motion.button>

                        {user?.role === 'tenant' && (
                            <motion.button
                                style={actionButtonStyle}
                                onClick={() => navigate('/bookings/new')}
                                whileHover={{
                                    backgroundColor: colors.primaryLight,
                                    borderColor: colors.primaryHover
                                }}
                                whileTap={{scale: 0.98}}
                            >
                                Book Another Villa
                            </motion.button>
                        )}

                        {booking.status === 'confirmed' && user?.role === 'tenant' && (
                            <motion.button
                                style={{
                                    ...actionButtonStyle,
                                    color: '#dc2626',
                                    borderColor: '#dc2626',
                                }}
                                whileHover={{
                                    backgroundColor: '#fef2f2',
                                    borderColor: '#b91c1c'
                                }}
                                whileTap={{scale: 0.98}}
                            >
                                Cancel Booking
                            </motion.button>
                        )}

                        {booking.status === 'pending' && user?.role === 'homeowner' && (
                            <>
                                <motion.button
                                    style={primaryButtonStyle}
                                    whileHover={{backgroundColor: colors.primaryHover}}
                                    whileTap={{scale: 0.98}}
                                >
                                    Approve Booking
                                </motion.button>
                                <motion.button
                                    style={{
                                        ...actionButtonStyle,
                                        color: '#dc2626',
                                        borderColor: '#dc2626',
                                    }}
                                    whileHover={{
                                        backgroundColor: '#fef2f2',
                                        borderColor: '#b91c1c'
                                    }}
                                    whileTap={{scale: 0.98}}
                                >
                                    Reject Booking
                                </motion.button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BookingDetailPage;