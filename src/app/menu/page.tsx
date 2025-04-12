"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { menuItems } from '../../data/menu';
import { useCartStore } from '../../store/cartStore';
import MenuCategoryTabs from '../../components/MenuCategoryTabs';
import MenuGrid from '../../components/MenuGrid';
import MenuItemCustomizationDialog from '../../components/MenuItemCustomizationDialog';
import { MenuItem, Size } from '../../data/menu';
import { useSearchParams } from 'next/navigation';

export default function MenuPage() {
  const theme = useTheme();
  const { addItem } = useCartStore();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedItem, setSelectedItem] = React.useState<typeof menuItems[0] | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [excludedIngredients, setExcludedIngredients] = React.useState<string[]>([]);

  // Check for item ID in URL and open modal if present
  React.useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      const item = menuItems.find(i => i.id === parseInt(itemId));
      if (item) {
        setSelectedItem(item);
        setOpenDialog(true);
      }
    }
  }, [searchParams]);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleOpenDialog = (item: typeof menuItems[0]) => {
    setSelectedItem(item);
    setExcludedIngredients([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setExcludedIngredients([]);
  };

  const handleIngredientToggle = (ingredient: string) => {
    const newExcluded = excludedIngredients.includes(ingredient)
      ? excludedIngredients.filter(i => i !== ingredient)
      : [...excludedIngredients, ingredient];
    
    setExcludedIngredients(newExcluded);
  };

  const handleAddToCart = (size: Size) => {
    if (!selectedItem) return;

    // Create a unique customization ID based on excluded ingredients and size
    const customizationId = `${selectedItem.id}-${size}${excludedIngredients.length ? `-${excludedIngredients.join('-')}` : ''}`;

    // Get the price for the selected size
    const sizePrice = selectedItem.availableSizes?.find(s => s.size === size)?.price || selectedItem.price;

    // Create the cart item
    const cartItem = {
      ...selectedItem,
      price: sizePrice,
      quantity: 1,
      customizationId,
      excludedIngredients,
      selectedSize: size
    };

    addItem(cartItem);
    handleCloseDialog();
  };

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 6 }}>
          Our Menu
        </Typography>

        <MenuCategoryTabs 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <MenuGrid 
          items={filteredItems}
          onItemClick={handleOpenDialog}
        />

        <MenuItemCustomizationDialog
          open={openDialog}
          onClose={handleCloseDialog}
          item={selectedItem}
          onAddToCart={handleAddToCart}
          excludedIngredients={excludedIngredients}
          onIngredientToggle={handleIngredientToggle}
        />
      </Container>
    </Box>
  );
} 