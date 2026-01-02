
import React, { memo } from 'react';
import { Product } from '../../types';
import { formatCurrency } from '../../shared/utils/mathEngine';

interface MenuProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
    variant?: 'featured' | 'list';
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const MenuProductCard = memo<MenuProductCardProps>(({ product, onClick, variant = 'list' }) => {
    const isAvailable = product.available !== false;

    const isDiscountActive = () => {
        if (!product.discount || product.discount <= 0) return false;
        if (!product.discountExpiry) return true;
        return new Date() < new Date(product.discountExpiry);
    };

    const unitSuffix = product.measureUnit === 'KG' ? '/kg' : product.measureUnit === 'G' ? '/100g' : '';

    const renderPrice = () => {
        if (product.variants && product.variants.length > 0) {
            const minPrice = Math.min(...product.variants.map(v => v.price));
            return (
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">A partir de</span>
                    <span className="text-lg font-extrabold text-[#121118] dark:text-white">{formatCurrency(minPrice)}</span>
                </div>
            );
        }
        if (isDiscountActive()) {
            const finalPrice = Math.max(0, product.price - (product.discount || 0));
            return (
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-400 line-through decoration-red-500 decoration-2">{formatCurrency(product.price)}</span>
                    <span className="text-lg font-extrabold text-green-600 dark:text-green-400">
                        {formatCurrency(finalPrice)} <span className="text-xs text-slate-500 font-bold">{unitSuffix}</span>
                    </span>
                </div>
            );
        }
        return (
            <span className="text-lg font-extrabold text-[#121118] dark:text-white">
                {formatCurrency(product.price)} <span className="text-xs text-slate-500 font-bold">{unitSuffix}</span>
            </span>
        );
    };

    if (variant === 'featured') {
        return (
            <div onClick={() => isAvailable && onClick(product)} className={`shrink-0 w-[190px] rounded-2xl bg-surface-light dark:bg-surface-dark p-3 shadow-md transition-all dark:shadow-none dark:border dark:border-gray-800 ${!isAvailable ? 'opacity-60 grayscale pointer-events-none' : 'cursor-pointer active:scale-95 hover:shadow-lg'}`}>
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-500" style={{backgroundImage: `url('${product.imageUrl}')`}}></div>
                    {!isAvailable && <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]"><span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Esgotado</span></div>}
                    {isAvailable && isDiscountActive() && !product.variants?.length && (
                        <div className="absolute top-2 left-2 z-10 bg-green-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-black uppercase shadow-sm flex flex-col items-center leading-none gap-0.5"><span>Oferta</span>{product.discountExpiry && <span className="text-[8px] opacity-90">Tempo Limitado</span>}</div>
                    )}
                    {isAvailable && <div className="absolute top-2 right-2 z-10"><span className="material-symbols-outlined text-yellow-400 text-[24px] drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></div>}
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-[#121118] dark:text-white line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 h-8">{product.description}</p>
                    <div className="mt-2 flex justify-end">{renderPrice()}</div>
                </div>
            </div>
        );
    }

    return (
        <div onClick={() => isAvailable && onClick(product)} className={`flex items-stretch justify-between gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-3 shadow-sm border border-transparent dark:border-gray-800 transition-all ${!isAvailable ? 'opacity-60 grayscale pointer-events-none' : 'cursor-pointer active:scale-[0.98]'}`}>
            <div className="flex flex-col justify-between flex-[2_2_0px] py-1">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[#121118] dark:text-white text-base font-bold leading-tight">{product.name}</h3>
                        {!isAvailable && <span className="bg-red-100 text-red-600 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">Esgotado</span>}
                        {isAvailable && isDiscountActive() && !product.variants?.length && <span className="bg-green-100 text-green-700 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">Promo</span>}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed line-clamp-2">{product.description}</p>
                </div>
                <div className="mt-2 flex justify-start">{renderPrice()}</div>
            </div>
            <div className="relative w-28 h-28 shrink-0">
                <div className="w-full h-full bg-center bg-cover rounded-lg" style={{backgroundImage: `url('${product.imageUrl}')`}}></div>
                {!isAvailable && <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center"><Icon name="block" className="text-white text-3xl opacity-80" /></div>}
            </div>
        </div>
    );
});
