
import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Product } from '../../../types';
import { generateDishDescription } from '../../../services/geminiService';

interface ProductBasicFormProps {
    formData: Partial<Product>;
    onChange: (field: keyof Product, value: any) => void;
    categories: string[];
}

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{children}</label>
);

export const ProductBasicForm: React.FC<ProductBasicFormProps> = ({ formData, onChange, categories }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateDesc = async () => {
        if (!formData.name) return;
        try {
            setIsGenerating(true);
            const contextPrompt = `Categoria: ${formData.category || 'Geral'}. Estilo: Delivery, curto, persuasivo e apetitoso.`;
            const desc = await generateDishDescription(formData.name, contextPrompt);
            onChange('description', desc);
        } catch (error) {
            console.error("Erro Gemini Desc:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label>Nome do Produto</Label>
                <input 
                    value={formData.name} 
                    onChange={e => onChange('name', e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-[#EA2831] text-base" 
                    placeholder="Ex: X-Bacon Artesanal" 
                />
            </div>
            <div>
                <div className="flex justify-between items-center px-1 mb-1.5">
                    <Label>Descrição</Label>
                    <button 
                        type="button"
                        onClick={handleGenerateDesc} 
                        disabled={!formData.name || isGenerating} 
                        className="flex items-center gap-1 text-[#EA2831] text-[9px] font-black uppercase tracking-wide hover:underline disabled:opacity-50"
                    >
                        <Wand2 className="w-3 h-3" /> Gerar IA
                    </button>
                </div>
                <textarea 
                    value={formData.description} 
                    onChange={e => onChange('description', e.target.value)} 
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl font-medium text-xs text-slate-600 dark:text-gray-300 focus:ring-2 focus:ring-[#EA2831] h-20 resize-none shadow-inner" 
                    placeholder="Ingredientes e detalhes..." 
                />
            </div>
            <div>
                <Label>Categoria</Label>
                <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => onChange('category', cat)} 
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${formData.category === cat ? 'border-[#EA2831] bg-red-50 text-[#EA2831]' : 'border-gray-200 text-slate-500 hover:border-gray-300'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
