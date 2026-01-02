
import React, { useRef } from 'react';
import { Camera, Star, User, Plus, MapPin, Trash2 } from 'lucide-react';
import { maskPhone, maskDate } from '../../../../../../shared/utils/mathEngine';

interface NewCustomerFormStepProps {
    formData: any;
    setFormData: (data: any) => void;
    onSetViewAddress: () => void;
}

export const NewCustomerFormStep: React.FC<NewCustomerFormStepProps> = ({ formData, setFormData, onSetViewAddress }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) setFormData({ ...formData, photo: event.target!.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleRemoveAddress = (id: string) => {
        setFormData({ ...formData, addresses: formData.addresses.filter((a: any) => a.id !== id) });
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar p-8 space-y-8 animate-[fadeIn_0.3s]">
            <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-6 h-6 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-slate-500 text-[10px]">1</span> Dados Pessoais
                    </h3>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-col items-center gap-3 shrink-0">
                        <div className="relative size-32 rounded-full bg-gray-50 dark:bg-gray-800 border-4 border-white dark:border-gray-700 shadow-lg cursor-pointer group hover:border-[#EA2831] transition-all flex items-center justify-center overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                            {formData.photo ? <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-gray-300 group-hover:text-[#EA2831]" />}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera className="w-8 h-8 text-white" /></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Foto do Perfil</span>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nome Completo *</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#EA2831] font-bold text-slate-900 dark:text-white" placeholder="Ex: João Silva" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">WhatsApp *</label><input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: maskPhone(e.target.value)})} className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#EA2831] font-bold text-slate-900 dark:text-white" placeholder="(00) 00000-0000" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">E-mail (Opcional)</label><input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#EA2831] font-bold text-slate-900 dark:text-white" placeholder="cliente@email.com" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nascimento (Opcional)</label><input value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: maskDate(e.target.value)})} className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#EA2831] font-bold text-slate-900 dark:text-white" placeholder="DD/MM/AAAA" maxLength={10} /></div>
                        <div className="space-y-1 col-span-full"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Observações / Alergias</label><textarea value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#EA2831] font-medium text-slate-900 dark:text-white min-h-[80px]" placeholder="Preferências, alergias ou notas importantes..." /></div>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-2"><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><span className="w-6 h-6 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-slate-500 text-[10px]">2</span> Fidelidade Inicial</h3></div>
                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-3xl flex items-center justify-between mx-1"><div className="flex items-center gap-4"><div className="size-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center text-yellow-600"><Star className="w-6 h-6 fill-current" /></div><div><p className="text-base font-black text-slate-900 dark:text-white">Saldo de Pontos</p><p className="text-xs font-bold text-slate-500">Defina o saldo inicial para este cliente</p></div></div><div className="relative w-40"><input type="number" value={formData.points} onChange={e => setFormData({...formData, points: parseInt(e.target.value) || 0})} className="w-full pl-4 pr-10 py-3 bg-white dark:bg-surface-dark border-2 border-yellow-200 rounded-2xl font-black text-xl text-right text-yellow-600 focus:ring-0" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-yellow-400">pts</span></div></div>
            </div>
            <div className="space-y-4 pb-24">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-2"><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><span className="w-6 h-6 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-slate-500 text-[10px]">3</span> Endereços Cadastrados</h3><button onClick={onSetViewAddress} disabled={formData.addresses.length >= 2} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black disabled:opacity-50 flex items-center gap-2"><Plus className="w-3 h-3" /> Novo Endereço</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">{formData.addresses.length === 0 ? <div className="col-span-full p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-3"><MapPin className="w-8 h-8 opacity-30" /><span className="text-sm font-bold opacity-60">Nenhum endereço cadastrado</span></div> : formData.addresses.map((addr: any, idx: number) => (<div key={addr.id || idx} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 animate-[fadeIn_0.3s]"><div className="flex items-center gap-4"><div className="size-10 bg-white dark:bg-surface-dark rounded-xl flex items-center justify-center text-[#EA2831] shadow-sm"><MapPin className="w-5 h-5" /></div><div><p className="text-sm font-black text-slate-900 dark:text-white">{addr.label}</p><p className="text-xs font-bold text-slate-500">{addr.street}, {addr.number}</p></div></div><button onClick={() => handleRemoveAddress(addr.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-surface-dark rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button></div>))}</div>
            </div>
        </div>
    );
};
