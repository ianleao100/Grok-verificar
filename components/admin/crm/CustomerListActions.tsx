
import React, { useState } from 'react';
import { Plus, Filter, Clock, DollarSign, ListOrdered } from 'lucide-react';
import { CustomerProfile } from '../../../types';

type SortKey = keyof CustomerProfile | 'lastOrderAt';
type SortDirection = 'asc' | 'desc';

interface CustomerListActionsProps {
    onNewCustomer: () => void;
    onSortChange: (config: { key: SortKey; direction: SortDirection }) => void;
}

export const CustomerListActions: React.FC<CustomerListActionsProps> = ({ onNewCustomer, onSortChange }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
                onClick={(e) => { e.stopPropagation(); onNewCustomer(); }} 
                className="flex items-center gap-2 px-5 py-3 bg-[#EA2831] hover:bg-red-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all active:scale-95 whitespace-nowrap"
            >
                <Plus className="w-4 h-4 stroke-[3]" /> Novo Cliente
            </button>
            
            <div className="relative">
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }} 
                    className={`p-3 rounded-xl border transition-all shadow-sm group active:scale-95 flex items-center gap-2 ${isFilterOpen ? 'bg-[#EA2831] text-white border-[#EA2831]' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-800 text-slate-600 dark:text-white hover:border-[#EA2831] hover:text-[#EA2831]'}`} 
                    title="Filtros Rápidos"
                >
                    <Filter className="w-5 h-5" />
                </button>
                
                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20 animate-[slideDown_0.2s_ease-out]">
                        <div className="p-2 space-y-1">
                            <button onClick={() => onSortChange({key: 'lastOrderAt', direction: 'desc'})} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 text-slate-600 hover:bg-gray-50 hover:text-[#EA2831]"><Clock className="w-3.5 h-3.5" /> Mais Recentes</button>
                            <button onClick={() => onSortChange({key: 'totalSpent', direction: 'desc'})} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 text-slate-600 hover:bg-gray-50 hover:text-[#EA2831]"><DollarSign className="w-3.5 h-3.5" /> Maior Gasto</button>
                            <button onClick={() => onSortChange({key: 'name', direction: 'asc'})} className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 text-slate-600 hover:bg-gray-50 hover:text-[#EA2831]"><ListOrdered className="w-3.5 h-3.5" /> Ordem A-Z</button>
                        </div>
                    </div>
                )}
            </div>
            {isFilterOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
            )}
        </div>
    );
};
