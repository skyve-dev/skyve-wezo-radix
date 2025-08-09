import React, {useEffect, useState, useMemo} from 'react';
import {useVillas} from '../../contexts/VillasContext';
import type {Villa, VillaFilters} from '../../types';
import {defaultFilters} from '../../types/filters';
import {useNavigate} from 'react-router-dom';
import {colors} from '../../utils/colors';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import {applyFilters} from '../../utils/filterUtils';
import { getAssetUrl } from '../../utils/basePath';
import { shadows, borderRadius } from '../../utils/design';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import BookingCalendar from '../../components/common/BookingCalendar';
import { useBookings } from '../../contexts/BookingsContext';

const ListingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { villas } = useVillas();
    const { bookings } = useBookings();
    const [filteredVillas, setFilteredVillas] = useState<Villa[]>([]);
    const [filters, setFilters] = useState<VillaFilters>(defaultFilters);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    
    // Modal state for date selection
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    
    // Get only active villas for public listings - memoized to prevent infinite re-renders
    const activeVillas = useMemo(() => {
        return villas.filter(villa => villa.isActive);
    }, [villas]);

    // Helper function to get a flat array of amenities for display in villa cards
    const getFlatAmenities = (amenities: Villa['amenities']): string[] => {
        const flatAmenities: string[] = [];
        Object.values(amenities).forEach(categoryItems => {
            if (categoryItems) {
                flatAmenities.push(...categoryItems);
            }
        });
        return flatAmenities;
    };
    
    // Get unavailable dates for a villa
    const getUnavailableDates = (villa: Villa) => {
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
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
    };
    
    // Open modal for date selection
    const openDateModal = (villa: Villa) => {
        setSelectedVilla(villa);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setIsDateModalOpen(true);
    };
    
    // Close modal and reset selections
    const closeDateModal = () => {
        setIsDateModalOpen(false);
        setSelectedVilla(null);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
    };
    
    // Navigate to booking page with selected dates
    const proceedToBooking = () => {
        if (selectedVilla && selectedStartDate && selectedEndDate) {
            const searchParams = new URLSearchParams({
                villa: selectedVilla.id,
                checkIn: selectedStartDate.toISOString(),
                checkOut: selectedEndDate.toISOString()
            });
            navigate(`/bookings/new?${searchParams.toString()}`);
            closeDateModal();
        }
    };

    // Apply filters whenever filters change or villas change
    useEffect(() => {
        const filtered = applyFilters(activeVillas, filters);
        setFilteredVillas(filtered);
    }, [filters, activeVillas]);

    const handleFiltersChange = (newFilters: VillaFilters) => {
        setFilters(newFilters);
    };

    const handleApplyFilters = () => {
        // Filters are applied automatically via useEffect
        // This function can be used for additional logic like analytics
    };

    const handleBookVilla = (villa: Villa) => {
        openDateModal(villa);
    };

    const handleViewDetails = (villaId: string) => {
        navigate(`/villas/${villaId}`);
    };

    const containerStyle: React.CSSProperties = {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    };


    const buttonStyle: React.CSSProperties = {
        padding: '10px 20px',
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
        gap: '25px',
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        boxShadow: shadows.md,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        paddingTop: '80%',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }

    const cardContentStyle: React.CSSProperties = {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
    };

    const villaNameStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        margin: '0px',
    };

    const locationStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6b7280',
        margin: '0px',
    };

    const descriptionStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#4b5563',
        marginBottom: '15px',
        lineHeight: '1.5',
    };

    const amenitiesStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '15px',
    };

    const amenityTagStyle: React.CSSProperties = {
        fontSize: '12px',
        padding: '4px 8px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        borderRadius: '6px',
    };

    const priceInfoStyle: React.CSSProperties = {
        marginBottom: '15px',
        flexGrow: 1
    };

    const priceStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '600',
        color: colors.primary,
        marginBottom: '5px',
    };

    const capacityStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6b7280',
    };

    const actionsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '10px',
    };

    const primaryButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        flex: 1,
        backgroundColor: colors.primary,
    };

    const secondaryButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        flex: 1,
        backgroundColor: '#6b7280',
    };

    return (
        <div style={containerStyle}>


            {/* Search Bar */}
            <SearchBar
                filters={filters}
                onOpenFilters={() => setIsFilterPanelOpen(true)}
            />

            {/* Filter Panel */}
            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApplyFilters={handleApplyFilters}
            />

            <div style={gridStyle}>
                {filteredVillas.map((villa) => (
                    <div 
                        key={villa.id} 
                        style={cardStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = shadows.xl;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = shadows.md;
                        }}
                    >
                        <div style={{
                            backgroundImage: `url(${getAssetUrl(villa.images[0])})`,
                            ...imageStyle
                        }}>
                        </div>
                        <div style={cardContentStyle}>
                            <h3 style={villaNameStyle}>{villa.name}</h3>
                            <p style={locationStyle}>{villa.location}</p>
                            <p style={descriptionStyle}>{villa.description}</p>

                            <div style={amenitiesStyle}>
                                {(() => {
                                    const flatAmenities = getFlatAmenities(villa.amenities);
                                    return (
                                        <>
                                            {flatAmenities.slice(0, 4).map((amenity, index) => (
                                                <span key={index} style={amenityTagStyle}>
                          {amenity}
                        </span>
                                            ))}
                                            {flatAmenities.length > 4 && (
                                                <span style={amenityTagStyle}>
                          +{flatAmenities.length - 4} more
                        </span>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            <div style={priceInfoStyle}>
                                <div style={priceStyle}>
                                    From AED {villa.pricing.weekday}/night
                                </div>
                                <div style={capacityStyle}>
                                    {villa.numberOfBedrooms} Bed • {villa.numberOfBathrooms} Bath • Up
                                    to {villa.maxVisitors} guests
                                </div>
                            </div>

                            <div style={actionsStyle}>
                                <button
                                    onClick={() => handleViewDetails(villa.id)}
                                    style={secondaryButtonStyle}
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleBookVilla(villa)}
                                    style={primaryButtonStyle}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredVillas.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                    No villas found matching your criteria. Try adjusting your filters.
                </div>
            )}
            
            {/* Date Selection Modal */}
            <Dialog.Root open={isDateModalOpen} onOpenChange={setIsDateModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9998
                    }} />
                    <Dialog.Content style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        maxWidth: '320px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        zIndex: 9999,
                        boxShadow: '0 10px 50px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <Dialog.Title style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                color: '#1a1a1a',
                                margin: 0
                            }}>
                                Select Your Dates
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <button
                                    onClick={closeDateModal}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '4px',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <Cross2Icon style={{ width: '18px', height: '18px' }} />
                                </button>
                            </Dialog.Close>
                        </div>
                        
                        {selectedVilla && (
                            <>
                                <div style={{
                                    marginBottom: '20px',
                                    padding: '16px',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '8px'
                                }}>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#1a1a1a',
                                        marginTop: 0,
                                        marginBottom: '8px'
                                    }}>
                                        {selectedVilla.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#6b7280',
                                        margin: 0
                                    }}>
                                        {selectedVilla.location}
                                    </p>
                                </div>
                                
                                <BookingCalendar
                                    pricing={selectedVilla.pricing}
                                    customPricing={selectedVilla.customPricing}
                                    unavailableDates={getUnavailableDates(selectedVilla)}
                                    onDateRangeSelect={handleDateRangeSelect}
                                />
                                
                                {selectedStartDate && selectedEndDate && (
                                    <div style={{
                                        marginTop: '20px',
                                        padding: '16px',
                                        backgroundColor: '#f0fdf4',
                                        borderRadius: '8px',
                                        border: '1px solid #bbf7d0'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '8px'
                                        }}>
                                            <span style={{ fontSize: '14px', color: '#4b5563' }}>
                                                Check-in: {selectedStartDate.toLocaleDateString()}
                                            </span>
                                            <span style={{ fontSize: '14px', color: '#4b5563' }}>
                                                Check-out: {selectedEndDate.toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: colors.primary
                                        }}>
                                            Total nights: {Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24))}
                                        </div>
                                    </div>
                                )}
                                
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginTop: '24px'
                                }}>
                                    <button
                                        onClick={closeDateModal}
                                        style={{
                                            flex: 1,
                                            padding: '12px 24px',
                                            backgroundColor: '#f3f4f6',
                                            color: '#374151',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={proceedToBooking}
                                        disabled={!selectedStartDate || !selectedEndDate}
                                        style={{
                                            flex: 1,
                                            padding: '12px 24px',
                                            backgroundColor: selectedStartDate && selectedEndDate ? colors.primary : '#d1d5db',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: selectedStartDate && selectedEndDate ? 'pointer' : 'not-allowed',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedStartDate && selectedEndDate) {
                                                e.currentTarget.style.backgroundColor = colors.primaryHover;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedStartDate && selectedEndDate) {
                                                e.currentTarget.style.backgroundColor = colors.primary;
                                            }
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default ListingsPage;