
import React, { useState, useRef } from 'react';
import { AddressManager } from '../common/AddressManager';
import { LoyaltyPointsCard } from './profile/LoyaltyPointsCard';
import { ProfileDataForm } from './profile/ProfileDataForm';
import { AddressList } from './profile/AddressList';
import { PaymentMethodsList } from './profile/PaymentMethodsList';

interface ClientProfileProps {
  onBack: () => void;
  userProfile: any;
  setUserProfile: (profile: any) => void;
  savedAddresses: any[];
  setSavedAddresses: (addresses: any[]) => void;
  savedCards: any[];
  setSavedCards: (cards: any[]) => void;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const ClientProfile: React.FC<ClientProfileProps> = ({
  onBack, userProfile, setUserProfile, savedAddresses, setSavedAddresses, savedCards, setSavedCards
}) => {
  const [profileSubView, setProfileSubView] = useState<'MAIN' | 'DATA' | 'ACCOUNT' | 'ADDRESSES' | 'PAYMENTS' | 'POINTS'>('MAIN');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressData, setEditingAddressData] = useState<any>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileBack = () => { if (profileSubView === 'MAIN') onBack(); else setProfileSubView('MAIN'); };
  const getProfileTitle = () => {
      const titles = { DATA: 'Meus Dados', ACCOUNT: 'Minha Conta', ADDRESSES: 'Endereços', PAYMENTS: 'Pagamento', POINTS: 'Meus Pontos' };
      return titles[profileSubView] || 'Meu Perfil';
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => { if (event.target?.result) setUserProfile({ ...userProfile, photo: event.target!.result as string }); };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveAddress = (addressData: any) => {
      const newId = addressData.id || Date.now().toString();
      const newAddress = { ...addressData, id: newId };
      if (addressData.id) setSavedAddresses(savedAddresses.map(a => a.id === addressData.id ? newAddress : a));
      else setSavedAddresses([...savedAddresses, newAddress]);
      setIsAddingAddress(false);
      setEditingAddressData(undefined);
  };

  return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8f6f6] dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <header className="sticky top-0 z-50 flex items-center bg-[#f8f6f6] dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90 transition-colors">
            <button onClick={handleProfileBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer text-slate-900 dark:text-white"><Icon name="arrow_back_ios_new" /></button>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">{getProfileTitle()}</h2>
        </header>

        {profileSubView === 'MAIN' && (
            <div className="flex flex-col animate-[slideIn_0.2s_ease-out]">
                <section className="flex flex-col items-center pt-6 pb-8 px-4">
                    <div className="relative group cursor-pointer">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 shadow-sm border-4 border-white dark:border-surface-dark" style={{ backgroundImage: `url("${userProfile.photo}")` }}></div>
                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#ea2a33] text-white rounded-full p-1.5 border-4 border-[#f8f6f6] dark:border-background-dark flex items-center justify-center shadow-sm"><Icon name="photo_camera" className="text-[18px]" /></button>
                        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                    </div>
                    <div className="flex flex-col items-center justify-center mt-4">
                        <p className="text-neutral-900 dark:text-white text-[22px] font-bold leading-tight text-center">{userProfile.fullName || 'Cliente'}</p>
                        <div className="flex items-center gap-2 mt-2 bg-[#ea2a33]/10 px-4 py-1.5 rounded-full"><Icon name="loyalty" className="text-[#ea2a33] text-sm" /><p className="text-[#ea2a33] font-bold text-sm">{userProfile.points} Pontos</p></div>
                    </div>
                </section>
                <div className="px-4 mb-6">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 ml-2">Conta</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                        {[
                            { id: 'DATA', label: 'Meus Dados', icon: 'person' },
                            { id: 'POINTS', label: 'Meus Pontos', icon: 'loyalty', badge: userProfile.points },
                            { id: 'ACCOUNT', label: 'Minha Conta', icon: 'lock' },
                            { id: 'ADDRESSES', label: 'Endereços Salvos', icon: 'location_on', badge: savedAddresses.length },
                            { id: 'PAYMENTS', label: 'Formas de Pagamento', icon: 'credit_card' },
                        ].map(item => (
                            <button key={item.id} onClick={() => setProfileSubView(item.id as any)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800/50">
                                <div className="flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-white shrink-0 size-10"><Icon name={item.icon} /></div>
                                <div className="flex-1 min-w-0 text-left flex justify-between items-center pr-2"><p className="text-slate-900 dark:text-white text-base font-medium truncate">{item.label}</p>{item.badge !== undefined && <span className="bg-[#ea2a33]/10 text-[#ea2a33] text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}</div>
                                <Icon name="chevron_right" className="text-gray-400" />
                            </button>
                        ))}
                         <div className="flex items-center gap-4 p-4"><div className="flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-white shrink-0 size-10"><Icon name="notifications" /></div><div className="flex-1 min-w-0"><p className="text-slate-900 dark:text-white text-base font-medium truncate">Notificações</p></div><div className="relative w-12 h-7 cursor-pointer" onClick={() => setNotificationsEnabled(!notificationsEnabled)}><div className={`block overflow-hidden h-7 rounded-full border-2 transition-colors ${notificationsEnabled ? 'bg-[#ea2a33] border-[#ea2a33]' : 'bg-transparent border-gray-300 dark:border-gray-600'}`}></div><div className={`absolute w-5 h-5 rounded-full bg-white shadow-sm top-1 transition-all ${notificationsEnabled ? 'right-1' : 'left-1 bg-gray-300'}`}></div></div></div>
                    </div>
                </div>
                <div className="px-4 pb-8 flex justify-center"><button onClick={onBack} className="text-[#ea2a33] text-base font-medium px-6 py-3 hover:bg-[#ea2a33]/5 rounded-lg w-full">Sair da conta</button></div>
            </div>
        )}

        {profileSubView === 'POINTS' && <LoyaltyPointsCard points={userProfile.points} />}
        {profileSubView === 'DATA' && <ProfileDataForm userProfile={userProfile} onChange={setUserProfile} />}
        {profileSubView === 'ADDRESSES' && <AddressList addresses={savedAddresses} onDelete={(id) => setSavedAddresses(savedAddresses.filter(a => a.id !== id))} onAdd={() => { setEditingAddressData(undefined); setIsAddingAddress(true); }} />}
        {profileSubView === 'PAYMENTS' && <PaymentMethodsList cards={savedCards} setCards={setSavedCards} />}
        {profileSubView === 'ACCOUNT' && (
            <div className="p-4 space-y-4 animate-[slideIn_0.2s_ease-out]">
                <div><label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">E-mail</label><input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-500 font-medium" value={userProfile.email} readOnly /></div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">Alterar Senha</h3>
                <input type="password" placeholder="Senha Atual" className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none focus:border-[#ea2a33]" />
                <input type="password" placeholder="Nova Senha" className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none focus:border-[#ea2a33]" />
                <input type="password" placeholder="Confirmar Nova Senha" className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none focus:border-[#ea2a33]" />
                <div className="flex gap-3 pt-2"><button className="flex-1 bg-white border border-gray-200 text-slate-600 font-bold py-3.5 rounded-xl">Cancelar</button><button className="flex-1 bg-[#ea2a33] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#ea2a33]/30">Salvar</button></div>
            </div>
        )}
        
        {isAddingAddress && <AddressManager initialData={editingAddressData} onClose={() => setIsAddingAddress(false)} onSave={handleSaveAddress} />}
      </div>
  );
};
