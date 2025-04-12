import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');

  const handleQuantityChange = (itemId: number, change: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setOpenDialog(true);
  };

  const handleConfirmOrder = () => {
    const orderMessage = `Hello, I want to order:
${items
  .map(
    (item) =>
      ` - ${item.quantity}x ${item.name}${
        item.selectedIngredients.length < item.ingredients.length
          ? ` (without: ${item.ingredients
              .filter((i) => !item.selectedIngredients.includes(i))
              .join(', ')})`
          : ''
      }`
  )
  .join('\n')}
Total: $${getTotal().toFixed(2)}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappUrl, '_blank');
    setOpenDialog(false);
  };

  if (items.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add some delicious items to your cart!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ListItem
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <ListItemText
                primary={item.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      ${(item.isOnSale && item.salePrice ? item.salePrice : item.price).toFixed(2)}
                    </Typography>
                    {item.selectedIngredients.length < item.ingredients.length && (
                      <Typography component="span" variant="body2" color="text.secondary">
                        {' '}
                        (without:{' '}
                        {item.ingredients
                          .filter((i) => !item.selectedIngredients.includes(i))
                          .join(', ')}
                        )
                      </Typography>
                    )}
                  </>
                }
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(item.id, -1)}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(item.id, 1)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeItem(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </motion.div>
        ))}
      </AnimatePresence>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6" color="primary">
          ${getTotal().toFixed(2)}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<WhatsAppIcon />}
        onClick={handleCheckout}
      >
        Place Order via WhatsApp
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Name"
            fullWidth
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmOrder} variant="contained">
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cart; 