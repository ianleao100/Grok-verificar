
import React, { useState } from 'react';
import { useAdminAnalytics } from '../../../hooks/core/useAdminAnalytics';
import { DashboardTabs, DashboardTab } from './DashboardTabs';
import { DashboardHeader } from './DashboardHeader';
import { DashboardOverview } from './DashboardOverview';
import { FinanceiroTab } from './tabs/FinanceiroTab';
import { ClientesTab } from './tabs/ClientesTab';
import { OperacionalTab } from './tabs/OperacionalTab';
import { PedidosTab } from './tabs/PedidosTab';
import { MarketingTab } from './tabs/MarketingTab';

export const DashboardMain: React.FC = () => {
  const [activeDashboardTab, setActiveDashboardTab] = useState<DashboardTab>('RESUMO');
  const [dateFilter, setDateFilter] = useState('Hoje');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  // Hook central de analytics
  const analytics = useAdminAnalytics(dateFilter, dateFilter === 'Customizado' ? customRange : undefined);

  const renderTabContent = () => {
      switch (activeDashboardTab) {
          case 'RESUMO':
              return <DashboardOverview analytics={analytics} />;
          case 'VENDAS':
              return <FinanceiroTab dateFilter={dateFilter} customRange={customRange} />;
          case 'OPERACAO':
              return <OperacionalTab dateFilter={dateFilter} customRange={customRange} />;
          case 'CLIENTES':
              return <ClientesTab />;
          case 'PEDIDOS':
              return <PedidosTab dateFilter={dateFilter} customRange={customRange} />;
          case 'MARKETING':
              return <MarketingTab dateFilter={dateFilter} customRange={customRange} />;
          default:
              return <DashboardOverview analytics={analytics} />;
      }
  };

  return (
    <div className="space-y-6 pb-10">
        <DashboardHeader 
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            customRange={customRange}
            setCustomRange={setCustomRange}
        />

        <div className="mb-8">
            <DashboardTabs activeTab={activeDashboardTab} onChange={setActiveDashboardTab} />
        </div>
        
        {renderTabContent()}
    </div>
  );
};
