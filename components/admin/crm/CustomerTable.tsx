
import React from 'react';
import { CustomerProfile } from '../../../types';
import { ChevronUp, ChevronDown, User, Cake, Star, ShoppingBag, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, isTodayBirthday } from '../../../shared/utils/mathEngine';

type SortKey = keyof CustomerProfile | 'lastOrderAt';
type SortDirection = 'asc' | 'desc';

interface CustomerTableProps {
    customers: CustomerProfile[];
    sortConfig: { key: SortKey; direction: SortDirection };
    onSort: (key: SortKey) => void;
    onSelectCustomer: (customer: CustomerProfile) => void;
    onEditCustomer: (customer: CustomerProfile) => void;
    onDeleteCustomer: (customer: CustomerProfile) => void;
    pagination: {
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
        indexOfFirstItem: number;
        indexOfLastItem: number;
        totalItems: number;
        onPageChange: (page: number) => void;
        onItemsPerPageChange: (items: number) => void;
    };
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
    customers,
    sortConfig,
    onSort,
    onSelectCustomer,
    onEditCustomer,
    onDeleteCustomer,
    pagination
}) => {
    
    const openWhatsApp = (e: React.MouseEvent, phone?: string) => {
        e.stopPropagation();
        if (!phone) return;
        const rawPhone = phone.replace(/\D/g, '');
        const target = rawPhone.length <= 11 ? `55${rawPhone}` : rawPhone;
        window.open(`https://wa.me/${target}`, '_blank');
    };

    const SortableHeader = ({ label, field, className = "", align = 'center' }: { label: string, field: SortKey, className?: string, align?: 'left' | 'center' | 'right' }) => {
        const isActive = sortConfig.key === field;
        const isAsc = isActive && sortConfig.direction === 'asc';
        const isDesc = isActive && sortConfig.direction === 'desc';
        const justifyClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';
        const textClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

        return (
            <th className={`px-[15px] py-5 cursor-pointer bg-white dark:bg-surface-dark border-b border-r border-gray-100 dark:border-gray-800 last:border-r-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 align-middle whitespace-nowrap group ${textClass} ${className}`} onClick={() => onSort(field)}>
                <div className={`flex items-center ${justifyClass} gap-2.5`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-[#EA1D2C]' : 'text-slate-600 dark:text-slate-300'}`}>{label}</span>
                    <div className="flex flex-col justify-center -space-y-1">
                        <ChevronUp size={12} className={`transition-all stroke-[3px] ${isActive && !isAsc ? 'text-gray-200' : 'text-[#EA1D2C]'}`} />
                        <ChevronDown size={12} className={`transition-all stroke-[3px] ${isActive && !isDesc ? 'text-gray-200' : 'text-[#EA1D2C]'}`} />
                    </div>
                </div>
            </th>
        );
    };

    const RegularHeader = ({ label, className = "", align = 'center' }: { label: string, className?: string, align?: 'left' | 'center' | 'right' }) => {
        const textClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
        return (
            <th className={`px-[15px] py-5 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest align-middle cursor-default bg-white dark:bg-surface-dark border-b border-r border-gray-100 dark:border-gray-800 last:border-r-0 ${textClass} ${className}`}>
                {label}
            </th>
        );
    };

    return (
        <div className="bg-white dark:bg-surface-dark rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <SortableHeader label="Cliente" field="name" align="center" className="w-[28%]" />
                            <RegularHeader label="Contato" className="w-[12%]" />
                            <SortableHeader label="Nascimento" field="birthDate" className="w-[12%]" />
                            <SortableHeader label="Valor Total" field="totalSpent" align="center" className="w-[14%]" />
                            <SortableHeader label="Pontos" field="points" className="w-[10%]" />
                            <SortableHeader label="Pedidos" field="orderCount" className="w-[10%]" />
                            <RegularHeader label="Informações" className="w-[8%]" />
                            <RegularHeader label="Gestão" className="w-[6%] border-r-0" />
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id} className="group hover:bg-gray-50 transition-colors">
                                <td className="px-[15px] pl-6 py-5 align-middle text-left cursor-pointer bg-white dark:bg-surface-dark group-hover:bg-gray-50 dark:group-hover:bg-gray-800" onClick={() => onSelectCustomer(customer)}>
                                    <div className="flex items-center justify-start gap-4">
                                        <div className="size-10 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-slate-500 font-black text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors overflow-hidden shrink-0">
                                            {customer.photo ? <img src={customer.photo} alt={customer.name} className="w-full h-full object-cover" /> : (customer.name || '?').substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col items-start min-w-[120px]">
                                            <span className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{customer.name || 'Sem nome'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-[15px] py-5 text-center align-middle cursor-pointer bg-white dark:bg-surface-dark group-hover:bg-gray-50 dark:group-hover:bg-gray-800" onClick={() => onSelectCustomer(customer)}>
                                    <div className="flex justify-center">
                                        {customer.whatsapp ? (
                                            <button onClick={(e) => openWhatsApp(e, customer.whatsapp)} className="inline-block px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-[10px] font-black uppercase tracking-wide shadow-sm">WhatsApp</button>
                                        ) : <span className="text-slate-300 text-xs">-</span>}
                                    </div>
                                </td>
                                <td className="px-[15px] py-5 text-center align-middle cursor-pointer bg-white dark:bg-surface-dark group-hover:bg-gray-50 dark:group-hover:bg-gray-800" onClick={() => onSelectCustomer(customer)}>
                                    {customer.birthDate ? (
                                        <div className={`flex items-center justify-center gap-1.5 ${isTodayBirthday(customer.birthDate) ? 'text-pink-600 font-black bg-pink-50 px-2 py-1 rounded-lg animate-pulse' : 'text-slate-500'}`}>
                                            <Cake className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold">{customer.birthDate.substring(0,5)}</span>
                                        </div>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-[15px] py-5 text-center align-middle cursor-pointer bg-white dark:bg-surface-dark group-hover:bg-gray-50 dark:group-hover:bg-gray-800" onClick={() => onSelectCustomer(customer)}>
                                    <div className="font-black text-slate-900 dark:text-white font-display text-sm text-center">{formatCurrency(customer.totalSpent || 0)}</div>
                                </td>
                                <td className="px-[15px] py-5 text-center align-middle cursor-pointer bg-white dark:bg-surface-dark group-hover:bg-gray-50 dark:group-hover:bg-gray-800" onClick={() => onSelectCustomer(customer)}>
                                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                                        <Star className="w-3 h-3 fill-current" />{customer.points || 0}
                                    </div>
                                </td>
                                <td className="px-[15px] py-5 text-center align-middle cursor-pointer bg-white dark:bg-surface-dark group-hover:bg-gray-50 dark:group-hover:bg-gray-800" onClick={() => onSelectCustomer(customer)}>
                                    <div className="flex justify-center">
                                        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-gray-800 rounded-lg text-slate-600 dark:text-gray-300 font-bold text-xs"><ShoppingBag className="w-3 h-3" />{customer.orderCount || 0}</div>
                                    </div>
                                </td>
                                <td className="px-[15px] py-5 text-center align-middle bg-white dark:bg-surface-dark group-hover:bg-gray-50 dark:group-hover:bg-gray-800">
                                    <div className="flex justify-center">
                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelectCustomer(customer); }} className="px-4 py-2 bg-[#EA1D2C] hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">Ver Mais</button>
                                    </div>
                                </td>
                                <td className="px-[15px] py-5 text-center align-middle bg-white dark:bg-surface-dark group-hover:bg-gray-50 dark:group-hover:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); onEditCustomer(customer); }} className="size-8 flex items-center justify-center bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-[#EA1D2C] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm active:scale-95"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); onDeleteCustomer(customer); }} className="size-8 flex items-center justify-center bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-[#EA1D2C] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm active:scale-95"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr><td colSpan={8} className="px-8 py-16 text-center border-b border-[#EEEEEE] dark:border-gray-800"><div className="flex flex-col items-center gap-3 text-slate-300"><User className="w-12 h-12 opacity-20" /><p className="font-bold text-xs uppercase tracking-widest">Nenhum cliente encontrado</p></div></td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exibir:</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-surface-dark p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                        {[10, 25, 50, 100].map(val => <button key={val} onClick={() => pagination.onItemsPerPageChange(val)} className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-colors ${pagination.itemsPerPage === val ? 'bg-[#EA2831] text-white' : 'text-slate-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{val}</button>)}
                    </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mostrando {Math.min(pagination.indexOfFirstItem + 1, pagination.totalItems)} - {Math.min(pagination.indexOfLastItem, pagination.totalItems)} de {pagination.totalItems} resultados</div>
                <div className="flex items-center gap-2">
                    <button onClick={() => pagination.onPageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-slate-500 hover:bg-white hover:text-[#EA2831] disabled:opacity-50 disabled:cursor-not-allowed transition-all"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => pagination.onPageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-slate-500 hover:bg-white hover:text-[#EA2831] disabled:opacity-50 disabled:cursor-not-allowed transition-all"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
};
