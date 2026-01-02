
import { Product, ProductExtra, CartItem } from '../../types';
import { INITIAL_PRODUCTS, GLOBAL_EXTRAS, CATEGORIES as DEFAULT_CATEGORIES } from '../../constants';
import { KEYS } from './keys';

const dispatchEvents = () => {
    window.dispatchEvent(new Event('storage-update'));
    window.dispatchEvent(new Event('storage'));
};

export const menuService = {
    // --- PRODUTOS ---

    getProducts: (): Product[] => {
        try {
            const stored = localStorage.getItem(KEYS.CUSTOM_MENU);
            if (!stored) {
                console.log('[SYSTEM] Inicializando banco de produtos...');
                localStorage.setItem(KEYS.CUSTOM_MENU, JSON.stringify(INITIAL_PRODUCTS));
                return INITIAL_PRODUCTS;
            }
            return JSON.parse(stored);
        } catch (e) {
            console.error("Erro ao ler produtos:", e);
            return [];
        }
    },

    saveProducts: (products: Product[]) => {
        localStorage.setItem(KEYS.CUSTOM_MENU, JSON.stringify(products));
        dispatchEvents();
    },

    // Nova função: Decrementa estoque e desativa se necessário
    decrementStock: (items: CartItem[]) => {
        try {
            const products = menuService.getProducts();
            let hasUpdates = false;

            const updatedProducts = products.map(p => {
                const cartItem = items.find(i => i.id === p.id);
                
                // Se o produto está no carrinho E tem controle de estoque ativado
                if (cartItem && p.stockControlEnabled) {
                    const currentStock = p.currentStock || 0;
                    const newStock = Math.max(0, currentStock - cartItem.quantity);
                    const minStock = p.minStock || 0;
                    
                    // Lógica de Auto-Desativação
                    const shouldDisable = newStock <= minStock;
                    
                    hasUpdates = true;
                    
                    return {
                        ...p,
                        currentStock: newStock,
                        available: shouldDisable ? false : p.available
                    };
                }
                return p;
            });

            if (hasUpdates) {
                menuService.saveProducts(updatedProducts);
            }
        } catch (e) {
            console.error("Erro ao dar baixa no estoque:", e);
        }
    },

    deleteProduct: (productId: string) => {
        try {
            const stored = localStorage.getItem(KEYS.CUSTOM_MENU);
            const currentProducts: Product[] = stored ? JSON.parse(stored) : [];
            const updatedProducts = currentProducts.filter(p => String(p.id) !== String(productId));
            
            localStorage.setItem(KEYS.CUSTOM_MENU, JSON.stringify(updatedProducts));
            dispatchEvents();
        } catch (error) {
            console.error("Erro crítico ao excluir produto:", error);
        }
    },

    duplicateProduct: (product: Product) => {
        try {
            const currentProducts = menuService.getProducts();
            const newProduct: Product = {
                ...product,
                id: `copy-${Date.now()}`,
                name: `Cópia de ${product.name}`,
                available: false
            };
            
            const updatedProducts = [...currentProducts, newProduct];
            localStorage.setItem(KEYS.CUSTOM_MENU, JSON.stringify(updatedProducts));
            dispatchEvents();
        } catch (error) {
            console.error("Erro ao duplicar produto:", error);
        }
    },

    // --- CATEGORIAS ---

    getCategories: (): string[] => {
        try {
            const stored = localStorage.getItem(KEYS.CUSTOM_CATEGORIES);
            if (!stored) {
                localStorage.setItem(KEYS.CUSTOM_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
                return DEFAULT_CATEGORIES;
            }
            return JSON.parse(stored);
        } catch { return DEFAULT_CATEGORIES; }
    },

    addCategory: (categoryName: string) => {
        const categories = menuService.getCategories();
        // Normaliza para evitar duplicatas com cases diferentes
        if (!categories.some(c => c.trim().toLowerCase() === categoryName.trim().toLowerCase())) {
            const updated = [...categories, categoryName];
            localStorage.setItem(KEYS.CUSTOM_CATEGORIES, JSON.stringify(updated));
            dispatchEvents();
        }
    },

    updateCategory: (oldName: string, newName: string) => {
        const categories = menuService.getCategories();
        const updatedCategories = categories.map(c => c === oldName ? newName : c);
        localStorage.setItem(KEYS.CUSTOM_CATEGORIES, JSON.stringify(updatedCategories));

        const products = menuService.getProducts();
        let hasChanges = false;
        const updatedProducts = products.map(p => {
            if (p.category === oldName) {
                hasChanges = true;
                return { ...p, category: newName };
            }
            return p;
        });

        if (hasChanges) {
            localStorage.setItem(KEYS.CUSTOM_MENU, JSON.stringify(updatedProducts));
        }

        dispatchEvents();
    },

    deleteCategory: (categoryName: string) => {
        const target = categoryName.trim().toLowerCase();
        
        try {
            // 1. Remover da lista de categorias
            const categories = menuService.getCategories();
            const updatedCategories = categories.filter(c => c.trim().toLowerCase() !== target);
            
            localStorage.setItem(KEYS.CUSTOM_CATEGORIES, JSON.stringify(updatedCategories));

            // 2. Remover produtos associados
            const products = menuService.getProducts();
            const updatedProducts = products.filter(p => p.category.trim().toLowerCase() !== target);
            
            if (products.length !== updatedProducts.length) {
                localStorage.setItem(KEYS.CUSTOM_MENU, JSON.stringify(updatedProducts));
            }

            dispatchEvents();
        } catch (e) {
            console.error("[MENU SERVICE] Erro fatal ao deletar categoria:", e);
        }
    },

    saveCategories: (categories: string[]) => {
        localStorage.setItem(KEYS.CUSTOM_CATEGORIES, JSON.stringify(categories));
        dispatchEvents();
    },

    // --- EXTRAS & DISPONIBILIDADE ---

    toggleProductAvailability: (productId: string) => {
        const products = menuService.getProducts();
        const updated = products.map(p => String(p.id) === String(productId) ? { ...p, available: !p.available } : p);
        menuService.saveProducts(updated); // Já dispara eventos
    },

    getExtras: (): ProductExtra[] => {
        try {
            const availMap = JSON.parse(localStorage.getItem(KEYS.EXTRAS_AVAILABILITY) || '{}');
            return GLOBAL_EXTRAS.map(e => ({
                ...e,
                available: availMap.hasOwnProperty(e.id) ? availMap[e.id] : true
            }));
        } catch { return GLOBAL_EXTRAS; }
    },

    isExtraAvailableForProduct: (productId: string, extraId: string): boolean => {
        try {
            const globalMap = JSON.parse(localStorage.getItem(KEYS.EXTRAS_AVAILABILITY) || '{}');
            if (globalMap.hasOwnProperty(extraId) && !globalMap[extraId]) return false;

            const specificMap = JSON.parse(localStorage.getItem(KEYS.PRODUCT_SPECIFIC_EXTRAS) || '{}');
            const key = `${productId}_${extraId}`;
            return specificMap.hasOwnProperty(key) ? specificMap[key] : true; 
        } catch { return true; }
    },

    toggleProductExtraAvailability: (productId: string, extraId: string) => {
        const specificMap = JSON.parse(localStorage.getItem(KEYS.PRODUCT_SPECIFIC_EXTRAS) || '{}');
        const key = `${productId}_${extraId}`;
        const currentStatus = specificMap.hasOwnProperty(key) ? specificMap[key] : true;
        specificMap[key] = !currentStatus;
        localStorage.setItem(KEYS.PRODUCT_SPECIFIC_EXTRAS, JSON.stringify(specificMap));
        dispatchEvents();
    },

    toggleExtraAvailability: (extraId: string) => {
        const availMap = JSON.parse(localStorage.getItem(KEYS.EXTRAS_AVAILABILITY) || '{}');
        const currentStatus = availMap.hasOwnProperty(extraId) ? availMap[extraId] : true;
        availMap[extraId] = !currentStatus;
        localStorage.setItem(KEYS.EXTRAS_AVAILABILITY, JSON.stringify(availMap));
        dispatchEvents();
    }
};
