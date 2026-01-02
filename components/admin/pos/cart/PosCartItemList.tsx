
import React from 'react';
import { ShoppingCart, Trash2, Minus, Plus, Check } from 'lucide-react';
import { CartItem } from '../../../../types';
import { formatCurrency } from '../../../../shared/utils/mathEngine';

interface PosCartItemListProps {
    cart: CartItem[];
    selectedIndices: number[];
    toggleSelection: (idx: number) => void;
    updateQty: (idx: number, delta: number) => void;
}

export const PosCartItemList: React.FC<PosCartItemListProps> = ({ 
    cart, selectedIndices, toggleSelection, updateQty 
}) => {
    if (cart.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6 text-slate-300">
                <div className="size-20 bg-gray-50 dark:bg-gray-800/50 rounded-[32px] flex items-center justify-center border border-gray-100 dark:border-gray-800">
                    <ShoppingCart className="w-8 h-8 opacity-10" />
                </div>
                <p className="font-black text-[10px] uppercase tracking-[0.3em] opacity-30">Aguardando itens...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex items-center gap-4 group animate-[slideIn_0.2s_ease-out] border-b border-gray-50 dark:border-gray-800/50 pb-3 last:border-0 last:pb-0">
                    <button 
                        onClick={() => toggleSelection(idx)}
                        className={`shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedIndices.includes(idx) ? 'bg-primary border-primary text-white shadow-lg' : 'border-gray-200 hover:border-primary'}`}
                    >
                        {selectedIndices.includes(idx) && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex flex-1 gap-4 items-center">
                        <img src={item.imageUrl} className="size-16 rounded-[20px] object-cover shrink-0 shadow-sm border border-gray-50 dark:border-gray-800" alt={item.name} />
                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight line-clamp-1">{item.name}</h4>
                                <div className="flex items-center gap-2 shrink-0 ml-4">
                                    <button onClick={() => updateQty(idx, -1)} className="text-primary hover:scale-125 transition-all"><Minus className="w-4 h-4 stroke-[3]" /></button>
                                    <span className="text-sm font-black w-5 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                                    <button onClick={() => updateQty(idx, 1)} className="text-primary hover:scale-125 transition-all"><Plus className="w-4 h-4 stroke-[3]" /></button>
                                </div>
                            </div>
                            
                            {item.selectedExtras && item.selectedExtras.length > 0 && (
                                <div className="flex flex-col gap-0.5 mb-1.5">
                                    {item.selectedExtras.map(extra => (
                                        <div key={extra.id} className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-gray-500">
                                            <span>+ {extra.name}</span>
                                            <span>{formatCurrency(extra.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {item.notes && (
                                <div className="flex items-start gap-1.5 text-[10px] font-bold text-red-600 bg-transparent w-full px-2 py-1.5 rounded-lg mb-1.5 border border-red-200 dark:border-red-900/30">
                                    <span className="whitespace-pre-wrap break-words leading-relaxed">{item.notes}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-dashed border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Valor Total:</span>
                                <span className={`text-lg font-black font-display ${selectedIndices.includes(idx) ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                    {formatCurrency(item.price * item.quantity)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
