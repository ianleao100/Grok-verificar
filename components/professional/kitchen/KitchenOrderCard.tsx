
import React, { useMemo } from 'react';
import { User, AlertTriangle, Cake } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { formatCurrency, isTodayBirthday } from '../../../shared/utils/mathEngine';
import { OrderBadge } from '../../admin/orders/OrderBadge';
import { useCustomerLoyalty } from '../../../hooks/useCustomerLoyalty';
import { KitchenOrderTimer } from './KitchenOrderTimer';
import { KitchenStatusControls } from './KitchenStatusControls';

interface KitchenOrderCardProps {
    order: Order;
    elapsedMinutes: number;
    onSelect: (order: Order) => void;
    onUpdateStatus: (order: Order, status: OrderStatus) => void;
    onRequestCancel: (order: Order, type: 'REJECT' | 'CANCEL') => void;
    onDispatchOpen: (order: Order) => void;
}

export const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({
    order, elapsedMinutes, onSelect, onUpdateStatus, onRequestCancel, onDispatchOpen
}) => {
    const { customers } = useCustomerLoyalty();

    const customerInfo = useMemo(() => {
        if (!order.customerWhatsapp) return null;
        return customers.find(c => c.whatsapp === order.customerWhatsapp);
    }, [customers, order.customerWhatsapp]);

    const isBirthday = customerInfo ? isTodayBirthday(customerInfo.birthDate) : false;
    const hasObservations = customerInfo?.observations && customerInfo.observations.trim().length > 0;
    const isCritical = elapsedMinutes >= 60;
    const isWarning = elapsedMinutes >= 40 && elapsedMinutes < 60;

    let borderClass = 'border-transparent';
    if (isWarning) borderClass = 'border-yellow-400';
    else if (!isCritical) borderClass = 'border-green-500';

    return (
        <div onClick={() => onSelect(order)} className="relative group cursor-pointer">
            {isCritical && <div className="absolute inset-0 border-2 border-[#EA2831] rounded-[24px] animate-pulse z-20 shadow-[0_0_15px_rgba(234,40,49,0.5)] pointer-events-none"></div>}
            
            <div className={`relative z-10 bg-white dark:bg-surface-dark p-4 rounded-[24px] flex flex-col gap-3 hover:shadow-xl transition-all hover:scale-[1.02] border-2 ${!isCritical ? borderClass : 'border-transparent'}`}>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-lg text-slate-900 dark:text-white leading-none">#{order.id.slice(-4)}</span>
                        <OrderBadge order={order} />
                    </div>
                    <KitchenOrderTimer elapsedMinutes={elapsedMinutes} />
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 line-clamp-1 leading-tight">{order.customerName}</span>
                            {isBirthday && <span className="shrink-0 flex items-center gap-1 bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase animate-pulse"><Cake className="w-3 h-3" /> Niver</span>}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white font-display mt-1">{formatCurrency(order.total)}</span>
                    </div>
                </div>

                {hasObservations && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-2 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-red-700 dark:text-red-400 font-bold leading-tight line-clamp-2"><span className="uppercase tracking-wide">Atenção:</span> {customerInfo?.observations}</p>
                    </div>
                )}

                {order.status === OrderStatus.DISPATCHED && order.driverName && (
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700 w-fit">
                        <User className="w-3 h-3" /> <span className="truncate max-w-[120px]">{order.driverName}</span>
                    </div>
                )}

                <KitchenStatusControls order={order} onUpdateStatus={onUpdateStatus} onRequestCancel={onRequestCancel} onDispatchOpen={onDispatchOpen} />
            </div>
        </div>
    );
};
