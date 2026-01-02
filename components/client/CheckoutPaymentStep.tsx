
import React from 'react';
import { PaymentSelector } from './checkout/PaymentSelector';
import { PaymentMethodType } from '../../types';

interface CheckoutPaymentStepProps {
    onBack: () => void;
    paymentSelections: any[];
    activePaymentIdToUpdate: number | null;
    total: number;
    subtotal: number;
    deliveryFee: number;
    usePoints: boolean;
    setUsePoints: (v: boolean) => void;
    pointsDiscountValue: number;
    userProfile: any;
    onSetActivePaymentId: (id: number | null) => void;
    onAddPaymentMethod: () => void;
    onRemovePaymentMethod: (id: number) => void;
    onUpdateMethod: (id: number, method: PaymentMethodType) => void;
    onUpdateValue: (id: number, val: number) => void;
    onUpdateField: (id: number, field: string, val: any) => void;
    finalizeCheckout: () => void;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const CheckoutPaymentStep: React.FC<CheckoutPaymentStepProps> = ({
    onBack, paymentSelections, activePaymentIdToUpdate, total, subtotal, deliveryFee,
    usePoints, setUsePoints, pointsDiscountValue, userProfile,
    onSetActivePaymentId, onAddPaymentMethod, onRemovePaymentMethod, onUpdateMethod,
    onUpdateValue, onUpdateField, finalizeCheckout
}) => {
    return (
        <div className="relative min-h-screen flex flex-col w-full max-w-md mx-auto overflow-x-hidden bg-[#f8f6f6] dark:bg-background-dark pb-32">
            <header className="sticky top-0 z-40 bg-[#f8f6f6]/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white"><Icon name="arrow_back" className="text-2xl" /></button>
                    <h1 className="text-lg font-bold tracking-tight flex-1 text-center pr-10 text-slate-900 dark:text-white">Pagamento</h1>
                </div>
            </header>
            <main className="flex-1 flex flex-col gap-6 p-4">
                <PaymentSelector 
                    paymentSelections={paymentSelections}
                    activePaymentIdToUpdate={activePaymentIdToUpdate}
                    total={total}
                    onSetActivePaymentId={onSetActivePaymentId}
                    onAddPaymentMethod={onAddPaymentMethod}
                    onRemovePaymentMethod={onRemovePaymentMethod}
                    onUpdateMethod={onUpdateMethod}
                    onUpdateValue={onUpdateValue}
                    onUpdateField={onUpdateField}
                />
                <section className="flex flex-col gap-3">
                    <h2 className="text-base font-semibold px-1 text-slate-900 dark:text-white">Ganhar Desconto</h2>
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-black/5 dark:border-white/5 p-4 flex flex-col gap-4">
                        <div className="flex gap-3"><div className="relative flex-1 group"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Icon name="local_offer" className="text-gray-500 dark:text-gray-400 transition-colors group-focus-within:text-[#ea2a33]" /></div><input className="block w-full pl-11 p-3.5 text-sm rounded-xl bg-gray-50 dark:bg-background-dark text-slate-900 dark:text-white placeholder:text-gray-400 border border-gray-200 dark:border-gray-700 focus:border-[#ea2a33] focus:ring-1 focus:ring-[#ea2a33] outline-none transition-all shadow-sm" placeholder="Adicionar cupom" type="text"/></div><button className="px-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-[#ea2a33] hover:bg-[#ea2a33] hover:text-white hover:border-[#ea2a33] transition-all shadow-sm">Aplicar</button></div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl">
                            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 text-yellow-600 dark:text-yellow-500"><Icon name="stars" /></div><div><p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Saldo de Pontos</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Você tem <span className="font-medium text-yellow-600 dark:text-yellow-500">{userProfile.points}</span> pontos</p></div></div>
                            <label className="relative inline-flex items-center cursor-pointer"><input className="sr-only peer" type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ea2a33]"></div></label>
                        </div>
                    </div>
                </section>
                <section className="flex flex-col gap-3">
                    <h2 className="text-base font-semibold px-1 text-slate-900 dark:text-white">Resumo do Valor</h2>
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-black/5 dark:border-white/5 p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm"><span className="text-gray-500 dark:text-gray-400">Subtotal</span><span className="font-medium text-slate-900 dark:text-white">R$ {subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center text-sm"><span className="text-gray-500 dark:text-gray-400">Taxa de entrega</span><span className="font-medium text-slate-900 dark:text-white">R$ {deliveryFee.toFixed(2)}</span></div>
                        {usePoints && (<div className="flex justify-between items-center text-sm"><span className="text-gray-500 dark:text-gray-400">Desconto Pontos</span><span className="font-medium text-green-600">- R$ {pointsDiscountValue.toFixed(2)}</span></div>)}
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                        <div className="flex justify-between items-center text-lg"><span className="font-bold text-slate-900 dark:text-white">Total</span><span className="font-bold text-[#ea2a33]">R$ {total.toFixed(2)}</span></div>
                    </div>
                </section>
            </main>
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] border-t border-black/5 dark:border-white/5 px-4 pt-4 pb-8 z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] w-full max-w-md mx-auto">
                <button onClick={finalizeCheckout} className="w-full bg-[#ea2a33] hover:bg-red-600 text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all flex items-center justify-between px-6 group">
                    <span>Fazer Pedido</span>
                    <div className="flex items-center gap-2"><span>R$ {total.toFixed(2)}</span><Icon name="arrow_forward" className="text-xl group-hover:translate-x-1 transition-transform" /></div>
                </button>
            </div>
        </div>
    );
};
