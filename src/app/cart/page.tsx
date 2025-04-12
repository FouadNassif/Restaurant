"use client"
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Stack,
  Chip,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon, ShoppingCart as CartIcon, Edit as EditIcon } from '@mui/icons-material';
import { useCartStore } from '../../store/cartStore';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { MenuItem, menuItems, Size } from '../../data/menu';
import { Offer } from '../../data/offers';
import { useRouter } from 'next/navigation';
import { useMenuStore } from '../../store/menuStore';
import type { CartItem } from '../../store/cartStore';
import type { MenuItem as MenuItemType } from '../../data/menu';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

// Restaurant Info Data
const PHONE_NUMBER = '96171339879';
const deliveryFee = 5

const MotionCard = motion(Card);

export default function CartPage() {
  const { items, removeItem, updateQuantity, updateItem, addItem, refreshCart } = useCartStore();
  const [openCheckoutDialog, setOpenCheckoutDialog] = React.useState(false);
  const [openIngredientDialog, setOpenIngredientDialog] = React.useState(false);
  const [saveInfo, setSaveInfo] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [customerInfo, setCustomerInfo] = React.useState<CustomerInfo>(() => {
    const savedInfo = Cookies.get('customerInfo');
    return savedInfo ? JSON.parse(savedInfo) : {
      name: '',
      phone: '',
      address: '',
    };
  });
  const [selectedItem, setSelectedItem] = React.useState<CartItem | null>(null);
  const [phoneError, setPhoneError] = React.useState(false);
  const [selectedQuantity, setSelectedQuantity] = React.useState(1);
  const [openQuantityDialog, setOpenQuantityDialog] = React.useState(false);
  const [pendingIngredientChanges, setPendingIngredientChanges] = React.useState<{
    item: CartItem;
    excludedIngredients: string[];
  } | null>(null);

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (itemId: number, change: number, customizationId?: string) => {
    const item = items.find(item => item.id === itemId && item.customizationId === customizationId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      if (newQuantity === 0) {
        removeItem(itemId, customizationId);
      } else {
        updateQuantity(itemId, newQuantity, customizationId);
      }
    }
  };

  const handleRemoveItem = (itemId: number, customizationId?: string) => {
    removeItem(itemId, customizationId);
  };

  const handleOpenCheckout = () => {
    setOpenCheckoutDialog(true);
  };

  const handleCloseCheckout = () => {
    setOpenCheckoutDialog(false);
  };

  const handleSaveCustomerInfo = () => {
    if (saveInfo) {
      Cookies.set('customerInfo', JSON.stringify(customerInfo), { expires: 365 }); // Save for 1 year
    } else {
      Cookies.remove('customerInfo');
    }
    handleWhatsAppOrder();
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  const totalWithDelivery = calculateTotal() + deliveryFee;

  const generateWhatsAppMessage = () => {
    let message = `*New Order*%0A%0A`;
    message += `Name: ${customerInfo.name}%0A`;
    message += `Phone Number: +961 ${customerInfo.phone}%0A`;
    message += `Address: ${customerInfo.address}%0A%0A`;
    message += `*Order Items:*%0A%0A`;

    // Group items by name, size, and customization
    const groupedItems = items.reduce((acc, item) => {
      const key = `${item.customizationId || item.id.toString()}-${item.selectedSize || 'default'}`;
      if (!acc[key]) {
        acc[key] = {
          ...item,
          quantity: 0
        };
      }
      acc[key].quantity += item.quantity;
      return acc;
    }, {} as { [key: string]: CartItem });

    // Format each item for the message
    Object.values(groupedItems).forEach(item => {
      if (item.isOfferItem) {
        // Handle offer items
        message += `- ${item.quantity}x ${item.name}%0A`;
        if (item.offerItems) {
          item.offerItems.forEach(offerItem => {
            const menuItem = menuItems.find(i => i.id === offerItem.itemId);
            if (menuItem) {
              message += `  + ${menuItem.name}`;
              if (offerItem.excludedIngredients?.length) {
                message += ` (without: ${offerItem.excludedIngredients.join(', ')})`;
              }
              message += `%0A`;
            }
          });
        }
      } else {
        // Handle regular items
        message += `- ${item.quantity}x ${item.name}`;
        if (item.selectedSize) {
          message += ` (Size: ${item.selectedSize})`;
        }
        if (item.excludedIngredients?.length) {
          message += ` (without: ${item.excludedIngredients.join(', ')})`;
        }
        message += `%0A`;
      }
      message += `%0A`;
    });

    message += `%0A*Subtotal:* $${calculateTotal().toFixed(2)}%0A`;
    message += `*Delivery Fee:* $${deliveryFee.toFixed(2)}%0A`;
    message += `*Total:* $${totalWithDelivery.toFixed(2)}%0A`;

    return message;
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
  };

  const handleEditOffer = (item: CartItem) => {
    if (item.isOfferItem) {
      // For offer items, create a copy of the item with all offer items' ingredients
      const offerItemsWithIngredients = item.offerItems?.map(oi => {
        const menuItem = menuItems.find(i => i.id === oi.itemId);
        if (!menuItem) return oi;
        return {
          ...oi,
          requiredIngredients: menuItem.requiredIngredients,
          optionalIngredients: menuItem.optionalIngredients
        };
      }) || [];

      setSelectedItem({
        ...item,
        offerItems: offerItemsWithIngredients
      });
    } else {
      // For regular items, just set the selected item
      setSelectedItem(item);
    }
    setOpenIngredientDialog(true);
  };

  const handleQuantityConfirm = () => {
    if (selectedItem && pendingIngredientChanges) {
      setOpenQuantityDialog(false);
      setOpenIngredientDialog(true);
    }
  };

  const handleIngredientToggle = (ingredient: string, offerItemId?: number) => {
    if (!selectedItem) return;
    
    if (selectedItem.isOfferItem && selectedItem.offerItems) {
      // For offer items, update the specific item's ingredients
      const updatedOfferItems = selectedItem.offerItems.map(oi => ({
        ...oi,
        excludedIngredients: oi.itemId === offerItemId ?
          (oi.excludedIngredients?.includes(ingredient) ?
            oi.excludedIngredients.filter(i => i !== ingredient) :
            [...(oi.excludedIngredients || []), ingredient]) :
          oi.excludedIngredients || []
      }));
      
      setSelectedItem(prev => prev ? {
        ...prev,
        offerItems: updatedOfferItems
      } : null);
    } else {
      // For regular items
      const currentExcluded = selectedItem.excludedIngredients || [];
      const newExcluded = currentExcluded.includes(ingredient)
        ? currentExcluded.filter(i => i !== ingredient)
        : [...currentExcluded, ingredient];
      
      setSelectedItem(prev => prev ? {
        ...prev,
        excludedIngredients: newExcluded
      } : null);
    }
  };

  const handleFinalSaveIngredients = () => {
    if (!selectedItem) return;

    if (selectedQuantity === selectedItem.quantity) {
      // Update all items
      if (selectedItem.isOfferItem) {
        // Update offer items
        const customizationId = `offer-${selectedItem.id}-${selectedItem.offerItems?.map(oi => 
          `${oi.itemId}-${(oi.excludedIngredients || []).sort().join('-')}`
        ).join('_')}`;

        updateItem(selectedItem.id, {
          offerItems: selectedItem.offerItems,
          customizationId
        });
      } else {
        // Update regular item
        const customizationId = `custom-${selectedItem.id}-${(selectedItem.excludedIngredients || []).sort().join('-')}`;
        updateItem(selectedItem.id, {
          excludedIngredients: selectedItem.excludedIngredients,
          customizationId
        });
      }
    } else {
      // Create a new item with the modified ingredients
      const customizationId = selectedItem.isOfferItem ? 
        `offer-${selectedItem.id}-${selectedItem.offerItems?.map(oi => 
          `${oi.itemId}-${(oi.excludedIngredients || []).sort().join('-')}`
        ).join('_')}` :
        `custom-${selectedItem.id}-${(selectedItem.excludedIngredients || []).sort().join('-')}`;

      const newItem = {
        ...selectedItem,
        quantity: selectedQuantity,
        customizationId
      };

      // Update the original item quantity
      const updatedQuantity = selectedItem.quantity - selectedQuantity;
      if (updatedQuantity > 0) {
        updateItem(selectedItem.id, {
          quantity: updatedQuantity
        });
      } else {
        removeItem(selectedItem.id, selectedItem.customizationId);
      }

      // Add the new customized item
      addItem(newItem);
    }
    
    // Force a refresh of the cart data
    refreshCart();
    
    setOpenIngredientDialog(false);
    setSelectedItem(null);
    setPendingIngredientChanges(null);
  };

  const handleSaveIngredients = () => {
    if (!selectedItem) return;
    
    if (selectedItem.quantity > 1) {
      setPendingIngredientChanges({
        item: selectedItem,
        excludedIngredients: selectedItem.excludedIngredients || []
      });
      setOpenIngredientDialog(false);
      setOpenQuantityDialog(true);
    } else {
      updateItem(selectedItem.id, {
        excludedIngredients: selectedItem.excludedIngredients
      });
      setOpenIngredientDialog(false);
      setSelectedItem(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 8) { // Only allow up to 8 digits
      setCustomerInfo(prev => ({ ...prev, phone: value }));
      setPhoneError(value.length !== 8);
    }
  };

  const handleOfferIngredientToggle = (itemId: number, ingredient: string) => {
    if (!selectedItem || !selectedItem.isOfferItem || !selectedItem.offerItems) return;

    setSelectedItem(prev => {
      if (!prev || !prev.offerItems) return null;
      const updatedOfferItems = prev.offerItems.map(oi => {
        if (oi.itemId === itemId) {
          const currentExcluded = oi.excludedIngredients || [];
          const newExcluded = currentExcluded.includes(ingredient)
            ? currentExcluded.filter(i => i !== ingredient)
            : [...currentExcluded, ingredient];
          return { ...oi, excludedIngredients: newExcluded };
        }
        return oi;
      });
      return { ...prev, offerItems: updatedOfferItems };
    });
  };

  const handleSaveOfferChanges = () => {
    if (!selectedItem || !selectedItem.isOfferItem || !selectedItem.offerItems) return;

    // Create a new customization ID based on the changes
    const newCustomizationId = `offer-${selectedItem.id}-${selectedItem.offerItems.map(oi => 
      `${oi.itemId}-${(oi.excludedIngredients || []).sort().join('-')}`
    ).join('_')}`;

    // Remove the old item
    removeItem(selectedItem.id, selectedItem.customizationId);

    // Add the updated item
    addItem({
      ...selectedItem,
      customizationId: newCustomizationId
    });

    setOpenIngredientDialog(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          py: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          bgcolor: 'grey.50',
          minHeight: '100vh'
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading your cart...
        </Typography>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box 
        sx={{ 
          py: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          bgcolor: 'grey.50',
          minHeight: '100vh'
        }}
      >
        <Box 
          component="img"
          src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          alt="Empty Cart"
          sx={{ 
            width: 200,
            height: 200,
            objectFit: 'cover',
            borderRadius: 2,
            boxShadow: 3,
            mb: 2
          }}
        />
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Your cart is empty
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ maxWidth: 400 }}>
          Looks like you haven't added any items to your cart yet. Browse our menu and add some delicious items!
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          href="/menu"
          sx={{ 
            mt: 2,
            py: 1.5,
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          Browse Menu
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 12, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid 
            item 
            xs={12} 
            md={8}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Your Cart
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review and modify your items
              </Typography>
            </Box>
            
            {/* Cart Items */}
            <Stack spacing={2}>
              {items.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Your cart is empty
                </Typography>
              ) : (
                items.map((item, index) => (
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    sx={{ mb: 3 }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <List disablePadding>
                        <ListItem
                          sx={{
                            py: 2,
                            px: 0,
                            '&:hover': {
                              bgcolor: 'action.hover',
                              borderRadius: 1,
                            }
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: 'background.paper',
                              border: '1px solid',
                              borderColor: 'divider',
                              '&:hover': {
                                borderColor: 'primary.main',
                                transition: 'all 0.2s ease-in-out'
                              }
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              width: '100%', 
                              alignItems: 'center', 
                              gap: 2, 
                              flexDirection: { xs: 'column', sm: 'row' },
                              position: 'relative'
                            }}>
                              <Box 
                                component="img"
                                src={item.image}
                                alt={item.name}
                                sx={{ 
                                  width: { xs: '100%', sm: 100 }, 
                                  height: { xs: 200, sm: 100 }, 
                                  objectFit: 'cover',
                                  borderRadius: 1
                                }}
                              />
                              <Box sx={{ flex: 1, width: '100%' }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  mb: 1
                                }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                    {item.name}
                                    {item.selectedSize && (
                                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        (Size: {item.selectedSize})
                                      </Typography>
                                    )}
                                    {item.selectedDrinkType && (
                                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        ({item.selectedDrinkType})
                                      </Typography>
                                    )}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEditOffer(item)}
                                      sx={{ 
                                        color: 'primary.main',
                                        bgcolor: 'primary.light',
                                        '&:hover': {
                                          bgcolor: 'primary.main',
                                          color: 'white'
                                        }
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleRemoveItem(item.id, item.customizationId)}
                                      sx={{ 
                                        color: 'error.main',
                                        bgcolor: 'error.light',
                                        '&:hover': {
                                          bgcolor: 'error.main',
                                          color: 'white'
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  ${item.price.toFixed(2)} each
                                </Typography>
                                
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    {item.isOfferItem ? 'Offer Items:' : 'Ingredients:'}
                                  </Typography>
                                  {item.isOfferItem ? (
                                    <Stack spacing={2}>
                                      {item.offerItems?.map((offerItem) => {
                                        const menuItem = menuItems.find(i => i.id === offerItem.itemId);
                                        if (!menuItem) return null;
                                        const allIngredients = [
                                            ...(menuItem.requiredIngredients || []),
                                            ...(menuItem.optionalIngredients || [])
                                        ];
                                        return (
                                          <Box key={offerItem.itemId}>
                                            <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                                              {menuItem.name}
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                              {allIngredients.map((ingredient, index) => (
                                                <Chip 
                                                  key={`${menuItem.id}-${index}`}
                                                  label={ingredient}
                                                  size="small"
                                                  color={offerItem.excludedIngredients?.includes(ingredient) ? "error" : "default"}
                                                  variant={offerItem.excludedIngredients?.includes(ingredient) ? "outlined" : "filled"}
                                                  sx={{
                                                    '& .MuiChip-label': {
                                                      color: offerItem.excludedIngredients?.includes(ingredient) ? 'error.main' : 'inherit'
                                                    }
                                                  }}
                                                />
                                              ))}
                                            </Stack>
                                          </Box>
                                        );
                                      })}
                                    </Stack>
                                  ) : (
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                      {item.requiredIngredients && item.requiredIngredients.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            Required Ingredients:
                                          </Typography>
                                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {item.requiredIngredients.map((ingredient, index) => (
                                              <Chip
                                                key={`${item.id}-required-${index}`}
                                                label={ingredient}
                                                size="small"
                                                sx={{ 
                                                  bgcolor: item.excludedIngredients?.includes(ingredient) ? 'error.light' : 'grey.100',
                                                  '& .MuiChip-label': {
                                                    fontSize: '0.75rem',
                                                    color: item.excludedIngredients?.includes(ingredient) ? 'error.main' : 'text.secondary'
                                                  }
                                                }}
                                              />
                                            ))}
                                          </Stack>
                                        </Box>
                                      )}
                                      {item.optionalIngredients && item.optionalIngredients.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            Optional Ingredients:
                                          </Typography>
                                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {item.optionalIngredients.map((ingredient, index) => (
                                              <Chip
                                                key={`${item.id}-optional-${index}`}
                                                label={ingredient}
                                                size="small"
                                                sx={{ 
                                                  bgcolor: item.excludedIngredients?.includes(ingredient) ? 'error.light' : 'grey.100',
                                                  '& .MuiChip-label': {
                                                    fontSize: '0.75rem',
                                                    color: item.excludedIngredients?.includes(ingredient) ? 'error.main' : 'text.secondary'
                                                  }
                                                }}
                                              />
                                            ))}
                                          </Stack>
                                        </Box>
                                      )}
                                    </Stack>
                                  )}
                                </Box>

                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  mt: 'auto'
                                }}>
                                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                    ${item.price.toFixed(2)}
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
                                      onClick={() => handleQuantityChange(item.id, -1, item.customizationId)}
                                    >
                                      <RemoveIcon fontSize="small" />
                                    </IconButton>
                                    <Typography sx={{ px: 2, minWidth: 20, textAlign: 'center' }}>
                                      {item.quantity}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleQuantityChange(item.id, 1, item.customizationId)}
                                    >
                                      <AddIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Paper>
                        </ListItem>
                      </List>
                    </CardContent>
                  </MotionCard>
                ))
              )}
            </Stack>
          </Grid>

          <Grid 
            item 
            xs={12} 
            md={4}
          >
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              elevation={2}
              sx={{ 
                borderRadius: 2,
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Order Summary
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50',
                        borderRadius: 1
                      }}
                    >
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>Subtotal</Typography>
                          <Typography>${calculateTotal().toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>Delivery Fee</Typography>
                          <Typography>${deliveryFee.toFixed(2)}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            ${totalWithDelivery.toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleOpenCheckout}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'medium'
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </Stack>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Checkout Dialog */}
        <Dialog 
          open={openCheckoutDialog} 
          onClose={handleCloseCheckout}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', pb: 2 }}>
            Place Your Order
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Order Summary
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50',
                    borderRadius: 1
                  }}
                >
                  <Stack spacing={2}>
                    {items.map((item, index) => (
                      <Box key={`${item.id}-${item.customizationId || index}`}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              {item.name} x{item.quantity}
                            </Typography>
                            {item.requiredIngredients && item.requiredIngredients.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Required Ingredients:
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                  {item.requiredIngredients.map((ingredient, index) => (
                                    <Chip
                                      key={`${item.id}-required-${index}`}
                                      label={ingredient}
                                      size="small"
                                      sx={{ 
                                        bgcolor: item.excludedIngredients?.includes(ingredient) ? 'error.light' : 'grey.100',
                                        '& .MuiChip-label': {
                                          fontSize: '0.75rem',
                                          color: item.excludedIngredients?.includes(ingredient) ? 'error.main' : 'text.secondary'
                                        }
                                      }}
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            )}
                            {item.optionalIngredients && item.optionalIngredients.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Optional Ingredients:
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                  {item.optionalIngredients.map((ingredient, index) => (
                                    <Chip
                                      key={`${item.id}-optional-${index}`}
                                      label={ingredient}
                                      size="small"
                                      sx={{ 
                                        bgcolor: item.excludedIngredients?.includes(ingredient) ? 'error.light' : 'grey.100',
                                        '& .MuiChip-label': {
                                          fontSize: '0.75rem',
                                          color: item.excludedIngredients?.includes(ingredient) ? 'error.main' : 'text.secondary'
                                        }
                                      }}
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            )}
                          </Box>
                          <Typography variant="subtitle1">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Subtotal</Typography>
                      <Typography>${calculateTotal().toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Delivery Fee</Typography>
                      <Typography>${deliveryFee.toFixed(2)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <Typography>Total</Typography>
                      <Typography>${totalWithDelivery.toFixed(2)}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Delivery Information
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    value={customerInfo.phone}
                    onChange={handlePhoneChange}
                    error={phoneError}
                    helperText={phoneError ? "Phone number must be 8 digits" : ""}
                    inputProps={{
                      maxLength: 8,
                      pattern: "[0-9]*",
                      inputMode: "numeric"
                    }}
                    required
                  />
                  <TextField
                    label="Delivery Address"
                    fullWidth
                    multiline
                    rows={3}
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Save my information for future orders"
                  />
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={handleCloseCheckout}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleSaveCustomerInfo}
              disabled={!customerInfo.name || !customerInfo.phone || customerInfo.phone.length !== 8 || !customerInfo.address}
              sx={{ 
                textTransform: 'none',
                fontWeight: 'medium'
              }}
            >
              Place Order via WhatsApp
            </Button>
          </DialogActions>
        </Dialog>

        {/* Quantity Selection Dialog */}
        <Dialog
          open={openQuantityDialog}
          onClose={() => setOpenQuantityDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Select Quantity to Modify</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              How many items would you like to modify?
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 2 }}>
              <IconButton
                onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                disabled={selectedQuantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6">{selectedQuantity}</Typography>
              <IconButton
                onClick={() => setSelectedQuantity(prev => Math.min(selectedItem?.quantity || 1, prev + 1))}
                disabled={selectedQuantity >= (selectedItem?.quantity || 1)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenQuantityDialog(false)}>Cancel</Button>
            <Button onClick={handleQuantityConfirm} variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Ingredient Modification Dialog */}
        <Dialog
          open={openIngredientDialog}
          onClose={() => setOpenIngredientDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Customize {selectedItem?.name}
          </DialogTitle>
          <DialogContent>
            {selectedItem?.isOfferItem ? (
              // Offer items customization
              selectedItem.offerItems?.map(offerItem => {
                const menuItem = menuItems.find(i => i.id === offerItem.itemId);
                if (!menuItem) return null;
                
                return (
                  <Box key={offerItem.itemId} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {menuItem.name}
                    </Typography>
                    
                    {/* Required Ingredients */}
                    {(menuItem?.requiredIngredients ?? []).length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Required Ingredients:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {(menuItem?.requiredIngredients ?? []).map((ingredient) => (
                            <Chip
                              key={`${menuItem.id}-required-${ingredient}`}
                              label={ingredient}
                              color="primary"
                              variant="filled"
                              sx={{ 
                                cursor: 'not-allowed',
                                opacity: 0.7
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* Optional Ingredients */}
                    {(menuItem?.optionalIngredients ?? []).length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Optional Ingredients:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {(menuItem?.optionalIngredients ?? []).map((ingredient) => (
                            <Chip
                              key={`${menuItem.id}-optional-${ingredient}`}
                              label={ingredient}
                              onClick={() => handleOfferIngredientToggle(offerItem.itemId, ingredient)}
                              color={offerItem.excludedIngredients?.includes(ingredient) ? "error" : "default"}
                              variant={offerItem.excludedIngredients?.includes(ingredient) ? "outlined" : "filled"}
                              sx={{
                                cursor: 'pointer',
                                '& .MuiChip-label': {
                                  color: offerItem.excludedIngredients?.includes(ingredient) ? 'error.main' : 'inherit'
                                }
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                );
              })
            ) : (
              // Regular item customization
              <Box>
                {/* Required Ingredients */}
                {selectedItem?.requiredIngredients && selectedItem.requiredIngredients.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Required Ingredients:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedItem.requiredIngredients.map((ingredient) => (
                        <Chip
                          key={`required-${ingredient}`}
                          label={ingredient}
                          color="primary"
                          variant="filled"
                          sx={{ 
                            cursor: 'not-allowed',
                            opacity: 0.7
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Optional Ingredients */}
                {selectedItem?.optionalIngredients && selectedItem.optionalIngredients.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Optional Ingredients:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedItem.optionalIngredients.map((ingredient) => (
                        <Chip
                          key={`optional-${ingredient}`}
                          label={ingredient}
                          onClick={() => handleIngredientToggle(ingredient)}
                          color={selectedItem.excludedIngredients?.includes(ingredient) ? "error" : "default"}
                          variant={selectedItem.excludedIngredients?.includes(ingredient) ? "outlined" : "filled"}
                          sx={{
                            cursor: 'pointer',
                            '& .MuiChip-label': {
                              color: selectedItem.excludedIngredients?.includes(ingredient) ? 'error.main' : 'inherit'
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenIngredientDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={selectedItem?.isOfferItem ? handleSaveOfferChanges : handleSaveIngredients}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 