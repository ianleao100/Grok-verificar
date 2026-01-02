
import React from 'react';

const mockPointsHistory = [
    { id: 1, type: 'EARN', amount: 50, description: 'Pedido #ORD-90882', date: '17/12/2025' },
    { id: 2, type: 'SPEND', amount: -150, description: 'Resgate de Cupom R$ 5,00', date: '15/12/2025' },
    { id: 3, type: 'EARN', amount: 120, description: 'Pedido #ORD-HIST-001', date: '10/12/2025' },
    { id: 4, type: 'EARN', amount: 30, description: 'Avaliação de Pedido', date: '08/12/2025' },
    { id: 5, type: 'EARN', amount: 300, description: 'Bônus de Boas Vindas', date: '01/12/2025' },
];

const Icon: React.FC<{ name: string, className?: string, style?: React.CSSProperties }> = ({ name, className = "", style }) => (
  <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
);

interface LoyaltyPointsCardProps {
    points: number;
}

export const LoyaltyPointsCard: React.FC<LoyaltyPointsCardProps> = ({ points }) => {
    return (
        <div className="p-4 space-y-6 animate-[slideIn_0.2s_ease-out]">
            {/* Top Badge Card */}
            <div className="flex justify-center">
                <div className="bg-[#ea2a33]/10 rounded-full px-6 py-2 flex items-center gap-2 border border-[#ea2a33]/20 shadow-sm">
                    <Icon name="loyalty" className="text-[#ea2a33] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }} />
                    <span className="text-2xl font-bold text-[#ea2a33]">{points} Pontos</span>
                </div>
            </div>

            {/* History Section */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 ml-1">Histórico de Pontos</h3>
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    {mockPointsHistory.map((item, index) => (
                        <div key={item.id} className={`flex items-center justify-between p-4 ${index !== mockPointsHistory.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'EARN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                    <Icon name={item.type === 'EARN' ? 'arrow_upward' : 'arrow_downward'} className="text-lg font-bold" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900 dark:text-white text-sm">{item.description}</span>
                                    <span className="text-xs text-gray-500">{item.date}</span>
                                </div>
                            </div>
                            <span className={`font-bold ${item.type === 'EARN' ? 'text-green-600' : 'text-red-500'}`}>
                                {item.type === 'EARN' ? '+' : ''}{item.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
