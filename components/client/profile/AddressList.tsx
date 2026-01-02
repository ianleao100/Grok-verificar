
import React from 'react';

interface AddressListProps {
    addresses: any[];
    onDelete: (id: string) => void;
    onAdd: () => void;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const AddressList: React.FC<AddressListProps> = ({ addresses, onDelete, onAdd }) => {
    return (
        <div className="p-4 space-y-4 animate-[slideIn_0.2s_ease-out]">
            {addresses.map(addr => (
                <div key={addr.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-gray-600 dark:text-gray-300">
                            <Icon name={addr.icon || 'home'} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white text-base">{addr.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{addr.street}, {addr.number}</p>
                        </div>
                    </div>
                    <button onClick={() => onDelete(addr.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                        <Icon name="delete" className="text-xl" />
                    </button>
                </div>
            ))}
            
            <button 
                onClick={onAdd} 
                className="w-full bg-[#ea2a33] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#ea2a33]/30 hover:bg-[#d6252d] transition-colors flex items-center justify-center gap-2 mt-4"
            >
                Novo Endereço
            </button>
        </div>
    );
};
