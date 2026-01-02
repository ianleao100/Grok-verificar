
import React from 'react';
import { CheckSquare } from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { OrderCard } from './OrderCard';

interface OrderKanbanBoardProps {
    orders: Order[];
    searchTerm: string;
    sectorFilter: string;
    selectedOrders: string[];
    toggleSelection: (id: string) => void;
    onDetail: (order: Order) => void;
    onStatusUpdate: (order: Order, status: OrderStatus) => void;
    onDispatch: (order: Order) => void;
    onCancel: (order: Order, type: 'REJECT' | 'CANCEL') => void;
    getElapsedTime: (date: Date) => number;
}

const COLUMNS = [
    { id: OrderStatus.PENDING, label: 'NOVOS PEDIDOS', color: 'bg-yellow-400' },
    { id: OrderStatus.PREPARING, label: 'EM PREPARO', color: 'bg-blue-400' },
    { id: OrderStatus.READY, label: 'PRONTO (AGUARDANDO)', color: 'bg-orange-400' },
    { id: OrderStatus.DISPATCHED, label: 'EM ROTA', color: 'bg-purple-400' },
];

export const OrderKanbanBoard: React.FC<OrderKanbanBoardProps> = ({
    orders,
    searchTerm,
    sectorFilter,
    selectedOrders,
    toggleSelection,
    onDetail,
    onStatusUpdate,
    onDispatch,
    onCancel,
    getElapsedTime
}) => {
    
    const getOrdersByStatus = (status: OrderStatus) => {
        return orders
            .filter(o => {
                const statusMatch = o.status === status;
                const searchMatch = (o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
                const sectorMatch = sectorFilter === 'ALL' || o.sector === sectorFilter;
                if (status === OrderStatus.READY) return statusMatch && searchMatch && sectorMatch;
                return statusMatch && searchMatch;
            })
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    };

    return (
        <div className="flex-1 px-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full min-h-[600px]">
                {COLUMNS.map(col => {
                    const items = getOrdersByStatus(col.id as OrderStatus);
                    return (
                      <div key={col.id} className="flex flex-col h-full">
                          <div className={`flex items-center gap-3 mb-3 px-2`}>
                              <div className={`w-2.5 h-2.5 rounded-full ${col.color} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}></div>
                              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{col.label}</h3>
                              <span className="ml-auto bg-white dark:bg-surface-dark px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-500 shadow-sm border border-gray-100 dark:border-gray-700">
                                  {items.length}
                              </span>
                          </div>
                          <div className="flex-1 bg-gray-100/50 dark:bg-gray-800/20 rounded-[24px] p-3 border border-dashed border-gray-200 dark:border-gray-800 relative overflow-y-auto no-scrollbar space-y-3">
                              {items.length === 0 && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none opacity-50">
                                      <span className="text-4xl font-black opacity-20">0</span>
                                      <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Vazio</span>
                                  </div>
                              )}
                              {items.map(order => (
                                  <div key={order.id} className="relative group">
                                      {col.id === OrderStatus.READY && (
                                          <div className="absolute top-3 left-3 z-30">
                                              <button 
                                                  onClick={(e) => { e.stopPropagation(); toggleSelection(order.id); }}
                                                  className={`p-1 rounded-lg transition-all ${selectedOrders.includes(order.id) ? 'bg-[#EA2831] text-white' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}`}
                                              >
                                                  <CheckSquare className="w-4 h-4" />
                                              </button>
                                          </div>
                                      )}
                                      <OrderCard 
                                          order={order}
                                          elapsedMinutes={getElapsedTime(order.timestamp)}
                                          onSelect={onDetail}
                                          onUpdateStatus={onStatusUpdate}
                                          onDispatchOpen={() => { toggleSelection(order.id); onDispatch(order); }}
                                          onRequestCancel={onCancel}
                                      />
                                      {order.sector && (
                                          <div className="absolute bottom-3 right-3 z-20 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider pointer-events-none opacity-80">
                                              {order.sector}
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      </div>
                    );
                })}
            </div>
        </div>
    );
};
