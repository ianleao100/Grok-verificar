
import React, { useState, useEffect, useRef } from 'react';
import { AdminTab, OrderStatus, Product } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { DashboardMain } from './dashboard/DashboardMain';
import { AdminMenuManager } from './AdminMenuManager';
import { AdminCRM } from './AdminCRM';
import { AdminReports } from './reports/AdminReports';
import { AdminMarketing } from './marketing/AdminMarketing';
import { AdminSettings } from './settings/AdminSettings';
import { SalesHistory } from '../professional/history/SalesHistory';
import { AdminFinancial } from './financial/AdminFinancial';
import { storageService } from '../../services/storageService';
import { Bell, AlertTriangle } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [criticalStockItems, setCriticalStockItems] = useState<Product[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevPendingCount = useRef<number>(0);

  const playAlert = () => {
      if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.warn("Autoplay bloqueado:", e));
      }
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  useEffect(() => {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

      const checkData = () => {
          const orders = storageService.loadOrders();
          const pending = orders.filter(o => o.status === OrderStatus.PENDING).length;

          if (pending > prevPendingCount.current) playAlert();
          prevPendingCount.current = pending;

          const products = storageService.getProducts();
          const critical = products.filter(p => p.stockControlEnabled && !p.available && (p.currentStock || 0) <= (p.minStock || 0));
          setCriticalStockItems(critical);
      };

      const initialOrders = storageService.loadOrders();
      prevPendingCount.current = initialOrders.filter(o => o.status === OrderStatus.PENDING).length;
      checkData();

      window.addEventListener('storage-update', checkData);
      window.addEventListener('storage', checkData);
      const interval = setInterval(checkData, 10000);

      return () => {
          window.removeEventListener('storage-update', checkData);
          window.removeEventListener('storage', checkData);
          clearInterval(interval);
      };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD': return <DashboardMain />;
      case 'MENU': return <AdminMenuManager />;
      case 'CRM': return <AdminCRM />;
      case 'HISTORY': return <SalesHistory />;
      case 'FINANCIAL': return <AdminFinancial />;
      case 'REPORTS': return <AdminReports />;
      case 'MARKETING': return <AdminMarketing />;
      case 'SETTINGS': return <AdminSettings />;
      default: return <DashboardMain />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f6f6] dark:bg-background-dark font-display overflow-hidden text-slate-900 dark:text-white transition-colors">
      
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
          <div className="absolute top-4 right-8 z-50 flex flex-col items-end gap-2">
              {criticalStockItems.length > 0 && (
                  <div className="bg-red-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-[slideDown_0.3s_ease-out] border-2 border-red-400">
                      <div className="p-1.5 bg-white/20 rounded-full animate-pulse"><AlertTriangle className="w-4 h-4 fill-white text-red-600" /></div>
                      <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-90">Estoque Crítico</span>
                          <span className="text-xs font-bold">{criticalStockItems.length} {criticalStockItems.length === 1 ? 'item pausado' : 'itens pausados'}</span>
                      </div>
                  </div>
              )}
              <button onClick={playAlert} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-slate-500 hover:text-[#EA2831] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95 w-fit">
                  <Bell className="w-3 h-3" /> Testar Alerta
              </button>
          </div>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-8 no-scrollbar h-full">{renderContent()}</main>
      </div>
    </div>
  );
};
