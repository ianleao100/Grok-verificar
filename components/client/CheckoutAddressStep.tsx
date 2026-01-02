
import React, { useState } from 'react';
import { AddressManager } from '../common/AddressManager';
import { CheckoutMap } from './checkout/CheckoutMap';

interface CheckoutAddressStepProps {
    onBack: () => void;
    onNext: () => void;
    deliveryMethod: 'DELIVERY' | 'PICKUP';
    setDeliveryMethod: (m: 'DELIVERY' | 'PICKUP') => void;
    coordinates: { lat: number; lng: number };
    savedAddresses: any[];
    selectedAddressId: string;
    handleSelectAddress: (id: string) => void;
    handleEditAddress: (addr: any) => void;
    saveAddress: (addr: any) => void;
    subtotal: number;
    deliveryFee: number;
    total: number;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const CheckoutAddressStep: React.FC<CheckoutAddressStepProps> = ({
    onBack, onNext, deliveryMethod, setDeliveryMethod, coordinates, savedAddresses,
    selectedAddressId, handleSelectAddress, handleEditAddress, saveAddress,
    subtotal, deliveryFee, total
}) => {
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddressData, setEditingAddressData] = useState<any>(undefined);

    return (
        <div className="relative min-h-screen flex flex-col w-full overflow-x-hidden bg-[#f8f6f6] dark:bg-background-dark pb-32">
            <header className="sticky top-0 z-40 bg-[#f8f6f6]/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white"><Icon name="arrow_back" className="text-2xl" /></button>
                    <h1 className="text-lg font-bold tracking-tight flex-1 text-center pr-10 text-slate-900 dark:text-white">Entrega</h1>
                </div>
            </header>
            <main className="flex-1 flex flex-col gap-6 p-4">
                <section>
                    <div className="flex p-1 bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-xl">
                        <button onClick={() => setDeliveryMethod('DELIVERY')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${deliveryMethod === 'DELIVERY' ? 'bg-[#ea2a33]/10 text-[#ea2a33] shadow-sm' : 'text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'}`}>Entrega</button>
                        <button onClick={() => setDeliveryMethod('PICKUP')} className={`flex-1 py-2 text-sm font-medium transition-all rounded-lg ${deliveryMethod === 'PICKUP' ? 'bg-[#ea2a33]/10 text-[#ea2a33] shadow-sm' : 'text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'}`}>Retirada</button>
                    </div>
                </section>
                {deliveryMethod === 'DELIVERY' && (
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-6 h-full">
                        <div className="md:col-span-2 order-1 md:order-2">
                            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 h-full flex flex-col gap-3">
                                <div className="flex items-center justify-between"><h2 className="text-base font-bold text-slate-900 dark:text-white">Localização no Mapa</h2></div>
                                <CheckoutMap coordinates={coordinates} savedAddresses={savedAddresses} />
                            </div>
                        </div>
                        <div className="md:col-span-1 flex flex-col gap-4 order-2 md:order-1">
                            <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 flex flex-col gap-4">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Endereço de Entrega</h2>
                                <div className="flex flex-col gap-3">
                                    {savedAddresses.map(addr => (
                                        <div key={addr.id} onClick={() => handleSelectAddress(addr.id)} className={`flex items-center gap-4 p-4 rounded-xl shadow-sm cursor-pointer transition-all border ${selectedAddressId === addr.id ? 'bg-[#f8f6f6] dark:bg-background-dark border-[#ea2a33]/20' : 'bg-white dark:bg-surface-dark border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? 'bg-[#ea2a33]/10' : 'bg-gray-100 dark:bg-gray-800'}`}><span className={`material-symbols-outlined ${selectedAddressId === addr.id ? 'text-[#ea2a33]' : 'text-gray-500'}`}>{addr.icon || 'home'}</span></div>
                                            <div className="flex-1 min-w-0">
                                                {selectedAddressId === addr.id && (<p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">Selecionado<span className="material-symbols-outlined text-[12px] text-[#ea2a33] filled-icon">check_circle</span></p>)}
                                                <p className={`text-sm font-bold truncate ${selectedAddressId === addr.id ? 'text-slate-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{addr.label}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{addr.street}, {addr.number} - {addr.district}</p>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); setEditingAddressData(addr); setIsAddingAddress(true); }} className="shrink-0 p-2 text-gray-400 hover:text-[#ea2a33] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><Icon name="edit" className="text-[18px]" /></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => { setEditingAddressData(undefined); setIsAddingAddress(true); }} className="flex items-center justify-center gap-2 w-full p-3.5 rounded-xl border border-dashed border-[#ea2a33]/40 hover:bg-[#ea2a33]/5 text-[#ea2a33] font-bold text-sm transition-all group"><span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_location_alt</span>Novo Endereço</button>
                            </div>
                            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-base">Resumo do Pedido</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Subtotal</span><span className="font-bold text-slate-900 dark:text-white">R$ {subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Taxa de entrega</span><span className="font-bold text-slate-900 dark:text-white">R$ {deliveryFee.toFixed(2)}</span></div>
                                </div>
                                <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>
                                <div className="flex justify-between items-center"><span className="font-bold text-lg text-slate-900 dark:text-white">Total</span><span className="font-bold text-xl text-[#ea2a33]">R$ {total.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                )}
                {deliveryMethod === 'PICKUP' && (
                    <div className="flex flex-col items-center justify-center py-10 text-center gap-4 animate-[fadeIn_0.3s]">
                        <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-2"><Icon name="storefront" className="text-5xl text-orange-500" /></div>
                        <div><h3 className="font-bold text-xl text-slate-900 dark:text-white">Retirada na Loja</h3><p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">Dirija-se ao balcão para retirar seu pedido assim que estiver pronto.</p></div>
                    </div>
                )}
            </main>
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] border-t border-black/5 dark:border-white/5 px-4 pt-4 pb-8 z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] w-full lg:max-w-md mx-auto">
                <button onClick={onNext} disabled={deliveryMethod === 'DELIVERY' && !selectedAddressId} className="w-full bg-[#ea2a33] hover:bg-red-600 text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all flex items-center justify-between px-6 group disabled:opacity-50 disabled:shadow-none">
                    <span>Ir para Pagamento</span>
                    <div className="flex items-center gap-2"><span>R$ {total.toFixed(2)}</span><span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span></div>
                </button>
            </div>
            {isAddingAddress && (<AddressManager initialData={editingAddressData} onClose={() => setIsAddingAddress(false)} onSave={saveAddress} />)}
        </div>
    );
};
