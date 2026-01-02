
import React from 'react';
import { Product, TableConfig, TableSession, CartItem } from '../../../types';
import TableGrid from '../../admin/pos/tables/TableGrid';
import { GLOBAL_EXTRAS } from '../../../constants';
import PosProductGridAdmin from '../../admin/pos/PosProductGrid';
import ProductSelectionModal from '../../admin/pos/ProductSelectionModal';

interface PosProductGridProps {
    posMode: 'QUICK' | 'TABLES' | 'DELIVERY';
    selectedTableId: string | null;
    products: Product[];
    search: string;
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    
    // Table Props
    tablesConfig: TableConfig[];
    tableSessions: Record<string, TableSession>;
    onSelectTable: (table: TableConfig) => void;
    onEditTable: (e: React.MouseEvent, table: TableConfig) => void;
    onDeleteTable: (e: React.MouseEvent, id: string) => void;
    onAddTable: () => void;

    // Product Selection
    selectedProduct: Product | null;
    setSelectedProduct: (p: Product | null) => void;
    onAddToCartFromModal: (item: CartItem) => void;
}

export const PosProductGrid: React.FC<PosProductGridProps> = ({
    posMode,
    selectedTableId,
    products,
    search,
    activeCategory,
    setActiveCategory,
    tablesConfig,
    tableSessions,
    onSelectTable,
    onEditTable,
    onDeleteTable,
    onAddTable,
    selectedProduct,
    setSelectedProduct,
    onAddToCartFromModal
}) => {
    return (
        <div className="flex-1 overflow-y-auto no-scrollbar">
            {posMode === 'TABLES' && !selectedTableId ? (
                <TableGrid 
                    tablesConfig={tablesConfig} 
                    tableSessions={tableSessions} 
                    onSelectTable={onSelectTable} 
                    onEditTable={onEditTable} 
                    onDeleteTable={onDeleteTable} 
                    onAddTable={onAddTable} 
                />
            ) : (
                <div className="p-10 h-full">
                    <PosProductGridAdmin
                        products={products}
                        search={search}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        onSelectProduct={setSelectedProduct}
                    />
                </div>
            )}

            {selectedProduct && (
                <ProductSelectionModal 
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={onAddToCartFromModal}
                    extras={GLOBAL_EXTRAS}
                />
            )}
        </div>
    );
};
