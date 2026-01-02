
import React from 'react';
import { Order, OrderStatus } from '../../../types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderHistoryItemProps {
    order: Order;
    onSelect: (order: Order) => void;
    onTrack: (order: Order) => void;
    onRepeat: (order: Order) => void;
}

export const OrderHistoryItem: React.FC<OrderHistoryItemProps> = ({ order, onSelect, onTrack, onRepeat }) => {
    const isCancelled = order.status === OrderStatus.CANCELLED;
    const isScheduled = order.status === OrderStatus.SCHEDULED;

    return (
        <div className={`bg-white dark:bg-[#2a1a1a] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-all ${isCancelled ? 'grayscale brightness-90 opacity-80' : ''}`}>
            <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-gray-800/30">
                <span className="text-sm font-bold text-gray-400">
                    {order.timestamp.toLocaleDateString()} • {order.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                <OrderStatusBadge status={order.status} scheduledTime={order.scheduledTime} />
            </div>
            
            <div className="flex gap-4 pt-4">
                 <div 
                    className={`bg-center bg-no-repeat bg-cover rounded-2xl size-[64px] shrink-0 border border-gray-100 dark:border-gray-700 transition-all ${isCancelled ? 'grayscale' : ''}`} 
                    style={{backgroundImage: `url('${order.items[0]?.imageUrl}')`}}
                ></div>
                 <div className="flex flex-col flex-1">
                    <h4 className="text-slate-900 dark:text-white text-[15px] font-bold">Dreamlícias</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-[13px] line-clamp-2 mt-1">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                </div>
            </div>

            <div className="flex justify-end items-center gap-3 mt-4 pt-3 border-t border-gray-50 dark:border-gray-800/30">
                <span className="mr-auto font-bold text-slate-900 dark:text-white">R$ {order.total.toFixed(2)}</span>
                
                <button 
                    onClick={() => onSelect(order)} 
                    className="text-primary font-bold text-sm px-3 py-1.5 bg-primary/5 rounded-lg active:scale-95 transition-transform"
                >
                    Detalhes
                </button>
                
                {!isCancelled && !isScheduled && (
                    order.status !== OrderStatus.DELIVERED ? (
                        <button 
                            onClick={() => onTrack(order)} 
                            className="text-primary font-bold text-sm px-3 py-1.5 bg-primary/5 rounded-lg active:scale-95 transition-transform"
                        >
                            Acompanhar
                        </button>
                    ) : (
                        <button 
                            onClick={() => onRepeat(order)} 
                            className="text-primary font-bold text-sm px-3 py-1.5 bg-primary/5 rounded-lg active:scale-95 transition-transform"
                        >
                            Repetir
                        </button>
                    )
                )}
            </div>
        </div>
    );
};
