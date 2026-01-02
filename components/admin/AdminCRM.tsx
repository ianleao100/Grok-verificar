
import React, { useState, useMemo } from 'react';
import { useCustomerLoyalty } from '../../hooks/useCustomerLoyalty';
import { CustomerDetailModal } from './crm/CustomerDetailModal';
import { NewCustomerModal } from './crm/NewCustomerModal';
import { CustomerProfile } from '../../types';
import { CustomerStatsHeader } from './crm/CustomerStatsHeader';
import { CustomerSearchBar } from './crm/CustomerSearchBar';
import { CustomerListActions } from './crm/CustomerListActions';
import { CustomerTable } from './crm/CustomerTable';
import { DeleteCustomerModal } from './crm/DeleteCustomerModal';

type SortDirection = 'asc' | 'desc';
type SortKey = keyof CustomerProfile | 'lastOrderAt';

export const AdminCRM: React.FC = () => {
  const { customers, addCustomer, editCustomer, removeCustomer } = useCustomerLoyalty();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerProfile | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerProfile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'lastOrderAt', direction: 'desc' });

  const handleSort = (key: SortKey) => {
      setSortConfig((current) => {
          if (current.key === key) return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
          if (['points', 'orderCount', 'totalSpent'].includes(key)) return { key, direction: 'desc' };
          return { key, direction: 'asc' };
      });
  };

  const filteredCustomers = useMemo(() => {
      const safeCustomers = customers || [];
      let result = safeCustomers.filter(c => (c?.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) || (c?.whatsapp && c.whatsapp.includes(searchTerm)));

      result = result.sort((a, b) => {
          if (!a || !b) return 0;
          const direction = sortConfig.direction === 'asc' ? 1 : -1;
          
          if (sortConfig.key === 'birthDate') {
              const parseDate = (d?: string) => (!d || d.length < 10) ? 0 : new Date(d.split('/').reverse().join('-')).getTime();
              return (parseDate(a.birthDate) - parseDate(b.birthDate)) * direction;
          }
          if (sortConfig.key === 'lastOrderAt') {
             return ((a.lastOrderAt ? new Date(a.lastOrderAt).getTime() : 0) - (b.lastOrderAt ? new Date(b.lastOrderAt).getTime() : 0)) * direction;
          }
          
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          if (aValue === undefined || aValue === null) return 1;
          if (bValue === undefined || bValue === null) return -1;
          if (aValue < bValue) return -1 * direction;
          if (aValue > bValue) return 1 * direction;
          return 0;
      });
      return result;
  }, [customers, searchTerm, sortConfig]);

  const totalPages = Math.ceil((filteredCustomers?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers?.slice(indexOfFirstItem, indexOfLastItem) || [];

  useMemo(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage, sortConfig]);

  const handleSaveCustomer = (data: any) => {
      if (customerToEdit) editCustomer({ ...customerToEdit, ...data });
      else addCustomer(data);
      setIsAddModalOpen(false);
      setCustomerToEdit(null);
  };

  const handleConfirmDelete = () => {
      if (customerToDelete?.id) {
          removeCustomer(customerToDelete.id);
          setCustomerToDelete(null);
      }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out] pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-2">
            <CustomerStatsHeader />
            <div className="flex items-center gap-3 w-full md:w-auto">
                <CustomerSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                <CustomerListActions 
                    onNewCustomer={() => { setCustomerToEdit(null); setIsAddModalOpen(true); }}
                    onSortChange={(config) => setSortConfig(config)}
                />
            </div>
        </div>

        <CustomerTable 
            customers={currentCustomers}
            sortConfig={sortConfig}
            onSort={handleSort}
            onSelectCustomer={setSelectedCustomer}
            onEditCustomer={(c) => { setCustomerToEdit(c); setIsAddModalOpen(true); }}
            onDeleteCustomer={setCustomerToDelete}
            pagination={{
                currentPage,
                itemsPerPage,
                totalPages,
                indexOfFirstItem,
                indexOfLastItem,
                totalItems: filteredCustomers.length,
                onPageChange: setCurrentPage,
                onItemsPerPageChange: setItemsPerPage
            }}
        />

        {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
        {isAddModalOpen && <NewCustomerModal onClose={() => { setIsAddModalOpen(false); setCustomerToEdit(null); }} onSave={handleSaveCustomer} initialData={customerToEdit} />}
        {customerToDelete && <DeleteCustomerModal customer={customerToDelete} onCancel={() => setCustomerToDelete(null)} onConfirm={handleConfirmDelete} />}
    </div>
  );
};
