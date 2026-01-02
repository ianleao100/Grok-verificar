
import React from 'react';
import { Order, OrderStatus } from '../../../types';

interface KitchenStatusControlsProps {
    order: Order;
    onUpdateStatus: (order: Order, status: OrderStatus) => void;
    onRequestCancel: (order: Order, type: 'REJECT' | 'CANCEL') => void;
    onDispatchOpen: (order: Order) => void;
}

export const KitchenStatusControls: React.FC<KitchenStatusControlsProps> = ({
    order,
    onUpdateStatus,
    onRequestCancel,
    onDispatchOpen
}) => {
    const handleStop = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div className="pt-3 mt-1 border-t border-dashed border-gray-100 dark:border-gray-700 flex justify-center items-center w-full">
            <div className="flex gap-2 w-full" onClick={handleStop}>
                {order.status === OrderStatus.PENDING && (
                    <>
                        <button onClick={() => onRequestCancel(order, 'REJECT')} className="flex-1 px-2 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-black text-[10px] uppercase tracking-wide transition-colors">Rejeitar</button>
                        <button onClick={() => onUpdateStatus(order, OrderStatus.PREPARING)} className="flex-[2] px-2 py-2 bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-wide hover:bg-green-600 shadow-sm transition-colors">Aceitar</button>
                    </>
                )}

                {order.status === OrderStatus.PREPARING && (
                    <>
                        <button onClick={() => onRequestCancel(order, 'CANCEL')} className="flex-1 px-2 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-black text-[10px] uppercase tracking-wide transition-colors">Cancelar</button>
                        {order.origin === 'DELIVERY' || order.isDelivery ? (
                            <button onClick={() => onDispatchOpen(order)} className="flex-[2] px-2 py-2 bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-wide hover:bg-blue-600 shadow-sm transition-colors">Chamar Entregador</button>
                        ) : (
                            <button onClick={() => onUpdateStatus(order, OrderStatus.DELIVERED)} className="flex-[2] px-2 py-2 bg-purple-500 text-white rounded-xl font-black text-[10px] uppercase tracking-wide hover:bg-purple-600 shadow-sm transition-colors">Pronto (Notificar)</button>
                        )}
                    </>
                )}

                {order.status === OrderStatus.DISPATCHED && (
                    <>
                        <button onClick={() => onRequestCancel(order, 'CANCEL')} className="flex-1 px-2 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-black text-[10px] uppercase tracking-wide transition-colors">Cancelar</button>
                        <button onClick={() => onUpdateStatus(order, OrderStatus.DELIVERED)} className="flex-[2] px-2 py-2 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wide hover:bg-green-700 shadow-sm transition-colors">Concluir</button>
                    </>
                )}
            </div>
        </div>
    );
};
