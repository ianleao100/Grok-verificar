
import { useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { OrderStatus, Order } from '../../types';

// Mock Feedbacks Dinâmicos
const getMockFeedbacks = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('joão')) return [{ id: 1, rating: 5, date: '15/12/2023', comment: 'O X-Tudo é imbatível!' }, { id: 2, rating: 5, date: '10/12/2023', comment: 'Entrega rápida.' }];
    if (n.includes('maria')) return [{ id: 1, rating: 4, date: '05/12/2023', comment: 'A batata estava ótima.' }, { id: 2, rating: 5, date: '25/11/2023', comment: 'Adoro o suco!' }];
    return [{ id: 1, rating: 5, date: 'Hoje', comment: 'Primeira vez pedindo e adorei!' }];
};

// Mock Pixel Data
const getPixelData = (customerId: string) => {
    const seed = customerId.charCodeAt(0) || 0;
    return {
        topViewed: ['Smash Burger Duplo', 'Batata Suprema', 'Milkshake Oreo'],
        leastViewed: ['Salada Simples', 'Água com Gás'],
        addedToCart: ['Smash Burger Duplo', 'Coca-Cola Zero'],
        removedFromCart: ['Salada Simples'],
        mostActiveDay: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][seed % 7],
        activeHours: '19h às 21h',
        platform: seed % 2 === 0 ? 'iOS App' : 'Android App'
    };
};

export const useCustomerStats = (customer: any) => {
    return useMemo(() => {
        const allOrders = storageService.loadOrders();
        const customerOrders = allOrders.filter(o => 
            (customer.whatsapp && o.customerWhatsapp === customer.whatsapp) || 
            (o.customerName === customer.name)
        ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const deliveredOrders = customerOrders.filter(o => o.status === OrderStatus.DELIVERED);

        // 1. CONSUMO & PREFERÊNCIAS
        const itemFrequency: Record<string, { count: number, type: 'FOOD' | 'DRINK', name: string }> = {};
        deliveredOrders.forEach(order => {
            order.items.forEach(item => {
                const isDrink = item.category?.toLowerCase().includes('bebida') || ['suco','refri','água','coca'].some(x => item.name.toLowerCase().includes(x));
                if (!itemFrequency[item.id]) itemFrequency[item.id] = { count: 0, type: isDrink ? 'DRINK' : 'FOOD', name: item.name };
                itemFrequency[item.id].count += item.quantity;
            });
        });

        const sortedItems = Object.values(itemFrequency).sort((a, b) => b.count - a.count);
        const topFoods = sortedItems.filter(i => i.type === 'FOOD').slice(0, 3);
        const topDrinks = sortedItems.filter(i => i.type === 'DRINK').slice(0, 3);

        // 2. RECORRÊNCIA
        let avgDaysBetween = 0;
        let daysSinceLast = 0;
        if (deliveredOrders.length > 0) {
            const lastOrderDate = new Date(deliveredOrders[0].timestamp);
            daysSinceLast = Math.floor(Math.abs(new Date().getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
            if (deliveredOrders.length > 1) {
                let totalDaysDiff = 0;
                const chronoOrders = [...deliveredOrders].reverse();
                for (let i = 1; i < chronoOrders.length; i++) {
                    totalDaysDiff += (new Date(chronoOrders[i].timestamp).getTime() - new Date(chronoOrders[i-1].timestamp).getTime());
                }
                avgDaysBetween = Math.ceil((totalDaysDiff / (chronoOrders.length - 1)) / (1000 * 60 * 60 * 24));
            }
        }

        // 3. FINANCEIRO DETALHADO
        const financials = deliveredOrders.reduce((acc, order) => {
            const methodUpper = (order.paymentMethod || '').toUpperCase();
            if (methodUpper.includes('PIX')) acc.methods.pix += order.total;
            else if (methodUpper.includes('CRÉDITO') || methodUpper.includes('CREDIT')) acc.methods.credit += order.total;
            else if (methodUpper.includes('DÉBITO') || methodUpper.includes('DEBIT')) acc.methods.debit += order.total;
            else if (methodUpper.includes('DINHEIRO') || methodUpper.includes('CASH')) acc.methods.cash += order.total;
            else acc.methods.other += order.total;

            return {
                products: acc.products + (order.subtotal || order.total),
                fees: acc.fees + (order.deliveryFee || 0),
                discounts: acc.discounts + (order.discount || 0),
                methods: acc.methods
            };
        }, { products: 0, fees: 0, discounts: 0, methods: { pix: 0, credit: 0, debit: 0, cash: 0, other: 0 } });

        const avgTicket = deliveredOrders.length > 0 ? (financials.products + financials.fees - financials.discounts) / deliveredOrders.length : 0;
        const feedbacks = getMockFeedbacks(customer.name);
        const averageRating = feedbacks.length > 0 ? (feedbacks.reduce((a, b) => a + b.rating, 0) / feedbacks.length).toFixed(1) : null;

        return {
            totalOrders: customerOrders.length,
            deliveredCount: deliveredOrders.length,
            topFoods, topDrinks, avgDaysBetween, daysSinceLast, avgTicket,
            financials, feedbacks, averageRating, history: customerOrders,
            pixel: getPixelData(customer.id)
        };
    }, [customer]);
};
