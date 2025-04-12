import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import { MenuItem, Size } from '../data/menu';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCartStore } from '../store/cartStore';
import MenuItemCustomizationDialog from './MenuItemCustomizationDialog';

interface MenuItemCardProps {
  item: MenuItem;
  quantity?: number;
  onQuantityChange?: (change: number) => void;
  onEdit?: () => void;
  onRemove?: () => void;
  showActions?: boolean;
  isOfferItem?: boolean;
  offerItems?: Array<{
    itemId: string;
    excludedIngredients: string[];
  }>;
}

export default function MenuItemCard({ 
  item, 
  quantity, 
  onQuantityChange,
  onEdit,
  onRemove,
  showActions = true,
  isOfferItem = false,
  offerItems = []
}: MenuItemCardProps) {
  const [open, setOpen] = React.useState(false);
  const [excludedIngredients, setExcludedIngredients] = React.useState<string[]>([]);
  const addToCart = useCartStore((state: any) => state.addItem);

  const handleIngredientToggle = (ingredient: string) => {
    setExcludedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleAddToCart = (selectedSize: Size) => {
    addToCart({
      ...item,
      quantity: 1,
      excludedIngredients,
      selectedSize,
      customizationId: `${item.id}-${selectedSize}-${excludedIngredients.sort().join(',')}`
    });
    setOpen(false);
  };

  const offerExcludedIngredients = isOfferItem 
    ? offerItems.find(oi => oi.itemId === item.id.toString())?.excludedIngredients || []
    : [];

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={item.image}
          alt={item.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {item.description}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Required Ingredients:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {item.requiredIngredients?.map((ingredient, index) => (
                <Chip
                  key={`${item.id}-${index}`}
                  label={ingredient}
                  size="small"
                  sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Optional Ingredients:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {item.optionalIngredients?.map((ingredient, index) => (
                <Chip
                  key={`${item.id}-${index}`}
                  label={ingredient}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mt: 'auto'
          }}>
            <Box>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                ${item.price.toFixed(2)}
              </Typography>
              {item.isOnSale && (
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                  On Sale!
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Customize
            </Button>
          </Box>
        </CardContent>
      </Card>

      <MenuItemCustomizationDialog
        open={open}
        onClose={() => setOpen(false)}
        item={item}
        onAddToCart={handleAddToCart}
        excludedIngredients={excludedIngredients}
        onIngredientToggle={handleIngredientToggle}
      />
    </>
  );
} 