
import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from './history/OrderStatusBadge';
import { OrderHistoryList } from './history/OrderHistoryList';

interface ClientOrderHistoryProps {
    onBack: () => void;
    myOrders: Order[];
    onRepeatOrder: (order: Order) => void;
    onTrackOrder: (order: Order) => void; 
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const ClientOrderHistory: React.FC<ClientOrderHistoryProps> = ({ onBack, myOrders, onRepeatOrder, onTrackOrder }) => {
    const [historyTab, setHistoryTab] = useState<'PEDIDOS' | 'AGENDADOS'>('PEDIDOS');
    const [activeModal, setActiveModal] = useState<'NONE' | 'DETAILS'>('NONE');
    const [focusedOrder, setFocusedOrder] = useState<Order | null>(null);

    const handleHelp = () => {
        const phoneNumber = "5511999999999"; 
        const message = "Olá, preciso de ajuda com um pedido no App.";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleSelectOrder = (order: Order) => {
        setFocusedOrder(order);
        setActiveModal('DETAILS');
    };

    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-200">
         <div className="sticky top-0 z-20 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
            <div className="flex items-center px-4 py-3 justify-between">
                <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-800 dark:text-white transition-colors">
                    <Icon name="arrow_back_ios_new" className="text-[24px]" />
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold flex-1 text-center">Histórico</h2>
                <button onClick={handleHelp} className="flex w-12 items-center justify-end text-primary text-sm font-bold hover:opacity-80 transition-opacity">Ajuda</button>
            </div>
            <div className="px-4 pb-0 flex gap-6 overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-800">
                <button 
                    onClick={() => setHistoryTab('PEDIDOS')} 
                    className={`relative pb-3 font-bold text-sm transition-colors ${historyTab === 'PEDIDOS' ? 'text-primary' : 'text-gray-500'}`}
                >
                    Pedidos
                    {historyTab === 'PEDIDOS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                </button>
                <button 
                    onClick={() => setHistoryTab('AGENDADOS')} 
                    className={`relative pb-3 font-bold text-sm transition-colors ${historyTab === 'AGENDADOS' ? 'text-primary' : 'text-gray-500'}`}
                >
                    Agendados
                    {historyTab === 'AGENDADOS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                </button>
            </div>
         </div>

         <div className="flex-1 p-4">
            <OrderHistoryList 
                orders={myOrders}
                activeTab={historyTab}
                onSelectOrder={handleSelectOrder}
                onTrackOrder={onTrackOrder}
                onRepeatOrder={onRepeatOrder}
            />
         </div>

         {/* Modal de Detalhes do Pedido */}
         {activeModal === 'DETAILS' && focusedOrder && (
             <div className="fixed inset-0 z-[110] bg-white dark:bg-surface-dark flex flex-col animate-[slideUp_0.3s_ease-out]">
                 <header className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-surface-dark z-10 transition-colors">
                     <h3 className="font-bold text-lg">Detalhes do Pedido</h3>
                     <button onClick={() => setActiveModal('NONE')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
                         <Icon name="close" />
                     </button>
                 </header>
                 <div className="flex-1 overflow-y-auto p-4 space-y-6">
                     <div className="flex justify-between items-center">
                         <OrderStatusBadge status={focusedOrder.status} scheduledTime={focusedOrder.scheduledTime} />
                         <span className="text-xs text-gray-400 font-mono">#{focusedOrder.id}</span>
                     </div>
                     <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                         <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Endereço de Entrega</h4>
                         <p className="text-sm font-bold">{focusedOrder.address}</p>
                     </div>
                     <div>
                         <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3 ml-1">Itens</h4>
                         <div className="space-y-4">
                            {focusedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <span className="text-sm font-medium">{item.quantity}x {item.name}</span>
                                    <span className="text-sm font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                         </div>
                     </div>
                     <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2 transition-colors">
                         <div className="flex justify-between text-sm text-gray-500">
                             <span>Subtotal</span>
                             <span>R$ {focusedOrder.total.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200 dark:border-gray-800 mt-2 transition-colors">
                             <span className="font-bold">Total</span>
                             <span className="font-extrabold text-xl text-primary font-display">R$ {focusedOrder.total.toFixed(2)}</span>
                         </div>
                     </div>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-surface-dark/50 border-t border-gray-100 dark:border-gray-800 transition-colors">
                    {focusedOrder.status !== OrderStatus.CANCELLED && (
                        <button 
                            onClick={() => { onRepeatOrder(focusedOrder); setActiveModal('NONE'); }} 
                            className="w-full bg-white dark:bg-surface-dark border border-primary text-primary font-bold py-3.5 rounded-xl shadow-sm active:scale-95 transition-all"
                        >
                            Pedir Novamente
                        </button>
                    )}
                 </div>
             </div>
         )}
      </div>
    );
};
