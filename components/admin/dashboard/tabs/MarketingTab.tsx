
import React from 'react';
import { useAdminAnalytics } from '../../../../hooks/core/useAdminAnalytics';
import { MarketingFunnelCard } from './marketing/MarketingFunnelCard';
import { LoyaltyProgramCard } from './marketing/LoyaltyProgramCard';
import { FeaturedProductCard } from './marketing/FeaturedProductCard';
import { RetentionTable } from './marketing/RetentionTable';

interface MarketingTabProps {
    dateFilter: string;
    customRange?: { start: string, end: string };
}

export const MarketingTab: React.FC<MarketingTabProps> = ({ dateFilter, customRange }) => {
    const { 
        marketingFunnel,
        couponRevenue,
        couponRoiValue,
        couponRoiPercent,
        loyaltyData,
        featuredProductStats,
        campaignRetention
    } = useAdminAnalytics(dateFilter, customRange);

    return (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MarketingFunnelCard 
                    marketingFunnel={marketingFunnel}
                    couponRevenue={couponRevenue}
                    couponRoiPercent={couponRoiPercent}
                    couponRoiValue={couponRoiValue}
                />
                <LoyaltyProgramCard loyaltyData={loyaltyData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <FeaturedProductCard stats={featuredProductStats} />
                <RetentionTable data={campaignRetention} />
            </div>
        </div>
    );
};
