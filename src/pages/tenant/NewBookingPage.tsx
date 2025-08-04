import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import {CheckCircledIcon} from '@radix-ui/react-icons';
import {useAuth} from '../../contexts/AuthContext';
import {useBookings} from '../../contexts/BookingsContext';
import {useVillas} from '../../contexts/VillasContext';
import {colors} from '../../utils/colors';
import type {Booking} from '../../types';
import {NumericInput} from "../../components/inputs/NumericInput.tsx";
import BookingCalendar from '../../components/common/BookingCalendar';
import { getAssetUrl } from '../../utils/basePath';

const NewBookingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {user} = useAuth();
    const {addBooking, bookings} = useBookings();
    const {getVillaById, isVillaAvailable} = useVillas();

    // Get booking details from URL params
    const villaId = searchParams.get('villa');
    const checkInStr = searchParams.get('checkIn');
    const checkOutStr = searchParams.get('checkOut');

    const villa = villaId ? getVillaById(villaId) : null;
    const [checkInDate, setCheckInDate] = useState<Date | null>(checkInStr ? new Date(checkInStr) : null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(checkOutStr ? new Date(checkOutStr) : null);
    
    // State for calendar visibility - show if no dates are pre-selected
    const [showCalendar, setShowCalendar] = useState(!checkInStr || !checkOutStr);

    // Form state
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);

    // UI state
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Redirect if no villa
    useEffect(() => {
        if (!villa) {
            navigate('/listings');
        }
    }, [villa, navigate]);
    
    // Get unavailable dates for the villa
    const getUnavailableDates = () => {
        if (!villa) return [];
        
        return bookings
            .filter(booking => 
                booking.villaId === villa.id && 
                (booking.status === 'confirmed' || booking.status === 'pending')
            )
            .flatMap(booking => {
                const dates = [];
                const start = new Date(booking.checkInDate);
                const end = new Date(booking.checkOutDate);
                
                for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
                    dates.push(new Date(d));
                }
                
                return dates;
            });
    };
    
    // Handle date selection from calendar
    const handleDateRangeSelect = (startDate: Date | null, endDate: Date | null) => {
        setCheckInDate(startDate);
        setCheckOutDate(endDate);
        
        // Hide calendar once dates are selected
        if (startDate && endDate) {
            setShowCalendar(false);
        }
    };

    // Calculate total price
    const calculateTotalPrice = () => {
        if (!villa || !checkInDate || !checkOutDate) return 0;

        let total = 0;
        const currentDate = new Date(checkInDate);

        while (currentDate < checkOutDate) {
            const dayOfWeek = currentDate.getDay();
            // Weekend is Friday (5) and Saturday (6) in UAE
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                total += villa.pricing.weekend;
            } else {
                total += villa.pricing.weekday;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return total;
    };

    const totalPrice = calculateTotalPrice();
    const nights = checkInDate && checkOutDate
        ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    // Format card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }

        if (!cardName || cardName.length < 3) {
            newErrors.cardName = 'Please enter the cardholder name';
        }

        if (!expiryMonth || !expiryYear) {
            newErrors.expiry = 'Please enter the expiry date';
        }

        if (!cvv || cvv.length !== 3) {
            newErrors.cvv = 'Please enter a valid 3-digit CVV';
        }

        if (numberOfGuests < 1 || numberOfGuests > (villa?.maxVisitors || 1)) {
            newErrors.guests = `Number of guests must be between 1 and ${villa?.maxVisitors}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Simulate payment processing
    const processPayment = async () => {
        if (!validateForm() || !user || !villa || !checkInDate || !checkOutDate) return;

        setIsProcessing(true);

        // Check villa availability before processing payment
        const available = isVillaAvailable(villa.id, checkInDate, checkOutDate, bookings);

        if (!available) {
            setErrors({
                ...errors,
                availability: 'Sorry, this villa is not available for the selected dates. Please choose different dates.'
            });
            setIsProcessing(false);
            return;
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create new booking
        const newBooking: Booking = {
            id: `booking-${Date.now()}`,
            villaId: villa.id,
            tenantId: user.id,
            checkInDate,
            checkOutDate,
            numberOfGuests,
            totalPrice,
            status: 'confirmed',
            paymentStatus: 'paid',
        };

        // Add booking to context
        addBooking(newBooking);

        setIsProcessing(false);
        setShowSuccess(true);

        // Redirect after 3 seconds
        setTimeout(() => {
            navigate('/tenant');
        }, 3000);
    };

    // Styles
    const containerStyle: React.CSSProperties = {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const pageHeaderStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '30px',
    };

    const contentGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '40px',
        marginBottom: '40px',
    };

    const sectionStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#1a1a1a',
    };

    const formGroupStyle: React.CSSProperties = {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column'
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '8px',
    };

    const inputStyle: React.CSSProperties = {
        padding: '12px 16px',
        fontSize: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#fff',
        transition: 'border-color 0.2s',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    };

    const inputErrorStyle: React.CSSProperties = {
        ...inputStyle,
        borderColor: '#ef4444',
    };

    const errorTextStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#ef4444',
        marginTop: '4px',
    };

    const expiryContainerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px'
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

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: colors.primary,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    };

    const buttonDisabledStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed',
    };

    const processingSpinnerStyle: React.CSSProperties = {
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid #ffffff',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginRight: '8px',
    };

    const successModalOverlayStyle: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
    };

    const successModalContentStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50vh',
        left: '50vw',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        width: 'calc(100vw - 40px)',
        maxWidth: '330px',
        maxHeight: 'calc(100vh - 40px)',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        zIndex: 51,
        outline: 'none',
        margin: '0',
        overflow: 'auto',
    };

    const successIconContainerStyle: React.CSSProperties = {
        width: '80px',
        height: '80px',
        margin: '0 auto 24px',
        backgroundColor: '#10b981',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const successTitleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '12px',
    };

    const successMessageStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '8px',
    };

    const villaInfoStyle: React.CSSProperties = {
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
    };

    const villaImageStyle: React.CSSProperties = {
        width: '120px',
        height: '90px',
        borderRadius: '8px',
        objectFit: 'cover',
    };

    const villaDetailsStyle: React.CSSProperties = {
        flex: 1,
    };

    const villaNameStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px',
    };

    const villaLocationStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6b7280',
    };


    if (!villa) {
        return null;
    }

    return (
        <div style={containerStyle}>
            <style>
                {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .content-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
            </style>

            <h1 style={pageHeaderStyle}>
                {showCalendar ? 'Select Your Dates' : 'Complete Your Booking'}
            </h1>
            
            {/* Show Calendar if dates not pre-selected */}
            {showCalendar && villa && (
                <motion.div
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        marginBottom: '30px',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                            {villa.name}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                            {villa.location}
                        </p>
                    </div>
                    
                    <BookingCalendar
                        pricing={villa.pricing}
                        customPricing={villa.customPricing}
                        unavailableDates={getUnavailableDates()}
                        onDateRangeSelect={handleDateRangeSelect}
                    />
                    
                    {checkInDate && checkOutDate && (
                        <motion.button
                            style={{
                                ...buttonStyle,
                                marginTop: '20px',
                            }}
                            onClick={() => setShowCalendar(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ backgroundColor: colors.primaryHover }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Continue with Booking
                        </motion.button>
                    )}
                </motion.div>
            )}
            
            {/* Show Booking Form only when dates are selected */}
            {!showCalendar && checkInDate && checkOutDate && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
            <div style={contentGridStyle} className="content-grid">
                {/* Left Column - Payment Form */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Payment Details</h2>

                    {/* Card Number */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Card Number</label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            style={errors.cardNumber ? inputErrorStyle : inputStyle}
                            onFocus={(e) => e.target.style.borderColor = colors.primary}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        {errors.cardNumber && <div style={errorTextStyle}>{errors.cardNumber}</div>}
                    </div>

                    {/* Cardholder Name */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Cardholder Name</label>
                        <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="John Doe"
                            style={errors.cardName ? inputErrorStyle : inputStyle}
                            onFocus={(e) => e.target.style.borderColor = colors.primary}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        {errors.cardName && <div style={errorTextStyle}>{errors.cardName}</div>}
                    </div>

                    {/* Expiry and CVV */}
                    <div style={expiryContainerStyle}>
                        <div>
                            <label style={labelStyle}>Expiry Date</label>
                            <div style={{display: 'flex', gap: '8px'}}>
                                <input
                                    type="text"
                                    value={expiryMonth}
                                    onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="MM"
                                    maxLength={2}
                                    style={errors.expiry ? inputErrorStyle : inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = colors.primary}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                                <input
                                    type="text"
                                    value={expiryYear}
                                    onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="YY"
                                    maxLength={2}
                                    style={errors.expiry ? inputErrorStyle : inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = colors.primary}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            {errors.expiry && <div style={errorTextStyle}>{errors.expiry}</div>}
                        </div>
                        <div>
                            <label style={labelStyle}>CVV</label>
                            <input
                                type="text"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                placeholder="123"
                                maxLength={3}
                                style={errors.cvv ? inputErrorStyle : inputStyle}
                                onFocus={(e) => e.target.style.borderColor = colors.primary}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                            {errors.cvv && <div style={errorTextStyle}>{errors.cvv}</div>}
                        </div>
                    </div>

                    {/* Number of Guests */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Number of Guests</label>
                        <NumericInput value={numberOfGuests} onChange={(val) => {
                            setNumberOfGuests(val || 1)
                        }} invalid={errors.guests !== null && errors.guests !== undefined && errors.guests.length > 0}/>
                        {errors.guests && <div style={errorTextStyle}>{errors.guests}</div>}
                    </div>
                </div>

                {/* Right Column - Booking Summary */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Booking Summary</h2>

                    {/* Villa Info */}
                    <div style={villaInfoStyle}>
                        <img src={getAssetUrl(villa.images[0])} alt={villa.name} style={villaImageStyle}/>
                        <div style={villaDetailsStyle}>
                            <h3 style={villaNameStyle}>{villa.name}</h3>
                            <p style={villaLocationStyle}>{villa.location}</p>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div>
                        <div style={summaryRowStyle}>
                            <span>Check-in</span>
                            <span>{checkInDate.toLocaleDateString()}</span>
                        </div>
                        <div style={summaryRowStyle}>
                            <span>Check-out</span>
                            <span>{checkOutDate.toLocaleDateString()}</span>
                        </div>
                        <div style={summaryRowStyle}>
                            <span>Number of nights</span>
                            <span>{nights}</span>
                        </div>
                        <div style={summaryRowStyle}>
                            <span>Guests</span>
                            <span>{numberOfGuests}</span>
                        </div>
                        <div style={summaryRowStyle}>
                            <span>Price per night (avg)</span>
                            <span>AED {Math.round(totalPrice / nights)}</span>
                        </div>
                        <div style={totalRowStyle}>
                            <span>Total Amount</span>
                            <span>AED {totalPrice}</span>
                        </div>
                    </div>

                    {/* Availability Error */}
                    {errors.availability && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '16px',
                        }}>
                            <div style={{
                                fontSize: '14px',
                                color: '#dc2626',
                                fontWeight: '500',
                            }}>
                                {errors.availability}
                            </div>
                        </div>
                    )}

                    {/* Pay Button */}
                    <motion.button
                        style={isProcessing ? buttonDisabledStyle : buttonStyle}
                        onClick={processPayment}
                        disabled={isProcessing}
                        whileHover={!isProcessing ? {backgroundColor: colors.primaryHover} : {}}
                        whileTap={!isProcessing ? {scale: 0.98} : {}}
                    >
                        {isProcessing ? (
                            <>
                                <span style={processingSpinnerStyle}></span>
                                Processing Payment...
                            </>
                        ) : (
                            'Pay Now'
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <Dialog.Root open={showSuccess}>
                        <Dialog.Portal>
                            <Dialog.Overlay asChild>
                                <motion.div
                                    style={successModalOverlayStyle}
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                />
                            </Dialog.Overlay>
                            <Dialog.Content asChild>
                                <motion.div
                                    style={successModalContentStyle}
                                    initial={{opacity: 0, scale: 0.9, x: '-50%', y: '-50%'}}
                                    animate={{opacity: 1, scale: 1}}
                                    exit={{opacity: 0, scale: 0.9}}
                                >
                                    <div style={successIconContainerStyle}>
                                        <CheckCircledIcon width={48} height={48} color="white"/>
                                    </div>
                                    <h2 style={successTitleStyle}>Booking Confirmed!</h2>
                                    <p style={successMessageStyle}>
                                        Your booking for {villa.name} has been confirmed.
                                    </p>
                                    <p style={successMessageStyle}>
                                        Check-in: {checkInDate.toLocaleDateString()}
                                    </p>
                                    <p style={{...successMessageStyle, fontSize: '14px', marginTop: '16px'}}>
                                        Redirecting to your dashboard...
                                    </p>
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                )}
            </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default NewBookingPage;