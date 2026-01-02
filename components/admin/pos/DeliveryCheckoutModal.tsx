
import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { BaseModal } from '../../ui/BaseModal';
import { CartItem } from '../../../types';
import { useDeliveryCheckout } from '../../../hooks/pro/useDeliveryCheckout';
import DeliveryCustomerStep from './delivery/DeliveryCustomerStep';
import DeliveryMapStep from './delivery/DeliveryMapStep';
import DeliveryPaymentStep from './delivery/DeliveryPaymentStep';
import MapComponent from './delivery/MapComponent';

interface DeliveryCheckoutModalProps {
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  onConfirm: (orderData: any) => void;
  loyaltySystem: any; 
}

const FullscreenMapWrapper = ({ lat, lng, onClose }: { lat: number, lng: number, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-[fadeIn_0.2s]">
            <button onClick={onClose} className="absolute top-4 right-4 z-[10000] p-3 bg-white rounded-full shadow-lg hover:text-red-500 hover:bg-gray-50 transition-all border border-gray-100"><X className="w-6 h-6" /></button>
            <div className="w-full h-full relative">
                 <MapComponent lat={lat} lng={lng} onPositionChange={() => {}} manualSearchTerm="" setManualSearchTerm={() => {}} onManualSearch={() => {}} isLoading={false} isFullScreen={true} />
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10000]">
                <button onClick={onClose} className="bg-[#EA2831] text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95 flex items-center gap-3 text-lg"><CheckCircle className="w-6 h-6" /> CONFIRMAR LOCALIZAÇÃO</button>
            </div>
        </div>
    );
};

export default function DeliveryCheckoutModal(props: DeliveryCheckoutModalProps) {
  const { onClose } = props;
  const [isFullscreenMapOpen, setIsFullscreenMapOpen] = useState(false);

  const logic = useDeliveryCheckout({
      loyaltySystem: props.loyaltySystem,
      subtotal: props.subtotal,
      cart: props.cart,
      onConfirm: props.onConfirm
  });

  return (
    <BaseModal onClose={onClose} className="max-w-5xl w-full" hideCloseButton={true}>
        {isFullscreenMapOpen && <FullscreenMapWrapper lat={logic.geoCoords.lat} lng={logic.geoCoords.lng} onClose={() => setIsFullscreenMapOpen(false)} />}

        <div className="flex flex-col h-[85vh] bg-white dark:bg-surface-dark rounded-[32px] shadow-2xl overflow-hidden relative">
            <div className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-8 py-5 shrink-0 z-30 flex items-center justify-between relative">
                 <div className="flex flex-col"><h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Pedido Delivery</h2></div>
                 <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-4">
                        {[1, 2, 3].map(s => (
                            <React.Fragment key={s}>
                                <div className={`flex items-center gap-2 ${logic.step === s ? 'opacity-100 scale-105' : 'opacity-50'}`}>
                                    <div className={`size-6 rounded-full flex items-center justify-center border-2 font-black text-[10px] transition-all ${logic.step >= s ? 'bg-[#EA2831] border-[#EA2831] text-white' : 'bg-white border-slate-300 text-slate-400'}`}>{s}</div>
                                    <span className={`text-xs font-bold ${logic.step >= s ? 'text-[#EA2831]' : 'text-slate-400'}`}>{s === 1 ? 'Cliente' : s === 2 ? 'Endereço' : 'Pagamento'}</span>
                                </div>
                                {s < 3 && <div className="w-8 h-px bg-slate-200"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                 </div>
                 <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 px-8 pt-6 pb-28 overflow-y-auto no-scrollbar relative bg-white dark:bg-surface-dark">
                {logic.step === 1 && (
                    <DeliveryCustomerStep 
                        searchLogic={logic.searchLogic}
                        handleSearchChange={(e) => logic.searchLogic.handleSearch(e.target.value, logic.customerName)}
                        handleSelectSuggestion={logic.fillCustomerData}
                        customerName={logic.customerName} setCustomerName={logic.setCustomerName}
                        customerPhone={logic.customerPhone} setCustomerPhone={logic.setCustomerPhone}
                        customerPoints={logic.customerPoints}
                        savedAddresses={logic.savedAddresses} selectedAddressId={logic.selectedAddressId}
                        handleSelectAddress={logic.handleSelectAddress}
                        addressForm={logic.addressForm} updateAddressField={logic.updateAddressField}
                    />
                )}
                {logic.step === 2 && (
                    <DeliveryMapStep 
                        geoCoords={logic.geoCoords} setGeoCoords={logic.setGeoCoords}
                        manualMapSearch={logic.manualMapSearch} setManualMapSearch={logic.setManualMapSearch}
                        handleManualMapSearch={logic.handleManualMapSearchAction}
                        isLoadingGeo={logic.isLoadingGeo} onExpandMap={() => setIsFullscreenMapOpen(true)}
                    />
                )}
                {logic.step === 3 && (
                    <DeliveryPaymentStep 
                        subtotal={props.subtotal} totalValue={logic.totalValue}
                        deliveryFee={logic.deliveryFee} setDeliveryFee={logic.setDeliveryFee}
                        discount={logic.discount} setDiscount={logic.setDiscount}
                        discountType={logic.discountType} setDiscountType={logic.setDiscountType}
                        pointsToUse={logic.pointsToUse} setPointsToUse={logic.setPointsToUse}
                        paymentMethod={logic.paymentMethod} setPaymentMethod={logic.setPaymentMethod}
                        cashPaidAmount={logic.cashPaidAmount} setCashPaidAmount={logic.setCashPaidAmount}
                        changeValue={logic.changeValue} calculatedDiscount={logic.calculatedDiscount}
                        pointsDiscountValue={logic.pointsDiscountValue}
                        showMoreOptions={logic.showMoreOptions} setShowMoreOptions={logic.setShowMoreOptions}
                        customerPoints={logic.customerPoints}
                    />
                )}
            </div>

            <div className="absolute bottom-0 left-0 w-full px-8 py-6 z-40 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                {logic.step > 1 && (<button onClick={() => logic.setStep(logic.step - 1)} className="px-6 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-gray-100 hover:text-slate-900 transition-all uppercase text-xs tracking-widest border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark shadow-sm mr-auto">Voltar</button>)}
                {logic.step < 3 ? (
                    <button onClick={() => logic.setStep(prev => prev + 1)} disabled={logic.step === 1 && !logic.isStep1Valid} className="px-10 bg-[#EA2831] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl shadow-xl shadow-red-500/20 uppercase text-xs tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2">
                        {logic.isLoadingGeo ? 'Localizando...' : 'Avançar'}
                    </button>
                ) : (
                    <button onClick={logic.handleFinalize} className="px-10 bg-green-600 hover:bg-green-700 text-white font-black py-3.5 rounded-xl shadow-xl shadow-green-500/20 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95"><CheckCircle className="w-5 h-5" /> Concluir Pedido</button>
                )}
            </div>
        </div>
    </BaseModal>
  );
}
