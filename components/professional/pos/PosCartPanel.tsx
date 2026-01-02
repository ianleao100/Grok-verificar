
import React from 'react';
import PosCart from '../../admin/pos/PosCart';
import { CartItem } from '../../../types';

interface PosCartPanelProps {
    cart: CartItem[];
    customerData: { name: string; whatsapp: string };
    updateCustomer: (data: Partial<{ name: string; whatsapp: string }>) => void;
    currentTableNumber: string;
    updateQty: (idx: number, delta: number) => void;
    
    // Financial State (Pass-through to PosCart)
    showExtraOptions: boolean; setShowExtraOptions: (v: boolean) => void;
    serviceFee: number; setServiceFee: (v: number) => void;
    serviceFeeType: 'BRL' | 'PERCENT'; setServiceFeeType: (v: 'BRL' | 'PERCENT') => void;
    coverCharge: number; setCoverCharge: (v: number) => void;
    coverChargeType: 'BRL' | 'PERCENT'; setCoverChargeType: (v: 'BRL' | 'PERCENT') => void;
    discount: number; setDiscount: (v: number) => void;
    discountType: 'BRL' | 'PERCENT'; setDiscountType: (v: 'BRL' | 'PERCENT') => void;
    splitCount: number; setSplitCount: (v: number) => void;
    
    posMode: 'QUICK' | 'TABLES' | 'DELIVERY';
    selectedTableId: string | null;
    selectedIndices: number[];
    setSelectedIndices: (indices: number[]) => void;
    
    onSaveToTable?: () => void;
    onOpenPayment: (data: any) => void;
    onPrint: () => void;
}

export const PosCartPanel: React.FC<PosCartPanelProps> = (props) => {
    return (
        <PosCart 
            cart={props.cart} 
            customerName={props.customerData.name} 
            setCustomerName={(name) => props.updateCustomer({ name })} 
            customerWhatsapp={props.customerData.whatsapp} 
            setCustomerWhatsapp={(whatsapp) => props.updateCustomer({ whatsapp })} 
            tableNumber={props.currentTableNumber} 
            setTableNumber={() => {}} 
            updateQty={props.updateQty} 
            showExtraOptions={props.showExtraOptions} 
            setShowExtraOptions={props.setShowExtraOptions} 
            serviceFee={props.serviceFee} 
            setServiceFee={props.setServiceFee} 
            serviceFeeType={props.serviceFeeType} 
            setServiceFeeType={props.setServiceFeeType} 
            coverCharge={props.coverCharge} 
            setCoverCharge={props.setCoverCharge} 
            coverChargeType={props.coverChargeType} 
            setCoverChargeType={props.setCoverChargeType} 
            discount={props.discount} 
            setDiscount={props.setDiscount} 
            discountType={props.discountType} 
            setDiscountType={props.setDiscountType} 
            splitCount={props.splitCount} 
            setSplitCount={props.setSplitCount} 
            onSaveToTable={props.onSaveToTable} 
            posMode={props.posMode}
            onOpenPayment={props.onOpenPayment} 
            onPrint={props.onPrint} 
            isTableView={props.selectedTableId !== null}
            selectedIndices={props.selectedIndices} 
            setSelectedIndices={props.setSelectedIndices}
        />
    );
};
