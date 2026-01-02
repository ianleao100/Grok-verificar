
import React from 'react';
import { CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../../../../shared/utils/mathEngine';

interface PaymentMethodsChartProps {
    data: any[];
}

const COLORS_MONOCHROME = ['#171717', '#525252', '#A3A3A3', '#D4D4D4'];

export const PaymentMethodsChart: React.FC<PaymentMethodsChartProps> = ({ data }) => {
    return (
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#EA2831]" /> Métodos de Pagamento
            </h3>
            <div className="flex-1 min-h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_MONOCHROME[index % COLORS_MONOCHROME.length]} strokeWidth={2} stroke="#fff" />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
