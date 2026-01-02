
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Order, OrderStatus, RiderProfile } from '../../../types';
import { storageService } from '../../../services/storageService';
import { useOrderTimer } from '../../../hooks/useOrderTimer';
import { optimizeRoute } from '../../../shared/utils/mathEngine';
import { useOrderManager } from '../../../hooks/core/useOrderManager';
import { OrderDetailsModal } from './OrderDetailsModal';

// Modular Components
import { OrderSelectionToolbar } from './OrderSelectionToolbar';
import { OrderKanbanBoard } from './OrderKanbanBoard';
import { OrderActionModals } from './OrderActionModals';

const BAG_LIMIT = 6;

export default function OrderManager() {
  const { orders, updateOrderStatus } = useOrderManager();
  const [drivers, setDrivers] = useState<RiderProfile[]>([]);
  
  // Modals & Selection State
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
      isOpen: boolean; type: 'REJECT' | 'CANCEL'; order: Order | null;
  }>({ isOpen: false, type: 'REJECT', order: null });

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  
  const { getElapsedTimeInMinutes } = useOrderTimer();

  useEffect(() => {
      const load = () => setDrivers(storageService.loadDrivers());
      load();
      const interval = setInterval(load, 5000); 
      return () => clearInterval(interval);
  }, []);

  const driversWithLoad = useMemo(() => {
      return drivers.map(driver => {
          const activeLoad = orders.filter(o => 
              o.status === OrderStatus.DISPATCHED && o.driverName === driver.name && !o.deliveredAt
          ).length;
          return { ...driver, activeLoad };
      }).sort((a, b) => (a.dailyOrdersCount !== b.dailyOrdersCount) ? a.dailyOrdersCount - b.dailyOrdersCount : a.activeLoad - b.activeLoad);
  }, [drivers, orders]);

  const handleBulkDispatch = useCallback((driverId: string, driverName: string, activeLoad: number) => {
      const targets = orders.filter(o => selectedOrders.includes(o.id));
      if (activeLoad + targets.length > BAG_LIMIT) {
          alert(`OPERAÇÃO BLOQUEADA! Limite de bag excedido.`);
          return;
      }
      optimizeRoute(targets).forEach((order, index) => {
          updateOrderStatus(order, OrderStatus.DISPATCHED, { driverName, routeSequence: index + 1 });
      });
      storageService.incrementDriverCount(driverId, targets.length);
      setDrivers(storageService.loadDrivers()); 
      setIsDriverModalOpen(false);
      setSelectedOrders([]);
  }, [selectedOrders, orders, updateOrderStatus]);

  const handleSmartSplitDispatch = useCallback(() => {
      const targets = orders.filter(o => selectedOrders.includes(o.id));
      const driverA = driversWithLoad[0];
      const driverB = driversWithLoad[1];

      if (!driverA || !driverB) { alert("Sem entregadores suficientes."); return; }

      const midPoint = Math.ceil(targets.length / 2);
      const batchA = targets.slice(0, midPoint);
      const batchB = targets.slice(midPoint);

      optimizeRoute(batchA).forEach((o, i) => updateOrderStatus(o, OrderStatus.DISPATCHED, { driverName: driverA.name, routeSequence: i + 1 }));
      storageService.incrementDriverCount(driverA.id, batchA.length);

      optimizeRoute(batchB).forEach((o, i) => updateOrderStatus(o, OrderStatus.DISPATCHED, { driverName: driverB.name, routeSequence: i + 1 }));
      storageService.incrementDriverCount(driverB.id, batchB.length);

      setDrivers(storageService.loadDrivers());
      setIsDriverModalOpen(false);
      setSelectedOrders([]);
      alert(`Lote dividido: ${driverA.name} (${batchA.length}) e ${driverB.name} (${batchB.length})`);
  }, [selectedOrders, orders, driversWithLoad, updateOrderStatus]);

  const toggleSelection = (orderId: string) => {
      setSelectedOrders(prev => prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]);
  };

  const executeConfirmAction = useCallback(() => {
      if (confirmModal.order) {
          updateOrderStatus(confirmModal.order, OrderStatus.CANCELLED);
          setConfirmModal({ isOpen: false, type: 'REJECT', order: null });
      }
  }, [confirmModal, updateOrderStatus]);

  // Order Details Nav Helper (Simplified Logic for Nav)
  const handleNavigateOrder = useCallback((direction: 'prev' | 'next') => {
      if (!detailOrder) return;
      const sorted = orders.filter(o => o.status === detailOrder.status).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      const idx = sorted.findIndex(o => o.id === detailOrder.id);
      if (idx === -1) return;
      const newIdx = direction === 'prev' ? idx - 1 : idx + 1;
      if (newIdx >= 0 && newIdx < sorted.length) setDetailOrder(sorted[newIdx]);
  }, [detailOrder, orders]);

  return (
    <div className="min-h-screen flex flex-col animate-[fadeIn_0.3s_ease-out] bg-[#f8f6f6] dark:bg-background-dark pb-10">
      
      <OrderSelectionToolbar 
          orders={orders}
          onAudit={() => setIsAuditModalOpen(true)}
          sectorFilter={sectorFilter}
          setSectorFilter={setSectorFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
      />
      
      <OrderKanbanBoard 
          orders={orders}
          searchTerm={searchTerm}
          sectorFilter={sectorFilter}
          selectedOrders={selectedOrders}
          toggleSelection={toggleSelection}
          onDetail={setDetailOrder}
          onStatusUpdate={updateOrderStatus}
          onDispatch={(o) => { setSelectedOrders([o.id]); setIsDriverModalOpen(true); }}
          onCancel={(o, type) => setConfirmModal({ isOpen: true, type, order: o })}
          getElapsedTime={getElapsedTimeInMinutes}
      />

      {detailOrder && (
          <OrderDetailsModal 
              order={detailOrder}
              onClose={() => setDetailOrder(null)}
              onNavigate={handleNavigateOrder}
              onUpdateStatus={updateOrderStatus}
              onDispatch={(o) => { setSelectedOrders([o.id]); setIsDriverModalOpen(true); setDetailOrder(null); }}
              onRequestCancel={(o, type) => { setConfirmModal({ isOpen: true, type, order: o }); setDetailOrder(null); }}
              getElapsedTime={getElapsedTimeInMinutes}
          />
      )}

      <OrderActionModals 
          isDriverModalOpen={isDriverModalOpen}
          setIsDriverModalOpen={setIsDriverModalOpen}
          selectedOrdersCount={selectedOrders.length}
          driversWithLoad={driversWithLoad}
          onBulkDispatch={handleBulkDispatch}
          onSplitDispatch={handleSmartSplitDispatch}
          bagLimit={BAG_LIMIT}
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
          onExecuteConfirm={executeConfirmAction}
      />
    </div>
  );
}
