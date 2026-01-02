
import React, { useMemo, useState } from 'react';
import { X, Calendar, MousePointer, Activity, Star, Cake } from 'lucide-react';
import { BaseModal } from '../../ui/BaseModal';
import { storageService } from '../../../services/storageService';
import { OrderStatus, CustomerProfile } from '../../../types';
import { CustomerGeneralTab } from './detail/CustomerGeneralTab';
import { CustomerHistoryTab } from './detail/CustomerHistoryTab';
import { CustomerBehaviorTab } from './detail/CustomerBehaviorTab';

interface CustomerDetailsModalProps {
    customer: CustomerProfile;
    onClose: () => void;
}

const getPixelData = (customerId: string) => {
    const seed = customerId.charCodeAt(0) || 0;
    return {
        topViewed: ['Smash Burger Duplo', 'Batata Suprema', 'Milkshake Oreo'],
        leastViewed: ['Salada Simples', 'Água com Gás'],
        addedToCart: ['Smash Burger Duplo', 'Coca-Cola Zero', 'Brownie'],
        removedFromCart: ['Salada Simples'],
        mostActiveDay: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][seed % 7],
        activeHours: '19h às 21h',
        platform: seed % 2 === 0 ? 'iOS App' : 'Android App'
    };
};

export const CustomerDetailModal: React.FC<CustomerDetailsModalProps> = ({ customer, onClose }) => {
    const [activeTab, setActiveTab] = useState<'GERAL' | 'HISTORICO' | 'COMPORTAMENTO'>('GERAL');

    const stats = useMemo(() => {
        const allOrders = storageService.loadOrders();
        const customerOrders = allOrders.filter(o => 
            (customer.whatsapp && o.customerWhatsapp === customer.whatsapp) || 
            (o.customerName === customer.name)
        ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const deliveredOrders = customerOrders.filter(o => o.status === OrderStatus.DELIVERED);

        // Preferencias
        const itemFreq: Record<string, { count: number, type: 'FOOD' | 'DRINK', name: string }> = {};
        deliveredOrders.forEach(order => {
            order.items.forEach(item => {
                const isDrink = item.category?.toLowerCase().includes('bebida') || ['suco','refri','água','coca','cerveja','drink'].some(k => item.name.toLowerCase().includes(k));
                if (!itemFreq[item.id]) itemFreq[item.id] = { count: 0, type: isDrink ? 'DRINK' : 'FOOD', name: item.name };
                itemFreq[item.id].count += item.quantity;
            });
        });
        const sortedItems = Object.values(itemFreq).sort((a, b) => b.count - a.count);
        
        // Recorrência
        let avgDays = 0, daysSinceLast = 0;
        if (deliveredOrders.length > 0) {
            daysSinceLast = Math.floor(Math.abs(new Date().getTime() - new Date(deliveredOrders[0].timestamp).getTime()) / (864e5));
            if (deliveredOrders.length > 1) {
                let totalDiff = 0;
                const ascOrders = [...deliveredOrders].reverse();
                for (let i = 1; i < ascOrders.length; i++) totalDiff += new Date(ascOrders[i].timestamp).getTime() - new Date(ascOrders[i-1].timestamp).getTime();
                avgDays = Math.ceil((totalDiff / (deliveredOrders.length - 1)) / 864e5);
            }
        }

        // Financeiro
        const financials = deliveredOrders.reduce((acc, order) => {
            acc.products += (order.subtotal || order.total);
            acc.fees += (order.deliveryFee || 0);
            acc.discounts += (order.discount || 0);
            return acc;
        }, { products: 0, fees: 0, discounts: 0 });

        const avgTicket = deliveredOrders.length > 0 ? (financials.products + financials.fees - financials.discounts) / deliveredOrders.length : 0;

        return {
            topFoods: sortedItems.filter(i => i.type === 'FOOD').slice(0, 3),
            topDrinks: sortedItems.filter(i => i.type === 'DRINK').slice(0, 3),
            avgDays, daysSinceLast, avgTicket, financials, 
            history: customerOrders, pixel: getPixelData(customer.id),
            feedbacks: [], averageRating: null // Mock or implement real feedback
        };
    }, [customer]);

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all outline-none focus:outline-none focus:ring-0 ${activeTab === id ? 'border-[#EA2831] text-[#EA2831]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
            <Icon className="w-4 h-4" /> {label}
        </button>
    );

    return (
        <BaseModal onClose={onClose} className="max-w-5xl w-full h-[90vh]" hideCloseButton={true}>
            <div className="flex flex-col h-full bg-[#f8f6f6] dark:bg-background-dark rounded-[32px] overflow-hidden relative">
                <div className="bg-white dark:bg-surface-dark px-8 pt-6 pb-0 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-5">
                            <div className="size-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-slate-400 font-black text-2xl border-4 border-white dark:border-gray-700 shadow-sm">{customer.name.charAt(0)}</div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{customer.name}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-sm font-bold text-slate-500">{customer.whatsapp}</span>
                                    {customer.birthDate && (<><div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div><span className="text-sm font-bold text-slate-500 flex items-center gap-1"><Cake className="w-3 h-3 text-slate-400" /> {customer.birthDate}</span></>)}
                                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                                    <span className="text-xs font-black text-[#EA2831] bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md flex items-center gap-1 border border-red-100 dark:border-red-900/30"><Star className="w-3 h-3 fill-current" /> {customer.points} pts</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors focus:ring-0 focus:outline-none"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="flex gap-2">
                        <TabButton id="GERAL" label="Visão Geral" icon={Activity} />
                        <TabButton id="HISTORICO" label="Histórico de Pedidos" icon={Calendar} />
                        <TabButton id="COMPORTAMENTO" label="Comportamento (Pixel)" icon={MousePointer} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    {activeTab === 'GERAL' && <CustomerGeneralTab customer={customer} stats={stats} />}
                    {activeTab === 'HISTORICO' && <CustomerHistoryTab history={stats.history} />}
                    {activeTab === 'COMPORTAMENTO' && <CustomerBehaviorTab pixel={stats.pixel} />}
                </div>
            </div>
        </BaseModal>
    );
};
