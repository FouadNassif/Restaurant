import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Offer } from '../data/offers';
import { menuItems } from '../data/menu';

const MotionCard = motion(Card);

interface OfferCardProps {
  offer: Offer;
  onViewOffer: () => void;
  index?: number;
}

export default function OfferCard({
  offer,
  onViewOffer,
  index = 0,
}: OfferCardProps) {
  const calculateSavings = (offer: Offer) => {
    if (!offer) return 0;
    const totalIndividualPrice = offer.items.reduce((total, itemId) => {
      const item = menuItems.find((i) => i.id === itemId);
      return total + (item?.price || 0);
    }, 0);
    return totalIndividualPrice - offer.price;
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 2,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          transition: 'all 0.3s ease'
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={offer.image}
        alt={offer.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          {offer.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {offer.description}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Included Items:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {offer.items.map(itemId => {
              const item = menuItems.find(i => i.id === itemId);
              return item ? (
                <Chip 
                  key={item.id} 
                  label={item.name}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              ) : null;
            })}
          </Stack>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ${offer.price.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
              Save ${calculateSavings(offer).toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={onViewOffer}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            View Offer
          </Button>
        </Box>
      </CardContent>
    </MotionCard>
  );
} 