import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {motion} from 'framer-motion';
import {colors} from '../../utils/colors';
import BookingCalendar from '../../components/common/BookingCalendar';
import VillaImageGallery from '../../components/common/VillaImageGallery';
import {useVillas} from "../../contexts/VillasContext.tsx";
import { getAssetUrl } from '../../utils/basePath';
import {
    IoBedOutline,
    IoCameraOutline,
    IoLogoNoSmoking,
    IoPawOutline,
    IoPeopleOutline,
    IoTimeOutline
} from "react-icons/io5";
import {MdOutlineBedroomParent, MdOutlineCelebration, MdOutlineShower} from "react-icons/md";
import {GoPeople} from "react-icons/go";

const VillaDetailsPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const {villas} = useVillas();
    const villa = villas.find(v => v.id === id);

    // Helper function to get display name for amenity categories
    const getCategoryDisplayName = (category: string): string => {
        const categoryNames: { [key: string]: string } = {
            generalComfort: 'General Comfort',
            outdoorRecreation: 'Outdoor & Recreation',
            kitchenDining: 'Kitchen & Dining',
            technologyEntertainment: 'Technology & Entertainment',
            specialFeatures: 'Special Features'
        };
        return categoryNames[category] || category;
    };

    // Helper function to get icon for amenity
    const getAmenityIcon = (amenity: string): string => {
        const amenityIcons: { [key: string]: string } = {
            'Air conditioning': '❄️',
            'Wi-Fi': '📶',
            'Linens and towels': '🛏️',
            'Parking': '🚗',
            'Heating': '🔥',
            'Washing machine': '🧺',
            'Kitchen essentials': '🍳',
            'Coffee maker': '☕',
            'Dishwasher': '🧽',
            'Private pool': '🏊',
            'Beach access': '🏖️',
            'BBQ grill': '🔥',
            'Private terrace': '🌿',
            'Outdoor seating': '🪑',
            'Garden': '🌱',
            'Balcony': '🏡',
            'Ocean view': '🌊',
            'Mountain view': '⛰️',
            'City view': '🏙️',
            'TV': '📺',
            'Sound system': '🔊',
            'Netflix': '📱',
            'Gaming console': '🎮',
            'Projector': '📽️',
            'Spa facilities': '🧖',
            'Gym access': '💪',
            'Concierge service': '🛎️',
            'Private chef': '👨‍🍳',
            'Butler service': '🤵',
            'Security': '🔒',
            'Fire safety': '🚨',
            'First aid kit': '🩹',
            'Safe': '🔐',
            'Smoke detector': '💨',
            'Carbon monoxide detector': '⚠️'
        };
        return amenityIcons[amenity] || '✓';
    };

    if (!villa) {
        return (
            <div style={{padding: '40px', textAlign: 'center'}}>
                <h1>Villa not found</h1>
                <button style={{border: '1px solid rgba(0,0,0,0.1)', padding: '8px 14px', borderRadius: '8px'}}
                        onClick={() => navigate('/listings')}>
                    Back to Listings
                </button>
            </div>
        );
    }

    const handleBookNow = () => {
        if (selectedStartDate && selectedEndDate) {
            const searchParams = new URLSearchParams({
                villa: villa.id,
                checkIn: selectedStartDate.toISOString(),
                checkOut: selectedEndDate.toISOString()
            });
            navigate(`/bookings/new?${searchParams.toString()}`);
        }
    };

    const handleDateRangeSelect = (startDate: Date | null, endDate: Date | null) => {
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
    };

    // Get price for a specific date with custom pricing priority
    const getPriceForDate = (date: Date) => {
        // Format date as ISO string (YYYY-MM-DD) for comparison
        const dateStr = date.toISOString().split('T')[0];

        // First, check if there's a custom price for this specific date
        const customPrice = villa.customPricing?.find(cp => cp.date === dateStr);
        if (customPrice) {
            return customPrice.price;
        }

        // If no custom price, fall back to standard pricing logic
        const dayOfWeek = date.getDay();
        // Weekend is Friday (5) and Saturday (6) in UAE
        if (dayOfWeek === 5 || dayOfWeek === 6) {
            return villa.pricing.weekend;
        }
        return villa.pricing.weekday;
    };

    // Calculate total price using custom pricing logic
    const calculateTotalPrice = () => {
        if (!selectedStartDate || !selectedEndDate) return 0;

        let total = 0;
        const currentDate = new Date(selectedStartDate);

        while (currentDate < selectedEndDate) {
            total += getPriceForDate(currentDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return total;
    };

    // Mock unavailable dates (for demo)
    const unavailableDates = [
        new Date(2025, 0, 15),
        new Date(2025, 0, 16),
        new Date(2025, 0, 17),
        new Date(2025, 0, 25),
        new Date(2025, 0, 26),
    ];

    const containerStyle: React.CSSProperties = {
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto',
    };


    const titleStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1a1a1a',
    };

    const locationStyle: React.CSSProperties = {
        fontSize: '18px',
        color: '#6b7280',
        margin: 0,
        marginBottom: '18px'
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#4b5563',
        lineHeight: '1.6',
        margin: 0,

    };

    const priceStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '0px',
        display: 'flex',
        gap: '24px'
    };

    const amenitiesCategoriesStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    };

    const amenityCategoryStyle: React.CSSProperties = {
        marginBottom: '0',
    };

    const amenityCategoryTitleStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '16px',
    };

    const amenityListStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
        gap: '16px',
    };

    const amenityItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '15px',
        color: '#374151',
        lineHeight: '1.5',
        width: '200px',
        minWidth: '200px',
        flexShrink: 0,
    };

    const amenityIconStyle: React.CSSProperties = {
        fontSize: '18px',
        width: '20px',
        flexShrink: 0,
    };

    const categorySeparatorStyle: React.CSSProperties = {
        height: '1px',
        backgroundColor: '#f3f4f6',
        border: 'none',
        margin: '0',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '15px 30px',
        fontSize: '16px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: colors.primary,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    };

    const secondaryButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#6b7280',
    };

    const twoColumnLayoutStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '40px',
        marginTop: '40px',
    };

    const leftColumnStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
    };

    const rightColumnStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        flexGrow: 1,
    };

    const bookingSummaryStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    };

    const summaryTitleStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#1a1a1a',
    };

    const summaryRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '14px',
        color: '#4b5563',
    };

    const totalRowStyle: React.CSSProperties = {
        ...summaryRowStyle,
        fontWeight: '600',
        fontSize: '16px',
        color: '#1a1a1a',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '12px',
        marginTop: '12px',
    };

    const disabledButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#e5e7eb',
        color: '#9ca3af',
        cursor: 'not-allowed',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#1a1a1a',
    };

    const propertyDetailsStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '32px',
        marginBottom: '30px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
    };

    const propertyDetailItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    };

    const propertyDetailIconStyle: React.CSSProperties = {
        fontSize: '16px',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    };

    const propertyDetailTextStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: '500',
        color: '#374151',
    };

    const houseRulesContainerStyle: React.CSSProperties = {
        marginBottom: '40px',
    };

    const houseRulesTitleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#1a1a1a',
    };

    const houseRulesListStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '20px',
    };

    const houseRuleItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        width: '300px'
    };

    const houseRuleIconStyle: React.CSSProperties = {
        fontSize: '20px',
        width: '24px',
        flexShrink: 0,
        marginTop: '2px',
    };

    const houseRuleContentStyle: React.CSSProperties = {
        flex: 1,
    };

    const houseRuleLabelStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px',
    };

    const houseRuleValueStyle: React.CSSProperties = {
        fontSize: '15px',
        color: '#6b7280',
        lineHeight: '1.5',
    };

    const nights = selectedStartDate && selectedEndDate
        ? Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const totalPrice = calculateTotalPrice();
    const averagePricePerNight = nights > 0 ? Math.round(totalPrice / nights) : 0;

    return (
        <motion.div
            style={containerStyle}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                <style>
                    {`
                      @media (max-width: 770px) {
                        .hidden-on-tablet {
                          display: none !important;
                        }
                      }
                      @media (max-width: 400px) {
                        .hidden-on-mobile {
                          display: none !important;
                        }
                      }
                    `}
                </style>
                <motion.div
                    initial={{y: 20, opacity: 0, flexGrow: 2}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.1, duration: 0.5}}
                >
                    <VillaImageGallery images={villa.images} villaName={villa.name}/>
                </motion.div>
                <motion.div
                    style={{display: "flex", flexDirection: 'column', gap: '10px'}} className={'hidden-on-mobile'}
                    initial={{y: 20, opacity: 0, flexGrow: 1}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.1, duration: 0.5}}
                >
                    <div style={{
                        borderRadius: 10,
                        background: colors.gray100,
                        height: '50%',
                        backgroundImage: `url(${getAssetUrl(villa.images[9] || villa.images[0])})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}></div>
                    <div style={{
                        borderRadius: 10,
                        background: colors.gray100,
                        height: '50%',
                        backgroundImage: `url(${getAssetUrl(villa.images[8] || villa.images[0])})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}></div>
                </motion.div>
                <motion.div
                    style={{display: "flex", flexDirection: 'column', gap: '10px'}} className={'hidden-on-tablet'}
                    initial={{y: 20, opacity: 0, flexGrow: 1}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.1, duration: 0.5}}>
                    <div style={{
                        borderRadius: 10,
                        background: colors.gray100,
                        height: '50%',
                        backgroundImage: `url(${getAssetUrl(villa.images[7] || villa.images[0])})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}></div>
                    <div style={{
                        borderRadius: 10,
                        background: colors.gray100,
                        height: '50%',
                        backgroundImage: `url(${getAssetUrl(villa.images[6] || villa.images[0])})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}></div>
                </motion.div>
            </div>
            <motion.div
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.2, duration: 0.5}}
            >
                <h1 style={titleStyle}>{villa.name}</h1>
                <p style={locationStyle}>{villa.location}</p>
                <p style={descriptionStyle}>{villa.description}</p>

                {/* Property Details */}
                <div style={propertyDetailsStyle}>
                    <div style={propertyDetailItemStyle}>
                        <span style={propertyDetailIconStyle}>
                            <MdOutlineBedroomParent style={{fontSize: '26px'}}/>
                        </span>
                        <span style={propertyDetailTextStyle}>{villa.numberOfBedrooms} Bedrooms</span>
                    </div>
                    <div style={propertyDetailItemStyle}>
                        <span style={propertyDetailIconStyle}>
                            <IoBedOutline style={{fontSize: '26px'}}/>
                        </span>
                        <span style={propertyDetailTextStyle}>{villa.numberOfBeds} Beds</span>
                    </div>
                    <div style={propertyDetailItemStyle}>
                        <span style={propertyDetailIconStyle}>
                            <MdOutlineShower style={{fontSize: '26px'}}/>
                        </span>
                        <span style={propertyDetailTextStyle}>{villa.numberOfBathrooms} Bathrooms</span>
                    </div>
                    <div style={propertyDetailItemStyle}>
                        <span style={propertyDetailIconStyle}>
                            <GoPeople style={{fontSize: '22px'}}/>
                        </span>
                        <span style={propertyDetailTextStyle}>Max {villa.maxVisitors} Guests</span>
                    </div>
                </div>
                <div style={priceStyle}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                        <div style={{width: 60, fontSize: '12px', color: colors.gray500, whiteSpace: 'nowrap'}}>Weekday
                            :
                        </div>
                        <div style={{fontSize: '16px', color: colors.primaryHover}}>
                            AED {villa.pricing.weekday}/night
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                        <div style={{width: 60, fontSize: '12px', color: colors.gray500, whiteSpace: 'nowrap'}}>Weekend
                            :
                        </div>
                        <div style={{fontSize: '16px', color: colors.primaryHover}}>
                            AED {villa.pricing.weekend}/night
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                        <div style={{width: 60, fontSize: '12px', color: colors.gray500, whiteSpace: 'nowrap'}}>Halfday
                            :
                        </div>
                        <div style={{fontSize: '16px', color: colors.primaryHover}}>
                            AED {villa.pricing.halfDay}
                        </div>
                    </div>
                </div>

                {/* Amenities Section */}
                <div style={{marginBottom: '40px'}}>
                    <div style={amenitiesCategoriesStyle}>
                        {Object.entries(villa.amenities).map(([category, items], categoryIndex) => (
                            items && items.length > 0 && (
                                <div key={category}>
                                    <div style={amenityCategoryStyle}>
                                        <h4 style={amenityCategoryTitleStyle}>
                                            {getCategoryDisplayName(category)}
                                        </h4>
                                        <div style={amenityListStyle}>
                                            {items.map((amenity: string, index: number) => (
                                                <div key={index} style={amenityItemStyle}>
                          <span style={amenityIconStyle}>
                            {getAmenityIcon(amenity)}
                          </span>
                                                    <span>{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {categoryIndex < Object.entries(villa.amenities).filter(([, items]) => items && items.length > 0).length - 1 && (
                                        <hr style={categorySeparatorStyle}/>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </div>


                {/* House Rules Section */}
                <div style={houseRulesContainerStyle}>
                    <h3 style={houseRulesTitleStyle}>House Rules</h3>
                    <div style={houseRulesListStyle}>
                        {/* Check-in/Check-out Times */}
                        <div style={houseRuleItemStyle}>
                            <div style={houseRuleIconStyle}>
                                <IoTimeOutline style={{fontSize: '26px'}}/>
                            </div>
                            <div style={houseRuleContentStyle}>
                                <div style={houseRuleLabelStyle}>Check-in / Check-out</div>
                                <div style={houseRuleValueStyle}>
                                    Check-in: {villa.houseRules.checkInTime} •
                                    Check-out: {villa.houseRules.checkOutTime}
                                </div>
                            </div>
                        </div>

                        {/* Maximum Occupancy */}
                        <div style={houseRuleItemStyle}>
                            <div style={houseRuleIconStyle}>
                                <IoPeopleOutline style={{fontSize: '26px'}}/>
                            </div>
                            <div style={houseRuleContentStyle}>
                                <div style={houseRuleLabelStyle}>Maximum Occupancy</div>
                                <div style={houseRuleValueStyle}>
                                    {villa.maxVisitors} guests maximum
                                </div>
                            </div>
                        </div>

                        {/* Pets Policy */}
                        <div style={houseRuleItemStyle}>
                            <div style={houseRuleIconStyle}>
                                <IoPawOutline style={{fontSize: '26px'}}/>
                            </div>
                            <div style={houseRuleContentStyle}>
                                <div style={houseRuleLabelStyle}>Pets Policy</div>
                                <div style={houseRuleValueStyle}>
                                    {villa.houseRules.petsAllowed ? 'Pets are welcome' : 'No pets allowed'}
                                </div>
                            </div>
                        </div>

                        {/* Parties/Events */}
                        <div style={houseRuleItemStyle}>
                            <div style={houseRuleIconStyle}>
                                <MdOutlineCelebration style={{fontSize: '26px'}}/>
                            </div>
                            <div style={houseRuleContentStyle}>
                                <div style={houseRuleLabelStyle}>Parties & Events</div>
                                <div style={houseRuleValueStyle}>
                                    {villa.houseRules.partiesAllowed ? 'Events allowed (with prior approval)' : 'No parties or events'}
                                </div>
                            </div>
                        </div>

                        {/* Photography */}
                        <div style={houseRuleItemStyle}>
                            <div style={houseRuleIconStyle}>
                                <IoCameraOutline style={{fontSize: '26px'}}/>
                            </div>
                            <div style={houseRuleContentStyle}>
                                <div style={houseRuleLabelStyle}>Commercial Photography</div>
                                <div style={houseRuleValueStyle}>
                                    {villa.houseRules.commercialPhotographyAllowed ? 'Allowed with permission' : 'Not permitted'}
                                </div>
                            </div>
                        </div>

                        {/* Smoking */}
                        <div style={houseRuleItemStyle}>
                            <div style={houseRuleIconStyle}>
                                <IoLogoNoSmoking style={{fontSize: '26px'}}/>
                            </div>
                            <div style={houseRuleContentStyle}>
                                <div style={houseRuleLabelStyle}>Smoking Policy</div>
                                <div style={houseRuleValueStyle}>
                                    {villa.houseRules.smokingAllowed ? 'Smoking allowed in designated areas' : 'No smoking indoors'}
                                </div>
                            </div>
                        </div>

                        {/* Quiet Hours */}
                        {villa.houseRules.quietHours && (
                            <div style={houseRuleItemStyle}>
                                <div style={houseRuleIconStyle}>🤫</div>
                                <div style={houseRuleContentStyle}>
                                    <div style={houseRuleLabelStyle}>Quiet Hours</div>
                                    <div style={houseRuleValueStyle}>
                                        {villa.houseRules.quietHours}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pool Rules */}
                        {villa.houseRules.poolRules && (
                            <div style={houseRuleItemStyle}>
                                <div style={houseRuleIconStyle}>🏊</div>
                                <div style={houseRuleContentStyle}>
                                    <div style={houseRuleLabelStyle}>Pool Rules</div>
                                    <div style={houseRuleValueStyle}>
                                        {villa.houseRules.poolRules}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cleaning Fee */}
                        {villa.houseRules.cleaningFee && (
                            <div style={houseRuleItemStyle}>
                                <div style={houseRuleIconStyle}>🧹</div>
                                <div style={houseRuleContentStyle}>
                                    <div style={houseRuleLabelStyle}>Cleaning Fee</div>
                                    <div style={houseRuleValueStyle}>
                                        {villa.houseRules.cleaningFee}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div style={twoColumnLayoutStyle}>
                    {/* Left Column - Calendar */}
                    <div style={leftColumnStyle}>
                        <h3 style={sectionTitleStyle}>Select Dates</h3>
                        <BookingCalendar
                            pricing={villa.pricing}
                            customPricing={villa.customPricing}
                            unavailableDates={unavailableDates}
                            onDateRangeSelect={handleDateRangeSelect}
                        />
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div style={rightColumnStyle}>
                        <div style={bookingSummaryStyle}>
                            <h3 style={summaryTitleStyle}>Booking Summary</h3>

                            {selectedStartDate && selectedEndDate ? (
                                <>
                                    <div style={summaryRowStyle}>
                                        <span>Check-in</span>
                                        <span>{selectedStartDate.toLocaleDateString()}</span>
                                    </div>
                                    <div style={summaryRowStyle}>
                                        <span>Check-out</span>
                                        <span>{selectedEndDate.toLocaleDateString()}</span>
                                    </div>
                                    <div style={summaryRowStyle}>
                                        <span>Number of nights</span>
                                        <span>{nights}</span>
                                    </div>
                                    <div style={summaryRowStyle}>
                                        <span>Average per night</span>
                                        <span>AED {averagePricePerNight}</span>
                                    </div>
                                    <div style={summaryRowStyle}>
                                        <span>Maximum guests</span>
                                        <span>{villa.maxVisitors} guests</span>
                                    </div>
                                    <div style={totalRowStyle}>
                                        <span>Total Price</span>
                                        <span>AED {totalPrice}</span>
                                    </div>
                                </>
                            ) : (
                                <div style={{...summaryRowStyle, justifyContent: 'center', color: '#9ca3af'}}>
                                    Select dates to see pricing
                                </div>
                            )}
                        </div>

                        <motion.button
                            style={selectedStartDate && selectedEndDate ? buttonStyle : disabledButtonStyle}
                            onClick={handleBookNow}
                            disabled={!selectedStartDate || !selectedEndDate}
                            whileHover={selectedStartDate && selectedEndDate ? {backgroundColor: colors.primaryHover} : {}}
                            whileTap={selectedStartDate && selectedEndDate ? {scale: 0.98} : {}}
                        >
                            {selectedStartDate && selectedEndDate
                                ? 'Proceed to Booking'
                                : 'Select Dates'}
                        </motion.button>

                        <motion.button
                            style={secondaryButtonStyle}
                            onClick={() => navigate('/listings')}
                            whileHover={{backgroundColor: '#4b5563'}}
                            whileTap={{scale: 0.98}}
                        >
                            Back to Listings
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default VillaDetailsPage;