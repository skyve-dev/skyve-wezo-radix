import React, {useEffect, useRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';
import {ChevronLeftIcon, ChevronRightIcon} from '@radix-ui/react-icons';
import {colors} from '../../utils/colors';
import type {Swiper as SwiperType} from 'swiper';

interface VillaImageGalleryProps {
    images: string[];
    villaName: string;
}

const VillaImageGallery: React.FC<VillaImageGalleryProps> = ({images, villaName}) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    const paginationRef = useRef<HTMLDivElement>(null);

    // Initialize navigation after Swiper is ready
    useEffect(() => {
        if (swiperRef.current && prevButtonRef.current && nextButtonRef.current) {
            const swiper = swiperRef.current;

            // Update navigation elements
            if (swiper.navigation) {
                (swiper.navigation as any).prevEl = prevButtonRef.current;
                (swiper.navigation as any).nextEl = nextButtonRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
            }

            // Update pagination
            if (swiper.pagination && paginationRef.current) {
                (swiper.pagination as any).el = paginationRef.current;
                swiper.pagination.init();
                swiper.pagination.update();
            }
        }
    }, []);

    const containerStyle: React.CSSProperties = {
        position: 'absolute',
        top:0,
        left:0,
        height : '100%',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        marginBottom: '30px',
    };

    const swiperStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
    };

    const slideStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    };

    const navigationButtonStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: window.innerWidth < 768 ? '32px' : '40px',
        height: window.innerWidth < 768 ? '32px' : '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        cursor: 'pointer',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease',
    };

    const prevButtonStyle: React.CSSProperties = {
        ...navigationButtonStyle,
        left: window.innerWidth < 768 ? '12px' : '16px',
    };

    const nextButtonStyle: React.CSSProperties = {
        ...navigationButtonStyle,
        right: window.innerWidth < 768 ? '12px' : '16px',
    };

    const iconStyle: React.CSSProperties = {
        width: '20px',
        height: '20px',
        color: colors.primary,
    };

    const paginationStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
    };

    const imageCountStyle: React.CSSProperties = {
        position: 'absolute',
        top: '16px',
        right: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 10,
    };

    const handlePrevClick = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleNextClick = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    // Filter out any invalid images
    const validImages = images.filter(image => image && typeof image === 'string' && image.trim() !== '');

    if (validImages.length === 0) {
        return (
            <div style={{width:'100%',paddingTop:'100%',position:'relative'}}>
                <div style={containerStyle}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '16px',
                    color: '#6b7280'
                }}>
                    No images available
                </div>
            </div>
            </div>
        );
    }

    return (
        <div style={{width:'100%',paddingTop:'100%',position:'relative'}}>
            <div style={containerStyle}>
                {/* Image Counter */}
                <div style={imageCountStyle}>
                    {validImages.length} Photo{validImages.length > 1 ? 's' : ''}
                </div>

                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={false} // We'll handle navigation manually
                    pagination={{
                        clickable: true,
                        bulletClass: 'custom-swiper-pagination-bullet',
                        bulletActiveClass: 'custom-swiper-pagination-bullet-active',
                        renderBullet: (_index, className) => {
                            return `<span class="${className}"></span>`;
                        },
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={validImages.length > 1} // Only enable loop if there are multiple images
                    loopAdditionalSlides={2}
                    style={swiperStyle}
                    className="villa-image-gallery"
                >
                    {validImages.map((image, index) => (
                        <SwiperSlide key={`${image}-${index}`} style={slideStyle}>
                            <img
                                src={image}
                                alt={`${villaName} - Image ${index + 1}`}
                                style={imageStyle}
                                loading={index < 3 ? 'eager' : 'lazy'} // Load first 3 images eagerly
                                onError={(e) => {
                                    // Handle broken images
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    console.warn(`Failed to load image: ${image}`);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                {validImages.length > 1 && (
                    <>
                        <button
                            ref={prevButtonRef}
                            style={prevButtonStyle}
                            onClick={handlePrevClick}
                            aria-label="Previous image"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            }}
                        >
                            <ChevronLeftIcon style={iconStyle}/>
                        </button>

                        <button
                            ref={nextButtonRef}
                            style={nextButtonStyle}
                            onClick={handleNextClick}
                            aria-label="Next image"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            }}
                        >
                            <ChevronRightIcon style={iconStyle}/>
                        </button>
                    </>
                )}

                {/* Custom Pagination */}
                {validImages.length > 1 && (
                    <div ref={paginationRef} style={paginationStyle}></div>
                )}

                <style>{`
        /* Essential Swiper styles */
        .villa-image-gallery {
          position: relative;
          overflow: hidden;
        }
        
        .villa-image-gallery .swiper-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 1;
          display: flex;
          transition-property: transform;
          box-sizing: content-box;
        }
        
        .villa-image-gallery .swiper-slide {
          flex-shrink: 0;
          width: 100%;
          height: 100%;
          position: relative;
          transition-property: transform;
        }

        /* Custom pagination bullet styles */
        .custom-swiper-pagination-bullet {
          width: ${window.innerWidth < 768 ? '6px' : '8px'};
          height: ${window.innerWidth < 768 ? '6px' : '8px'};
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 1;
          display: inline-block;
        }
        
        .custom-swiper-pagination-bullet-active {
          background-color: ${colors.primary};
          transform: scale(1.2);
        }
        
        /* Hide default swiper navigation and pagination */
        .villa-image-gallery .swiper-button-next,
        .villa-image-gallery .swiper-button-prev,
        .villa-image-gallery .swiper-pagination-bullets {
          display: none !important;
        }
      `}</style>
            </div>
        </div>
    );
};

export default VillaImageGallery;