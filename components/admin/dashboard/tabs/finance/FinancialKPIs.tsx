
import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Wallet, Package, Clock, Filter, ArrowDown } from 'lucide-react';
import { BarChart, Bar, Cell, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { formatCurrency } from '../../../../../shared/utils/mathEngine';

interface FinancialKPIsProps {
    totalRevenue: number;
    totalCount: number;
    avgTicket: number;
    avgItemsPerOrder: number;
    peakHoursData: any[];
    last7DaysData: any[];
    funnelData: any[];
    conversionRate: string;
    totalVisits: number;
    totalOrders: number;
}

export const FinancialKPIs: React.FC<FinancialKPIsProps> = ({
    totalRevenue, totalCount, avgTicket, avgItemsPerOrder,
    peakHoursData, last7DaysData, funnelData, conversionRate, totalVisits, totalOrders
}) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Faturamento */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between h-[280px]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-[#EA2831]" /> Faturamento Total
                            </p>
                            <div className="flex items-baseline gap-3">
                                <p className="text-4xl font-black text-[#EA2831] tracking-tight leading-none">{formatCurrency(totalRevenue)}</p>
                                <span className="bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12%</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-32 w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={last7DaysData}><Bar dataKey="sales" radius={[4, 4, 4, 4]}>{last7DaysData.map((e, i) => (<Cell key={`cell-${i}`} fill={i === last7DaysData.length - 1 ? '#EA1D2C' : '#E8E8E8'} />))}</Bar></BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Pedidos */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between h-[280px]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-slate-900" /> Total de Pedidos</p>
                            <div className="flex items-baseline gap-3">
                                <p className="text-4xl font-black text-slate-900 tracking-tight leading-none">{totalCount}</p>
                                <span className="bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5%</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-32 w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={last7DaysData}><Bar dataKey="count" radius={[4, 4, 4, 4]}>{last7DaysData.map((e, i) => (<Cell key={`cell-${i}`} fill={i === last7DaysData.length - 1 ? '#EA1D2C' : '#E8E8E8'} />))}</Bar></BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mini Cards */}
                <div className="bg-white p-6 rounded-[12px] shadow-sm border border-slate-100 flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start"><span className="text-xs font-black text-slate-600 uppercase tracking-widest">Ticket Médio</span><div className="p-2 bg-green-50 rounded-lg text-green-600"><Wallet className="w-5 h-5" /></div></div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(avgTicket)}</p>
                </div>
                <div className="bg-white p-6 rounded-[12px] shadow-sm border border-slate-100 flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start"><span className="text-xs font-black text-slate-600 uppercase tracking-widest">Itens por Pedido</span><div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Package className="w-5 h-5" /></div></div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{avgItemsPerOrder} <span className="text-xs text-slate-400 font-bold uppercase">produtos</span></p>
                </div>
                <div className="bg-white p-4 rounded-[12px] shadow-sm border border-slate-100 flex flex-col justify-between h-36 relative">
                     <div className="flex justify-between items-center mb-2 px-2"><span className="text-xs font-black text-slate-600 uppercase tracking-widest">Vendas por Hora</span><Clock className="w-4 h-4 text-slate-400" /></div>
                     <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={peakHoursData} margin={{top: 5, right: 5, left: 5, bottom: 0}}><Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold'}} itemStyle={{color: '#EA1D2C'}} /><Line type="monotone" dataKey="orders" stroke="#EA1D2C" strokeWidth={2} dot={false} activeDot={{r: 4}} /></LineChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>

            {/* Funil */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2"><Filter className="w-5 h-5 text-[#EA2831]" /> Funil de Conversão</h3>
                    <p className="text-xs text-slate-500 font-bold mb-6">Eficiência do cardápio digital (Visitas → Vendas)</p>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" /><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fontWeight: 700, fill: '#64748B'}} axisLine={false} tickLine={false} /><Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} /><Bar dataKey="value" barSize={32} radius={[0, 8, 8, 0]}>{funnelData.map((e, i) => (<Cell key={`cell-${i}`} fill={e.fill} />))}</Bar></BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="md:w-1/3 flex flex-col justify-center gap-6 border-l border-slate-100 pl-8">
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100"><p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Taxa de Conversão</p><div className="flex items-baseline gap-2"><span className="text-4xl font-black text-green-600 tracking-tight">{conversionRate}%</span><span className="text-xs font-bold text-green-600">Global</span></div></div>
                    <div className="space-y-4"><div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Visitas Totais</span><span className="font-black text-slate-900">{totalVisits}</span></div><div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500 flex items-center gap-2"><ArrowDown className="w-3 h-3 text-slate-300" /> Adic. Carrinho</span><span className="font-black text-slate-900">{funnelData.find(d => d.name === 'Adic. Sacola')?.value || 0}</span></div><div className="h-px bg-slate-100"></div><div className="flex justify-between items-center"><span className="text-xs font-bold text-[#EA2831] uppercase">Pedidos Finalizados</span><span className="font-black text-[#EA2831] text-lg">{totalOrders}</span></div></div>
                </div>
            </div>
        </div>
    );
};
