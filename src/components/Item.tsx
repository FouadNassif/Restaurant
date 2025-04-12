"use client"
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCartStore } from '../store/cartStore';
import { MenuItem } from '../data/menu';

interface ItemProps {
  item: MenuItem;
}

const Item: React.FC<ItemProps> = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedIngredients, setSelectedIngredients] = React.useState<string[]>([]);
  const { addItem } = useCartStore();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIngredients([]);
  };

  const handleIngredientChange = (ingredient: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleAddToCart = () => {
    addItem(item, 1, selectedIngredients);
    handleClose();
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width:{xs:"100%"}, backgroundColor:"blue" }}>
        <CardMedia
          component="img"
          height="200"
          image={item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
          alt={item.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {item.description}
          </Typography>
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {item.ingredients.slice(0, 3).map((ingredient) => (
                <Chip
                  key={ingredient}
                  label={ingredient}
                  size="small"
                  sx={{ bgcolor: 'primary.light', color: 'white' }}
                />
              ))}
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                ${item.isOnSale ? item.salePrice : item.price}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Customize {item.name}</DialogTitle>
        <DialogContent>
          <FormGroup>
            {item.ingredients.map((ingredient) => (
              <FormControlLabel
                key={ingredient}
                control={
                  <Checkbox
                    checked={selectedIngredients.includes(ingredient)}
                    onChange={() => handleIngredientChange(ingredient)}
                    color="primary"
                  />
                }
                label={ingredient}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddToCart} variant="contained" color="primary">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Item; 