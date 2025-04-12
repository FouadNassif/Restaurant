import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { Offer } from '../data/offers';
import { MenuItem, Size } from '../data/menu';

export interface CartItem extends Omit<MenuItem, 'requiredIngredients' | 'optionalIngredients'> {
  quantity: number;
  excludedIngredients?: string[];
  isOfferItem?: boolean;
  offer?: Offer;
  offerItems?: {
    itemId: number;
    excludedIngredients: string[];
  }[];
  customizationId?: string; // Unique identifier for different customizations of the same item
  selectedSize?: Size;
  selectedDrinkType?: string;
  requiredIngredients?: string[];
  optionalIngredients?: string[];
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, customizationId?: string) => void;
  updateItem: (id: number, updates: Partial<CartItem>) => void;
  updateQuantity: (id: number, quantity: number, customizationId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  refreshCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find(
          i => i.id === item.id && 
          (!item.customizationId || i.customizationId === item.customizationId) &&
          (!item.isOfferItem || (item.isOfferItem && i.isOfferItem && 
            JSON.stringify(i.offerItems) === JSON.stringify(item.offerItems)))
        );

        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id && 
              (!item.customizationId || i.customizationId === item.customizationId) &&
              (!item.isOfferItem || (item.isOfferItem && i.isOfferItem && 
                JSON.stringify(i.offerItems) === JSON.stringify(item.offerItems)))
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, item],
          }));
        }

        // After adding, merge any identical items
        get().refreshCart();
      },
      removeItem: (id: number, customizationId?: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.customizationId === customizationId)
          ),
        }));
        // After removing, merge any identical items
        get().refreshCart();
      },
      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
        // After updating, merge any identical items
        get().refreshCart();
      },
      updateQuantity: (id: number, quantity: number, customizationId?: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.customizationId === customizationId ? { ...item, quantity } : item
          ),
        }));
        // After updating quantity, merge any identical items
        get().refreshCart();
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      refreshCart: () => {
        const mergedItems = mergeIdenticalItems(get().items);
        if (JSON.stringify(mergedItems) !== JSON.stringify(get().items)) {
          set({ items: mergedItems });
        }
      }
    }),
    {
      name: 'cart-storage',
      storage: {
        getItem: (name) => {
          const value = Cookies.get(name);
          if (!value) return null;
          
          // Parse the value and merge identical items before returning
          const parsedValue = JSON.parse(value);
          if (parsedValue.state && Array.isArray(parsedValue.state.items)) {
            parsedValue.state.items = mergeIdenticalItems(parsedValue.state.items);
          }
          return parsedValue;
        },
        setItem: (name, value) => {
          Cookies.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          Cookies.remove(name);
        },
      },
    }
  )
);

// Helper function to merge identical items
function mergeIdenticalItems(items: CartItem[]): CartItem[] {
  const itemMap = new Map<string, CartItem>();

  items.forEach(item => {
    const key = generateItemKey(item);
    if (itemMap.has(key)) {
      const existingItem = itemMap.get(key)!;
      existingItem.quantity += item.quantity;
    } else {
      itemMap.set(key, { ...item });
    }
  });

  return Array.from(itemMap.values());
}

// Helper function to generate a unique key for an item based on its properties
function generateItemKey(item: CartItem): string {
  if (item.isOfferItem) {
    return `offer-${item.id}-${JSON.stringify(item.offerItems)}`;
  } else {
    return `item-${item.id}-${item.selectedSize || 'default'}-${item.selectedDrinkType || 'default'}-${JSON.stringify(item.excludedIngredients)}`;
  }
} 