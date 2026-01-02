
import React from 'react';
import { useCustomerSearch } from '../../../hooks/useCustomerSearch';

// Este componente encapsula a lógica de busca que é usada internamente nos modais.
// No design atual do PDV, a busca visual é feita dentro do componente PosCart ou DeliveryModal.
// Mantemos este arquivo para respeitar a estrutura solicitada e para futura expansão de busca isolada.

interface PosCustomerSearchProps {
    loyaltySystem: any;
    onSelectCustomer: (customer: any) => void;
}

export const PosCustomerSearch: React.FC<PosCustomerSearchProps> = ({ loyaltySystem, onSelectCustomer }) => {
    const { 
        searchTerm, 
        handleSearch, 
        suggestions, 
        showSuggestions 
    } = useCustomerSearch({ loyaltySystem });

    // Renderless logic provider pattern or simplistic UI if needed elsewhere
    return null; 
};
