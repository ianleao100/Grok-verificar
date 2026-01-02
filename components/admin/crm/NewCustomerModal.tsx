
import React, { useState, useEffect } from 'react';
import { X, User, MapPin, ChevronLeft, Save, CheckCircle } from 'lucide-react';
import { BaseModal } from '../../ui/BaseModal';
import { CustomerProfile, Address } from '../../../types';
import { NewCustomerFormStep } from './new-customer/NewCustomerFormStep';
import { NewCustomerAddressStep } from './new-customer/NewCustomerAddressStep';

interface NewCustomerModalProps {
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: CustomerProfile | null;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({ onClose, onSave, initialData }) => {
    const [view, setView] = useState<'MAIN' | 'ADDRESS'>('MAIN');
    
    // Form States
    const [formData, setFormData] = useState({
        name: '', whatsapp: '', email: '', points: 0, photo: '', birthDate: '', observations: '', addresses: [] as Address[]
    });

    const [addressForm, setAddressForm] = useState<Partial<Address>>({
        label: '', street: '', number: '', district: '', complement: '', reference: '', city: '', cep: '',
        lat: -14.2233, lng: -42.7766, icon: 'home'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                whatsapp: initialData.whatsapp || '',
                email: initialData.email || '',
                points: initialData.points || 0,
                photo: initialData.photo || '',
                birthDate: initialData.birthDate || '',
                observations: initialData.observations || '',
                addresses: initialData.addresses || []
            });
        }
    }, [initialData]);

    const handleSaveAddress = () => {
        if (!addressForm.street || !addressForm.label) { alert("Nome e Rua obrigatórios."); return; }
        const newAddr = { ...addressForm, id: Date.now().toString() } as Address;
        setFormData(prev => ({ ...prev, addresses: [...prev.addresses, newAddr] }));
        setView('MAIN');
        setAddressForm({ label: '', street: '', number: '', district: '', complement: '', reference: '', city: '', cep: '', lat: -14.2233, lng: -42.7766, icon: 'home' });
    };

    const handleFinalSave = () => {
        if (!formData.name || !formData.whatsapp) { alert("Nome e WhatsApp obrigatórios."); return; }
        onSave(formData);
        onClose();
    };

    return (
        <BaseModal onClose={onClose} className="max-w-6xl w-[95vw] h-[90vh]" hideCloseButton={true}>
            <div className="bg-white dark:bg-surface-dark rounded-[40px] shadow-2xl relative flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-surface-dark z-20">
                    {view === 'ADDRESS' ? (
                        <div className="flex items-center gap-4">
                            <button onClick={() => setView('MAIN')} className="flex items-center gap-2 text-slate-500 hover:text-[#EA2831] font-bold text-sm transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"><ChevronLeft className="w-5 h-5" /> Voltar</button>
                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3"><MapPin className="w-6 h-6 text-[#EA2831]" /> Novo Endereço</h2>
                        </div>
                    ) : (
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3"><User className="w-6 h-6 text-[#EA2831]" /> {initialData ? 'Editar Cliente' : 'Novo Cliente'}</h2>
                    )}
                    <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {view === 'MAIN' && <NewCustomerFormStep formData={formData} setFormData={setFormData} onSetViewAddress={() => setView('ADDRESS')} />}
                    {view === 'ADDRESS' && <NewCustomerAddressStep addressForm={addressForm} setAddressForm={setAddressForm} customerName={formData.name} customerWhatsapp={formData.whatsapp} />}
                </div>

                <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark z-20">
                    {view === 'MAIN' ? (
                        <button onClick={handleFinalSave} className="w-full bg-[#EA2831] hover:bg-red-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-500/20 uppercase text-sm tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-3"><Save className="w-5 h-5" /> Salvar Cadastro Completo</button>
                    ) : (
                        <button onClick={handleSaveAddress} className="w-full bg-[#EA2831] hover:bg-red-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-500/30 uppercase text-sm tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-3"><CheckCircle className="w-5 h-5" /> Confirmar e Adicionar Endereço</button>
                    )}
                </div>
            </div>
        </BaseModal>
    );
};
