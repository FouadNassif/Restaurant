"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { menuItems } from '../../data/menu';
import { offers } from '../../data/offers';
import { useCartStore } from '../../store/cartStore';
import { useSearchParams } from 'next/navigation';
import OfferCard from '../../components/OfferCard';
import OfferItemCard from '../../components/OfferItemCard';

export default function OffersPage() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();
  const [selectedOffer, setSelectedOffer] = React.useState<typeof offers[0] | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [customizedItems, setCustomizedItems] = React.useState<{ [key: number]: any }>({});
  const [quantity, setQuantity] = React.useState(1);
  const [showCustomization, setShowCustomization] = React.useState(false);

  // Get the offer ID from URL if present and open modal
  React.useEffect(() => {
    const offerId = searchParams.get('offer');
    if (offerId) {
      const offer = offers.find(o => o.id === parseInt(offerId));
      if (offer) {
        setSelectedOffer(offer);
        setOpenDialog(true);
      }
    }
  }, [searchParams]);

  const handleOpenDialog = (offer: typeof offers[0]) => {
    setSelectedOffer(offer);
    setOpenDialog(true);
    setShowCustomization(false);
    setQuantity(1);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setShowCustomization(false);
    setQuantity(1);
  };

  const handleIngredientToggle = (ingredient: string) => {
    if (!selectedItem) return;
    
    const currentExcluded = selectedItem.excludedIngredients || [];
    const newExcluded = currentExcluded.includes(ingredient)
      ? currentExcluded.filter((i: string) => i !== ingredient)
      : [...currentExcluded, ingredient];
    
    setSelectedItem((prev: any) => prev ? {
      ...prev,
      excludedIngredients: newExcluded
    } : null);
  };

  const handleStartCustomization = () => {
    setShowCustomization(true);
    const firstItem = menuItems.find(i => i.id === selectedOffer?.items[0]);
    if (firstItem) {
      setSelectedItem(firstItem);
    }
  };

  const handleSaveItem = () => {
    if (!selectedItem || !selectedOffer) return;
    
    setCustomizedItems(prev => ({
      ...prev,
      [selectedItem.id]: selectedItem
    }));

    // If this is the last item in the offer, add the offer to cart
    if (activeStep === selectedOffer.items.length - 1) {
      // Create a unique customization ID based on all excluded ingredients
      const customizationId = selectedOffer.items
        .map(itemId => {
          const item = customizedItems[itemId];
          return item?.excludedIngredients?.length ? 
            `${itemId}-${item.excludedIngredients.join('-')}` : 
            itemId;
        })
        .join('_');

      // Create the offer cart item with all customized items
      const offerCartItem = {
        id: selectedOffer.id,
        name: selectedOffer.name,
        price: selectedOffer.price,
        quantity: quantity,
        image: selectedOffer.image,
        description: selectedOffer.description,
        ingredients: [], // Not used for offers
        isOfferItem: true,
        offer: selectedOffer,
        category: 'Offers',
        isOnSale: false,
        customizationId: `offer-${customizationId}`,
        offerItems: selectedOffer.items.map(itemId => ({
          itemId,
          excludedIngredients: customizedItems[itemId]?.excludedIngredients || []
        }))
      };

      addItem(offerCartItem);
      handleCloseDialog();
      setActiveStep(0);
      setCustomizedItems({});
    } else {
      setActiveStep(prev => prev + 1);
      const nextItemId = selectedOffer.items[activeStep + 1];
      const nextItem = menuItems.find(i => i.id === nextItemId);
      if (nextItem) {
        setSelectedItem(nextItem);
      }
    }
  };

  const getCurrentItem = () => {
    if (!selectedOffer) return null;
    const itemId = selectedOffer.items[activeStep];
    return menuItems.find(i => i.id === itemId);
  };

  const calculateSavings = (offer: typeof offers[0]) => {
    if (!offer) return 0;
    const totalIndividualPrice = offer.items.reduce((total, itemId) => {
      const item = menuItems.find(i => i.id === itemId);
      return total + (item?.price || 0);
    }, 0);
    return totalIndividualPrice - offer.price;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 6 }}>
          Special Offers
        </Typography>

        <Grid container spacing={3}>
          {offers.map((offer, index) => (
            <Grid item xs={12} sm={6} md={4} key={offer.id}>
              <OfferCard
                offer={offer}
                onViewOffer={() => handleOpenDialog(offer)}
                index={index}
              />
            </Grid>
          ))}
        </Grid>

        {/* Offer Details Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
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
            {selectedOffer?.name}
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {!showCustomization ? (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {selectedOffer?.description}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Included Items:
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedOffer?.items.map(itemId => {
                      const item = menuItems.find(i => i.id === itemId);
                      return item ? (
                        <Grid item xs={12} key={item.id}>
                          <OfferItemCard item={item} />
                        </Grid>
                      ) : null;
                    })}
                  </Grid>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Quantity:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      sx={{ border: 1, borderColor: 'divider' }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      sx={{ 
                        width: 60,
                        '& input': { textAlign: 'center' }
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => setQuantity(prev => prev + 1)}
                      sx={{ border: 1, borderColor: 'divider' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      Total: ${((selectedOffer?.price || 0) * quantity).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                      Save ${(selectedOffer ? calculateSavings(selectedOffer) * quantity : 0).toFixed(2)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleStartCustomization}
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Customize & Add to Cart
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {selectedOffer?.items.map((itemId, index) => {
                    const item = menuItems.find(i => i.id === itemId);
                    return (
                      <Step key={itemId}>
                        <StepLabel>{item?.name}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Customize {selectedItem?.name}:
                  </Typography>
                  <Stack spacing={2}>
                    {selectedItem?.requiredIngredients?.map((ingredient: string, index: number) => (
                      <Box 
                        key={`${selectedItem.id}-required-${index}`}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          p: 2,
                          bgcolor: 'grey.50',
                          borderRadius: 1,
                        }}
                      >
                        <Box>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: 'primary.main'
                            }}
                          >
                            {ingredient}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'primary.main'
                        }}>
                          Required
                        </Box>
                      </Box>
                    ))}
                    {selectedItem?.optionalIngredients?.map((ingredient: string, index: number) => (
                      <Box 
                        key={`${selectedItem.id}-optional-${index}`}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          p: 2,
                          bgcolor: selectedItem.excludedIngredients?.includes(ingredient) ? 'error.light' : 'grey.50',
                          borderRadius: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            bgcolor: selectedItem.excludedIngredients?.includes(ingredient) ? 'error.light' : 'grey.100',
                          }
                        }}
                        onClick={() => handleIngredientToggle(ingredient)}
                      >
                        <Box>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: selectedItem.excludedIngredients?.includes(ingredient) ? 'bold' : 'normal',
                              color: selectedItem.excludedIngredients?.includes(ingredient) ? 'error.main' : 'text.primary'
                            }}
                          >
                            {ingredient}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: selectedItem.excludedIngredients?.includes(ingredient) ? 'error.main' : 'grey.500'
                        }}>
                          {selectedItem.excludedIngredients?.includes(ingredient) ? 'Excluded' : 'Included'}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            {showCustomization && (
              <Button 
                variant="contained" 
                onClick={handleSaveItem}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                {selectedOffer && activeStep === selectedOffer.items.length - 1 ? 'Add to Cart' : 'Next Item'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 