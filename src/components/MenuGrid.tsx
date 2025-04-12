import React from 'react';
import { Grid, Box } from '@mui/material';
import { MenuItem } from '../data/menu';
import MenuItemCard from './MenuItemCard';

interface MenuGridProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export default function MenuGrid({ items, onItemClick }: MenuGridProps) {
  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid xs={12} sm={6} md={4} key={item.id}>
          <Box>
            <MenuItemCard
              item={item}
              onEdit={() => onItemClick(item)}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
} 