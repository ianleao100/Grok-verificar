
import React from 'react';
import { Eye, ShoppingBag, Trash2, Activity } from 'lucide-react';

interface CustomerBehaviorTabProps {
    pixel: any;
}

export const CustomerBehaviorTab: React.FC<CustomerBehaviorTabProps> = ({ pixel }) => {
    return (
        <div className="space-y-8 animate-[fadeIn_0.3s]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-[#EA2831]"><Eye className="w-4 h-4" /></div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Mais Visualizados</h4>
                    </div>
                    <ul className="space-y-2">{pixel.topViewed.map((item: string, i: number) => (<li key={i} className="text-xs font-bold text-slate-600 dark:text-gray-400 border-l-2 border-[#EA2831]/20 pl-3 py-1">{item}</li>))}</ul>
                </div>
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-[#EA2831]"><ShoppingBag className="w-4 h-4" /></div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Colocou na Sacola</h4>
                    </div>
                    <ul className="space-y-2">{pixel.addedToCart.map((item: string, i: number) => (<li key={i} className="text-xs font-bold text-slate-600 dark:text-gray-400 border-l-2 border-[#EA2831]/20 pl-3 py-1">{item}</li>))}</ul>
                </div>
                <div className="bg-white dark:bg-surface-dark p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-[#EA2831]"><Trash2 className="w-4 h-4" /></div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Removeu da Sacola</h4>
                    </div>
                    <ul className="space-y-2">{pixel.removedFromCart.map((item: string, i: number) => (<li key={i} className="text-xs font-bold text-slate-600 dark:text-gray-400 border-l-2 border-[#EA2831]/20 pl-3 py-1">{item}</li>))}</ul>
                </div>
            </div>
            <div className="bg-slate-50 dark:bg-gray-800/30 p-8 rounded-[32px] border border-gray-200 dark:border-gray-800">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-[#EA2831]" /> Padrão de Atividade</h3>
                <div className="flex flex-col md:flex-row gap-8 justify-around items-center">
                    <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase mb-2">Dia Mais Ativo</p><p className="text-3xl font-black text-slate-900 dark:text-white">{pixel.mostActiveDay}</p></div>
                    <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                    <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase mb-2">Horário de Pico</p><p className="text-3xl font-black text-slate-900 dark:text-white">{pixel.activeHours}</p></div>
                    <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                    <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase mb-2">Plataforma</p><p className="text-xl font-black text-slate-900 dark:text-white">{pixel.platform}</p></div>
                </div>
            </div>
        </div>
    );
};
