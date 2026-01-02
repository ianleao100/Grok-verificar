
import React, { useState } from 'react';

interface PaymentMethodsListProps {
    cards: any[];
    setCards: (cards: any[]) => void;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ cards, setCards }) => {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardForm, setNewCardForm] = useState({ number: '', holder: '', expiry: '', cvv: '' });
    
    const inputClasses = "w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#ea2a33] focus:border-[#ea2a33] outline-none transition-all placeholder:text-gray-400";

    const saveCard = () => {
        if (newCardForm.number) {
            setCards([...cards, {
                id: Date.now().toString(),
                type: 'Cartão',
                last4: newCardForm.number.slice(-4) || '0000',
                holder: newCardForm.holder.toUpperCase() || 'TITULAR'
            }]);
            setNewCardForm({ number: '', holder: '', expiry: '', cvv: '' });
            setIsAddingCard(false);
        }
    };

    const removeCard = (id: string) => {
        setCards(cards.filter(c => c.id !== id));
    };

    return (
        <div className="p-4 space-y-4 animate-[slideIn_0.2s_ease-out]">
            {cards.map(card => (
                <div key={card.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-gray-600 dark:text-gray-300">
                            <Icon name="credit_card" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white text-base">{card.type} •••• {card.last4}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{card.holder}</p>
                        </div>
                    </div>
                    <button onClick={() => removeCard(card.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                        <Icon name="delete" className="text-xl" />
                    </button>
                </div>
            ))}
            
            {!isAddingCard ? (
                <button onClick={() => setIsAddingCard(true)} className="w-full bg-[#ea2a33] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#ea2a33]/30 hover:bg-[#d6252d] transition-colors flex items-center justify-center gap-2 mt-4">
                    Adicionar Cartão
                </button>
            ) : (
                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 animate-[fadeIn_0.3s]">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Novo Cartão</h4>
                    <input placeholder="Número do Cartão" className={inputClasses} maxLength={16} value={newCardForm.number} onChange={e => setNewCardForm({...newCardForm, number: e.target.value})} />
                    <input placeholder="Nome do Titular" className={inputClasses} value={newCardForm.holder} onChange={e => setNewCardForm({...newCardForm, holder: e.target.value})} />
                    <div className="flex gap-3">
                        <input placeholder="MM/AA" className={inputClasses} maxLength={5} value={newCardForm.expiry} onChange={e => setNewCardForm({...newCardForm, expiry: e.target.value})} />
                        <input placeholder="CVV" className={inputClasses} maxLength={3} value={newCardForm.cvv} onChange={e => setNewCardForm({...newCardForm, cvv: e.target.value})} />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button onClick={() => setIsAddingCard(false)} className="flex-1 bg-white border border-gray-200 text-slate-600 font-bold py-3 rounded-lg hover:bg-gray-50">Cancelar</button>
                        <button onClick={saveCard} className="flex-1 bg-[#ea2a33] text-white font-bold py-3 rounded-lg hover:bg-[#d6252d]">Salvar</button>
                    </div>
                </div>
            )}
        </div>
    );
};
