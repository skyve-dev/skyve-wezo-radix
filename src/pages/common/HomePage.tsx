import React from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {mockPromotion} from '../../data/mockData';
import {useVillas} from '../../contexts/VillasContext';
import type {Villa} from '../../types';
import {colors} from '../../utils/colors';
import { getAssetUrl } from '../../utils/basePath';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { getFeaturedVillas } = useVillas();
    const featuredVillas = getFeaturedVillas().slice(0, 4);

    const containerStyle: React.CSSProperties = {
        padding: '16px',
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const heroBannerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        height: '300px',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '32px',
        cursor: 'pointer',
    };

    const heroImageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    const heroOverlayStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '24px',
    };

    const heroTitleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '8px',
    };

    const heroDescriptionStyle: React.CSSProperties = {
        fontSize: '16px',
        color: 'rgba(255,255,255,0.9)',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '16px',
    };

    const villaGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
    };

    const villaCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    };


    const villaContentStyle: React.CSSProperties = {
        padding: '16px',
    };

    const villaNameStyle: React.CSSProperties = {
        fontSize: '18px',
        lineHeight : '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        margin : 0,
    };

    const villaLocationStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#6b7280',
        margin : 0,
    };

    const villaPriceStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: '600',
        color: colors.primary,
    };

    const amenitiesStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '8px',
    };

    const amenityTagStyle: React.CSSProperties = {
        fontSize: '12px',
        padding: '4px 8px',
        backgroundColor: '#F3F4F6',
        borderRadius: '4px',
        color: '#4B5563',
    };

    // Helper function to get a flat array of amenities for display
    const getFlatAmenities = (amenities: Villa['amenities']): string[] => {
        const flatAmenities: string[] = [];
        Object.values(amenities).forEach(categoryItems => {
            if (categoryItems) {
                flatAmenities.push(...categoryItems);
            }
        });
        return flatAmenities;
    };

    const VillaCard: React.FC<{ villa: Villa }> = ({villa}) => {
        const flatAmenities = getFlatAmenities(villa.amenities);

        return (
            <motion.div
                style={villaCardStyle}
                whileHover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                }}
                whileTap={{scale: 0.98}}
                onClick={() => navigate(`/villas/${villa.id}`)}
            >
                <div style={{
                    width: '100%',
                    paddingTop: '100%',
                    backgroundImage: `url(${getAssetUrl(villa.images[0])})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}></div>

                <div style={villaContentStyle}>
                    <h3 style={villaNameStyle}>{villa.name}</h3>
                    <p style={villaLocationStyle}>{villa.location}</p>
                    <p style={villaPriceStyle}>
                        AED {villa.pricing.weekday}/day
                    </p>
                    <div style={amenitiesStyle}>
                        {flatAmenities.slice(0, 3).map((amenity: string, index: number) => (
                            <span key={index} style={amenityTagStyle}>
                {amenity}
              </span>
                        ))}
                        {flatAmenities.length > 3 && (
                            <span style={amenityTagStyle}>+{flatAmenities.length - 3}</span>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <motion.div
            style={containerStyle}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            {/* Hero Banner */}
            <motion.div
                style={heroBannerStyle}
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.1, duration: 0.5}}
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
                onClick={() => navigate('/listings')}
            >
                <img
                    src={mockPromotion.imageUrl}
                    alt={mockPromotion.title}
                    style={heroImageStyle}
                />
                <div style={heroOverlayStyle}>
                    <h1 style={heroTitleStyle}>{mockPromotion.title}</h1>
                    <p style={heroDescriptionStyle}>{mockPromotion.description}</p>
                </div>
            </motion.div>

            {/* Featured Villas */}
            <section>
                <h2 style={sectionTitleStyle}>Featured Villas</h2>
                <div style={villaGridStyle}>
                    {featuredVillas.map((villa, index) => (
                        <motion.div
                            key={villa.id}
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 0.2 + index * 0.1, duration: 0.5}}
                        >
                            <VillaCard villa={villa}/>
                        </motion.div>
                    ))}
                </div>
            </section>

        </motion.div>
    );
};

export default HomePage;