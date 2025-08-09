import React, { useState } from 'react';
import { colors } from '../../utils/colors';
import { shadows, borderRadius } from '../../utils/design';
import { 
    QuestionMarkCircledIcon, 
    ChevronDownIcon, 
    ChevronUpIcon,
    ChatBubbleIcon,
    EnvelopeClosedIcon,
    MobileIcon,
    ClockIcon
} from '@radix-ui/react-icons';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: 'booking' | 'payment' | 'account' | 'general';
}

const HelpSupportPage: React.FC = () => {
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'booking' | 'payment' | 'account' | 'general'>('all');
    
    const faqs: FAQ[] = [
        {
            id: '1',
            question: 'How do I make a booking?',
            answer: 'To make a booking, browse our villa listings, select your preferred villa, choose your dates using the calendar, and follow the booking process. You can book as a guest or create an account for easier management.',
            category: 'booking'
        },
        {
            id: '2',
            question: 'What payment methods do you accept?',
            answer: 'We accept major credit cards (Visa, Mastercard, American Express), bank transfers, and digital wallets. All payments are processed securely through our encrypted payment system.',
            category: 'payment'
        },
        {
            id: '3',
            question: 'Can I cancel my booking?',
            answer: 'Yes, you can cancel your booking according to the villa\'s cancellation policy. Most bookings can be cancelled up to 24-48 hours before check-in for a full refund. Please check the specific policy for your booking.',
            category: 'booking'
        },
        {
            id: '4',
            question: 'How do I reset my password?',
            answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.',
            category: 'account'
        },
        {
            id: '5',
            question: 'Are the villa prices per night or total?',
            answer: 'All villa prices displayed are per night. The total cost will be calculated during the booking process, including any additional fees, taxes, and services.',
            category: 'payment'
        },
        {
            id: '6',
            question: 'What is included in the villa rental?',
            answer: 'Each villa rental typically includes basic amenities like WiFi, utilities, and standard furnishing. Specific inclusions vary by property and are listed in the villa details page.',
            category: 'general'
        },
        {
            id: '7',
            question: 'How do I contact the villa owner?',
            answer: 'Once your booking is confirmed, you\'ll receive the owner\'s contact information. You can also use our messaging system to communicate directly through the platform.',
            category: 'booking'
        },
        {
            id: '8',
            question: 'Can I modify my booking dates?',
            answer: 'Yes, you can request to modify your booking dates subject to availability and the villa\'s modification policy. Contact our support team or the villa owner directly.',
            category: 'booking'
        }
    ];
    
    const filteredFAQs = selectedCategory === 'all' 
        ? faqs 
        : faqs.filter(faq => faq.category === selectedCategory);
    
    const toggleFAQ = (id: string) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };
    
    const containerStyle: React.CSSProperties = {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
    };
    
    const headerStyle: React.CSSProperties = {
        marginBottom: '32px',
        textAlign: 'center',
    };
    
    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
    };
    
    const subtitleStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '32px',
    };
    
    const contactSectionStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: '24px',
        marginBottom: '32px',
        boxShadow: shadows.sm,
    };
    
    const contactGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    };
    
    const contactItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
    };
    
    const categoryFilterStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap',
    };
    
    const filterButtonStyle: React.CSSProperties = {
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
    
    const activeFilterStyle: React.CSSProperties = {
        ...filterButtonStyle,
        backgroundColor: colors.primary,
        color: 'white',
    };
    
    const faqSectionStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: '24px',
        boxShadow: shadows.sm,
    };
    
    const faqItemStyle: React.CSSProperties = {
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '20px',
        marginBottom: '20px',
    };
    
    const faqQuestionStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '12px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a1a',
        gap: '12px',
    };
    
    const faqAnswerStyle: React.CSSProperties = {
        padding: '16px 0 0 0',
        fontSize: '14px',
        color: '#4b5563',
        lineHeight: '1.6',
        display: 'block',
    };
    
    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '16px',
    };
    
    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>
                    <QuestionMarkCircledIcon style={{ width: '28px', height: '28px' }} />
                    Help & Support
                </h1>
                <p style={subtitleStyle}>
                    Find answers to common questions or get in touch with our support team
                </p>
            </div>
            
            {/* Contact Information */}
            <div style={contactSectionStyle}>
                <h2 style={sectionTitleStyle}>Contact Our Support Team</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                    Need immediate assistance? Our support team is here to help you.
                </p>
                
                <div style={contactGridStyle}>
                    <div style={contactItemStyle}>
                        <ChatBubbleIcon style={{ width: '20px', height: '20px', color: colors.primary }} />
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>Live Chat</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Available 24/7</div>
                        </div>
                    </div>
                    
                    <div style={contactItemStyle}>
                        <EnvelopeClosedIcon style={{ width: '20px', height: '20px', color: colors.primary }} />
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>Email Support</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>support@wezo.ae</div>
                        </div>
                    </div>
                    
                    <div style={contactItemStyle}>
                        <MobileIcon style={{ width: '20px', height: '20px', color: colors.primary }} />
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>Phone Support</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>+971 4 XXX XXXX</div>
                        </div>
                    </div>
                    
                    <div style={contactItemStyle}>
                        <ClockIcon style={{ width: '20px', height: '20px', color: colors.primary }} />
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>Business Hours</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Sun-Thu: 9AM-6PM GST</div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* FAQ Section */}
            <div style={faqSectionStyle}>
                <h2 style={sectionTitleStyle}>Frequently Asked Questions</h2>
                
                <div style={categoryFilterStyle}>
                    <button
                        style={selectedCategory === 'all' ? activeFilterStyle : filterButtonStyle}
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </button>
                    <button
                        style={selectedCategory === 'booking' ? activeFilterStyle : filterButtonStyle}
                        onClick={() => setSelectedCategory('booking')}
                    >
                        Booking
                    </button>
                    <button
                        style={selectedCategory === 'payment' ? activeFilterStyle : filterButtonStyle}
                        onClick={() => setSelectedCategory('payment')}
                    >
                        Payment
                    </button>
                    <button
                        style={selectedCategory === 'account' ? activeFilterStyle : filterButtonStyle}
                        onClick={() => setSelectedCategory('account')}
                    >
                        Account
                    </button>
                    <button
                        style={selectedCategory === 'general' ? activeFilterStyle : filterButtonStyle}
                        onClick={() => setSelectedCategory('general')}
                    >
                        General
                    </button>
                </div>
                
                {filteredFAQs.map((faq, index) => (
                    <div 
                        key={faq.id} 
                        style={{
                            ...faqItemStyle,
                            borderBottom: index === filteredFAQs.length - 1 ? 'none' : '1px solid #e5e7eb',
                            marginBottom: index === filteredFAQs.length - 1 ? 0 : '20px',
                            paddingBottom: index === filteredFAQs.length - 1 ? 0 : '20px',
                        }}
                    >
                        <div
                            style={faqQuestionStyle}
                            onClick={() => toggleFAQ(faq.id)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <span>{faq.question}</span>
                            {expandedFAQ === faq.id ? (
                                <ChevronUpIcon style={{ width: '20px', height: '20px', color: colors.primary }} />
                            ) : (
                                <ChevronDownIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                            )}
                        </div>
                        
                        {expandedFAQ === faq.id && (
                            <div style={faqAnswerStyle}>
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
                
                {filteredFAQs.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#6b7280',
                    }}>
                        <QuestionMarkCircledIcon style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No FAQs found</h3>
                        <p style={{ fontSize: '14px', margin: 0 }}>
                            No questions found for the selected category.
                        </p>
                    </div>
                )}
            </div>
            
            {/* Additional Help */}
            <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: borderRadius.lg,
                padding: '20px',
                marginTop: '24px',
                textAlign: 'center',
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#065f46', marginBottom: '8px' }}>
                    Still need help?
                </h3>
                <p style={{ fontSize: '14px', color: '#047857', marginBottom: '16px' }}>
                    Can't find the answer you're looking for? Our support team is ready to assist you.
                </p>
                <button
                    style={{
                        padding: '12px 24px',
                        backgroundColor: colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    Contact Support
                </button>
            </div>
        </div>
    );
};

export default HelpSupportPage;