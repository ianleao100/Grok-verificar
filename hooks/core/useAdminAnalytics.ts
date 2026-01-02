
import { useMemo } from 'react';
import { useOrderManager } from './useOrderManager';
import { OrderStatus } from '../../types';
import { roundFinance } from '../../shared/utils/mathEngine';
import { 
    filterOrdersByDate, calculateFunnel, calculateABC, calculateChannelComparison, 
    calculateQualityMetrics, calculateDispatchPerformance, calculateTimeMetrics 
} from '../../utils/analyticsEngine';

export const useAdminAnalytics = (period: string = 'Hoje', customRange?: { start: string, end: string }) => {
    const { orders } = useOrderManager();

    const analytics = useMemo(() => {
        const filteredOrders = filterOrdersByDate(orders, period, customRange);
        const validOrders = filteredOrders.filter(o => o.status !== OrderStatus.CANCELLED);
        const completedOrders = filteredOrders.filter(o => o.status === OrderStatus.DELIVERED);
        const cancelledOrders = filteredOrders.filter(o => o.status === OrderStatus.CANCELLED);

        // Core Metrics
        const totalRevenue = roundFinance(validOrders.reduce((acc, o) => acc + o.total, 0));
        const totalCount = validOrders.length;
        const avgTicket = totalCount > 0 ? roundFinance(totalRevenue / totalCount) : 0;
        const totalItemsSold = validOrders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);
        const avgItemsPerOrder = totalCount > 0 ? Number((totalItemsSold / totalCount).toFixed(1)) : 0;

        // Breakdown & Special Metrics
        let channelStats = { delivery: 0, tables: 0, pos: 0 };
        let totalDiscounts = 0;
        validOrders.forEach(order => {
            if (order.origin === 'DELIVERY' || order.isDelivery) channelStats.delivery++;
            else if (order.tableNumber || order.origin === 'MESA') channelStats.tables++;
            else channelStats.pos++;
            if (order.discount) totalDiscounts += order.discount;
        });

        // Engine Calculations
        const funnelData = calculateFunnel(totalCount);
        const abcProducts = calculateABC(validOrders);
        const channelComparison = calculateChannelComparison(validOrders);
        const qualityMetrics = calculateQualityMetrics(filteredOrders);
        const { performance: dispatchPerformance, bagAlerts } = calculateDispatchPerformance(filteredOrders);
        const { avgAcceptance, avgPrep, avgDelivery, categoryEfficiency } = calculateTimeMetrics(validOrders);

        // Heatmaps & Maps (Simplified here for length)
        const volumeHeatmap = Array.from({ length: 7 }, () => Array(24).fill(0));
        const heatMapPoints: {lat: number, lng: number, weight: number}[] = [];
        const neighborhoodMap: Record<string, number> = {};
        
        validOrders.forEach(o => {
            const d = new Date(o.timestamp);
            volumeHeatmap[d.getDay()][d.getHours()]++;
            if (o.coordinates) heatMapPoints.push({ lat: o.coordinates.lat, lng: o.coordinates.lng, weight: o.total });
            if (o.address) {
                const parts = o.address.split('-');
                const hood = parts.length > 1 ? parts[1].trim() : 'Centro';
                neighborhoodMap[hood] = (neighborhoodMap[hood] || 0) + o.total;
            }
        });

        const topNeighborhoods = Object.entries(neighborhoodMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
        const trendingProducts = abcProducts.slice(0, 5).map(p => ({ name: p.name, sales: p.current, growth: 10 }));
        const lowConversionProducts = abcProducts.slice(-3).map(p => ({ name: p.name, views: p.current * 15, sales: p.current }));

        // Marketing Stub
        const marketingMetrics = {
            marketingFunnel: [
                {name: 'Dist.', value: 100, fill: '#94A3B8'}, 
                {name: 'Uso', value: 20, fill: '#F97316'}, 
                {name: 'Venda', value: 20, fill: '#EA2831'}
            ],
            couponRevenue: 0, 
            couponRoiValue: 0, 
            couponRoiPercent: 0, 
            loyaltyData: [
                { name: 'Acumulados', value: 1500 },
                { name: 'Resgatados', value: 450 }
            ], 
            featuredProductStats: {name: 'N/A', sales: 0, clicks: 0, revenue: 0}, 
            campaignRetention: []
        };

        const insights: { type: 'TREND' | 'ALERT', message: string }[] = [];
        if (avgPrep > 25) insights.push({ type: 'ALERT', message: `Tempo de preparo alto: ${avgPrep} min.` });
        if (cancelledOrders.length > 2) insights.push({ type: 'ALERT', message: `${cancelledOrders.length} cancelamentos.` });

        return {
            totalRevenue, totalCount, avgTicket, avgItemsPerOrder,
            channelBreakdown: channelStats, channelSplit: { delivery: channelStats.delivery, inPerson: channelStats.tables + channelStats.pos },
            totalDiscounts, avgAcceptance, avgPrep, avgDelivery,
            funnelData, abcProducts, channelComparison, qualityMetrics, dispatchPerformance, bagAlerts,
            categoryEfficiency, volumeHeatmap, heatMapPoints, topNeighborhoods,
            trendingProducts, lowConversionProducts, insights,
            trendData: [], peakHoursData: [], categoryData: [], recentActivity: [], 
            customerRetention: [], newCustomersCount: 0, cancellationStats: [],
            ...marketingMetrics, cacValue: 0
        };
    }, [orders, period, customRange]);

    return analytics;
};
