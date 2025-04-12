import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from '../data/menu';
import { menuItems } from '../data/menu';

interface MenuStore {
  items: MenuItem[];
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  getItemById: (id: number) => MenuItem | undefined;
  filterItemsByCategory: (category: string) => MenuItem[];
  searchItems: (query: string) => MenuItem[];
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      items: menuItems,
      selectedItem: null,
      setSelectedItem: (item) => set({ selectedItem: item }),
      getItemById: (id) => get().items.find(item => item.id === id),
      filterItemsByCategory: (category) => 
        get().items.filter(item => item.category === category),
      searchItems: (query) => {
        const searchTerm = query.toLowerCase();
        return get().items.filter(item => 
          item.name.toLowerCase().includes(searchTerm) ||
          item.description?.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
        );
      },
    }),
    {
      name: 'menu-storage',
    }
  )
); 