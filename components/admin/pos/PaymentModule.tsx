
import React, { useState } from 'react';
import { roundFinance, calculateFinalTotal, maskPhone, isEffectivelyPaid, calculatePointsDiscount } from '../../../shared/utils/mathEngine';
import { CartItem } from '../../../types';
import { BaseModal } from '../../ui/BaseModal';
import { PaymentSummarySidebar } from './payment/PaymentSummarySidebar';
import { PaymentMethodSelector } from './payment/PaymentMethodSelector';

interface PaymentModuleProps {
    subtotal: number;
    initialServiceFee?: number;
    initialCoverCharge?: number;
    onClose: () => void;
    onConfirm: (payments: Record<string, number>, meta: { receivedAmount: number, changeAmount: number, customerName: string, customerWhatsapp: string, isDelivery: boolean, pointsUsed: number }) => void;
    customerName: string;
    setCustomerName: (name: string) => void;
    customerWhatsapp: string;
    setCustomerWhatsapp: (whatsapp: string) => void;
    customerPoints?: number;
    cart: CartItem[];
}

export default function PaymentModule({ 
    subtotal, 
    initialServiceFee = 0, 
    initialCoverCharge = 0, 
    onClose, 
    onConfirm,
    customerName,
    setCustomerName,
    customerWhatsapp,
    setCustomerWhatsapp,
    customerPoints,
    cart
}: PaymentModuleProps) {
    const [values, setValues] = useState<Record<string, string>>({ PIX: '', CASH: '', CREDIT: '', DEBIT: '' });
    
    // Editable Fees State
    const [serviceFee, setServiceFee] = useState(roundFinance(initialServiceFee));
    const [coverCharge, setCoverCharge] = useState(roundFinance(initialCoverCharge));
    const [pointsToUse, setPointsToUse] = useState(0);

    const pointsDiscount = calculatePointsDiscount(pointsToUse);

    // Dynamic Total Calculation
    const totalToReceive = calculateFinalTotal(subtotal, serviceFee, coverCharge, pointsDiscount);
    const sum = roundFinance((Object.values(values) as string[]).reduce((acc: number, val: string) => acc + (parseFloat(val) || 0), 0));
    
    // Balance Logic
    const balance = roundFinance(sum - totalToReceive);
    const isPaid = isEffectivelyPaid(balance); 
    const isSurplus = balance > 0.01;
    const cashValue = parseFloat(values.CASH) || 0;
    
    // Troco só é permitido se houver dinheiro na jogada e o valor pago exceder o total
    const isValidChange = !isSurplus || (isSurplus && cashValue > 0);
    const canFinalize = isPaid && isValidChange;
    const changeAmount = (cashValue > 0 && isSurplus) ? balance : 0;

    const handleUpdateValue = (method: string, val: string) => {
        setValues(prev => ({ ...prev, [method]: val }));
    };

    const setTotalOnMethod = (method: string) => {
        const otherSum = (Object.entries(values) as [string, string][])
            .filter(([m]) => m !== method)
            .reduce((acc: number, [_, v]) => acc + (parseFloat(v) || 0), 0);
        
        const autoVal = roundFinance(Math.max(0, totalToReceive - otherSum));
        handleUpdateValue(method, autoVal.toString());
    };

    const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value) || 0;
        if (val < 0) val = 0;
        if (customerPoints && val > customerPoints) val = customerPoints;
        setPointsToUse(val);
    };

    const handleConfirm = () => {
        const finalValues: Record<string, number> = {};
        (Object.entries(values) as [string, string][]).forEach(([k, v]) => { if (parseFloat(v) > 0) finalValues[k] = parseFloat(v); });
        onConfirm(finalValues, { receivedAmount: sum, changeAmount: changeAmount, customerName, customerWhatsapp, isDelivery: false, pointsUsed: pointsToUse });
    };

    return (
        <BaseModal onClose={onClose} className="max-w-5xl">
            <div className="relative w-full bg-white dark:bg-surface-dark rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                
                <PaymentSummarySidebar 
                    cart={cart}
                    subtotal={subtotal}
                    serviceFee={serviceFee}
                    setServiceFee={setServiceFee}
                    coverCharge={coverCharge}
                    setCoverCharge={setCoverCharge}
                    pointsDiscount={pointsDiscount}
                    totalToReceive={totalToReceive}
                />

                <PaymentMethodSelector 
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    customerWhatsapp={customerWhatsapp}
                    setCustomerWhatsapp={setCustomerWhatsapp}
                    customerPoints={customerPoints}
                    pointsToUse={pointsToUse}
                    handlePointsChange={handlePointsChange}
                    pointsDiscount={pointsDiscount}
                    setPointsToUse={setPointsToUse}
                    values={values}
                    handleUpdateValue={handleUpdateValue}
                    setTotalOnMethod={setTotalOnMethod}
                    sum={sum}
                    balance={balance}
                    isPaid={isPaid}
                    isSurplus={isSurplus}
                    isValidChange={isValidChange}
                    canFinalize={canFinalize}
                    onConfirm={handleConfirm}
                    onClose={onClose}
                    totalToReceive={totalToReceive}
                />
            </div>
        </BaseModal>
    );
}
