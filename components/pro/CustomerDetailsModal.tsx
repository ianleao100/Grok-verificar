
import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Clock, MessageSquare, Star, Eye, ShoppingBag, Trash2, Activity, CreditCard, Smartphone, Banknote, QrCode } from 'lucide-react';
import { BaseModal } from '../ui/BaseModal';
import { useCustomerStats } from '../../hooks/pro/useCustomerStats';
import { CustomerConsumptionCard } from './customer/CustomerConsumptionCard';
import { CustomerFinancialCard } from './customer/CustomerFinancialCard';
import { formatCurrency } from '../../shared/utils/mathEngine';

interface CustomerDetailsModalProps {
    customer: any;
    onClose: () => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customer, onClose }) => {
    const stats = useCustomerStats(customer);
    const [activeTab, setActiveTab] = useState<'GERAL' | 'COMPORTAMENTO'>('GERAL');

    return (
        <BaseModal onClose={onClose} className="max-w-4xl w-full h-[85vh]" hideCloseButton={true}>
            <div className="flex flex-col h-full bg-[#f8f6f6] dark:bg-background-dark rounded-[32px] overflow-hidden relative">
                
                {/* HEADER */}
                <div className="bg-white dark:bg-surface-dark px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="size-14 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-slate-400 font-black text-xl">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{customer.name}</h2>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-sm font-bold text-slate-500">{customer.whatsapp}</span>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" /> {customer.points} pontos
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl hover:text-red-500 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-8 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark">
                    <div className="flex gap-6">
                        <button onClick={() => setActiveTab('GERAL')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'GERAL' ? 'border-[#EA2831] text-[#EA2831]' : 'border-transparent text-slate-400'}`}>Visão Geral</button>
                        <button onClick={() => setActiveTab('COMPORTAMENTO')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'COMPORTAMENTO' ? 'border-[#EA2831] text-[#EA2831]' : 'border-transparent text-slate-400'}`}>Comportamento</button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    {activeTab === 'GERAL' && (
                        <div className="animate-[fadeIn_0.3s]">
                            {/* 1. MÉTRICAS TOPO */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                    <div className="size-12 bg-red-50 dark:bg-red-900/20 text-[#EA2831] rounded-2xl flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recorrência</p><p className="text-lg font-black text-slate-900 dark:text-white leading-tight">A cada {stats.avgDaysBetween || '--'} dias</p></div>
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

                            {/* SEÇÃO 3: FEEDBACK */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-primary" /> Feedbacks do Cliente
                                    </h3>
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
                                    {stats.feedbacks.length > 0 ? stats.feedbacks.map(fb => (
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
                    )}

                    {activeTab === 'COMPORTAMENTO' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-[#EA2831]"><Eye className="w-4 h-4" /></div><h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Mais Visualizados</h4></div>
                                    <ul className="space-y-2">{stats.pixel.topViewed.map((item, i) => (<li key={i} className="text-xs font-bold text-slate-600 dark:text-gray-400 border-l-2 border-[#EA2831]/20 pl-3 py-1">{item}</li>))}</ul>
                                </div>
                                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-[#EA2831]"><ShoppingBag className="w-4 h-4" /></div><h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Colocou na Sacola</h4></div>
                                    <ul className="space-y-2">{stats.pixel.addedToCart.map((item, i) => (<li key={i} className="text-xs font-bold text-slate-600 dark:text-gray-400 border-l-2 border-[#EA2831]/20 pl-3 py-1">{item}</li>))}</ul>
                                </div>
                                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-[#EA2831]"><Trash2 className="w-4 h-4" /></div><h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Removeu da Sacola</h4></div>
                                    <ul className="space-y-2">{stats.pixel.removedFromCart.map((item, i) => (<li key={i} className="text-xs font-bold text-slate-600 dark:text-gray-400 border-l-2 border-[#EA2831]/20 pl-3 py-1">{item}</li>))}</ul>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-gray-800/30 p-8 rounded-[32px] border border-gray-200 dark:border-gray-800">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-[#EA2831]" /> Padrão de Atividade</h3>
                                <div className="flex flex-col md:flex-row gap-8 justify-around items-center">
                                    <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase mb-2">Dia Mais Ativo</p><p className="text-3xl font-black text-slate-900 dark:text-white">{stats.pixel.mostActiveDay}</p></div>
                                    <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                                    <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase mb-2">Horário de Pico</p><p className="text-3xl font-black text-slate-900 dark:text-white">{stats.pixel.activeHours}</p></div>
                                    <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                                    <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase mb-2">Plataforma</p><p className="text-xl font-black text-slate-900 dark:text-white">{stats.pixel.platform}</p></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};
