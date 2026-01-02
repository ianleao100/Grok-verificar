
import React from 'react';
import { TrendingUp, ShoppingBag, Clock } from 'lucide-react';

interface CustomerConsumptionCardProps {
    stats: {
        topFoods: any[];
        topDrinks: any[];
        avgDaysBetween: number;
        daysSinceLast: number;
    };
}

export const CustomerConsumptionCard: React.FC<CustomerConsumptionCardProps> = ({ stats }) => {
    return (
        <div className="mb-10 border-b border-dashed border-gray-200 dark:border-gray-700/50 pb-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Padrão de Consumo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Preferidos */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 md:col-span-2">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><ShoppingBag className="w-3 h-3" /> Pratos Favoritos</p>
                            {stats.topFoods.length > 0 ? (
                                <ul className="space-y-3">
                                    {stats.topFoods.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <span className="flex size-6 items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg text-[10px] font-black">{idx + 1}</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-gray-200 line-clamp-1">{item.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 ml-auto">{item.count}x</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-xs text-slate-400 italic">Sem dados suficientes</p>}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><span className="text-blue-400">🥤</span> Bebidas Favoritas</p>
                            {stats.topDrinks.length > 0 ? (
                                <ul className="space-y-3">
                                    {stats.topDrinks.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <span className="flex size-6 items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg text-[10px] font-black">{idx + 1}</span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-gray-200 line-clamp-1">{item.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 ml-auto">{item.count}x</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-xs text-slate-400 italic">Sem dados suficientes</p>}
                        </div>
                    </div>
                </div>

                {/* Recorrência */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center gap-6">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Média de Recompra</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{stats.avgDaysBetween || '--'}</span>
                            <span className="text-sm font-bold text-slate-500">dias</span>
                        </div>
                        <p className="text-[10px] text-green-600 font-bold mt-1">Ciclo estimado</p>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-800"></div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Último Pedido</p>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#EA2831]" />
                            <span className="text-lg font-black text-slate-900 dark:text-white">{stats.daysSinceLast === 0 ? 'Hoje' : `Há ${stats.daysSinceLast} dias`}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
