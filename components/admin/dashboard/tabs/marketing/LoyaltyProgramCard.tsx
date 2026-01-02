
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Star } from 'lucide-react';
import { formatCurrency } from '../../../../../../shared/utils/mathEngine';

interface LoyaltyProgramCardProps {
    loyaltyData: any[];
}

export const LoyaltyProgramCard: React.FC<LoyaltyProgramCardProps> = ({ loyaltyData }) => {
    return (
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col h-[400px]">
            <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" /> Programa de Fidelidade
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">Pontos gerados vs. resgatados</p>
            </div>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={loyaltyData} barSize={60}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            <Cell fill="#EAB308" />
                            <Cell fill="#22C55E" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-center">
                <p className="text-xs text-slate-400 font-medium">
                    <span className="font-black text-slate-900">{loyaltyData[1].value}</span> pontos resgatados economizaram aprox. <span className="font-black text-green-600">{formatCurrency(loyaltyData[1].value * 0.05)}</span> para os clientes.
                </p>
            </div>
        </div>
    );
};
