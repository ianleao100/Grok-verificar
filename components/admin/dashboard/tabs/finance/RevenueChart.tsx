
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RevenueChartProps {
    data: any[];
    totalRevenue: number;
}

const COLORS_RED = ['#EA2831', '#F97316', '#94A3B8', '#475569'];

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, totalRevenue }) => {
    return (
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#EA2831]" /> Canais de Venda
            </h3>
            <div className="flex-1 min-h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_RED[index % COLORS_RED.length]} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            iconType="circle"
                            wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#64748B' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pedidos</span>
                    <p className="text-2xl font-black text-slate-900">
                        {data.reduce((acc, curr) => acc + curr.value, 0)}
                    </p>
                </div>
            </div>
        </div>
    );
};
