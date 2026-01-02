
import React, { useState, useEffect } from 'react';
import { DollarSign, Trash2, Plus, ChevronDown } from 'lucide-react';
import { Product, ProductVariant } from '../../../types';

interface ProductPricingSectionProps {
    pricingMode: 'SIMPLE' | 'VARIANTS';
    setPricingMode: (mode: 'SIMPLE' | 'VARIANTS') => void;
    formData: Partial<Product>;
    onChange: (field: keyof Product, value: any) => void;
    variants: ProductVariant[];
    setVariants: (variants: ProductVariant[]) => void;
    visibleFields: any;
    setVisibleFields: React.Dispatch<React.SetStateAction<any>>;
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{children}</label>
);

export const ProductPricingSection: React.FC<ProductPricingSectionProps> = ({
    pricingMode, setPricingMode, formData, onChange, variants, setVariants, visibleFields, setVisibleFields
}) => {
    const [isUnitOpen, setIsUnitOpen] = useState(false);
    const [variantVisibility, setVariantVisibility] = useState<Record<string, { costs: boolean, discount: boolean, sku: boolean }>>({});

    const unitOptions = [{ value: 'UN', label: 'Unidade (un)' }, { value: 'KG', label: 'Quilo (kg)' }, { value: 'G', label: 'Grama (g)' }];

    const addVariant = () => {
        const newId = Date.now().toString();
        setVariants([...variants, { id: newId, name: '', price: 0, costPrice: 0, packagingFee: 0, laborCost: 0, cardFee: 0, discount: 0, discountType: 'FIXED', sku: '' }]);
        setVariantVisibility(prev => ({ ...prev, [newId]: { costs: true, discount: true, sku: true } }));
    };

    const updateVariant = (id: string, field: keyof ProductVariant, value: any) => {
        setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const toggleVarField = (id: string, field: 'costs' | 'discount' | 'sku') => {
        setVariantVisibility(prev => ({ ...prev, [id]: { ...prev[id], [field]: !prev[id]?.[field] } }));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2"><DollarSign className="w-4 h-4 text-[#EA2831]" /> Precificação</h3>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
                    <button onClick={() => setPricingMode('SIMPLE')} className={`px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${pricingMode === 'SIMPLE' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>Simples</button>
                    <button onClick={() => setPricingMode('VARIANTS')} className={`px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${pricingMode === 'VARIANTS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>Variantes</button>
                </div>
            </div>

            {pricingMode === 'SIMPLE' ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                            <Label>Preço Venda</Label>
                            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs">R$</span><input type="number" value={formData.price} onChange={e => onChange('price', parseFloat(e.target.value))} className="w-full pl-8 pr-3 py-2 bg-white dark:bg-gray-800 border-none rounded-lg font-black text-lg text-slate-900 dark:text-white focus:ring-1 focus:ring-[#EA2831]" placeholder="0.00" /></div>
                        </div>
                        <div className="w-1/3 relative">
                            <Label>Unidade</Label>
                            <button type="button" onClick={() => setIsUnitOpen(!isUnitOpen)} className="w-full pl-3 pr-6 py-2 bg-white dark:bg-gray-800 border-none rounded-lg font-bold text-xs text-slate-700 dark:text-white focus:ring-1 focus:ring-[#EA2831] text-left truncate relative h-[44px]">
                                {unitOptions.find(o => o.value === formData.measureUnit)?.label || 'Un'} <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                            </button>
                            {isUnitOpen && <div className="absolute top-full right-0 w-40 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">{unitOptions.map((opt) => (<button key={opt.value} onClick={() => { onChange('measureUnit', opt.value); setIsUnitOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold border-l-2 border-transparent hover:border-[#EA1D2C] hover:text-[#EA1D2C] hover:bg-red-50 transition-all">{opt.label}</button>))}</div>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setVisibleFields((prev: any) => ({...prev, discount: !prev.discount}))} className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${visibleFields.discount ? 'bg-red-50 border-red-200 text-[#EA1D2C]' : 'border-gray-200 text-slate-400 bg-white'}`}>+ Promoção</button>
                        <button onClick={() => setVisibleFields((prev: any) => ({...prev, costs: !prev.costs}))} className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${visibleFields.costs ? 'bg-red-50 border-red-200 text-[#EA1D2C]' : 'border-gray-200 text-slate-400 bg-white'}`}>+ Custos</button>
                    </div>
                    {visibleFields.discount && <div className="mt-3 p-3 bg-white rounded-lg border border-red-100 animate-[fadeIn_0.2s]"><div className="flex justify-between items-center mb-1"><span className="text-[9px] font-bold text-[#EA1D2C] uppercase">Desconto</span><div className="flex bg-gray-100 rounded p-0.5"><button onClick={() => onChange('discountType', 'FIXED')} className={`px-2 py-0.5 text-[8px] font-bold rounded ${formData.discountType === 'FIXED' ? 'bg-[#EA1D2C] text-white' : 'text-slate-400'}`}>R$</button><button onClick={() => onChange('discountType', 'PERCENT')} className={`px-2 py-0.5 text-[8px] font-bold rounded ${formData.discountType === 'PERCENT' ? 'bg-[#EA1D2C] text-white' : 'text-slate-400'}`}>%</button></div></div><input type="number" value={formData.discount} onChange={(e) => onChange('discount', parseFloat(e.target.value))} className="w-full px-2 py-1.5 bg-gray-50 border-none rounded text-sm font-bold text-[#EA1D2C] placeholder-red-200" placeholder="0" /></div>}
                </div>
            ) : (
                <div className="space-y-4">
                    {variants.map((v) => {
                        const visibility = variantVisibility[v.id] || { costs: false, discount: false, sku: false };
                        return (
                            <div key={v.id} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-3 animate-[fadeIn_0.2s]">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex-1"><Label>Nome da Variante</Label><input value={v.name} onChange={(e) => updateVariant(v.id, 'name', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-bold border-none shadow-sm focus:ring-1 focus:ring-[#EA2831]" placeholder="Ex: Grande" /></div>
                                    <div className="w-24"><Label>Preço</Label><input type="number" value={v.price} onChange={(e) => updateVariant(v.id, 'price', parseFloat(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-bold text-center border-none shadow-sm focus:ring-1 focus:ring-[#EA2831]" placeholder="R$" /></div>
                                    <div className="mt-5"><button onClick={() => setVariants(variants.filter(vt => vt.id !== v.id))} className="p-2 text-[#EA1D2C] bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></div>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    {['discount', 'costs', 'sku'].map(field => (
                                        <button key={field} onClick={() => toggleVarField(v.id, field as any)} className={`px-2 py-1 rounded text-[9px] font-bold border transition-all ${visibility[field as keyof typeof visibility] ? 'bg-red-50 border-red-200 text-[#EA1D2C]' : 'bg-white border-gray-200 text-slate-400'}`}>+ {field === 'discount' ? 'Desconto' : field === 'costs' ? 'Custos' : 'SKU'}</button>
                                    ))}
                                </div>
                                {visibility.discount && <div className="p-2 bg-white rounded-lg border border-red-100 mb-2 animate-[fadeIn_0.2s]"><div className="flex justify-between items-center mb-1"><span className="text-[9px] font-bold text-[#EA1D2C] uppercase">Promoção</span><div className="flex bg-gray-100 rounded p-0.5"><button onClick={() => updateVariant(v.id, 'discountType', 'FIXED')} className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${v.discountType === 'FIXED' ? 'bg-[#EA1D2C] text-white' : 'text-slate-400'}`}>R$</button><button onClick={() => updateVariant(v.id, 'discountType', 'PERCENT')} className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${v.discountType === 'PERCENT' ? 'bg-[#EA1D2C] text-white' : 'text-slate-400'}`}>%</button></div></div><input type="number" value={v.discount} onChange={(e) => updateVariant(v.id, 'discount', parseFloat(e.target.value))} className="w-full px-2 py-1 bg-gray-50 border-none rounded text-xs font-bold text-[#EA1D2C]" placeholder="0" /></div>}
                            </div>
                        );
                    })}
                    <button onClick={addVariant} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#EA1D2C] hover:border-[#EA1D2C] hover:bg-red-50 transition-all flex items-center justify-center gap-2"><Plus className="w-3 h-3" /> Adicionar Variante</button>
                </div>
            )}
        </div>
    );
};
