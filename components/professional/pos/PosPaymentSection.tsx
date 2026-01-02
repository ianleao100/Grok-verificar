
import React from 'react';
import PaymentModule from '../../admin/pos/PaymentModule';
import DeliveryCheckoutModal from '../../admin/pos/DeliveryCheckoutModal';
import { CartItem } from '../../../types';

interface PosPaymentSectionProps {
    paymentState: { subtotal: number, serviceFee: number, coverCharge: number, indices?: number[] } | null;
    isDeliveryModalOpen: boolean;
    setPaymentState: (state: any) => void;
    setIsDeliveryModalOpen: (open: boolean) => void;
    
    // Data Props
    cart: CartItem[];
    customerData: { name: string; whatsapp: string };
    updateCustomer: (data: Partial<{ name: string; whatsapp: string }>) => void;
    activeCustomerPoints?: number;
    
    // Handlers
    onProcessPaymentSuccess: (payments: any, meta: any) => void;
    onDeliveryComplete: (orderData: any) => void;
    
    // Systems
    loyaltySystem: any;
    roundFinance: (val: number) => number;
}

export const PosPaymentSection: React.FC<PosPaymentSectionProps> = ({
    paymentState,
    isDeliveryModalOpen,
    setPaymentState,
    setIsDeliveryModalOpen,
    cart,
    customerData,
    updateCustomer,
    activeCustomerPoints,
    onProcessPaymentSuccess,
    onDeliveryComplete,
    loyaltySystem,
    roundFinance
}) => {
    return (
        <>
            {paymentState && (
                <PaymentModule 
                    cart={paymentState.indices ? cart.filter((_, i) => paymentState.indices!.includes(i)) : cart} 
                    customerPoints={activeCustomerPoints}
                    customerName={customerData.name} 
                    setCustomerName={(n) => updateCustomer({name: n})} 
                    customerWhatsapp={customerData.whatsapp} 
                    setCustomerWhatsapp={(w) => updateCustomer({whatsapp: w})} 
                    subtotal={paymentState.subtotal} 
                    initialServiceFee={paymentState.serviceFee} 
                    initialCoverCharge={paymentState.coverCharge} 
                    onClose={() => setPaymentState(null)} 
                    onConfirm={onProcessPaymentSuccess}
                />
            )}

            {isDeliveryModalOpen && (
                <DeliveryCheckoutModal 
                    onClose={() => setIsDeliveryModalOpen(false)}
                    cart={cart}
                    subtotal={roundFinance(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                    onConfirm={onDeliveryComplete}
                    loyaltySystem={loyaltySystem}
                />
            )}
        </>
    );
};
