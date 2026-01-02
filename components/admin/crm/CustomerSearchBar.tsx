
import React from 'react';
import { Search } from 'lucide-react';

interface CustomerSearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const CustomerSearchBar: React.FC<CustomerSearchBarProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="relative group flex-1 md:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#EA2831] transition-colors" />
            <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => onSearchChange(e.target.value)} 
                placeholder="Buscar cliente..." 
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#EA2831] outline-none transition-all" 
            />
        </div>
    );
};
