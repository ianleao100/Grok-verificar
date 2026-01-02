
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CustomerProfile } from '../../../types';

interface DeleteCustomerModalProps {
    customer: CustomerProfile;
    onCancel: () => void;
    onConfirm: () => void;
}

export const DeleteCustomerModal: React.FC<DeleteCustomerModalProps> = ({ customer, onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s]">
            <div className="bg-white dark:bg-surface-dark rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-[slideUp_0.3s] text-center border-4 border-red-50 dark:border-red-900/20">
                <div className="size-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 animate-bounce">
                    <AlertTriangle className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Excluir Permanente?</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                    Você está prestes a remover <span className="font-bold text-slate-900 dark:text-white">"{customer.name}"</span> do sistema. Essa ação não poderá ser desfeita.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-sm uppercase tracking-wider transition-all"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-4 bg-[#EA2831] hover:bg-red-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all active:scale-95"
                    >
                        Sim, Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};
