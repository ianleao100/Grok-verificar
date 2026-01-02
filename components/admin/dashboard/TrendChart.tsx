
import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/mathEngine';

interface TrendChartProps {
    data: any[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
    return (
        <div className="w-full bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#EA2831]" /> Tendência & Previsão
                </h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-[#EA2831]"></span><span className="text-xs font-bold text-slate-500">Realizado</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-slate-300 border-t-2 border-dashed border-slate-400"></div><span className="text-xs font-bold text-slate-500">Previsão (3 dias)</span></div>
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} tickFormatter={(value) => `R$${value}`} />
                        <Tooltip 
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                            formatter={(value: number, name: string) => [
                                formatCurrency(value), 
                                name === 'sales' ? 'Faturamento Real' : (name === 'forecast' ? 'Previsão' : 'Anterior')
                            ]}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#EA2831" 
                            strokeWidth={4} 
                            dot={{r: 4, fill: '#EA2831', strokeWidth: 0}} 
                            activeDot={{r: 8}} 
                            connectNulls={false} 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="forecast" 
                            stroke="#94a3b8" 
                            strokeWidth={3} 
                            strokeDasharray="5 5" 
                            dot={{r: 3, fill: '#94a3b8', strokeWidth: 0}}
                            activeDot={{r: 6}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
