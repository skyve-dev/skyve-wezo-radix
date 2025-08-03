import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {CheckIcon} from '@radix-ui/react-icons';
import {Indicator, Root} from '@radix-ui/react-checkbox';
import {useAuth} from '../../contexts/AuthContext';
import {useAmenities} from '../../contexts/AmenitiesContext';
import {useVillas} from '../../contexts/VillasContext';
import {NumericInput} from '../../components/inputs/NumericInput';
import {colors} from '../../utils/colors';
import type {User, Villa, VillaAmenities} from '../../types';

// Mock users for admin selection (in a real app, this would come from an API)
const mockUsers: User[] = [
    {id: 'user-1', email: 'john@example.com', name: 'John Smith', role: 'homeowner', isActive: true},
    {id: 'user-2', email: 'jane@example.com', name: 'Jane Doe', role: 'homeowner', isActive: true},
    {id: 'user-3', email: 'mike@example.com', name: 'Mike Johnson', role: 'homeowner', isActive: true},
];

// Available locations from existing villa data
const availableLocations = [
    "Al Rams",
    "Suhaila",
    "Near Saqr Park",
    "Al Bateen",
    "Al Saadi",
    "Al Kharan",
    "Al Shaghi",
    "Al Jazirat Al Hamra",
    "Khatt",
    "Near Jebel Jais",
    "Al Mairid",
    "Shamal",
    "Al Riffa",
    "Al Fahlain",
    "Al Hamraniyah",
    "Seih Al Ghab",
    "Digdaga",
    "Near Ras Al Khaimah International Airport",
    "Al Barirat",
    "Mina Al Arab",
    "Al Dhait South",
    "Al Madafaq",
    "Al Maqour",
    "Near Sheikh Mohammed Bin Zayed Road"
];

const VillaManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const {amenities} = useAmenities();
    const {addVilla} = useVillas();

    // Form state
    const [formData, setFormData] = useState<Partial<Villa>>({
        name: '',
        description: '',
        location: '',
        ownerId: user?.role === 'homeowner' ? user.id : '',
        maxVisitors: 1,
        numberOfBedrooms: 1,
        numberOfBeds: 1,
        numberOfBathrooms: 1,
        pricing: {
            weekday: 0,
            weekend: 0,
            halfDay: 0,
        },
        amenities: {
            generalComfort: [],
            outdoorRecreation: [],
            kitchenDining: [],
            technologyEntertainment: [],
            specialFeatures: [],
        },
        houseRules: {
            checkInTime: '15:00',
            checkOutTime: '11:00',
            petsAllowed: false,
            partiesAllowed: false,
            commercialPhotographyAllowed: false,
            smokingAllowed: false,
            quietHours: '',
            poolRules: '',
            cleaningFee: '',
        },
        isActive: false, // New villas start as inactive and need admin approval
        isFeatured: false,
        images: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Location state for dropdown with custom input
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

    // Check if user has permission to access this page
    useEffect(() => {
        if (!user || (user.role !== 'homeowner' && user.role !== 'admin')) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

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

    // Handle location selection from dropdown
    const handleLocationSelect = (location: string) => {
        handleInputChange('location', location);
        setIsLocationDropdownOpen(false);
    };

    // Handle form input changes
    const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Handle nested object changes (pricing, houseRules)
    const handleNestedChange = (parent: string, field: string, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...((prev as Record<string, unknown>)[parent] as Record<string, string | number | boolean>),
                [field]: value
            }
        }));
    };

    // Handle amenity selection
    const handleAmenityToggle = (category: keyof VillaAmenities, amenity: string) => {
        setFormData(prev => {
            const currentAmenities = prev.amenities?.[category] || [];
            const isSelected = currentAmenities.includes(amenity);

            return {
                ...prev,
                amenities: {
                    ...prev.amenities,
                    [category]: isSelected
                        ? currentAmenities.filter(a => a !== amenity)
                        : [...currentAmenities, amenity]
                }
            };
        });
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Villa name is required';
        }

        if (!formData.description?.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.location?.trim()) {
            newErrors.location = 'Location is required';
        }

        if (user?.role === 'admin' && !formData.ownerId) {
            newErrors.ownerId = 'Please select an owner';
        }

        if (!formData.maxVisitors || formData.maxVisitors < 1) {
            newErrors.maxVisitors = 'Max visitors must be at least 1';
        }

        if (!formData.numberOfBedrooms || formData.numberOfBedrooms < 1) {
            newErrors.numberOfBedrooms = 'Number of bedrooms must be at least 1';
        }

        if (!formData.numberOfBeds || formData.numberOfBeds < 1) {
            newErrors.numberOfBeds = 'Number of beds must be at least 1';
        }

        if (!formData.numberOfBathrooms || formData.numberOfBathrooms < 1) {
            newErrors.numberOfBathrooms = 'Number of bathrooms must be at least 1';
        }

        if (!formData.pricing?.weekday || formData.pricing.weekday < 0) {
            newErrors.weekdayPrice = 'Weekday price must be greater than 0';
        }

        if (!formData.pricing?.weekend || formData.pricing.weekend < 0) {
            newErrors.weekendPrice = 'Weekend price must be greater than 0';
        }

        if (!formData.pricing?.halfDay || formData.pricing.halfDay < 0) {
            newErrors.halfDayPrice = 'Half day price must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create complete villa object with generated ID
            const newVilla: Villa = {
                id: `villa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: formData.name!,
                description: formData.description!,
                location: formData.location!,
                ownerId: formData.ownerId || user!.id,
                maxVisitors: formData.maxVisitors!,
                numberOfBedrooms: formData.numberOfBedrooms!,
                numberOfBeds: formData.numberOfBeds!,
                numberOfBathrooms: formData.numberOfBathrooms!,
                pricing: formData.pricing!,
                amenities: formData.amenities!,
                houseRules: formData.houseRules!,
                isActive: false, // New villas start as inactive and need admin approval
                isFeatured: false,
                images: formData.images || [],
            };

            // Add villa to context
            addVilla(newVilla);

            console.log('Villa created successfully:', newVilla);

            // Redirect to villa management list
            navigate('/villa-management');
        } catch (error) {
            console.error('Error creating villa:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Styles - Updated for compact layout
    const containerStyle: React.CSSProperties = {
        padding: '16px',
        maxWidth: '800px',
        margin: '0 auto',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
    };

    const sectionStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        padding: '16px',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '16px',
    };

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '16px',
    };

    const formGroupStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '12px',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '6px',
    };

    const inputStyle: React.CSSProperties = {
        padding: '12px 16px',
        fontSize: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#fff',
        outline: 'none',
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        cursor: 'pointer',
    };

    const textareaStyle: React.CSSProperties = {
        ...inputStyle,
        minHeight: '100px',
        resize: 'vertical',
    };

    const errorStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#ef4444',
        marginTop: '4px',
    };

    const amenityGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '8px',
        marginBottom: '16px',
    };

    const amenityItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s',
    };

    const amenitySelectedStyle: React.CSSProperties = {
        ...amenityItemStyle,
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        color: 'white',
    };

    const buttonStyle: React.CSSProperties = {
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

    const buttonDisabledStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed',
    };


    // Styles for custom location dropdown
    const locationContainerStyle: React.CSSProperties = {
        position: 'relative',
        display:'flex',
        flexDirection: 'column'
    };

    const locationDropdownStyle: React.CSSProperties = {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        maxHeight: '200px',
        overflowY: 'auto',
        zIndex: 10,
    };

    const locationOptionStyle: React.CSSProperties = {
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px',
        borderBottom: '1px solid #f3f4f6',
    };


    // Radix UI styles
    const radixCheckboxStyle: React.CSSProperties = {
        width: '18px',
        height: '18px',
        backgroundColor: 'white',
        borderRadius: '4px',
        border: '1px solid #d1d5db',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const checkboxLabelStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#374151',
        cursor: 'pointer',
    };

    if (!user || (user.role !== 'homeowner' && user.role !== 'admin')) {
        return null;
    }

    return (
        <motion.div
            style={containerStyle}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
        >
            <div style={headerStyle}>
                <h1 style={titleStyle}>Register New Villa</h1>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Basic Information</h2>
                    <div style={gridStyle}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Villa Name *</label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                style={inputStyle}
                                placeholder="Enter villa name"
                            />
                            {errors.name && <span style={errorStyle}>{errors.name}</span>}
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Location *</label>
                            <div style={locationContainerStyle}>
                                <input
                                    type="text"
                                    value={formData.location || ''}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    onFocus={() => setIsLocationDropdownOpen(true)}
                                    onBlur={() => setTimeout(() => setIsLocationDropdownOpen(false), 200)}
                                    style={inputStyle}
                                    placeholder="Select or enter location"
                                />
                                {isLocationDropdownOpen && (
                                    <div style={locationDropdownStyle}>
                                        {availableLocations
                                            .filter(location => location.toLowerCase().includes((formData.location || '').toLowerCase()))
                                            .slice(0, 8)
                                            .map((location, index) => (
                                                <div
                                                    key={index}
                                                    style={locationOptionStyle}
                                                    onClick={() => handleLocationSelect(location)}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                                >
                                                    {location}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                            {errors.location && <span style={errorStyle}>{errors.location}</span>}
                        </div>

                        {user.role === 'admin' && (
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Owner *</label>
                                <select
                                    value={formData.ownerId || ''}
                                    onChange={(e) => handleInputChange('ownerId', e.target.value)}
                                    style={selectStyle}
                                >
                                    <option value="">Select an owner</option>
                                    {mockUsers.map(mockUser => (
                                        <option key={mockUser.id} value={mockUser.id}>
                                            {mockUser.name} ({mockUser.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.ownerId && <span style={errorStyle}>{errors.ownerId}</span>}
                            </div>
                        )}
                    </div>

                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Description *</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            style={textareaStyle}
                            placeholder="Describe your villa..."
                        />
                        {errors.description && <span style={errorStyle}>{errors.description}</span>}
                    </div>

                    <div style={gridStyle}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Max Visitors *</label>
                            <NumericInput
                                value={formData.maxVisitors}
                                onChange={(value) => handleInputChange('maxVisitors', value || 1)}
                                min={1}
                                invalid={!!errors.maxVisitors}
                            />
                            {errors.maxVisitors && <span style={errorStyle}>{errors.maxVisitors}</span>}
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Bedrooms *</label>
                            <NumericInput
                                value={formData.numberOfBedrooms}
                                onChange={(value) => handleInputChange('numberOfBedrooms', value || 1)}
                                min={1}
                                invalid={!!errors.numberOfBedrooms}
                            />
                            {errors.numberOfBedrooms && <span style={errorStyle}>{errors.numberOfBedrooms}</span>}
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Beds *</label>
                            <NumericInput
                                value={formData.numberOfBeds}
                                onChange={(value) => handleInputChange('numberOfBeds', value || 1)}
                                min={1}
                                invalid={!!errors.numberOfBeds}
                            />
                            {errors.numberOfBeds && <span style={errorStyle}>{errors.numberOfBeds}</span>}
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Bathrooms *</label>
                            <NumericInput
                                value={formData.numberOfBathrooms}
                                onChange={(value) => handleInputChange('numberOfBathrooms', value || 1)}
                                min={1}
                                invalid={!!errors.numberOfBathrooms}
                            />
                            {errors.numberOfBathrooms && <span style={errorStyle}>{errors.numberOfBathrooms}</span>}
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Pricing</h2>
                    <div style={gridStyle}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Weekday Price (AED) *</label>
                            <NumericInput
                                value={formData.pricing?.weekday}
                                onChange={(value) => handleNestedChange('pricing', 'weekday', value || 0)}
                                min={0}
                                invalid={!!errors.weekdayPrice}
                            />
                            {errors.weekdayPrice && <span style={errorStyle}>{errors.weekdayPrice}</span>}
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Weekend Price (AED) *</label>
                            <NumericInput
                                value={formData.pricing?.weekend}
                                onChange={(value) => handleNestedChange('pricing', 'weekend', value || 0)}
                                min={0}
                                invalid={!!errors.weekendPrice}
                            />
                            {errors.weekendPrice && <span style={errorStyle}>{errors.weekendPrice}</span>}
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Half Day Price (AED) *</label>
                            <NumericInput
                                value={formData.pricing?.halfDay}
                                onChange={(value) => handleNestedChange('pricing', 'halfDay', value || 0)}
                                min={0}
                                invalid={!!errors.halfDayPrice}
                            />
                            {errors.halfDayPrice && <span style={errorStyle}>{errors.halfDayPrice}</span>}
                        </div>
                    </div>
                </div>

                {/* Amenities Section */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Amenities</h2>
                    {Object.entries(amenities).map(([category, categoryAmenities]) => (
                        <div key={category} style={{marginBottom: '20px'}}>
                            <h3 style={{fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151'}}>
                                {getCategoryDisplayName(category)}
                            </h3>
                            <div style={amenityGridStyle}>
                                {categoryAmenities.map((amenity: string) => {
                                    const isSelected = formData.amenities?.[category as keyof VillaAmenities]?.includes(amenity) || false;
                                    return (
                                        <div
                                            key={amenity}
                                            style={isSelected ? amenitySelectedStyle : amenityItemStyle}
                                            onClick={() => handleAmenityToggle(category as keyof VillaAmenities, amenity)}
                                        >
                                            {isSelected ? <CheckIcon width={16} height={16}/> :
                                                <div style={{width: '16px', height: '16px'}}/>}
                                            <span>{amenity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* House Rules Section */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>House Rules</h2>
                    <div style={gridStyle}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Check-in Time</label>
                            <input
                                type="time"
                                value={formData.houseRules?.checkInTime || '15:00'}
                                onChange={(e) => handleNestedChange('houseRules', 'checkInTime', e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Check-out Time</label>
                            <input
                                type="time"
                                value={formData.houseRules?.checkOutTime || '11:00'}
                                onChange={(e) => handleNestedChange('houseRules', 'checkOutTime', e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={gridStyle}>
                        <div style={formGroupStyle}>
                            <label style={checkboxLabelStyle}>
                                <Root
                                    checked={formData.houseRules?.petsAllowed || false}
                                    onCheckedChange={(checked: boolean) => handleNestedChange('houseRules', 'petsAllowed', checked)}
                                    style={radixCheckboxStyle}
                                >
                                    <Indicator>
                                        <CheckIcon width={14} height={14}/>
                                    </Indicator>
                                </Root>
                                Pets Allowed
                            </label>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={checkboxLabelStyle}>
                                <Root
                                    checked={formData.houseRules?.partiesAllowed || false}
                                    onCheckedChange={(checked: boolean) => handleNestedChange('houseRules', 'partiesAllowed', checked)}
                                    style={radixCheckboxStyle}
                                >
                                    <Indicator>
                                        <CheckIcon width={14} height={14}/>
                                    </Indicator>
                                </Root>
                                Parties/Events Allowed
                            </label>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={checkboxLabelStyle}>
                                <Root
                                    checked={formData.houseRules?.commercialPhotographyAllowed || false}
                                    onCheckedChange={(checked: boolean) => handleNestedChange('houseRules', 'commercialPhotographyAllowed', checked)}
                                    style={radixCheckboxStyle}
                                >
                                    <Indicator>
                                        <CheckIcon width={14} height={14}/>
                                    </Indicator>
                                </Root>
                                Commercial Photography Allowed
                            </label>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={checkboxLabelStyle}>
                                <Root
                                    checked={formData.houseRules?.smokingAllowed || false}
                                    onCheckedChange={(checked: boolean) => handleNestedChange('houseRules', 'smokingAllowed', checked)}
                                    style={radixCheckboxStyle}
                                >
                                    <Indicator>
                                        <CheckIcon width={14} height={14}/>
                                    </Indicator>
                                </Root>
                                Smoking Allowed
                            </label>
                        </div>
                    </div>

                    <div style={gridStyle}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Quiet Hours</label>
                            <input
                                type="text"
                                value={formData.houseRules?.quietHours || ''}
                                onChange={(e) => handleNestedChange('houseRules', 'quietHours', e.target.value)}
                                style={inputStyle}
                                placeholder="e.g., 10:00 PM - 8:00 AM"
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Pool Rules</label>
                            <input
                                type="text"
                                value={formData.houseRules?.poolRules || ''}
                                onChange={(e) => handleNestedChange('houseRules', 'poolRules', e.target.value)}
                                style={inputStyle}
                                placeholder="e.g., No glass containers"
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Cleaning Fee</label>
                            <input
                                type="text"
                                value={formData.houseRules?.cleaningFee || ''}
                                onChange={(e) => handleNestedChange('houseRules', 'cleaningFee', e.target.value)}
                                style={inputStyle}
                                placeholder="e.g., AED 200"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    style={isSubmitting ? buttonDisabledStyle : buttonStyle}
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? {backgroundColor: colors.primaryHover} : {}}
                    whileTap={!isSubmitting ? {scale: 0.98} : {}}
                >
                    {isSubmitting ? 'Creating Villa...' : 'Create Villa'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default VillaManagementPage;