import React from 'react';
import { shadows, borderRadius } from '../../utils/design';

interface ReportsSkeletonProps {
    itemCount?: number;
}

const ReportsSkeleton: React.FC<ReportsSkeletonProps> = ({ itemCount = 6 }) => {
    const containerStyle: React.CSSProperties = {
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
    };
    
    const headerStyle: React.CSSProperties = {
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
    };
    
    const skeletonPulse: React.CSSProperties = {
        background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
    };
    
    const titleSkeletonStyle: React.CSSProperties = {
        height: '32px',
        width: '240px',
        borderRadius: '6px',
        ...skeletonPulse,
    };
    
    const subtitleSkeletonStyle: React.CSSProperties = {
        height: '20px',
        width: '320px',
        borderRadius: '4px',
        marginTop: '8px',
        ...skeletonPulse,
    };
    
    const periodButtonsSkeletonStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
    };
    
    const buttonSkeletonStyle: React.CSSProperties = {
        height: '36px',
        width: '80px',
        borderRadius: '8px',
        ...skeletonPulse,
    };
    
    const metricsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
    };
    
    const metricCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: '24px',
        boxShadow: shadows.sm,
        border: '1px solid #f3f4f6',
    };
    
    const metricHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
    };
    
    const iconSkeletonStyle: React.CSSProperties = {
        width: '44px',
        height: '44px',
        borderRadius: '8px',
        ...skeletonPulse,
    };
    
    const metricLabelSkeletonStyle: React.CSSProperties = {
        height: '20px',
        width: '120px',
        borderRadius: '4px',
        ...skeletonPulse,
    };
    
    const metricValueSkeletonStyle: React.CSSProperties = {
        height: '36px',
        width: '140px',
        borderRadius: '6px',
        marginBottom: '8px',
        ...skeletonPulse,
    };
    
    const metricChangeSkeletonStyle: React.CSSProperties = {
        height: '16px',
        width: '60px',
        borderRadius: '4px',
        ...skeletonPulse,
    };
    
    const chartsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginTop: '32px',
    };
    
    const chartCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: borderRadius.lg,
        padding: '24px',
        boxShadow: shadows.sm,
        border: '1px solid #f3f4f6',
    };
    
    const chartTitleSkeletonStyle: React.CSSProperties = {
        height: '24px',
        width: '180px',
        borderRadius: '4px',
        marginBottom: '20px',
        ...skeletonPulse,
    };
    
    const chartBarContainerStyle: React.CSSProperties = {
        marginBottom: '20px',
    };
    
    const chartLabelRowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    };
    
    const chartLabelSkeletonStyle: React.CSSProperties = {
        height: '16px',
        width: '80px',
        borderRadius: '4px',
        ...skeletonPulse,
    };
    
    const chartValueSkeletonStyle: React.CSSProperties = {
        height: '16px',
        width: '40px',
        borderRadius: '4px',
        ...skeletonPulse,
    };
    
    const chartBarSkeletonStyle: React.CSSProperties = {
        height: '24px',
        borderRadius: '12px',
        marginBottom: '4px',
        ...skeletonPulse,
    };
    
    return (
        <div style={containerStyle}>
            {/* Animated skeleton keyframes */}
            <style>{`
                @keyframes skeleton-pulse {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }
            `}</style>
            
            {/* Header skeleton */}
            <div style={headerStyle}>
                <div>
                    <div style={titleSkeletonStyle} />
                    <div style={subtitleSkeletonStyle} />
                </div>
                <div style={periodButtonsSkeletonStyle}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={buttonSkeletonStyle} />
                    ))}
                </div>
            </div>
            
            {/* Metrics grid skeleton */}
            <div style={metricsGridStyle}>
                {Array.from({ length: itemCount }, (_, i) => i + 1).map(i => (
                    <div key={i} style={metricCardStyle}>
                        <div style={metricHeaderStyle}>
                            <div style={iconSkeletonStyle} />
                            <div style={metricLabelSkeletonStyle} />
                        </div>
                        <div style={metricValueSkeletonStyle} />
                        <div style={metricChangeSkeletonStyle} />
                    </div>
                ))}
            </div>
            
            {/* Charts skeleton */}
            <div style={chartsGridStyle}>
                {[1, 2].map(chartIndex => (
                    <div key={chartIndex} style={chartCardStyle}>
                        <div style={chartTitleSkeletonStyle} />
                        {[1, 2, 3, 4].map(barIndex => (
                            <div key={barIndex} style={chartBarContainerStyle}>
                                <div style={chartLabelRowStyle}>
                                    <div style={chartLabelSkeletonStyle} />
                                    <div style={chartValueSkeletonStyle} />
                                </div>
                                <div style={chartBarSkeletonStyle} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportsSkeleton;