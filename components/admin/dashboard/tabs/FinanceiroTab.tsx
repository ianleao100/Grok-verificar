
import React from 'react';
import { useAdminAnalytics } from '../../../../hooks/core/useAdminAnalytics';
import { useFinancialCalculations } from '../../../../hooks/useFinancialCalculations';
import { FinancialKPIs } from './finance/FinancialKPIs';
import { RevenueChart } from './finance/RevenueChart';
import { PaymentMethodsChart } from './finance/PaymentMethodsChart';

interface FinanceiroTabProps {
    dateFilter: string;
    customRange?: { start: string, end: string };
}

export const FinanceiroTab: React.FC<FinanceiroTabProps> = ({ dateFilter, customRange }) => {
    // 1. Get Analytics Data based on Date Filter
    const { 
        totalRevenue, totalCount, avgTicket, avgItemsPerOrder,
        peakHoursData, trendData, channelBreakdown, funnelData 
    } = useAdminAnalytics(dateFilter, customRange);

    const { paymentBreakdown } = useFinancialCalculations();

    // 2. Prepare Data for Charts
    const channelData = [
        { name: 'Mesa', value: channelBreakdown.tables },
        { name: 'Delivery', value: channelBreakdown.delivery },
        { name: 'Venda Rápida', value: channelBreakdown.pos },
    ].filter(d => d.value > 0);

    const methodData = [
        { name: 'Pix', value: paymentBreakdown.PIX },
        { name: 'Cartão', value: paymentBreakdown.CARD },
        { name: 'Dinheiro', value: paymentBreakdown.CASH },
    ].filter(d => d.value > 0);

    const last7DaysData = trendData.slice(-7);

    // 3. Funnel Calculations
    const totalVisits = funnelData.find(d => d.name === 'Visualizações')?.value || 0;
    const totalOrders = funnelData.find(d => d.name === 'Pedidos')?.value || 0;
    const conversionRate = totalVisits > 0 ? ((totalOrders / totalVisits) * 100).toFixed(1) : '0.0';

    return (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            
            <FinancialKPIs 
                totalRevenue={totalRevenue}
                totalCount={totalCount}
                avgTicket={avgTicket}
                avgItemsPerOrder={avgItemsPerOrder}
                peakHoursData={peakHoursData}
                last7DaysData={last7DaysData}
                funnelData={funnelData}
                conversionRate={conversionRate}
                totalVisits={totalVisits}
                totalOrders={totalOrders}
            />

            {/* GRÁFICOS SECUNDÁRIOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart 
                    data={channelData} 
                    totalRevenue={totalRevenue} 
                />
                <PaymentMethodsChart 
                    data={methodData} 
                />
            </div>
        </div>
    );
};
