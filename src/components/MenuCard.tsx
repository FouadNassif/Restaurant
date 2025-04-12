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
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { MenuItem, menuItems } from '../data/menu';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MotionCard = motion(Card);

interface MenuCardProps {
  item: MenuItem & {
    excludedIngredients?: string[];
  };
  quantity?: number;
  isOfferItem?: boolean;
  offerItems?: {
    itemId: number;
    excludedIngredients: string[];
  }[];
  onQuantityChange?: (change: number) => void;
  onEdit?: () => void;
  onRemove?: () => void;
  showActions?: boolean;
  index?: number;
}

export default function MenuCard({
  item,
  quantity,
  isOfferItem,
  offerItems,
  onQuantityChange,
  onEdit,
  onRemove,
  showActions = true,
  index = 0,
}: MenuCardProps) {
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
        image={item.image}
        alt={item.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          {item.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {item.description}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {isOfferItem ? 'Offer Items:' : 'Ingredients:'}
          </Typography>
          {isOfferItem ? (
            <Stack spacing={2}>
              {offerItems?.map((offerItem) => {
                const menuItem = menuItems.find((i: MenuItem) => i.id === offerItem.itemId);
                if (!menuItem) return null;
                return (
                  <Box key={offerItem.itemId}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                      {menuItem.name}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {menuItem.ingredients.map((ingredient: string, index: number) => (
                        <Chip 
                          key={`${menuItem.id}-${index}`}
                          label={ingredient}
                          size="small"
                          color={offerItem.excludedIngredients?.includes(ingredient) ? "error" : "default"}
                          variant={offerItem.excludedIngredients?.includes(ingredient) ? "outlined" : "filled"}
                        />
                      ))}
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {item.ingredients.map((ingredient: string, index: number) => (
                <Chip 
                  key={`${item.id}-${index}`}
                  label={ingredient}
                  size="small"
                  color={item.excludedIngredients?.includes(ingredient) ? "error" : "default"}
                  variant={item.excludedIngredients?.includes(ingredient) ? "outlined" : "filled"}
                />
              ))}
            </Stack>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ${item.price.toFixed(2)}
            </Typography>
            {isOfferItem && (
              <Typography variant="caption" color="text.secondary">
                Special Offer Price
              </Typography>
            )}
          </Box>
          {showActions && (
            <Stack direction="row" spacing={1} alignItems="center">
              {quantity !== undefined && onQuantityChange && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  p: 0.5
                }}>
                  <IconButton
                    size="small"
                    onClick={() => onQuantityChange(-1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2, minWidth: 20, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onQuantityChange(1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              {isOfferItem && onEdit && (
                <IconButton
                  size="small"
                  onClick={onEdit}
                  sx={{ color: 'primary.main' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {onRemove && (
                <IconButton
                  size="small"
                  onClick={onRemove}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )}
        </Box>
      </CardContent>
    </MotionCard>
  );
} 