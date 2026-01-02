
import React from 'react';
import { Product } from '../../types';
import { MenuProductCard } from './MenuProductCard';

interface MenuProductGridProps {
    categoryDisplayNames: Record<string, { label: string, icon: string }>;
    getProductsByCategory: (categoryKey: string) => Product[];
    onSelectProduct: (product: Product) => void;
}

const Icon: React.FC<{ name: string, className?: string }> = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export const MenuProductGrid: React.FC<MenuProductGridProps> = ({ 
    categoryDisplayNames, 
    getProductsByCategory, 
    onSelectProduct 
}) => {
    return (
        <section className="mt-2 px-4 pb-4">
            {Object.entries(categoryDisplayNames).map(([catKey, data]) => {
                const catProducts = getProductsByCategory(catKey);
                if (catProducts.length === 0) return null;

                return (
                    <div key={catKey} className="mb-8 animate-[fadeIn_0.3s]">
                        <h2 className="text-xl font-bold leading-tight text-[#121118] dark:text-white mb-4 flex items-center gap-2">
                            <Icon name={data.icon} className="text-primary" />
                            {data.label}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {catProducts.map(product => (
                                <MenuProductCard 
                                    key={product.id}
                                    product={product}
                                    onClick={onSelectProduct}
                                    variant="list"
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </section>
    );
};
