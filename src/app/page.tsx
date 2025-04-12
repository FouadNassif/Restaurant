"use client"
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  GridProps,
} from '@mui/material';
import { motion } from 'framer-motion';
import { menuItems } from '../data/menu';
import { offers } from '../data/offers';
import Link from 'next/link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QuickLinks from '@/components/QuickLinks';
import HomeItem from '@/components/HomeItem';
import HomeOffer from '@/components/HomeOffer';
import { useRouter, useSearchParams } from 'next/navigation';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const locationRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const scrollToLocation = () => {
    locationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle navigation to menu/offers with item/offer ID
  const handleMenuClick = () => {
    const itemId = searchParams.get('item');
    if (itemId) {
      router.push(`/menu?item=${itemId}`);
    } else {
      router.push('/menu');
    }
  };

  const handleOffersClick = () => {
    const offerId = searchParams.get('offer');
    if (offerId) {
      router.push(`/offers?offer=${offerId}`);
    } else {
      router.push('/offers');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '80vh', md: '90vh' },
          overflow: 'hidden',
          bgcolor: 'grey.900',
          color: 'white',
        }}
      >
        <Box
          component="img"
          src="/assets/img/Hero.jpg"
          alt="Hero background"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.7,
            filter: 'brightness(0.8)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <MotionTypography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5rem' },
              fontWeight: 800,
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              lineHeight: 1.2,
            }}
            {...fadeInUp}
          >
            Delicious Food
            <br />
            Delivered To You
          </MotionTypography>
          <MotionTypography
            variant="h5"
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              maxWidth: '600px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
            {...fadeInUp}
          >
            Experience the finest culinary delights, crafted with passion and delivered right to your doorstep
          </MotionTypography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} {...fadeInUp}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/menu"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              View Menu
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={scrollToLocation}
              sx={{
                borderColor: 'white',
                color: 'white',
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Find Us
            </Button>
          </Stack>
        </Container>
      </Box>
      <Box sx={{py:8}}>
        <Container maxWidth="lg">
          <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap'}}>
            <QuickLinks 
              title='Menu' 
              description='Explore our delicious menu!'
              href="/menu"
              onClick={handleMenuClick}
            />
            <QuickLinks 
              title='Offers' 
              description='Check out our special offers!'
              href="/offers"
              onClick={handleOffersClick}
            />
          </Box>
        </Container>
      </Box>

      {/* Featured Items Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <MotionTypography
            variant="h3"
            sx={{ 
              mb: 6, 
              textAlign: 'center',
              fontWeight: 'bold',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                bgcolor: 'primary.main',
                borderRadius: 2,
              }
            }}
            {...fadeInUp}
          >
            Featured Items
          </MotionTypography>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <Grid container spacing={4}>
              {menuItems.slice(0, 3).map((item, index) => (
                <Grid 
                  key={item.id}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    custom={index}
                  >
                    <HomeItem item={item} fadeInUp={fadeInUp}/>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Special Offers Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <MotionTypography
            variant="h3"
            sx={{ 
              mb: 6, 
              textAlign: 'center',
              fontWeight: 'bold',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                bgcolor: 'primary.main',
                borderRadius: 2,
              }
            }}
            {...fadeInUp}
          >
            Special Offers
          </MotionTypography>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <Grid container spacing={4}>
              {offers.slice(0, 3).map((offer, index) => (
                <Grid 
                  key={offer.id}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    custom={index}
                  >
                    <HomeOffer offer={offer} fadeInUp={fadeInUp}/>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Location & Contact Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }} ref={locationRef}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/location-map.jpg"
                alt="Restaurant location"
                sx={{
                  width: '100%',
                  height: 500,
                  objectFit: 'cover',
                  borderRadius: 4,
                  boxShadow: 3,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox {...fadeInUp}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Visit Us
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  Come and experience our delicious food in person. We're located in the heart of the city.
                </Typography>
                <Stack spacing={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ 
                      bgcolor: 'primary.main', 
                      p: 2, 
                      borderRadius: 2,
                      color: 'white',
                    }}>
                      <LocationOnIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Address
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        123 Restaurant Street
                        <br />
                        City, State 12345
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ 
                      bgcolor: 'primary.main', 
                      p: 2, 
                      borderRadius: 2,
                      color: 'white',
                    }}>
                      <PhoneIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Phone
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        (123) 456-7890
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ 
                      bgcolor: 'primary.main', 
                      p: 2, 
                      borderRadius: 2,
                      color: 'white',
                    }}>
                      <AccessTimeIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Opening Hours
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Monday - Friday: 11:00 AM - 10:00 PM
                        <br />
                        Saturday - Sunday: 10:00 AM - 11:00 PM
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
