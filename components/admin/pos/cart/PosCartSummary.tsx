
import React from 'react';
import { Receipt, Layers, Percent, Users, Minus, Plus, CheckCircle, ShoppingCart, Printer, Save, X } from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils/mathEngine';

interface PosCartSummaryProps {
    subtotal: number;
    finalTotal: number;
    totalPerPerson: number;
    
    // Fees & Configs
    serviceFee: number; setServiceFee: (v: number) => void;
    serviceFeeType: 'BRL' | 'PERCENT'; setServiceFeeType: (v: 'BRL' | 'PERCENT') => void;
    coverCharge: number; setCoverCharge: (v: number) => void;
    coverChargeType: 'BRL' | 'PERCENT'; setCoverChargeType: (v: 'BRL' | 'PERCENT') => void;
    discount: number; setDiscount: (v: number) => void;
    discountType: 'BRL' | 'PERCENT'; setDiscountType: (v: 'BRL' | 'PERCENT') => void;
    splitCount: number; setSplitCount: (v: number) => void;
    
    // Calculated Display Values
    calculatedServiceFee: number;
    calculatedCoverCharge: number;
    calculatedDiscount: number;

    // Selection
    selectedIndicesLength: number;
    selectedSubtotal: number;

    // UI
    showExtraOptions: boolean;
    setShowExtraOptions: (v: boolean) => void;
    cartLength: number;
    isTableView?: boolean;

    // Actions
    onPayIndividual: () => void;
    onPrintIndividual: () => void;
    onPayFull: () => void;
    onPrint: () => void;
    onSaveToTable?: () => void;
}

export const PosCartSummary: React.FC<PosCartSummaryProps> = (props) => {
    const inputConfigClasses = "w-full pl-9 pr-14 py-3 bg-white dark:bg-gray-800 border border-slate-900 dark:border-gray-600 rounded-xl focus:ring-1 focus:ring-primary text-sm font-black text-slate-900 dark:text-white transition-all h-[46px]";
    const summaryLabelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest";
    const summaryValueClass = "text-[10px] font-black text-slate-600 dark:text-gray-300";

    const renderToggle = (type: 'BRL' | 'PERCENT', onToggle: () => void) => (
        <button onClick={onToggle} className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-primary text-white shadow-sm hover:bg-red-600 transition-all font-black text-xs min-w-[36px]">
            {type === 'BRL' ? '%' : 'R$'}
        </button>
    );

    return (
        <div className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 flex flex-col">
            {props.showExtraOptions && (
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 animate-[slideUp_0.2s_ease-out] bg-gray-50/30 dark:bg-surface-dark transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <h5 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Configurações da Venda</h5>
                        <button onClick={() => props.setShowExtraOptions(false)} className="text-slate-300 hover:text-red-500"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 dark:text-gray-300 uppercase flex items-center gap-2"><Receipt className="w-3 h-3 text-slate-400" /> Taxa Serviço</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">{props.serviceFeeType === 'BRL' ? 'R$' : '%'}</span>
                                <input type="number" step="0.01" value={props.serviceFee || ''} onChange={(e) => props.setServiceFee(parseFloat(e.target.value) || 0)} className={inputConfigClasses} placeholder="0,00" />
                                {renderToggle(props.serviceFeeType, () => props.setServiceFeeType(props.serviceFeeType === 'BRL' ? 'PERCENT' : 'BRL'))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 dark:text-gray-300 uppercase flex items-center gap-2"><Layers className="w-3 h-3 text-slate-400" /> Couvert</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">{props.coverChargeType === 'BRL' ? 'R$' : '%'}</span>
                                <input type="number" step="0.01" value={props.coverCharge || ''} onChange={(e) => props.setCoverCharge(parseFloat(e.target.value) || 0)} className={inputConfigClasses} placeholder="0,00" />
                                {renderToggle(props.coverChargeType, () => props.setCoverChargeType(props.coverChargeType === 'BRL' ? 'PERCENT' : 'BRL'))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 dark:text-gray-300 uppercase flex items-center gap-2"><Percent className="w-3 h-3 text-slate-400" /> Desconto</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">{props.discountType === 'BRL' ? 'R$' : '%'}</span>
                                <input type="number" step="0.01" value={props.discount || ''} onChange={(e) => props.setDiscount(parseFloat(e.target.value) || 0)} className={inputConfigClasses} placeholder="0,00" />
                                {renderToggle(props.discountType, () => props.setDiscountType(props.discountType === 'BRL' ? 'PERCENT' : 'BRL'))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 dark:text-gray-300 uppercase flex items-center gap-2"><Users className="w-3 h-3 text-slate-400" /> Dividir</label>
                            <div className="relative">
                                <button onClick={() => props.setSplitCount(Math.max(1, props.splitCount - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-primary text-white shadow-sm hover:bg-red-700 transition-all font-black text-xs min-w-[36px] flex items-center justify-center z-10"><Minus className="w-3 h-3 stroke-[3]" /></button>
                                <input type="text" readOnly value={props.splitCount} className={`${inputConfigClasses} text-center !px-12`} />
                                <button onClick={() => props.setSplitCount(props.splitCount + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-primary text-white shadow-sm hover:bg-red-700 transition-all font-black text-xs min-w-[36px] flex items-center justify-center z-10"><Plus className="w-3 h-3 stroke-[3]" /></button>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => props.setShowExtraOptions(false)} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-red-600 transition-all active:scale-95">Salvar Configurações</button>
                </div>
            )}

            <div className="p-8 space-y-4">
                <button onClick={() => props.setShowExtraOptions(!props.showExtraOptions)} className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-red-700 uppercase tracking-widest transition-colors mb-1 group">
                    <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">{props.showExtraOptions ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}</div>
                    {props.showExtraOptions ? 'OCULTAR OPÇÕES' : 'MAIS OPÇÕES DE CHECKOUT'}
                </button>

                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <span className={summaryLabelClass}>SUBTOTAL</span>
                        <span className={summaryValueClass}>{formatCurrency(props.subtotal)}</span>
                    </div>
                    {(props.calculatedServiceFee > 0 || props.calculatedCoverCharge > 0 || props.calculatedDiscount > 0 || props.splitCount > 1) && (
                        <div className="space-y-1 pb-1 border-b border-gray-50 dark:border-gray-800 transition-all mb-1">
                            {props.calculatedServiceFee > 0 && <div className="flex justify-between items-center"><span className={summaryLabelClass}>Taxa de Serviço</span><span className={summaryValueClass}>+ {formatCurrency(props.calculatedServiceFee)}</span></div>}
                            {props.calculatedCoverCharge > 0 && <div className="flex justify-between items-center"><span className={summaryLabelClass}>Couvert</span><span className={summaryValueClass}>+ {formatCurrency(props.calculatedCoverCharge)}</span></div>}
                            {props.calculatedDiscount > 0 && <div className="flex justify-between items-center"><span className={`${summaryLabelClass} text-green-500`}>Desconto</span><span className={`${summaryValueClass} text-green-600`}>- {formatCurrency(props.calculatedDiscount)}</span></div>}
                            {props.splitCount > 1 && <div className="flex justify-between items-center"><span className={summaryLabelClass}>Dividir ({props.splitCount}x)</span><span className={summaryValueClass}>{formatCurrency(props.totalPerPerson)} /pessoa</span></div>}
                        </div>
                    )}
                    <div className="flex justify-between items-end pt-1">
                        <div className="flex flex-col">
                            <span className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Total Geral</span>
                            {props.selectedIndicesLength > 0 && <span className="text-[10px] font-bold text-primary mt-1 uppercase tracking-wider">Itens Selecionados: {formatCurrency(props.selectedSubtotal)}</span>}
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-primary font-display tracking-tight leading-none">{formatCurrency(props.finalTotal)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {props.selectedIndicesLength > 0 ? (
                        <div className="flex gap-4 items-center">
                            <button onClick={props.onPayIndividual} className="flex-1 bg-primary text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-red-700 animate-[fadeIn_0.2s]">
                                <Receipt className="w-6 h-6" />
                                <span className="tracking-tight text-lg uppercase">PAGAR INDIVIDUAL ({formatCurrency(props.selectedSubtotal)})</span>
                            </button>
                            <button onClick={props.onPrintIndividual} className="p-5 bg-white dark:bg-surface-dark text-primary rounded-2xl hover:bg-primary/5 transition-all active:scale-90 shadow-sm border border-primary" title="Imprimir Cupom Individual"><Printer className="w-6 h-6" /></button>
                        </div>
                    ) : (
                        props.isTableView && props.onSaveToTable ? (
                            <div className="space-y-3">
                                <div className="flex gap-4 items-center">
                                    <button onClick={props.onSaveToTable} disabled={props.cartLength === 0} className="flex-1 bg-white border-2 border-primary text-primary font-black py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-[0.98] group shadow-sm hover:bg-primary/5">
                                        <Save className="w-5 h-5" />
                                        <span className="tracking-tight text-base uppercase">LANÇAR NA MESA</span>
                                    </button>
                                    <button onClick={props.onPrint} className="p-5 bg-white dark:bg-surface-dark text-primary rounded-2xl hover:bg-primary/5 transition-all active:scale-90 shadow-sm border border-primary" title="Imprimir Pré-Conta"><Printer className="w-6 h-6" /></button>
                                </div>
                                <button onClick={props.onPayFull} disabled={props.cartLength === 0} className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:grayscale disabled:opacity-50 transition-all active:scale-[0.98] hover:bg-red-600">
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="tracking-tight text-lg uppercase">ENCERRAR CONTA</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <button onClick={props.onPayFull} disabled={props.cartLength === 0} className="flex-1 bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:grayscale disabled:opacity-50 transition-all active:scale-[0.98] group">
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="tracking-tight text-base uppercase">FINALIZAR VENDA</span>
                                </button>
                                <button onClick={props.onPrint} className="p-5 bg-white dark:bg-surface-dark text-primary rounded-2xl hover:bg-primary/5 transition-all active:scale-90 shadow-sm border border-primary"><Printer className="w-6 h-6" /></button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
