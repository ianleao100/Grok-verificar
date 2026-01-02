
import React from 'react';
import { Split } from 'lucide-react';
import { BaseModal } from '../../ui/BaseModal';
import { Order, RiderProfile } from '../../../types';

interface OrderActionModalsProps {
    // Driver Modal Props
    isDriverModalOpen: boolean;
    setIsDriverModalOpen: (open: boolean) => void;
    selectedOrdersCount: number;
    driversWithLoad: (RiderProfile & { activeLoad: number })[];
    onBulkDispatch: (driverId: string, driverName: string, activeLoad: number) => void;
    onSplitDispatch: () => void;
    bagLimit: number;

    // Confirm Modal Props
    confirmModal: { isOpen: boolean; type: 'REJECT' | 'CANCEL'; order: Order | null; };
    setConfirmModal: (modal: { isOpen: boolean; type: 'REJECT' | 'CANCEL'; order: Order | null; }) => void;
    onExecuteConfirm: () => void;
}

export const OrderActionModals: React.FC<OrderActionModalsProps> = ({
    isDriverModalOpen,
    setIsDriverModalOpen,
    selectedOrdersCount,
    driversWithLoad,
    onBulkDispatch,
    onSplitDispatch,
    bagLimit,
    confirmModal,
    setConfirmModal,
    onExecuteConfirm
}) => {
    return (
        <>
            {isDriverModalOpen && (
                <BaseModal onClose={() => setIsDriverModalOpen(false)} className="max-w-xl" title="Logística de Entrega">
                    <div className="p-6 pt-0 space-y-6">
                        {selectedOrdersCount > bagLimit && (
                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl animate-[fadeIn_0.3s]">
                                <div className="flex items-start gap-3">
                                    <Split className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-blue-800 uppercase tracking-wide">Volume Excede Limite da Bag</h4>
                                        <p className="text-xs text-blue-700 mt-1 mb-3 leading-relaxed">
                                            Você selecionou <b>{selectedOrdersCount} pedidos</b>. Recomendamos dividir este lote.
                                        </p>
                                        <button 
                                            onClick={onSplitDispatch}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                        >
                                            Dividir entre os 2 mais livres
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto no-scrollbar">
                            {driversWithLoad.map((driver) => {
                                const willExceedLimit = driver.activeLoad + selectedOrdersCount > bagLimit;
                                
                                return (
                                    <button 
                                        key={driver.id}
                                        disabled={willExceedLimit}
                                        onClick={() => onBulkDispatch(driver.id, driver.name, driver.activeLoad)}
                                        className={`flex items-center gap-4 p-4 border rounded-2xl transition-all group relative ${willExceedLimit ? 'opacity-50 grayscale' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="text-left flex-1">
                                            <span className="font-black text-sm">{driver.name}</span>
                                            <span className="block text-xs text-slate-500">{driver.activeLoad} ativos</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </BaseModal>
            )}

            {confirmModal.isOpen && (
                <BaseModal onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="max-w-md">
                    <div className="p-6 text-center">
                        <h3 className="text-xl font-black mb-2">{confirmModal.type === 'REJECT' ? 'Rejeitar?' : 'Cancelar?'}</h3>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Voltar</button>
                            <button onClick={onExecuteConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Confirmar</button>
                        </div>
                    </div>
                </BaseModal>
            )}
        </>
    );
};
