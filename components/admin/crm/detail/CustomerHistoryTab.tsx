
import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../../../../shared/utils/mathEngine';

interface CustomerHistoryTabProps {
    history: any[];
}

export const CustomerHistoryTab: React.FC<CustomerHistoryTabProps> = ({ history }) => {
    return (
        <div className="space-y-4 animate-[fadeIn_0.3s]">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#EA2831]" /> Pedidos Realizados
            </h3>
            <div className="bg-white dark:bg-surface-dark rounded-[24px] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                {history.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumo</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {history.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-sm text-slate-700 dark:text-gray-300">{new Date(order.timestamp).toLocaleDateString()}</span>
                                        <p className="text-[10px] text-slate-400 font-bold">{new Date(order.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-1 max-w-[200px]">{order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-black text-sm text-slate-900 dark:text-white">{formatCurrency(order.total)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-bold uppercase tracking-widest">Nenhum pedido no histórico</p>
                    </div>
                )}
            </div>
        </div>
    );
};
