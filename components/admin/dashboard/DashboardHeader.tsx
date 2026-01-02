
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, X } from 'lucide-react';

interface DashboardHeaderProps {
    dateFilter: string;
    setDateFilter: (filter: string) => void;
    customRange: { start: string, end: string };
    setCustomRange: (range: { start: string, end: string }) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
    dateFilter, 
    setDateFilter, 
    customRange, 
    setCustomRange 
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleApplyCustomDate = () => {
        if (customRange.start && customRange.end) {
            setDateFilter('Customizado');
            setShowDatePicker(false);
        } else {
            alert('Selecione as datas de início e fim.');
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-2 px-2">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                <p className="text-sm text-slate-500 font-medium">Acompanhe o desempenho da sua empresa.</p>
            </div>

            <div className="relative z-20">
                <div className="relative group bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center px-4 py-2.5 hover:shadow-md transition-all cursor-pointer">
                    <CalendarIcon className="w-4 h-4 text-[#EA2831] shrink-0" />
                    <select 
                        value={dateFilter === 'Customizado' ? 'Customizado' : dateFilter}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'Customizado') setShowDatePicker(true);
                            else setDateFilter(val);
                        }}
                        className="appearance-none bg-transparent border-none text-sm font-bold text-slate-600 dark:text-slate-300 focus:ring-0 focus:outline-none cursor-pointer pl-3 pr-8 w-32"
                    >
                        <option>Hoje</option>
                        <option>7 dias</option>
                        <option>15 dias</option>
                        <option>30 dias</option>
                        <option>3 meses</option>
                        <option>6 meses</option>
                        <option>1 ano</option>
                        <option value="Customizado">Customizado...</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                {showDatePicker && (
                    <div className="absolute top-full right-0 mt-3 p-5 bg-white dark:bg-surface-dark rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] w-72 animate-[slideUp_0.2s_ease-out]">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Filtrar Período</span>
                            <button onClick={() => setShowDatePicker(false)} className="text-slate-400 hover:text-[#EA2831]"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Início</label>
                                <input type="date" value={customRange.start} onChange={(e) => setCustomRange({...customRange, start: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-gray-800 border-none rounded-lg text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-[#EA2831] outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Fim</label>
                                <input type="date" value={customRange.end} onChange={(e) => setCustomRange({...customRange, end: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-gray-800 border-none rounded-lg text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-[#EA2831] outline-none" />
                            </div>
                            <button onClick={handleApplyCustomDate} className="w-full py-3 bg-[#EA2831] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-700 transition-colors mt-2 shadow-lg shadow-red-500/20">Aplicar Filtro</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
