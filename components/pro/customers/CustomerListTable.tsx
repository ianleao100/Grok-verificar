
import React, { useState } from 'react';
import { Search, User, Phone, Star, ShoppingBag, Plus, Repeat, Calendar, FileText } from 'lucide-react';
import { useFinancialCalculations } from '../../../hooks/useFinancialCalculations';

interface CustomerListTableProps {
    loyaltySystem: any;
    onOpenAddModal: () => void;
    onSelectCustomer: (customer: any) => void;
}

export const CustomerListTable: React.FC<CustomerListTableProps> = ({ loyaltySystem, onOpenAddModal, onSelectCustomer }) => {
    const { customers } = loyaltySystem;
    const [search, setSearch] = useState('');
    const { recurrenceDays } = useFinancialCalculations();

    const filteredCustomers = (customers || []).filter((c: any) => 
        (c?.name && c.name.toLowerCase().includes(search.toLowerCase())) || 
        (c?.whatsapp && c.whatsapp.includes(search))
    );

    const totalPoints = (customers || []).reduce((acc: number, c: any) => acc + (c?.points || 0), 0);

    return (
        <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Clientes</h3>
                    <p className="text-slate-500 font-medium">Base de Clientes & CRM</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-[320px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input type="text" placeholder="Pesquisar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[24px] focus:outline-none focus:border-[#EA2831] focus:ring-1 focus:ring-[#EA2831] font-bold text-slate-900 dark:text-white shadow-sm transition-all"/>
                    </div>
                    <button onClick={onOpenAddModal} className="bg-[#EA2831] hover:bg-red-700 text-white px-6 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap">
                        <Plus className="w-4 h-4 stroke-[3]" /> Adicionar Cliente
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#EA2831] text-white p-8 rounded-[32px] shadow-xl shadow-red-500/20 flex items-center gap-6 overflow-hidden">
                    <div className="size-14 flex items-center justify-center"><Star className="fill-current w-12 h-12 text-white" /></div>
                    <div><p className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] mb-1">Pontos Distribuídos</p><p className="text-3xl font-black tracking-tight">{totalPoints.toLocaleString()} <span className="text-xs text-white/60">pts</span></p></div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-6">
                    <div className="size-14 flex items-center justify-center"><Repeat className="w-8 h-8 text-[#EA2831]" /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Recorrência de Pedidos</p><p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{recurrenceDays > 0 ? recurrenceDays : '--'} dias</p></div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-6">
                    <div className="size-14 flex items-center justify-center"><User className="w-8 h-8 text-[#EA2831]" /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Clientes na Base</p><p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{customers?.length || 0}</p></div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-surface-dark rounded-[40px] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Cliente</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Contato</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nascimento</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Observações</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Fidelidade</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {filteredCustomers.length > 0 ? filteredCustomers.map((customer: any) => (
                                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-slate-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all"><User className="w-5 h-5" /></div>
                                            <div className="flex flex-col"><span className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{customer.name}</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> {customer.orderCount || 0} pedidos</span></div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-gray-300"><div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-green-500" />{customer.whatsapp || 'Não informado'}</div></td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-600 dark:text-gray-300">{customer.birthDate ? <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-pink-400" />{customer.birthDate}</div> : '-'}</td>
                                    <td className="px-8 py-6">{customer.observations ? <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 max-w-[150px] truncate" title={customer.observations}><FileText className="w-3.5 h-3.5 text-[#EA2831]" />{customer.observations}</div> : <span className="text-slate-300 text-xs">-</span>}</td>
                                    <td className="px-8 py-6 text-center"><div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-2xl border border-primary/10 text-primary font-black text-xs"><Star className="w-3.5 h-3.5 fill-current" />{customer.points || 0}</div></td>
                                    <td className="px-8 py-6 text-right"><button onClick={() => onSelectCustomer(customer)} className="text-[#EA2831] font-bold text-xs uppercase tracking-widest hover:underline">Ver Mais</button></td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="px-10 py-20 text-center"><div className="flex flex-col items-center gap-4 text-slate-300"><User className="w-16 h-16 opacity-10" /><p className="font-black text-sm uppercase tracking-[0.2em] opacity-30">Nenhum cliente encontrado</p></div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
