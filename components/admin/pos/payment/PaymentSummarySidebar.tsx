
import React from 'react';
import { Receipt, Layers, Star, AlertTriangle } from 'lucide-react';
import { CartItem } from '../../../../types';
import { formatCurrency } from '../../../../shared/utils/mathEngine';

interface PaymentSummarySidebarProps {
    cart: CartItem[];
    subtotal: number;
    serviceFee: number;
    setServiceFee: (val: number) => void;
    coverCharge: number;
    setCoverCharge: (val: number) => void;
    pointsDiscount: number;
    totalToReceive: number;
}

export const PaymentSummarySidebar: React.FC<PaymentSummarySidebarProps> = ({
    cart, subtotal, serviceFee, setServiceFee, coverCharge, setCoverCharge,
    pointsDiscount, totalToReceive
}) => {
    const lowStockItems = cart.filter(item => item.name.includes("Kit") || item.price > 90);

    return (
        <div className="w-full md:w-2/5 bg-gray-50 dark:bg-gray-800/50 p-10 flex flex-col border-r border-gray-100 dark:border-gray-800">
            <div className="mb-10">
                <h2 className="text-2xl font-black tracking-tight leading-tight mb-1">Resumo da Venda</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Itens e Taxas Aplicadas</p>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
                <div className="space-y-4">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm group">
                            <span className="text-slate-500 font-bold truncate max-w-[180px] flex items-center gap-2">
                                <span className="size-5 bg-white rounded-md flex items-center justify-center text-[10px] shadow-sm border border-gray-100">{item.quantity}</span>
                                {item.name}
                            </span>
                            <span className="text-slate-900 dark:text-white font-black">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                        <span className="flex items-center gap-2 uppercase tracking-widest text-[10px]">Subtotal Itens</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                        <span className="flex items-center gap-2 uppercase tracking-widest text-[10px]"><Receipt className="w-3 h-3" /> Taxa Serviço</span>
                        <div className="relative w-24">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">R$</span>
                            <input type="number" value={serviceFee} onChange={(e) => setServiceFee(parseFloat(e.target.value) || 0)} className="w-full pl-6 pr-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-right text-xs font-black outline-none" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                        <span className="flex items-center gap-2 uppercase tracking-widest text-[10px]"><Layers className="w-3 h-3" /> Couvert</span>
                        <div className="relative w-24">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">R$</span>
                            <input type="number" value={coverCharge} onChange={(e) => setCoverCharge(parseFloat(e.target.value) || 0)} className="w-full pl-6 pr-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-right text-xs font-black outline-none" />
                        </div>
                    </div>
                    {pointsDiscount > 0 && (
                        <div className="flex justify-between items-center text-sm font-bold text-green-600">
                            <span className="flex items-center gap-2 uppercase tracking-widest text-[10px]"><Star className="w-3 h-3 fill-current" /> Desconto Pontos</span>
                            <span>- {formatCurrency(pointsDiscount)}</span>
                        </div>
                    )}
                </div>

                <div className="pt-6 mt-auto">
                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-1 text-center">Total Líquido a Receber</span>
                        <p className="text-5xl font-black text-primary text-center font-display tracking-tight">{formatCurrency(totalToReceive)}</p>
                    </div>
                </div>
            </div>

            {lowStockItems.length > 0 && (
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl animate-[fadeIn_0.3s]">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Atenção: Estoque Baixo
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {lowStockItems.map((item, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/80 dark:bg-black/20 rounded-lg text-[10px] font-bold text-amber-700 dark:text-amber-300">{item.name}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
