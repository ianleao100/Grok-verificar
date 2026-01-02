
import React from 'react';
import { Zap, AlertTriangle } from 'lucide-react';
import { KeyMetricsGrid } from './KeyMetricsGrid';
import { TrendChart } from './TrendChart';
import { GeoMapSection } from './GeoMapSection';

interface DashboardOverviewProps {
    analytics: any; // Tipagem do retorno do hook useAdminAnalytics
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ analytics }) => {
    const { 
        totalRevenue, totalCount, avgTicket, 
        trendData, topNeighborhoods, heatMapPoints, insights 
    } = analytics;

    return (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* INSIGHTS OPERACIONAIS */}
            {insights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.map((insight: any, idx: number) => (
                        <div 
                            key={idx} 
                            className={`p-4 rounded-[20px] border flex items-start gap-3 shadow-sm ${
                                insight.type === 'TREND' 
                                ? 'bg-orange-50 border-orange-100 text-orange-800' 
                                : 'bg-red-50 border-red-100 text-red-700'
                            }`}
                        >
                            <div className={`p-2 rounded-full shrink-0 ${insight.type === 'TREND' ? 'bg-orange-100' : 'bg-red-100'}`}>
                                {insight.type === 'TREND' ? <Zap className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest mb-1">Insight em Tempo Real</h4>
                                <p className="text-sm font-bold leading-tight">{insight.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* KPI CARDS */}
            <KeyMetricsGrid 
                totalRevenue={totalRevenue} 
                totalCount={totalCount} 
                avgTicket={avgTicket} 
            />

            {/* REVENUE TREND & FORECAST CHART */}
            <TrendChart data={trendData} />

            {/* GEO INTELLIGENCE */}
            <GeoMapSection 
                points={heatMapPoints} 
                topNeighborhoods={topNeighborhoods} 
            />
        </div>
    );
};
