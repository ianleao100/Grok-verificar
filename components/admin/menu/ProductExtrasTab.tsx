
import React, { useState } from 'react';
import { ProductExtraGroup, ProductExtraItem } from '../../../types';
import { Plus, Trash2, Layers, Tag, GripVertical, Check } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/mathEngine';

interface ProductExtrasTabProps {
    groups: ProductExtraGroup[];
    setGroups: (groups: ProductExtraGroup[]) => void;
}

export const ProductExtrasTab: React.FC<ProductExtrasTabProps> = ({ groups, setGroups }) => {
    // Local state for new item inputs per group to avoid global clutter
    const [newItemInputs, setNewItemInputs] = useState<Record<string, { name: string, price: string }>>({});

    const handleAddGroup = () => {
        const newGroup: ProductExtraGroup = {
            id: Date.now().toString(),
            title: '',
            items: []
        };
        setGroups([...groups, newGroup]);
    };

    const handleRemoveGroup = (groupId: string) => {
        setGroups(groups.filter(g => g.id !== groupId));
    };

    const handleUpdateGroupTitle = (groupId: string, title: string) => {
        setGroups(groups.map(g => g.id === groupId ? { ...g, title } : g));
    };

    const handleAddItem = (groupId: string) => {
        const input = newItemInputs[groupId];
        if (!input || !input.name) return;

        const newItem: ProductExtraItem = {
            id: `item-${Date.now()}`,
            name: input.name,
            price: parseFloat(input.price) || 0
        };

        setGroups(groups.map(g => {
            if (g.id === groupId) {
                return { ...g, items: [...g.items, newItem] };
            }
            return g;
        }));

        // Reset input
        setNewItemInputs(prev => ({ ...prev, [groupId]: { name: '', price: '' } }));
    };

    const handleRemoveItem = (groupId: string, itemId: string) => {
        setGroups(groups.map(g => {
            if (g.id === groupId) {
                return { ...g, items: g.items.filter(i => i.id !== itemId) };
            }
            return g;
        }));
    };

    const handleInputChange = (groupId: string, field: 'name' | 'price', value: string) => {
        setNewItemInputs(prev => ({
            ...prev,
            [groupId]: { ...prev[groupId] || { name: '', price: '' }, [field]: value }
        }));
    };

    return (
        <div className="animate-[fadeIn_0.3s] space-y-6 h-full flex flex-col">
            
            {/* Topo com Botão Principal de Gerenciamento - Fixo no Topo da Coluna */}
            <div className="flex flex-col gap-2 shrink-0">
                <button 
                    onClick={handleAddGroup}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Gerenciar Complementos
                </button>
                <div className="text-center mb-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Grupos de Opcionais (Ex: Bebidas)</p>
                </div>
            </div>

            <div className="space-y-6 flex-1">
                {groups.map((group) => (
                    <div key={group.id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-[24px] overflow-hidden shadow-sm transition-all hover:shadow-md">
                        
                        {/* Group Title Section - Prominent */}
                        <div className="p-5 pb-2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[9px] font-black text-[#EA2831] uppercase tracking-widest flex items-center gap-1">
                                    <Layers className="w-3 h-3" /> Título do Grupo
                                </label>
                                <button 
                                    onClick={() => handleRemoveGroup(group.id)}
                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                    title="Remover Grupo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <input 
                                type="text"
                                value={group.title}
                                onChange={(e) => handleUpdateGroupTitle(group.id, e.target.value)}
                                placeholder="Ex: Deseja alguma bebida?"
                                className="w-full bg-transparent border-b-2 border-gray-100 dark:border-gray-700 px-0 py-2 text-lg font-black text-slate-900 dark:text-white placeholder:text-slate-300 focus:ring-0 focus:border-[#EA2831] transition-colors"
                            />
                        </div>

                        {/* Items List - Indented Below Title */}
                        <div className="bg-gray-50/50 dark:bg-black/20 p-4 pt-2">
                            <div className="space-y-2 mb-4">
                                {group.items.length > 0 ? group.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm group">
                                        <Tag className="w-3 h-3 text-slate-300" />
                                        <span className="flex-1 text-sm font-bold text-slate-700 dark:text-gray-200">{item.name}</span>
                                        <span className="text-xs font-black text-[#EA2831] bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-lg">
                                            {formatCurrency(item.price)}
                                        </span>
                                        <button 
                                            onClick={() => handleRemoveItem(group.id, item.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-center text-xs text-slate-400 font-medium italic py-2">Nenhum item adicionado a este grupo.</p>
                                )}
                            </div>

                            {/* Add Item Input Row */}
                            <div className="flex gap-2 items-center bg-white dark:bg-surface-dark p-1.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 focus-within:border-[#EA2831]/50 transition-colors">
                                <input 
                                    type="text"
                                    placeholder="Nome do item..."
                                    value={newItemInputs[group.id]?.name || ''}
                                    onChange={(e) => handleInputChange(group.id, 'name', e.target.value)}
                                    className="flex-1 bg-transparent border-none text-xs font-bold px-3 py-2 focus:ring-0 text-slate-900 dark:text-white placeholder:font-normal"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem(group.id)}
                                />
                                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="relative w-20">
                                    <input 
                                        type="number"
                                        placeholder="0.00"
                                        value={newItemInputs[group.id]?.price || ''}
                                        onChange={(e) => handleInputChange(group.id, 'price', e.target.value)}
                                        className="w-full bg-transparent border-none text-xs font-bold px-2 py-2 focus:ring-0 text-slate-900 dark:text-white text-right placeholder:font-normal"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem(group.id)}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleAddItem(group.id)}
                                    disabled={!newItemInputs[group.id]?.name}
                                    className="bg-[#EA2831] hover:bg-red-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <Check className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {groups.length === 0 && (
                    <div className="text-center py-10 opacity-50 flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-[24px]">
                        <Layers className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-bold text-slate-400">Nenhum grupo de complemento criado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
