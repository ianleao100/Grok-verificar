
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Ticket, Target } from 'lucide-react';
import { formatCurrency } from '../../../../../../shared/utils/mathEngine';

interface MarketingFunnelCardProps {
    marketingFunnel: any[];
    couponRevenue: number;
    couponRoiPercent: number;
    couponRoiValue: number;
}

export const MarketingFunnelCard: React.FC<MarketingFunnelCardProps> = ({ marketingFunnel, couponRevenue, couponRoiPercent, couponRoiValue }) => {
    return (
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col h-[400px]">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-[#EA2831]" /> Performance de Cupons
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">Eficácia das campanhas ativas</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receita Gerada</p>
                    <p className="text-2xl font-black text-green-600">{formatCurrency(couponRevenue)}</p>
                </div>
            </div>
            
            <div className="flex-1 w-full flex gap-6">
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={marketingFunnel} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fontWeight: 700, fill: '#64748B'}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            <Bar dataKey="value" barSize={32} radius={[0, 8, 8, 0]}>
                                {marketingFunnel.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="w-1/3 flex flex-col justify-center border-l border-slate-100 pl-6 gap-6">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Target className="w-3 h-3" /> ROI Campanhas</span>
                        <p className="text-3xl font-black text-slate-900 mt-1">{couponRoiPercent}%</p>
                        <p className="text-[10px] font-bold text-green-600">+ {formatCurrency(couponRoiValue)} (Líquido)</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Conversão</span>
                        <p className="text-xl font-black text-[#EA2831]">
                            {marketingFunnel[0].value > 0 ? Math.round((marketingFunnel[1].value / marketingFunnel[0].value) * 100) : 0}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
