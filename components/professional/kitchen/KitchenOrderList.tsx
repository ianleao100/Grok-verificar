
import React from 'react';
import { CheckSquare } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { KitchenOrderCard } from './KitchenOrderCard';

interface KitchenOrderListProps {
    orders: Order[];
    mode: 'KITCHEN' | 'DELIVERY';
    selectedOrders: string[];
    onToggleSelection: (orderId: string) => void;
    getElapsedTime: (date: Date) => number;
    onSelectOrder: (order: Order) => void;
    onUpdateStatus: (order: Order, status: OrderStatus) => void;
    onRequestCancel: (order: Order, type: 'REJECT' | 'CANCEL') => void;
    onDispatchOpen: (order: Order) => void;
}

export const KitchenOrderList: React.FC<KitchenOrderListProps> = ({
    orders, mode, selectedOrders, onToggleSelection, getElapsedTime,
    onSelectOrder, onUpdateStatus, onRequestCancel, onDispatchOpen
}) => {
    return (
        <div className="flex-1 bg-white dark:bg-surface-dark rounded-[24px] p-3 border border-gray-200 dark:border-gray-800 relative overflow-y-auto no-scrollbar space-y-3 shadow-sm h-full">
            {orders.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none opacity-50">
                    <span className="text-4xl font-black opacity-20">0</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Vazio</span>
                </div>
            )}
            {orders.map(order => (
                <div key={order.id} className="relative group">
                    {mode === 'DELIVERY' && (order.status === OrderStatus.READY || order.status === OrderStatus.DISPATCHED) && (
                        <div className="absolute top-3 left-3 z-30">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onToggleSelection(order.id); }}
                                className={`p-1 rounded-lg transition-all ${selectedOrders.includes(order.id) ? 'bg-[#EA2831] text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                            >
                                <CheckSquare className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <KitchenOrderCard 
                        order={order}
                        elapsedMinutes={getElapsedTime(order.timestamp)}
                        onSelect={onSelectOrder}
                        onUpdateStatus={onUpdateStatus}
                        onRequestCancel={onRequestCancel}
                        onDispatchOpen={onDispatchOpen}
                    />
                    {order.sector && (
                        <div className="absolute bottom-3 right-3 z-20 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider pointer-events-none opacity-80">
                            {order.sector}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
