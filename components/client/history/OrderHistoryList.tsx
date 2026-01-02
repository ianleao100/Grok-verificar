
import React from 'react';
import { Order, OrderStatus } from '../../../types';
import { OrderHistoryItem } from './OrderHistoryItem';

interface OrderHistoryListProps {
    orders: Order[];
    activeTab: 'PEDIDOS' | 'AGENDADOS';
    onSelectOrder: (order: Order) => void;
    onTrackOrder: (order: Order) => void;
    onRepeatOrder: (order: Order) => void;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const OrderHistoryList: React.FC<OrderHistoryListProps> = ({ 
    orders, activeTab, onSelectOrder, onTrackOrder, onRepeatOrder 
}) => {
    
    const filteredOrders = activeTab === 'PEDIDOS'
        ? orders.filter(o => o.status !== OrderStatus.SCHEDULED)
        : orders.filter(o => o.status === OrderStatus.SCHEDULED);

    if (filteredOrders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <Icon name={activeTab === 'PEDIDOS' ? "shopping_basket" : "calendar_month"} className="text-6xl opacity-20 mb-4" />
                <p className="font-bold">{activeTab === 'PEDIDOS' ? 'Não há pedidos realizados ainda.' : 'Não há pedidos agendados.'}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 pb-24">
            {filteredOrders.map(order => (
                <OrderHistoryItem
                    key={order.id}
                    order={order}
                    onSelect={onSelectOrder}
                    onTrack={onTrackOrder}
                    onRepeat={onRepeatOrder}
                />
            ))}
        </div>
    );
};
