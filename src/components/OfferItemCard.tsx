import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { MenuItem } from '../data/menu';

interface OfferItemCardProps {
  item: MenuItem;
}

export default function OfferItemCard({ item }: OfferItemCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            sx={{
              width: 80,
              height: 80,
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
            <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
              ${item.price.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 