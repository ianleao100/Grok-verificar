
import React from 'react';
import { Truck, CheckCircle, AlertCircle, Archive, ChefHat, Clock } from 'lucide-react';
import { Product } from '../../../types';

interface ProductLogisticsSectionProps {
    formData: Partial<Product>;
    onChange: (field: keyof Product, value: any) => void;
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{children}</label>
);

export const ProductLogisticsSection: React.FC<ProductLogisticsSectionProps> = ({ formData, onChange }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-100">
                <Truck className="w-4 h-4 text-[#EA1D2C]" /> Logística & Cozinha
            </h3>

            {/* Status Switch */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {formData.available ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Status no Cardápio</p>
                        <p className="text-[9px] font-bold text-slate-400">{formData.available ? 'Disponível' : 'Esgotado'}</p>
                    </div>
                </div>
                <div onClick={() => onChange('available', !formData.available)} className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${formData.available ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.available ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
            </div>

            {/* Stock Control */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4 text-[#EA1D2C]" />
                        <span className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wide">Controle de Estoque</span>
                    </div>
                    <div onClick={() => onChange('stockControlEnabled', !formData.stockControlEnabled)} className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.stockControlEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.stockControlEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                </div>
                {formData.stockControlEnabled && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-gray-100 animate-[fadeIn_0.2s]">
                        <div><Label>Qtd Atual</Label><input type="number" value={formData.currentStock} onChange={e => onChange('currentStock', parseInt(e.target.value))} className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm font-bold" /></div>
                        <div><Label>Mínimo</Label><input type="number" value={formData.minStock} onChange={e => onChange('minStock', parseInt(e.target.value))} className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm font-bold" /></div>
                    </div>
                )}
            </div>

            {/* Prep Time */}
            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-[#EA1D2C]" />
                        <span className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wide">Necessita Preparo?</span>
                    </div>
                    <div onClick={() => onChange('needsPreparation', !formData.needsPreparation)} className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.needsPreparation ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.needsPreparation ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                </div>
                {formData.needsPreparation && (
                    <div className="pt-2 border-t border-dashed border-gray-100 animate-[fadeIn_0.2s]">
                        <Label>Tempo Médio (min)</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="number" value={formData.prepTime} onChange={e => onChange('prepTime', parseInt(e.target.value))} className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm font-bold" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
