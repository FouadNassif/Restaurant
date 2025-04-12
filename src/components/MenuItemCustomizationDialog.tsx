import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { MenuItem, Size } from '../data/menu';
import { useCartStore } from '../store/cartStore';

interface MenuItemCustomizationDialogProps {
  open: boolean;
  onClose: () => void;
  item: MenuItem | null;
  excludedIngredients: string[];
  onIngredientToggle: (ingredient: string) => void;
}

export default function MenuItemCustomizationDialog({
  open,
  onClose,
  item,
  excludedIngredients,
  onIngredientToggle,
}: MenuItemCustomizationDialogProps) {
  const [selectedSize, setSelectedSize] = React.useState<Size>('M');
  const [selectedDrinkType, setSelectedDrinkType] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState(1);
  const addToCart = useCartStore((state) => state.addItem);

  if (!item) return null;

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSize(event.target.value as Size);
  };

  const handleDrinkTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDrinkType(event.target.value);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const getPriceForSize = (size: Size) => {
    if (!item.availableSizes) return item.price;
    const sizePrice = item.availableSizes.find(s => s.size === size);
    return sizePrice ? sizePrice.price : item.price;
  };

  const handleAddToCart = () => {
    if (item.drinkTypes && !selectedDrinkType) {
      alert('Please select a drink type');
      return;
    }
    addToCart({
      ...item,
      quantity,
      excludedIngredients,
      selectedSize,
      selectedDrinkType,
      customizationId: `${item.id}-${selectedSize}-${selectedDrinkType || 'default'}-${excludedIngredients.sort().join(',')}`
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1,
        fontWeight: 'bold'
      }}>
        Customize {item.name}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              {item.description}
            </Typography>
            
            {item.drinkTypes && (
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Select Drink</FormLabel>
                <RadioGroup
                  value={selectedDrinkType}
                  onChange={handleDrinkTypeChange}
                >
                  {item.drinkTypes.map((drinkType) => (
                    <FormControlLabel
                      key={drinkType}
                      value={drinkType}
                      control={<Radio />}
                      label={drinkType}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {item.availableSizes && (
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Size</FormLabel>
                <RadioGroup
                  row
                  value={selectedSize}
                  onChange={handleSizeChange}
                >
                  {item.availableSizes.map((sizeOption) => (
                    <FormControlLabel
                      key={sizeOption.size}
                      value={sizeOption.size}
                      control={<Radio />}
                      label={`${sizeOption.size} ($${sizeOption.price.toFixed(2)})`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {item.requiredIngredients && item.requiredIngredients.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Required Ingredients:
                </Typography>
                <Stack spacing={1} sx={{ mb: 3 }}>
                  {item.requiredIngredients.map((ingredient, index) => (
                    <Box 
                      key={`${item.id}-${index}`}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body1">
                        {ingredient}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Required
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </>
            )}

            {item.optionalIngredients && item.optionalIngredients.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Optional Ingredients:
                </Typography>
                <Stack spacing={1}>
                  {item.optionalIngredients.map((ingredient, index) => (
                    <Box 
                      key={`${item.id}-${index}`}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: excludedIngredients.includes(ingredient) ? 'error.light' : 'grey.50',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: excludedIngredients.includes(ingredient) ? 'error.light' : 'grey.100',
                        }
                      }}
                      onClick={() => onIngredientToggle(ingredient)}
                    >
                      <Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: excludedIngredients.includes(ingredient) ? 'bold' : 'normal',
                            color: excludedIngredients.includes(ingredient) ? 'error.main' : 'text.primary'
                          }}
                        >
                          {ingredient}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: excludedIngredients.includes(ingredient) ? 'error.main' : 'grey.500'
                      }}>
                        {excludedIngredients.includes(ingredient) ? 'Excluded' : 'Included'}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ${getPriceForSize(selectedSize).toFixed(2)}
            </Typography>
            {item.isOnSale && (
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                On Sale!
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Quantity:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: 'grey.100',
              borderRadius: 1,
              p: 0.5
            }}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ px: 2, minWidth: 20, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(1)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={handleAddToCart}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Add to Cart
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
} 