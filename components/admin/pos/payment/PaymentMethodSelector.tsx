
import React from 'react';
import { User, Phone, Star, CreditCard, DollarSign, QrCode, CheckCircle, AlertTriangle, X, Sparkles, Banknote } from 'lucide-react';
import { formatCurrency, maskPhone } from '../../../../shared/utils/mathEngine';
import { PaymentMethodType } from '../../../../types';

interface PaymentMethodSelectorProps {
    customerName: string; setCustomerName: (n: string) => void;
    customerWhatsapp: string; setCustomerWhatsapp: (w: string) => void;
    customerPoints?: number;
    pointsToUse: number; handlePointsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    pointsDiscount: number;
    setPointsToUse: (val: number) => void;
    values: Record<string, string>;
    handleUpdateValue: (method: string, val: string) => void;
    setTotalOnMethod: (method: string) => void;
    sum: number;
    isPaid: boolean;
    isSurplus: boolean;
    isValidChange: boolean;
    canFinalize: boolean;
    balance: number;
    onConfirm: () => void;
    onClose: () => void;
    totalToReceive: number; // Used for calculating defaults if needed
}

const METHODS = [
    { id: 'PIX', label: 'PIX', icon: QrCode, color: 'text-primary bg-red-50' },
    { id: 'CASH', label: 'Dinheiro', icon: DollarSign, color: 'text-primary bg-red-50' },
    { id: 'CREDIT', label: 'Cartão de Crédito', icon: CreditCard, color: 'text-primary bg-red-50' },
    { id: 'DEBIT', label: 'Cartão de Débito', icon: CreditCard, color: 'text-primary bg-red-50' },
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = (props) => {
    return (
        <div className="flex-1 p-10 flex flex-col gap-8 bg-white dark:bg-surface-dark overflow-y-auto no-scrollbar relative">
            <button onClick={props.onClose} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:text-red-500 z-20"><X className="w-5 h-5" /></button>

            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black tracking-tight leading-tight">Pagamento</h2>
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Identificação do Cliente</p>
                        {props.customerPoints !== undefined && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
                                <Sparkles className="w-3 h-3 fill-current" /> {props.customerPoints} pontos
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><User className="w-3 h-3" /> Nome</label>
                    <input type="text" value={props.customerName} onChange={(e) => props.setCustomerName(e.target.value)} placeholder="Nome do Cliente" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary rounded-2xl font-bold text-slate-900 dark:text-white transition-all shadow-sm" />
                </div>
                <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Phone className="w-3 h-3" /> WhatsApp</label>
                    <input type="text" value={props.customerWhatsapp} onChange={(e) => props.setCustomerWhatsapp(maskPhone(e.target.value))} placeholder="(00) 00000-0000" maxLength={15} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary rounded-2xl font-bold text-slate-900 dark:text-white transition-all shadow-sm" />
                </div>
            </div>

            {props.customerPoints !== undefined && props.customerPoints > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-xl text-yellow-600"><Star className="w-5 h-5 fill-current" /></div>
                        <div><p className="text-[10px] font-black uppercase text-yellow-700 dark:text-yellow-500 tracking-widest">Usar Pontos</p><p className="text-xs text-slate-500 font-bold">Saldo: {props.customerPoints}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-24">
                            <input type="number" value={props.pointsToUse || ''} onChange={props.handlePointsChange} placeholder="0" className="w-full pl-3 pr-8 py-2 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 rounded-xl text-sm font-black focus:ring-1 focus:ring-yellow-500 text-slate-900 dark:text-white" />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">pts</span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-xl border border-yellow-200 dark:border-yellow-800 min-w-[80px] text-center">
                            <span className="text-xs font-black text-green-600">= {formatCurrency(props.pointsDiscount)}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Distribuir Valores</h3>
                <div className="grid grid-cols-2 gap-3">
                    {METHODS.map(method => (
                        <div key={method.id} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${parseFloat(props.values[method.id]) > 0 ? 'border-primary bg-primary/5' : 'border-gray-50 dark:border-gray-800 hover:border-gray-200'}`}>
                            <div className={`p-2.5 rounded-xl shrink-0 ${method.color}`}><method.icon className="w-4 h-4" /></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{method.label}</p>
                                <div className="relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs">R$</span>
                                    <input type="number" step="0.01" value={props.values[method.id]} onChange={(e) => props.handleUpdateValue(method.id, e.target.value)} placeholder="0,00" className="w-full pl-5 py-0.5 bg-transparent border-none focus:ring-0 font-black text-base text-slate-900 dark:text-white" />
                                </div>
                            </div>
                            <button onClick={() => props.setTotalOnMethod(method.id)} className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg text-[8px] font-black text-slate-500 hover:text-primary hover:border-primary active:scale-90 transition-all uppercase">Quitar</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-[32px] flex items-center justify-between border border-gray-100 dark:border-gray-800">
                    <div className="flex gap-8">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Pago</span>
                            <span className={`text-2xl font-black ${props.isPaid ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>{formatCurrency(props.sum)}</span>
                        </div>
                    </div>
                    
                    {props.isSurplus ? (
                        props.isValidChange ? (
                            <div className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border-2 bg-green-50 border-green-200 text-green-600 animate-[pulse_1s_ease-in-out]">
                                <CheckCircle className="w-4 h-4" /> Sobrou: {formatCurrency(Math.abs(props.balance))}
                            </div>
                        ) : (
                            <div className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border-2 bg-red-50 border-red-200 text-red-600">
                                <AlertTriangle className="w-4 h-4" /> Sem Troco Digital
                            </div>
                        )
                    ) : !props.isPaid ? (
                        <div className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border-2 bg-red-50 border-red-200 text-red-600">
                            <AlertTriangle className="w-4 h-4" /> Faltam: {formatCurrency(Math.abs(props.balance))}
                        </div>
                    ) : (
                        <div className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border-2 bg-gray-100 border-gray-200 text-gray-500">
                            Conta Liquidada
                        </div>
                    )}
                </div>

                <button 
                    onClick={props.onConfirm}
                    disabled={!props.canFinalize}
                    className="w-full bg-[#EA2831] hover:bg-red-600 text-white font-black py-6 rounded-3xl shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:grayscale disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-lg uppercase tracking-[0.2em]">CONFIRMAR E FINALIZAR</span>
                </button>
            </div>
        </div>
    );
};
