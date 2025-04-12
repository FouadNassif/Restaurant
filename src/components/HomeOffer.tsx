import React from 'react';
import {
    Box,
    Typography,
    CardContent,
    CardMedia,
    Button,
    Card,
    Stack,
    Chip
  } from '@mui/material';
  import { motion } from 'framer-motion';
  import Link from 'next/link';
  import { Offer } from '../data/offers';

interface HomeOfferProps {
  offer: Offer;
  fadeInUp: any; // You might want to properly type this based on your animation types
}

export default function HomeOffer({offer, fadeInUp}: HomeOfferProps) {
    const MotionCard = motion(Card);
    return(
        <MotionCard
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                sx={{
                  height: '100%',
                  width:{xs:"100%", md:"100%"},
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
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
                <CardContent sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {offer.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                    {offer.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${offer.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      component={Link}
                      href={`/offers?offer=${offer.id}`}
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      View Offer
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
    )
}