
import React, { useState } from 'react';
import { CustomerDetailsModal } from './CustomerDetailsModal';
import { CustomerListTable } from './customers/CustomerListTable';
import { NewCustomerForm } from './customers/NewCustomerForm';

interface ProCustomersProps {
    loyaltySystem: any;
}

export default function ProCustomers({ loyaltySystem }: ProCustomersProps) {
  const { addCustomer } = loyaltySystem;

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const handleSaveCustomer = (newCustomer: any) => {
      addCustomer(newCustomer);
      setIsAddModalOpen(false);
  };

  return (
    <>
      <CustomerListTable 
          loyaltySystem={loyaltySystem}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onSelectCustomer={setSelectedCustomer}
      />

      {selectedCustomer && (
          <CustomerDetailsModal 
              customer={selectedCustomer} 
              onClose={() => setSelectedCustomer(null)} 
          />
      )}

      {isAddModalOpen && (
          <NewCustomerForm 
              onClose={() => setIsAddModalOpen(false)}
              onSave={handleSaveCustomer}
          />
      )}
    </>
  );
}
