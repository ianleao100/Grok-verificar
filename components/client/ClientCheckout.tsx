
import React from 'react';
import { Order } from '../../types';
import { useCartLogic } from '../../hooks/core/useCartLogic';
import { useCheckoutLogic } from '../../hooks/useCheckoutLogic';
import { CheckoutAddressStep } from './CheckoutAddressStep';
import { CheckoutPaymentStep } from './CheckoutPaymentStep';

interface ClientCheckoutProps {
    viewMode: 'CART' | 'CHECKOUT_DELIVERY' | 'CHECKOUT_PAYMENT';
    setViewMode: (mode: any) => void;
    cartLogic: ReturnType<typeof useCartLogic>;
    userProfile: any;
    savedAddresses: any[];
    setSavedAddresses: (addresses: any[]) => void;
    onCheckoutComplete: (order: Order) => void;
}

const Icon: React.FC<{ name: string, className?: string, style?: React.CSSProperties }> = ({ name, className = "", style }) => (
  <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
);

export const ClientCheckout: React.FC<ClientCheckoutProps> = ({
    viewMode,
    setViewMode,
    cartLogic,
    userProfile,
    savedAddresses,
    setSavedAddresses,
    onCheckoutComplete
}) => {
    const { 
        orderNotes, setOrderNotes,
        deliveryMethod, setDeliveryMethod,
        selectedAddressId,
        usePoints, setUsePoints,
        paymentSelections,
        activePaymentIdToUpdate, setActivePaymentIdToUpdate,
        coordinates,
        handleSelectAddress,
        handleEditAddress,
        saveAddress,
        handleAddPaymentMethod,
        handleRemovePaymentMethod,
        updatePaymentMethod,
        handlePaymentValueUpdate,
        handlePaymentFieldChange,
        finalizeCheckout
    } = useCheckoutLogic({
        cartLogic,
        userProfile,
        savedAddresses,
        setSavedAddresses,
        onCheckoutComplete
    });

    const { cart, updateQuantity, removeFromCart, subtotal, deliveryFee, total, pointsDiscountValue } = cartLogic;

    if (viewMode === 'CART') {
        return (
            <div className="relative min-h-screen flex flex-col w-full overflow-x-hidden bg-[#f8f6f6] dark:bg-background-dark pb-32">
                <header className="sticky top-0 z-40 bg-[#f8f6f6]/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-colors">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button onClick={() => setViewMode('MENU')} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white">
                            <Icon name="arrow_back" className="text-2xl" />
                        </button>
                        <h1 className="text-lg font-bold tracking-tight flex-1 text-center pr-10 text-slate-900 dark:text-white">Revisar Pedido</h1>
                    </div>
                </header>
                <main className="flex-1 flex flex-col gap-6 p-4">
                    <section className="flex flex-col gap-4">
                        <h2 className="text-base font-semibold px-1 text-slate-900 dark:text-white">Itens do Pedido</h2>
                        {cart.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">Seu carrinho está vazio.</div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex gap-4 p-3 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-black/5 dark:border-white/5 transition-colors">
                                    <div className="shrink-0"><div className="bg-center bg-no-repeat bg-cover rounded-xl w-20 h-20" style={{ backgroundImage: `url('${item.imageUrl}')` }}></div></div>
                                    <div className="flex flex-col flex-1 justify-between py-0.5">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-sm leading-tight text-slate-900 dark:text-white line-clamp-2">{item.name}</h3>
                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-500 dark:text-gray-400 hover:text-[#ea2a33] transition-colors"><Icon name="delete" className="text-xl" /></button>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[#ea2a33] font-bold text-sm">R$ {item.price.toFixed(2)}</span>
                                            <div className="flex items-center gap-3 bg-[#f8f6f6] dark:bg-background-dark rounded-lg px-2 py-1 border border-black/5 dark:border-white/5">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-[#ea2a33] hover:bg-[#ea2a33]/10 rounded-md transition-colors font-medium text-lg leading-none pb-0.5">-</button>
                                                <span className="text-sm font-semibold w-4 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-[#ea2a33] hover:bg-[#ea2a33]/10 rounded-md transition-colors font-medium text-lg leading-none pb-0.5">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>
                    {cart.length > 0 && (
                        <>
                            <section className="flex flex-col gap-2">
                                <h2 className="text-base font-semibold px-1 text-slate-900 dark:text-white">Observações</h2>
                                <div className="relative">
                                    <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} className="w-full bg-white dark:bg-surface-dark rounded-xl border-none focus:ring-1 focus:ring-[#ea2a33] text-sm p-4 min-h-[80px] text-slate-900 dark:text-white placeholder:text-gray-400 resize-none shadow-sm transition-colors" placeholder="Ex: Tirar a cebola, caprichar no molho..."></textarea>
                                </div>
                            </section>
                            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 mt-2">
                                <h2 className="text-base font-bold mb-4 text-slate-900 dark:text-white">Resumo do Pedido</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Subtotal</span><span className="font-bold text-slate-900 dark:text-white">R$ {subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Taxa de entrega</span><span className="font-bold text-slate-900 dark:text-white">R$ {deliveryFee.toFixed(2)}</span></div>
                                </div>
                                <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>
                                <div className="flex justify-between items-center"><span className="font-bold text-lg text-slate-900 dark:text-white">Total</span><span className="font-bold text-xl text-[#ea2a33]">R$ {total.toFixed(2)}</span></div>
                            </div>
                        </>
                    )}
                </main>
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] border-t border-black/5 dark:border-white/5 px-4 pt-4 pb-8 z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] w-full lg:max-w-md mx-auto transition-colors">
                    <button onClick={() => setViewMode('CHECKOUT_DELIVERY')} disabled={cart.length === 0} className="w-full bg-[#ea2a33] hover:bg-red-600 text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all flex items-center justify-between px-6 group disabled:opacity-50 disabled:shadow-none">
                        <span>Continuar para Entrega</span>
                        <div className="flex items-center gap-2"><span>R$ {total.toFixed(2)}</span><span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span></div>
                    </button>
                </div>
            </div>
        );
    }

    if (viewMode === 'CHECKOUT_DELIVERY') {
        return (
            <CheckoutAddressStep 
                onBack={() => setViewMode('CART')}
                onNext={() => setViewMode('CHECKOUT_PAYMENT')}
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                coordinates={coordinates}
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId}
                handleSelectAddress={handleSelectAddress}
                handleEditAddress={handleEditAddress}
                saveAddress={saveAddress}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
            />
        );
    }

    if (viewMode === 'CHECKOUT_PAYMENT') {
        return (
            <CheckoutPaymentStep 
                onBack={() => setViewMode('CHECKOUT_DELIVERY')}
                paymentSelections={paymentSelections}
                activePaymentIdToUpdate={activePaymentIdToUpdate}
                total={total}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                usePoints={usePoints}
                setUsePoints={setUsePoints}
                pointsDiscountValue={pointsDiscountValue}
                userProfile={userProfile}
                onSetActivePaymentId={setActivePaymentIdToUpdate}
                onAddPaymentMethod={handleAddPaymentMethod}
                onRemovePaymentMethod={handleRemovePaymentMethod}
                onUpdateMethod={updatePaymentMethod}
                onUpdateValue={handlePaymentValueUpdate}
                onUpdateField={handlePaymentFieldChange}
                finalizeCheckout={finalizeCheckout}
            />
        );
    }

    return null;
};
