
import React from 'react';
import { Tag, ShoppingBag, Truck, Calendar, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/mathEngine';

interface CustomerFinancialCardProps {
    stats: {
        financials: { products: number; fees: number; discounts: number };
        history: any[];
    };
}

export const CustomerFinancialCard: React.FC<CustomerFinancialCardProps> = ({ stats }) => {
    return (
        <div className="mb-10 border-b border-dashed border-gray-200 dark:border-gray-700/50 pb-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Raio-X de Gastos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Breakdown de Valores */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg text-slate-600 dark:text-gray-300"><ShoppingBag className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-slate-600 dark:text-gray-300 uppercase">Em Produtos</span>
                            </div>
                            <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(stats.financials.products)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg text-slate-600 dark:text-gray-300"><Truck className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-slate-600 dark:text-gray-300 uppercase">Taxas de Entrega</span>
                            </div>
                            <span className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(stats.financials.fees)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-green-900/30 rounded-lg text-green-600"><Tag className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase">Descontos Obtidos</span>
                            </div>
                            <span className="text-sm font-black text-green-700 dark:text-green-400">{formatCurrency(stats.financials.discounts)}</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Simplificada */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Calendar className="w-3 h-3" /> Histórico Recente</p>
                    <div className="flex-1 overflow-y-auto max-h-[140px] no-scrollbar space-y-2 pr-2">
                        {stats.history.length > 0 ? stats.history.map((order, i) => (
                            <div key={order.id} className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800 pb-2 last:border-0">
                                <span className="font-bold text-slate-700 dark:text-gray-300">{new Date(order.timestamp).toLocaleDateString()}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-slate-500">{order.status}</span>
                                <span className="font-mono text-slate-400">#{order.id.slice(-4)}</span>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                <AlertCircle className="w-6 h-6 mb-1 opacity-50" />
                                <span className="text-[10px] font-bold uppercase">Sem histórico</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
