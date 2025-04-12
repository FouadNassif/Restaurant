import * as React from 'react';
import { Grid } from '@mui/material';
import type { GridProps } from '@mui/material/Grid';
import { Offer } from '../data/offers';
import OfferCard from './OfferCard';

interface OffersGridProps {
  offers: Offer[];
  onOfferClick: (offer: Offer) => void;
}

export default function OffersGrid({ offers, onOfferClick }: OffersGridProps) {
  return (
    <Grid container spacing={3}>
      {offers.map((offer, index) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={4} 
          key={offer.id}
          sx={{ display: 'flex' }}
        >
          <OfferCard
            offer={offer}
            onViewOffer={() => onOfferClick(offer)}
            index={index}
          />
        </Grid>
      ))}
    </Grid>
  );
} 