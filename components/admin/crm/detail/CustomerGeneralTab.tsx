
import React from 'react';
import { TrendingUp, DollarSign, Clock, MessageSquare, Star, FileText } from 'lucide-react';
import { formatCurrency } from '../../../../../../shared/utils/mathEngine';
import { CustomerConsumptionCard } from '../../../pro/customer/CustomerConsumptionCard';
import { CustomerFinancialCard } from '../../../pro/customer/CustomerFinancialCard';

interface CustomerGeneralTabProps {
    customer: any;
    stats: any;
}

export const CustomerGeneralTab: React.FC<CustomerGeneralTabProps> = ({ customer, stats }) => {
    return (
        <div className="space-y-8 animate-[fadeIn_0.3s]">
            
            {customer.observations && (
                <div className="bg-[#F8F8F8] dark:bg-gray-800/50 p-6 rounded-[24px] border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                    <div className="p-2.5 bg-white dark:bg-gray-700 rounded-xl text-slate-400 shadow-sm border border-gray-100 dark:border-gray-600"><FileText className="w-5 h-5" /></div>
                    <div className="flex-1">
                        <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Observações do Cliente</h4>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">{customer.observations}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div className="size-12 bg-red-50 dark:bg-red-900/20 text-[#EA2831] rounded-2xl flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recorrência</p><p className="text-lg font-black text-slate-900 dark:text-white leading-tight">A cada {stats.avgDays || '--'} dias</p></div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div className="size-12 bg-red-50 dark:bg-red-900/20 text-[#EA2831] rounded-2xl flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Médio</p><p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{formatCurrency(stats.avgTicket)}</p></div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div className="size-12 bg-red-50 dark:bg-red-900/20 text-[#EA2831] rounded-2xl flex items-center justify-center"><Clock className="w-6 h-6" /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Último Pedido</p><p className="text-lg font-black text-slate-900 dark:text-white leading-tight">{stats.daysSinceLast === 0 ? 'Hoje' : `Há ${stats.daysSinceLast} dias`}</p></div>
                </div>
            </div>

            <CustomerConsumptionCard stats={stats} />
            <CustomerFinancialCard stats={stats} />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Feedbacks do Cliente</h3>
                    {stats.averageRating ? (
                        <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/10 px-4 py-2 rounded-2xl border border-yellow-100 dark:border-yellow-900/30">
                            <div className="flex flex-col items-end"><span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{stats.averageRating}</span><span className="text-[9px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-widest">Média Geral</span></div>
                            <div className="h-8 w-px bg-yellow-200 dark:bg-yellow-800/30 mx-1"></div>
                            <div className="flex text-yellow-400 drop-shadow-sm"><Star className="fill-current w-6 h-6" /></div>
                        </div>
                    ) : (
                        <span className="text-xs font-bold text-slate-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">Sem avaliações</span>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.feedbacks.length > 0 ? stats.feedbacks.map((fb: any) => (
                        <div key={fb.id} className="bg-white dark:bg-surface-dark p-5 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-0.5 text-yellow-400">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />))}</div>
                                <span className="text-[10px] font-bold text-slate-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md">{fb.date}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-600 dark:text-gray-300 italic leading-relaxed">"{fb.comment}"</p>
                        </div>
                    )) : (
                        <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[24px]"><p className="text-sm font-bold text-slate-300">Nenhum feedback registrado.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};
