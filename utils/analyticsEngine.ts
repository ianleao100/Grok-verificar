
import { Order, OrderStatus } from '../types';
import { roundFinance } from '../shared/utils/mathEngine';

export const filterOrdersByDate = (orders: Order[], period: string, customRange?: { start: string, end: string }) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate = new Date(startOfDay);
    let endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    switch (period) {
        case 'Hoje': break;
        case '7 dias': startDate.setDate(now.getDate() - 7); break;
        case '15 dias': startDate.setDate(now.getDate() - 15); break;
        case '30 dias': startDate.setDate(now.getDate() - 30); break;
        case '3 meses': startDate.setMonth(now.getMonth() - 3); break;
        case '6 meses': startDate.setMonth(now.getMonth() - 6); break;
        case '1 ano': startDate.setFullYear(now.getFullYear() - 1); break;
        case 'Customizado':
            if (customRange?.start && customRange?.end) {
                startDate = new Date(customRange.start + 'T00:00:00');
                endDate = new Date(customRange.end + 'T23:59:59');
            }
            break;
    }

    return orders.filter(o => {
        const orderDate = new Date(o.timestamp);
        return orderDate >= startDate && orderDate <= endDate;
    });
};

export const calculateFunnel = (totalCount: number) => {
    const cartCount = Math.round(totalCount * 2.5) || 0;
    const viewCount = Math.round(cartCount * 3.3) || 0;
    return [
        { name: 'Visualizações', value: viewCount, fill: '#94A3B8' },
        { name: 'Adic. Sacola', value: cartCount, fill: '#F97316' },
        { name: 'Pedidos', value: totalCount, fill: '#EA2831' },
    ];
};

export const calculateABC = (orders: Order[]) => {
    const productStats: Record<string, { current: number, name: string, revenue: number }> = {};
    orders.forEach(o => {
        o.items.forEach(item => {
            if (!productStats[item.id]) productStats[item.id] = { current: 0, name: item.name, revenue: 0 };
            productStats[item.id].current += item.quantity;
            productStats[item.id].revenue += (item.price * item.quantity);
        });
    });

    const sorted = Object.values(productStats).sort((a, b) => b.revenue - a.revenue);
    const totalRev = sorted.reduce((acc, p) => acc + p.revenue, 0);
    let accum = 0;

    return sorted.map(p => {
        accum += p.revenue;
        const pct = (accum / totalRev) * 100;
        return {
            ...p,
            revenue: roundFinance(p.revenue),
            classification: pct <= 80 ? 'A' : pct <= 95 ? 'B' : 'C'
        };
    });
};

export const calculateChannelComparison = (orders: Order[]) => {
    let delRev = 0, delCount = 0;
    let tabRev = 0, tabCount = 0;

    orders.forEach(o => {
        if (o.origin === 'DELIVERY' || o.isDelivery) { delRev += o.total; delCount++; }
        else if (o.tableNumber || o.origin === 'MESA') { tabRev += o.total; tabCount++; }
    });

    return [
        { name: 'Delivery', ticket: delCount > 0 ? roundFinance(delRev / delCount) : 0, fill: '#3b82f6' },
        { name: 'Mesa', ticket: tabCount > 0 ? roundFinance(tabRev / tabCount) : 0, fill: '#eab308' }
    ];
};

export const calculateQualityMetrics = (orders: Order[]) => {
    const completed = orders.filter(o => o.status === OrderStatus.DELIVERED);
    const cancelled = orders.filter(o => o.status === OrderStatus.CANCELLED);
    
    const onTime = completed.filter(o => {
        const time = (new Date(o.deliveredAt || new Date()).getTime() - new Date(o.timestamp).getTime()) / 60000;
        return time <= 45;
    }).length;

    const score = completed.length > 0 
        ? Math.round(((onTime / completed.length) * 0.7 + (1 - (cancelled.length / (orders.length || 1))) * 0.3) * 100)
        : 100;

    return {
        score,
        complaintRate: orders.length > 0 ? roundFinance((cancelled.length / orders.length) * 100) : 0,
        onTimeRate: completed.length > 0 ? Math.round((onTime / completed.length) * 100) : 100
    };
};

export const calculateDispatchPerformance = (orders: Order[]) => {
    let under10 = 0, over20 = 0;
    const driverLoad: Record<string, number> = {};

    orders.forEach(o => {
        if (o.dispatchedAt && o.timestamp) {
            const mins = (new Date(o.dispatchedAt).getTime() - new Date(o.timestamp).getTime()) / 60000;
            if (mins < 10) under10++;
            else if (mins > 20) over20++;
        }
        if (o.status === OrderStatus.DISPATCHED && o.driverName) {
            driverLoad[o.driverName] = (driverLoad[o.driverName] || 0) + 1;
        }
    });

    let driversAtLimit = 0, activeDrivers = 0;
    Object.values(driverLoad).forEach(load => {
        activeDrivers++;
        if (load >= 6) driversAtLimit++;
    });

    return {
        performance: { under10, over20 },
        bagAlerts: { driversAtLimit, activeDrivers }
    };
};

export const calculateTimeMetrics = (orders: Order[]) => {
    let accTime = 0, accCount = 0, prepTime = 0, prepCount = 0, delTime = 0, delCount = 0;
    const catTimes: Record<string, { total: number, count: number }> = {};

    orders.forEach(o => {
        if (o.preparedAt && o.timestamp) { accTime += new Date(o.preparedAt).getTime() - new Date(o.timestamp).getTime(); accCount++; }
        
        let pTime = 0;
        if (o.dispatchedAt && o.preparedAt) pTime = new Date(o.dispatchedAt).getTime() - new Date(o.preparedAt).getTime();
        else if (o.dispatchedAt && o.timestamp) pTime = (new Date(o.dispatchedAt).getTime() - new Date(o.timestamp).getTime()) * 0.8;
        
        if (pTime > 0) {
            prepTime += pTime; prepCount++;
            const cats = Array.from(new Set(o.items.map(i => i.category)));
            cats.forEach(c => {
                if (!catTimes[c]) catTimes[c] = { total: 0, count: 0 };
                catTimes[c].total += pTime;
                catTimes[c].count++;
            });
        }

        if (o.deliveredAt && o.dispatchedAt) { delTime += new Date(o.deliveredAt).getTime() - new Date(o.dispatchedAt).getTime(); delCount++; }
    });

    const categoryEfficiency = Object.entries(catTimes)
        .map(([name, d]) => ({ name, avgTime: Math.round(d.total / d.count / 60000) }))
        .sort((a, b) => a.avgTime - b.avgTime).slice(0, 4);

    return {
        avgAcceptance: accCount ? Math.round(accTime / accCount / 60000) : 2,
        avgPrep: prepCount ? Math.round(prepTime / prepCount / 60000) : 15,
        avgDelivery: delCount ? Math.round(delTime / delCount / 60000) : 20,
        categoryEfficiency
    };
};
