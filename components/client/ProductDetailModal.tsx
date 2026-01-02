
import React, { useState, useEffect } from 'react';
import { Product, CartItem, ProductExtra, ProductVariant } from '../../types';
import { storageService } from '../../services/storageService';
import { formatCurrency, roundFinance } from '../../shared/utils/mathEngine';

interface ProductDetailModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (item: CartItem) => void;
}

const Icon: React.FC<{ name: string, className?: string, style?: React.CSSProperties }> = ({ name, className = "", style }) => (
  <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
);

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
    const [modalQuantity, setModalQuantity] = useState<number>(1);
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    const [availableExtras, setAvailableExtras] = useState<ProductExtra[]>([]);
    
    // Variant State
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

    // Determines step and min value based on Unit
    const isWeightProduct = product?.measureUnit === 'KG' || product?.measureUnit === 'G';
    const quantityStep = product?.measureUnit === 'KG' ? 0.1 : (product?.measureUnit === 'G' ? 100 : 1);
    const minQuantity = product?.measureUnit === 'KG' ? 0.1 : (product?.measureUnit === 'G' ? 100 : 1);

    useEffect(() => {
        if (product) {
            setModalQuantity(minQuantity); // Reset to minimum logic unit
            setSelectedExtras([]);
            
            // Se tiver variantes, reseta a seleção (ou seleciona a primeira/menor preço)
            if (product.variants && product.variants.length > 0) {
                // Opcional: auto-selecionar o mais barato
                const cheapest = product.variants.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
                setSelectedVariantId(cheapest.id);
            } else {
                setSelectedVariantId(null);
            }
            
            // Carrega todos os extras globais
            const allExtras = storageService.getExtras();
            
            // Filtra: 1. Precisa estar ativo globalmente
            // 2. Precisa estar ativo especificamente para este produto
            const filtered = allExtras.filter(e => 
                e.available && storageService.isExtraAvailableForProduct(product.id, e.id)
            );
            
            setAvailableExtras(filtered);
        }
    }, [product]);

    const toggleExtra = (extraId: string) => {
        setSelectedExtras(prev => 
            prev.includes(extraId) ? prev.filter(id => id !== extraId) : [...prev, extraId]
        );
    };

    // Helper para verificar desconto válido
    const isDiscountActive = () => {
        if (!product || !product.discount || product.discount <= 0) return false;
        if (!product.discountExpiry) return true; 
        return new Date() < new Date(product.discountExpiry);
    };

    const getBasePrice = () => {
        if (!product) return 0;
        
        // Se for variante, o preço base é o da variante
        if (product.variants && product.variants.length > 0) {
            const variant = product.variants.find(v => v.id === selectedVariantId);
            return variant ? variant.price : 0;
        }

        // Se for produto simples, aplica o desconto se existir e for válido
        const discount = isDiscountActive() ? (product.discount || 0) : 0;
        return Math.max(0, product.price - discount);
    };

    const handleAddToCart = () => {
        if (!product) return;

        const basePrice = getBasePrice();
        const extrasDetails = availableExtras.filter(e => selectedExtras.includes(e.id));
        const extrasTotal = extrasDetails.reduce((sum, e) => sum + e.price, 0);
        
        // Para produtos de peso, o preço unitário (base) é o preço por unidade de medida (ex: 1kg).
        // A lógica de cálculo total (price * qty) no carrinho vai lidar com o float.
        // No entanto, extras geralmente são "por item", não por peso.
        // Assumindo aqui que extras são valor fixo adicionado ao preço base unitário para simplificação,
        // ou seja, se pedir 0.5kg de carne + queijo, paga (preçoCarne + preçoQueijo) * 0.5?
        // Geralmente sim para comida a quilo.
        
        const finalUnitPrice = basePrice + extrasTotal;

        // Se tem variantes e nenhuma foi selecionada, impede (embora a UI deva bloquear)
        if (product.variants && product.variants.length > 0 && !selectedVariantId) return;

        const selectedVariantObj = product.variants?.find(v => v.id === selectedVariantId);

        const cartItem: CartItem = { 
            ...product, 
            price: finalUnitPrice, 
            quantity: roundFinance(modalQuantity), // Ensure clean precision
            selectedExtras: extrasDetails,
            selectedVariant: selectedVariantObj
        };

        onAddToCart(cartItem);
    };

    if (!product) return null;

    const basePrice = getBasePrice();
    const extrasTotal = availableExtras.filter(e => selectedExtras.includes(e.id)).reduce((s, e) => s + e.price, 0);
    const totalPrice = (basePrice + extrasTotal) * modalQuantity;
    const hasVariants = product.variants && product.variants.length > 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            
            {/* Modal Content */}
            <div className="relative w-full h-full lg:h-auto lg:max-w-5xl lg:aspect-[16/9] lg:max-h-[85vh] bg-surface-light dark:bg-surface-dark shadow-2xl overflow-y-auto lg:overflow-hidden no-scrollbar flex flex-col lg:flex-row animate-[slideUp_0.3s_ease-out] lg:rounded-3xl">
                
                {/* Image Section */}
                <div className="relative h-72 lg:h-full w-full lg:w-1/2 shrink-0 group">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
                    
                    {/* Botão Fechar Mobile */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10"
                    >
                        <Icon name="close" />
                    </button>

                    {/* Preço Sobreposto (Mobile) */}
                    <div className="absolute bottom-4 left-4 lg:hidden text-white">
                        <h2 className="text-2xl font-bold leading-tight shadow-sm">{product.name}</h2>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col w-full lg:w-1/2 lg:h-full lg:min-h-0 bg-surface-light dark:bg-surface-dark relative">
                    
                    {/* Botão Fechar Desktop */}
                    <button 
                        onClick={onClose}
                        className="hidden lg:block absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 transition-colors z-10"
                    >
                        <Icon name="close" className="text-2xl" />
                    </button>

                    {/* Scrollable Content */}
                    <div className="p-6 lg:p-8 lg:flex-1 lg:overflow-y-auto no-scrollbar">
                        <div className="hidden lg:block mb-4">
                            <h2 className="text-3xl font-black text-[#121118] dark:text-white leading-tight mb-2">{product.name}</h2>
                            {/* Exibição de Preço Base no Topo */}
                            <div className="flex items-center gap-3">
                                {hasVariants ? (
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Escolha uma opção</span>
                                ) : (
                                    isDiscountActive() ? (
                                        <>
                                            <span className="text-2xl font-black text-green-600 dark:text-green-400">{formatCurrency(basePrice)}</span>
                                            <span className="text-sm font-bold text-slate-400 line-through decoration-red-500">{formatCurrency(product.price)}</span>
                                            <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-1 rounded">Promoção</span>
                                        </>
                                    ) : (
                                        <span className="text-2xl font-black text-[#121118] dark:text-white">{formatCurrency(product.price)}</span>
                                    )
                                )}
                                {!hasVariants && isWeightProduct && (
                                    <span className="text-xs font-bold text-slate-400 uppercase">/ {product.measureUnit?.toLowerCase()}</span>
                                )}
                            </div>
                        </div>
                        
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">{product.description}</p>

                        {/* SEÇÃO 1: VARIANTES (Se houver) */}
                        {hasVariants && (
                            <div className="mb-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Escolha o Tamanho/Tipo</h3>
                                <div className="space-y-3">
                                    {product.variants!.map(v => (
                                        <div 
                                            key={v.id}
                                            onClick={() => setSelectedVariantId(v.id)}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedVariantId === v.id ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`size-5 rounded-full border-[2px] flex items-center justify-center ${selectedVariantId === v.id ? 'border-primary' : 'border-slate-300'}`}>
                                                    {selectedVariantId === v.id && <div className="size-2.5 rounded-full bg-primary"></div>}
                                                </div>
                                                <span className={`font-bold text-sm ${selectedVariantId === v.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400'}`}>{v.name}</span>
                                            </div>
                                            <span className="font-black text-slate-900 dark:text-white">{formatCurrency(v.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SEÇÃO 2: EXTRAS */}
                        {availableExtras.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Adicionais</h3>
                                <div className="space-y-3">
                                    {availableExtras.map(extra => (
                                        <div 
                                            key={extra.id}
                                            onClick={() => toggleExtra(extra.id)}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedExtras.includes(extra.id) ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`size-5 rounded border-2 flex items-center justify-center ${selectedExtras.includes(extra.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                                    {selectedExtras.includes(extra.id) && <Icon name="check" className="text-white text-xs font-bold" />}
                                                </div>
                                                <span className="font-bold text-sm text-slate-700 dark:text-gray-200">{extra.name}</span>
                                            </div>
                                            <span className="text-primary font-bold text-sm">+ {formatCurrency(extra.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SEÇÃO 3: QUANTIDADE (Adaptada para Peso) */}
                        <div className="mb-24 lg:mb-0">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                                {isWeightProduct ? 'Peso / Quantidade' : 'Quantidade'}
                            </h3>
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 w-fit gap-6">
                                <button 
                                    onClick={() => setModalQuantity(prev => Math.max(minQuantity, roundFinance(prev - quantityStep)))}
                                    className="size-10 rounded-xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary transition-colors disabled:opacity-50"
                                    disabled={modalQuantity <= minQuantity}
                                >
                                    <Icon name="remove" className="font-bold" />
                                </button>
                                
                                <div className="flex flex-col items-center w-24">
                                    {isWeightProduct ? (
                                        // Input direto para peso para precisão
                                        <input 
                                            type="number" 
                                            value={modalQuantity} 
                                            onChange={(e) => setModalQuantity(Math.max(minQuantity, parseFloat(e.target.value) || minQuantity))}
                                            step={quantityStep}
                                            className="w-full bg-transparent border-none text-center text-xl font-black text-slate-900 dark:text-white p-0 focus:ring-0"
                                        />
                                    ) : (
                                        <span className="text-xl font-black w-8 text-center text-slate-900 dark:text-white">{modalQuantity}</span>
                                    )}
                                    {isWeightProduct && (
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{product.measureUnit}</span>
                                    )}
                                </div>

                                <button 
                                    onClick={() => setModalQuantity(prev => roundFinance(prev + quantityStep))}
                                    className="size-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    <Icon name="add" className="font-bold" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Fixo */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark sticky bottom-0 z-20 lg:static w-full">
                        <button 
                            onClick={handleAddToCart}
                            disabled={hasVariants && !selectedVariantId}
                            className="w-full bg-primary text-white font-black h-16 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between px-8 hover:bg-primary/90 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
                        >
                            <span className="uppercase tracking-widest text-xs">
                                {hasVariants && !selectedVariantId ? 'Selecione uma opção' : 'Adicionar ao Pedido'}
                            </span>
                            <span className="bg-white/20 px-3 py-1.5 rounded-lg text-base group-hover:bg-white/30 transition-colors">
                                {formatCurrency(totalPrice)}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
