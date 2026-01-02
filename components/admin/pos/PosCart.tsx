
import React from 'react';
import { Layers, Zap, Utensils, Bike } from 'lucide-react';
import { CartItem } from '../../../types';
import { formatCurrency, calculateFee, calculateFinalTotal, calculateProportional, roundFinance } from '../../../shared/utils/mathEngine';
import { PosCartItemList } from './cart/PosCartItemList';
import { PosCartSummary } from './cart/PosCartSummary';

interface PosCartProps {
  cart: CartItem[];
  customerName: string;
  setCustomerName: (name: string) => void;
  customerWhatsapp: string;
  setCustomerWhatsapp: (whatsapp: string) => void;
  tableNumber: string;
  setTableNumber: (num: string) => void;
  updateQty: (idx: number, delta: number) => void;
  showExtraOptions: boolean;
  setShowExtraOptions: (show: boolean) => void;
  serviceFee: number;
  setServiceFee: (fee: number) => void;
  serviceFeeType: 'BRL' | 'PERCENT';
  setServiceFeeType: (type: 'BRL' | 'PERCENT') => void;
  coverCharge: number;
  setCoverCharge: (fee: number) => void;
  coverChargeType: 'BRL' | 'PERCENT';
  setCoverChargeType: (type: 'BRL' | 'PERCENT') => void;
  discount: number;
  setDiscount: (val: number) => void;
  discountType: 'BRL' | 'PERCENT';
  setDiscountType: (type: 'BRL' | 'PERCENT') => void;
  splitCount: number;
  setSplitCount: (val: number) => void;
  onSaveToTable?: () => void;
  onOpenPayment: (data: { subtotal: number, serviceFee: number, coverCharge: number, indices?: number[] }) => void;
  onPrint?: () => void;
  isTableView?: boolean;
  posMode?: 'QUICK' | 'TABLES' | 'DELIVERY'; 
  selectedIndices: number[];
  setSelectedIndices: (indices: number[]) => void;
}

export default function PosCart({
  cart,
  tableNumber,
  updateQty,
  showExtraOptions,
  setShowExtraOptions,
  serviceFee,
  setServiceFee,
  serviceFeeType,
  setServiceFeeType,
  coverCharge,
  setCoverCharge,
  coverChargeType,
  setCoverChargeType,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  splitCount,
  setSplitCount,
  onSaveToTable,
  onOpenPayment,
  onPrint,
  isTableView,
  posMode = 'QUICK',
  selectedIndices,
  setSelectedIndices
}: PosCartProps) {
  
  const subtotal = roundFinance(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  const selectedSubtotal = roundFinance(cart.filter((_, idx) => selectedIndices.includes(idx)).reduce((sum, item) => sum + (item.price * item.quantity), 0));
  
  const calculatedServiceFee = calculateFee(subtotal, serviceFee, serviceFeeType);
  const calculatedCoverCharge = calculateFee(subtotal, coverCharge, coverChargeType);
  const calculatedDiscount = calculateFee(subtotal, discount, discountType);

  const finalTotal = calculateFinalTotal(subtotal, calculatedServiceFee, calculatedCoverCharge, calculatedDiscount);
  const totalPerPerson = roundFinance(finalTotal / (splitCount || 1));

  const toggleSelection = (idx: number) => {
    setSelectedIndices(
      selectedIndices.includes(idx) ? selectedIndices.filter(i => i !== idx) : [...selectedIndices, idx]
    );
  };

  const handleOpenPaymentInternal = (isIndividual: boolean) => {
    if (isIndividual) {
        onOpenPayment({
            subtotal: selectedSubtotal,
            serviceFee: calculateProportional(calculatedServiceFee, subtotal, selectedSubtotal),
            coverCharge: calculateProportional(calculatedCoverCharge, subtotal, selectedSubtotal),
            indices: selectedIndices
        });
    } else {
        onOpenPayment({
            subtotal: roundFinance(subtotal - calculatedDiscount),
            serviceFee: calculatedServiceFee,
            coverCharge: calculatedCoverCharge
        });
    }
  };

  const handlePrintIndividual = () => {
      const propService = calculateProportional(calculatedServiceFee, subtotal, selectedSubtotal);
      const propCover = calculateProportional(calculatedCoverCharge, subtotal, selectedSubtotal);
      const totalIndividual = selectedSubtotal + propService + propCover;
      
      alert(`Imprimindo Cupom Individual:\n\nSubtotal Itens: ${formatCurrency(selectedSubtotal)}\nTaxa Serviço: ${formatCurrency(propService)}\nCouvert: ${formatCurrency(propCover)}\nTotal a Pagar: ${formatCurrency(totalIndividual)}`);
  };

  const getHeaderConfig = () => {
      if (posMode === 'DELIVERY') return { title: 'Delivery', icon: Bike };
      if (posMode === 'TABLES') return { title: 'Mesas', icon: Utensils };
      return { title: 'Venda Rápida', icon: Zap };
  };

  const headerConfig = getHeaderConfig();
  const HeaderIcon = headerConfig.icon;

  return (
    <div className="w-[480px] bg-white dark:bg-surface-dark flex flex-col shrink-0 shadow-[-20px_0_40px_rgba(0,0,0,0.02)] z-10 border-l border-gray-100 dark:border-gray-800 transition-colors">
      
      {/* HEADER */}
      <div className={`px-8 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-3`}>
         {isTableView ? (
           <div className="flex items-center justify-between py-2 bg-primary/5 rounded-2xl border border-primary/10 mb-2 px-6 animate-[slideDown_0.2s]">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Atendimento Ativo</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">Mesa {tableNumber}</span>
             </div>
             <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                <Layers className="w-5 h-5" />
             </div>
           </div>
         ) : (
           <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Venda</span>
                 <span className="text-sm font-black text-slate-900 dark:text-white">{headerConfig.title}</span>
              </div>
              <HeaderIcon className="w-5 h-5 text-primary" />
           </div>
         )}
      </div>

      {/* LISTA DE ITENS */}
      <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar">
          <PosCartItemList 
              cart={cart}
              selectedIndices={selectedIndices}
              toggleSelection={toggleSelection}
              updateQty={updateQty}
          />
      </div>

      {/* SUMMARY FOOTER */}
      <PosCartSummary 
          subtotal={subtotal}
          finalTotal={finalTotal}
          totalPerPerson={totalPerPerson}
          cartLength={cart.length}
          
          serviceFee={serviceFee} setServiceFee={setServiceFee}
          serviceFeeType={serviceFeeType} setServiceFeeType={setServiceFeeType}
          coverCharge={coverCharge} setCoverCharge={setCoverCharge}
          coverChargeType={coverChargeType} setCoverChargeType={setCoverChargeType}
          discount={discount} setDiscount={setDiscount}
          discountType={discountType} setDiscountType={setDiscountType}
          splitCount={splitCount} setSplitCount={setSplitCount}
          
          calculatedServiceFee={calculatedServiceFee}
          calculatedCoverCharge={calculatedCoverCharge}
          calculatedDiscount={calculatedDiscount}
          
          selectedIndicesLength={selectedIndices.length}
          selectedSubtotal={selectedSubtotal}
          
          showExtraOptions={showExtraOptions}
          setShowExtraOptions={setShowExtraOptions}
          
          isTableView={isTableView}
          onSaveToTable={onSaveToTable}
          onPayIndividual={() => handleOpenPaymentInternal(true)}
          onPrintIndividual={handlePrintIndividual}
          onPayFull={() => handleOpenPaymentInternal(false)}
          onPrint={() => onPrint && onPrint()}
      />
    </div>
  );
}
