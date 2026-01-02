
import React from 'react';
import { Megaphone, MousePointer, TrendingUp } from 'lucide-react';

interface FeaturedProductCardProps {
    stats: {
        name: string;
        clicks: number;
        sales: number;
        revenue: number;
    };
}

export const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({ stats }) => {
    return (
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                    <Megaphone className="w-5 h-5 text-purple-500" /> Destaque Ativo
                </h3>
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 mb-6">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Produto</p>
                    <p className="text-xl font-black text-purple-900 leading-tight">{stats.name}</p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><MousePointer className="w-4 h-4" /> Cliques (Est.)</div>
                        <span className="font-black text-slate-900">{stats.clicks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><TrendingUp className="w-4 h-4" /> Vendas</div>
                        <span className="font-black text-slate-900">{stats.sales}</span>
                    </div>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-400 uppercase">Conversão</span>
                        <span className="text-xl font-black text-green-500">
                            {stats.clicks > 0 ? ((stats.sales / stats.clicks) * 100).toFixed(1) : 0}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
