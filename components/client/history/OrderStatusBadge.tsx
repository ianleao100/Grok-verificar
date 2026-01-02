
import React from 'react';
import { OrderStatus } from '../../../types';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    scheduledTime?: string;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, scheduledTime }) => {
    switch (status) {
        case OrderStatus.PENDING:
            return (
                <div className="px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-bold flex items-center gap-1.5 border border-yellow-200 dark:border-yellow-800 transition-colors">
                    <Icon name="hourglass_top" className="text-[14px]" />
                    Aguardando Confirmação
                </div>
            );
        case OrderStatus.CONFIRMED:
            return (
                <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-colors">
                    <Icon name="thumb_up" className="text-[14px]" />
                    Confirmado
                </div>
            );
        case OrderStatus.PREPARING:
            return (
                <div className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 text-xs font-bold flex items-center gap-1.5 border border-orange-200 dark:border-orange-800 transition-colors">
                    <Icon name="skillet" className="text-[14px]" />
                    Em preparo
                </div>
            );
        case OrderStatus.READY:
             return (
                <div className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 transition-colors">
                    <Icon name="two_wheeler" className="text-[14px]" />
                    Em Trânsito
                </div>
            );
        case OrderStatus.DELIVERED:
            return (
                <div className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-xs font-bold flex items-center gap-1.5 border border-green-200 dark:border-green-800 transition-colors">
                    <Icon name="done_all" className="text-[14px]" />
                    Entregue
                </div>
            );
        case OrderStatus.CANCELLED:
             return (
                <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 transition-colors">
                    <Icon name="cancel" className="text-[14px]" />
                    Cancelado
                </div>
            );
        case OrderStatus.SCHEDULED:
            return (
                <div className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition-colors">
                    <Icon name="calendar_today" className="text-[14px]" />
                    Agendado para às {scheduledTime || '20:00'}
                </div>
            );
        default:
            return null;
    }
};
