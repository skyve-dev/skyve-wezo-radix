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

const ListingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { villas } = useVillas();
    const [filteredVillas, setFilteredVillas] = useState<Villa[]>([]);
    const [filters, setFilters] = useState<VillaFilters>(defaultFilters);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    
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

    const handleBookVilla = (villaId: string) => {
        navigate(`/bookings/new?villa=${villaId}`);
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
                                    onClick={() => handleBookVilla(villa.id)}
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
        </div>
    );
};

export default ListingsPage;