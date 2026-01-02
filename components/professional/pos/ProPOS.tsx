
import React, { useState, useMemo, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Product, CartItem, TableConfig } from '../../../types';
import { useTableOrders } from '../../../hooks/useTableOrders';
import { useCheckoutPersistence } from '../../../hooks/useCheckoutPersistence';
import { roundFinance } from '../../../shared/utils/mathEngine';
import { storageService } from '../../../services/storageService';
import { usePosTransaction } from '../../../hooks/pro/usePosTransaction';

// Sub-components
import { PosHeader } from './PosHeader';
import { PosProductGrid } from './PosProductGrid';
import { PosCartPanel } from './PosCartPanel';
import { PosPaymentSection } from './PosPaymentSection';
import TableManagementModal from '../../admin/pos/tables/TableManagementModal';
import TableTransferModal from '../../admin/pos/tables/TableTransferModal';

interface ProPOSProps {
  onBack: () => void;
  cashierRegistry: any; 
  loyaltySystem: any;
}

const INITIAL_TABLES_MOCK: TableConfig[] = Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString(),
    number: (i + 1).toString(),
    description: i < 5 ? 'Salão Principal' : 'Área Externa'
}));

export const ProPOS: React.FC<ProPOSProps> = ({ onBack, cashierRegistry, loyaltySystem }) => {
  const { session } = cashierRegistry;
  const { customers } = loyaltySystem;
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]); // Embora não usado explicitamente no grid novo, mantemos para integridade

  useEffect(() => {
      const loadData = () => {
          setProducts(storageService.getProducts());
          setCategories(storageService.getCategories());
      };
      loadData();
      const handleStorageChange = () => loadData();
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Hooks
  const { 
    tablesConfig, tableSessions, saveSession, transferTableOrder,
    closeSession, updateTableConfig, removeTableConfig 
  } = useTableOrders(INITIAL_TABLES_MOCK);

  const { cart, setCart, customerData, updateCustomer, clearCheckout } = useCheckoutPersistence();

  // UI State
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [posMode, setPosMode] = useState<'QUICK' | 'TABLES' | 'DELIVERY'>('QUICK');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Modals Local State
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Partial<TableConfig> | null>(null);

  // Transaction Logic
  const transactionLogic = usePosTransaction({
      cashierRegistry,
      loyaltySystem,
      cart,
      customerData,
      selectedTableId,
      tablesConfig,
      saveSession,
      closeSession,
      clearCheckout,
      setCart,
      setSelectedIndices,
      setPosMode
  });

  const activeCustomerPoints = useMemo(() => {
      if (!customerData.whatsapp || customerData.whatsapp.length < 8) return undefined;
      const customer = customers.find((c: any) => c.whatsapp === customerData.whatsapp);
      return customer ? customer.points : undefined;
  }, [customerData.whatsapp, customers]);

  const handleSelectTable = (table: TableConfig) => {
    const tableSession = tableSessions[table.id];
    setSelectedTableId(table.id);
    if (tableSession) {
      setCart(tableSession.items);
      updateCustomer({ name: tableSession.customerName, whatsapp: tableSession.customerWhatsapp || '' });
    } else {
      updateCustomer({ name: `Mesa ${table.number}`, whatsapp: '' });
    }
    setPosMode('TABLES'); 
  };

  const updateQty = (idx: number, delta: number) => {
    setCart(prev => prev.map((item, i) => i === idx ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
  };

  const handleAddToCartFromModal = (itemToAdd: CartItem) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.id === itemToAdd.id && JSON.stringify(item.selectedExtras) === JSON.stringify(itemToAdd.selectedExtras) && item.notes === itemToAdd.notes);
      if (existingIdx > -1) {
        const newCart = [...prev];
        newCart[existingIdx].quantity += itemToAdd.quantity;
        return newCart;
      }
      return [...prev, itemToAdd];
    });
    setSelectedProduct(null);
  };

  const currentTableNumber = tablesConfig.find(t => t.id === selectedTableId)?.number || '';

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8f6f6] dark:bg-background-dark flex animate-[fadeIn_0.2s_ease-out] font-display">
      
      {!session.isOpen && (
         <div className="absolute inset-0 z-[550] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-6">
            <div className="bg-white dark:bg-surface-dark p-12 rounded-[40px] shadow-2xl text-center max-w-lg flex flex-col items-center gap-6 border-4 border-primary">
               <div className="size-24 bg-red-50 dark:bg-red-900/20 text-primary rounded-[32px] flex items-center justify-center animate-bounce"><ShieldAlert className="w-12 h-12" /></div>
               <div className="space-y-2"><h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Caixa Fechado!</h2><p className="text-slate-500 font-medium leading-relaxed">Para iniciar vendas, primeiro abra o caixa no painel principal de tesouraria.</p></div>
               <button onClick={onBack} className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-black transition-all">VOLTAR PARA TESOURARIA</button>
            </div>
         </div>
      )}

      {/* LEFT COLUMN: NAVIGATION & CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 dark:border-gray-800">
        <PosHeader 
            onBack={onBack}
            posMode={posMode}
            setPosMode={setPosMode}
            selectedTableId={selectedTableId}
            onTransferTable={() => setIsTransferModalOpen(true)}
            isTransferEnabled={!!(selectedTableId && tableSessions[selectedTableId])}
            search={search}
            setSearch={setSearch}
            onResetSelection={() => { setSelectedTableId(null); setSelectedIndices([]); updateCustomer({ name: '', whatsapp: '' }); }}
        />

        <PosProductGrid 
            posMode={posMode}
            selectedTableId={selectedTableId}
            products={products}
            search={search}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            tablesConfig={tablesConfig}
            tableSessions={tableSessions}
            onSelectTable={handleSelectTable}
            onEditTable={(e, t) => { e.stopPropagation(); setEditingTable(t); setIsTableModalOpen(true); }}
            onDeleteTable={(e, id) => { e.stopPropagation(); removeTableConfig(id); }}
            onAddTable={() => { setEditingTable({ id: Math.random().toString(36).substr(2,9), number: '', description: '' }); setIsTableModalOpen(true); }}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onAddToCartFromModal={handleAddToCartFromModal}
        />
      </div>

      {/* RIGHT COLUMN: CART & PAYMENT */}
      <div className="w-[480px] bg-white dark:bg-surface-dark flex flex-col shrink-0 shadow-[-20px_0_40px_rgba(0,0,0,0.02)] z-10 border-l border-gray-100 dark:border-gray-800">
          <PosCartPanel 
            cart={cart}
            customerData={customerData}
            updateCustomer={updateCustomer}
            currentTableNumber={currentTableNumber}
            updateQty={updateQty}
            // Financials from Hook
            {...transactionLogic}
            posMode={posMode}
            selectedTableId={selectedTableId}
            selectedIndices={selectedIndices}
            setSelectedIndices={setSelectedIndices}
            onSaveToTable={(selectedTableId) ? () => { const tNum = tablesConfig.find(t => t.id === selectedTableId)?.number || ''; saveSession(selectedTableId, tNum, customerData.name, cart, customerData.whatsapp); setSelectedTableId(null); clearCheckout(); setPosMode('TABLES'); } : undefined}
            onOpenPayment={(data) => {
                if (posMode === 'DELIVERY') transactionLogic.setIsDeliveryModalOpen(true);
                else transactionLogic.setPaymentState({ subtotal: data.subtotal, serviceFee: data.serviceFee, coverCharge: data.coverCharge, indices: data.indices });
            }}
            onPrint={() => alert('Imprimindo...')}
          />
      </div>

      {/* Modals & Overlays */}
      <PosPaymentSection 
          paymentState={transactionLogic.paymentState}
          isDeliveryModalOpen={transactionLogic.isDeliveryModalOpen}
          setPaymentState={transactionLogic.setPaymentState}
          setIsDeliveryModalOpen={transactionLogic.setIsDeliveryModalOpen}
          cart={cart}
          customerData={customerData}
          updateCustomer={updateCustomer}
          activeCustomerPoints={activeCustomerPoints}
          onProcessPaymentSuccess={transactionLogic.processPaymentSuccess}
          onDeliveryComplete={transactionLogic.handleDeliveryComplete}
          loyaltySystem={loyaltySystem}
          roundFinance={roundFinance}
      />

      {isTableModalOpen && editingTable && <TableManagementModal editingTable={editingTable} setEditingTable={setEditingTable} onClose={() => setIsTableModalOpen(false)} onSave={() => { updateTableConfig(editingTable as TableConfig); setIsTableModalOpen(false); }}/>}
      {isTransferModalOpen && selectedTableId && <TableTransferModal currentTableId={selectedTableId} tablesConfig={tablesConfig} tableSessions={tableSessions} onClose={() => setIsTransferModalOpen(false)} onTransfer={(toId) => { transferTableOrder(selectedTableId, toId); setIsTransferModalOpen(false); setSelectedTableId(null); clearCheckout(); }}/>}
    </div>
  );
};
