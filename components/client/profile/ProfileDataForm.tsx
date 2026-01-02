
import React from 'react';
import { maskDate } from '../../../shared/utils/mathEngine';

interface ProfileDataFormProps {
    userProfile: any;
    onChange: (newProfile: any) => void;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const ProfileDataForm: React.FC<ProfileDataFormProps> = ({ userProfile, onChange }) => {
    const inputClasses = "w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#ea2a33] focus:border-[#ea2a33] outline-none transition-all placeholder:text-gray-400";
    const labelClasses = "block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2";

    return (
        <div className="p-4 space-y-4 animate-[slideIn_0.2s_ease-out]">
            <div>
                <label className={labelClasses}>Nome Completo</label>
                <input 
                    className={inputClasses} 
                    value={userProfile.fullName} 
                    onChange={(e) => onChange({...userProfile, fullName: e.target.value})} 
                />
            </div>
            <div>
                <label className={labelClasses}>WhatsApp</label>
                <input 
                    className={inputClasses} 
                    value={userProfile.whatsapp} 
                    onChange={(e) => onChange({...userProfile, whatsapp: e.target.value})} 
                />
            </div>
            <div>
                <label className={labelClasses}>Data de Nascimento</label>
                <div className="relative">
                    <input 
                        className={inputClasses} 
                        value={userProfile.birthDate || ''} 
                        onChange={(e) => onChange({...userProfile, birthDate: maskDate(e.target.value)})} 
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon name="calendar_month" />
                    </span>
                </div>
            </div>
            <div>
                <label className={labelClasses}>Observações / Alergias</label>
                <textarea 
                    className={inputClasses} 
                    value={userProfile.observations || ''} 
                    onChange={(e) => onChange({...userProfile, observations: e.target.value})}
                    placeholder="Alguma observação ou alergia alimentar?"
                    rows={3}
                />
            </div>
            <div className="pt-4">
                <button className="w-full bg-[#ea2a33] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#ea2a33]/30 hover:bg-[#d6252d] transition-colors">
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};
