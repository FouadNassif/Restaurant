import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Offer as OfferType } from '../data/offers';
import { menuItems } from '../data/menu';
import { useCartStore } from '../store/cartStore';

interface OfferProps {
  offer: OfferType;
}

const Offer: React.FC<OfferProps> = ({ offer }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [formattedDate, setFormattedDate] = React.useState<string>('');

  React.useEffect(() => {
    if (offer.validUntil) {
      setFormattedDate(new Date(offer.validUntil).toLocaleDateString());
    }
  }, [offer.validUntil]);

  const includedItems = offer.items.map((id) =>
    menuItems.find((item) => item.id === id)
  );

  const handleAddToCart = () => {
    includedItems.forEach((item) => {
      if (item) {
        addItem(item);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          maxWidth: 345,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={offer.image}
          alt={offer.name}
          sx={{ objectFit: 'cover' }}
        />
        <Chip
          label="COMBO DEAL"
          color="error"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {offer.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {offer.description}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="primary">
              ${offer.price.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Save ${(
                includedItems.reduce((total, item) => total + (item?.price || 0), 0) -
                offer.price
              ).toFixed(2)}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Includes:
          </Typography>
          <List dense>
            {includedItems.map((item, index) => (
              <ListItem key={item?.id || `item-${index}`}>
                <ListItemText
                  primary={item?.name || 'Unknown Item'}
                  secondary={item?.price ? `$${item.price.toFixed(2)}` : 'N/A'}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddToCart}
            sx={{ mt: 2 }}
          >
            Add Combo to Cart
          </Button>
          {offer.validUntil && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1 }}
            >
              Valid until: {formattedDate}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Offer; 