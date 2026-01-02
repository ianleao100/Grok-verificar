
import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/mathEngine';

interface KeyMetricsGridProps {
    totalRevenue: number;
    totalCount: number;
    avgTicket: number;
}

export const KeyMetricsGrid: React.FC<KeyMetricsGridProps> = ({ totalRevenue, totalCount, avgTicket }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Faturamento */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-transparent hover:shadow-xl transition-all group flex items-center justify-between relative overflow-hidden">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Faturamento Bruto</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="size-14 rounded-2xl flex items-center justify-center text-[#EA2831] bg-white shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-7 h-7" />
                </div>
            </div>

            {/* Volume */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-transparent hover:shadow-xl transition-all group flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume de Vendas</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{totalCount} <span className="text-sm text-slate-400 font-bold">pedidos</span></p>
                </div>
                <div className="size-14 rounded-2xl flex items-center justify-center text-[#EA2831] bg-white shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-7 h-7" />
                </div>
            </div>

            {/* Ticket Médio */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-transparent hover:shadow-xl transition-all group flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ticket Médio</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(avgTicket)}</p>
                </div>
                <div className="size-14 rounded-2xl flex items-center justify-center text-[#EA2831] bg-white shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7" />
                </div>
            </div>
        </div>
    );
};
