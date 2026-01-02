
import React from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { Order } from '../../../types';
import { OrderMetrics } from './OrderMetrics';

interface OrderSelectionToolbarProps {
    orders: Order[];
    onAudit: () => void;
    sectorFilter: string;
    setSectorFilter: (val: string) => void;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
}

export const OrderSelectionToolbar: React.FC<OrderSelectionToolbarProps> = ({
    orders,
    onAudit,
    sectorFilter,
    setSectorFilter,
    searchTerm,
    setSearchTerm
}) => {
    return (
        <div className="px-4 pt-4 pb-2 grid grid-cols-12 gap-4 items-center shrink-0">
            <div className="col-span-3 flex flex-col justify-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Expedição</h1>
                <button 
                    onClick={onAudit}
                    className="text-slate-500 font-bold text-xs flex items-center gap-1 hover:text-[#EA2831] w-fit"
                >
                    <Users className="w-3 h-3" /> Auditoria de Frota
                </button>
            </div>

            <div className="col-span-6 flex justify-center -mt-2">
                 <OrderMetrics orders={orders} />
            </div>

            <div className="col-span-3 flex justify-end gap-3">
                <div className="relative">
                    <select 
                        value={sectorFilter}
                        onChange={(e) => setSectorFilter(e.target.value)}
                        className="appearance-none bg-white dark:bg-surface-dark pl-9 pr-8 py-2.5 rounded-xl text-xs font-black border border-gray-200 dark:border-gray-800 text-slate-700 dark:text-white focus:ring-1 focus:ring-[#EA2831] outline-none shadow-sm cursor-pointer hover:bg-gray-50 uppercase tracking-wide"
                    >
                        <option value="ALL">Todas Zonas</option>
                        <option value="NORTE">Zona Norte</option>
                        <option value="SUL">Zona Sul</option>
                        <option value="LESTE">Zona Leste</option>
                        <option value="OESTE">Zona Oeste</option>
                        <option value="CENTRO">Centro</option>
                    </select>
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                <div className="relative group w-full max-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#EA2831] w-3.5 h-3.5 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="BUSCAR..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-black shadow-sm focus:outline-none focus:border-[#EA2831] focus:ring-1 focus:ring-[#EA2831] transition-all uppercase placeholder:normal-case placeholder:font-medium"
                    />
                </div>
            </div>
        </div>
    );
};
