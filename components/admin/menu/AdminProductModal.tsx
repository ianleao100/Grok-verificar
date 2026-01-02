
import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Product, ProductVariant } from '../../../types';
import { BaseModal } from '../../ui/BaseModal';
import { storageService } from '../../../services/storageService';
import { ProductExtrasTab } from './ProductExtrasTab';
import { ProductMediaUpload } from './ProductMediaUpload';
import { ProductBasicForm } from './ProductBasicForm';
import { ProductPricingSection } from './ProductPricingSection';
import { ProductLogisticsSection } from './ProductLogisticsSection';

interface AdminProductModalProps {
    product: Partial<Product>;
    onClose: () => void;
    onSave: (product: Product) => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({ product, onClose, onSave }) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [pricingMode, setPricingMode] = useState<'SIMPLE' | 'VARIANTS'>((product.variants && product.variants.length > 0) ? 'VARIANTS' : 'SIMPLE');
    
    // Form Data
    const [formData, setFormData] = useState<Partial<Product>>({
        id: product.id || Math.random().toString(36).substr(2, 9),
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || 'Individual',
        imageUrl: product.imageUrl || '',
        available: product.available !== false,
        needsPreparation: product.needsPreparation !== false,
        prepTime: product.prepTime || 15,
        sku: product.sku || '',
        costPrice: product.costPrice || 0,
        packagingFee: product.packagingFee || 0,
        laborCost: product.laborCost || 0,
        cardFee: product.cardFee || 0,
        discount: product.discount || 0,
        discountType: product.discountType || 'FIXED',
        discountExpiry: product.discountExpiry || '',
        stockControlEnabled: product.stockControlEnabled || false,
        currentStock: product.currentStock || 0,
        minStock: product.minStock || 0,
        measureUnit: product.measureUnit || 'UN',
        extraGroups: product.extraGroups || []
    });

    const [variants, setVariants] = useState<ProductVariant[]>(product.variants || []);
    const [visibleFields, setVisibleFields] = useState({
        discount: !!product.discount,
        costs: !!product.costPrice || !!product.packagingFee || !!product.laborCost || !!product.cardFee,
        sku: !!product.sku
    });

    useEffect(() => { setCategories(storageService.getCategories()); }, []);

    const handleChange = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.name) { alert('Nome é obrigatório'); return; }

        let finalPrice = formData.price || 0;
        let finalVariants = undefined;

        if (pricingMode === 'VARIANTS') {
            if (variants.length === 0) { alert('Adicione pelo menos uma variante.'); return; }
            if (variants.some(v => !v.name || v.price <= 0)) { alert('Preencha nome e preço das variantes.'); return; }
            finalPrice = Math.min(...variants.map(v => v.price));
            finalVariants = variants;
        } else {
            finalVariants = [];
            if (!finalPrice || finalPrice <= 0) { alert('Defina um preço de venda.'); return; }
        }
        
        const finalProduct: Product = {
            ...(formData as Product),
            price: finalPrice,
            variants: finalVariants,
            // Clean up conditional fields
            sku: visibleFields.sku ? formData.sku : undefined,
            costPrice: visibleFields.costs ? formData.costPrice : undefined,
            packagingFee: visibleFields.costs ? formData.packagingFee : undefined,
            laborCost: visibleFields.costs ? formData.laborCost : undefined,
            cardFee: visibleFields.costs ? formData.cardFee : undefined,
            discount: visibleFields.discount ? formData.discount : undefined,
            discountType: visibleFields.discount ? formData.discountType : 'FIXED',
            discountExpiry: (visibleFields.discount && formData.discountExpiry) ? formData.discountExpiry : undefined,
        };

        onSave(finalProduct);
    };

    return (
        <BaseModal onClose={onClose} className="max-w-7xl w-[95%] h-[90vh]" hideCloseButton={true}>
            <div className="flex flex-col h-full bg-white dark:bg-surface-dark rounded-[32px] overflow-hidden">
                <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200 dark:border-gray-800 shrink-0">
                    <div><h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{product.id ? 'Editar Produto' : 'Novo Item'}</h2><p className="text-sm font-bold text-slate-400">Gerenciamento completo do item</p></div>
                    <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-800 bg-gray-50/30 dark:bg-black/20">
                    
                    {/* COLUNA 1: IDENTIDADE E PREÇO */}
                    <div className="lg:col-span-4 overflow-y-auto p-6 space-y-6 bg-white dark:bg-surface-dark no-scrollbar">
                        <ProductMediaUpload 
                            imageUrl={formData.imageUrl || ''} 
                            productName={formData.name || ''} 
                            onImageChange={(url) => handleChange('imageUrl', url)} 
                        />
                        <ProductBasicForm formData={formData} onChange={handleChange} categories={categories} />
                        <div className="h-px bg-gray-100 dark:bg-gray-800"></div>
                        <ProductPricingSection 
                            pricingMode={pricingMode} setPricingMode={setPricingMode}
                            formData={formData} onChange={handleChange}
                            variants={variants} setVariants={setVariants}
                            visibleFields={visibleFields} setVisibleFields={setVisibleFields}
                        />
                    </div>

                    {/* COLUNA 2: LOGÍSTICA */}
                    <div className="lg:col-span-4 overflow-y-auto p-6 space-y-6 bg-white dark:bg-surface-dark no-scrollbar border-x border-gray-200 dark:border-gray-800">
                        <ProductLogisticsSection formData={formData} onChange={handleChange} />
                    </div>

                    {/* COLUNA 3: COMPLEMENTOS */}
                    <div className="lg:col-span-4 overflow-y-auto p-6 bg-white dark:bg-surface-dark no-scrollbar">
                        <ProductExtrasTab groups={formData.extraGroups || []} setGroups={(g) => handleChange('extraGroups', g)} />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark shrink-0 z-20 flex justify-end">
                    <button onClick={handleSave} className="bg-[#EA2831] hover:bg-red-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-red-500/20 uppercase text-xs tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                        <Save className="w-5 h-5" /> Salvar Item
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};
