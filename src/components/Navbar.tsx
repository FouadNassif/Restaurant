"use client"

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Badge,
  Menu,
  MenuItem,
  Fade,
  Typography,
  Container,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { useCartStore } from '../store/cartStore';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionAppBar = motion(AppBar);

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationAnchor, setLocationAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLocationClick = (event: React.MouseEvent<HTMLElement>) => {
    setLocationAnchor(event.currentTarget);
  };

  const handleLocationClose = () => {
    setLocationAnchor(null);
  };

  const handleLocationScroll = () => {
    const locationSection = document.getElementById('location-section');
    if (locationSection) {
      locationSection.scrollIntoView({ behavior: 'smooth' });
    }
    handleLocationClose();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'left', py: 2 }}>
      <List>
        <ListItem 
          component={Link} 
          href="/" 
          sx={{ 
            py: 2,
            '&:hover': { 
              bgcolor: 'primary.main',
              color: 'white',
              '& .MuiListItemText-primary': { color: 'white' }
            }
          }}
        >
          <ListItemText 
            primary="Home" 
            primaryTypographyProps={{
              sx: { 
                fontWeight: 500,
                fontSize: '1.1rem',
              }
            }}
          />
        </ListItem>
        <ListItem 
          component={Link} 
          href="/menu" 
          sx={{ 
            py: 2,
            '&:hover': { 
              bgcolor: 'primary.main',
              color: 'white',
              '& .MuiListItemText-primary': { color: 'white' }
            }
          }}
        >
          <ListItemText 
            primary="Menu" 
            primaryTypographyProps={{
              sx: { 
                fontWeight: 500,
                fontSize: '1.1rem',
              }
            }}
          />
        </ListItem>
        <ListItem 
          component={Link} 
          href="/offers" 
          sx={{ 
            py: 2,
            '&:hover': { 
              bgcolor: 'primary.main',
              color: 'white',
              '& .MuiListItemText-primary': { color: 'white' }
            }
          }}
        >
          <ListItemText 
            primary="Offers" 
            primaryTypographyProps={{
              sx: { 
                fontWeight: 500,
                fontSize: '1.1rem',
              }
            }}
          />
        </ListItem>
        <ListItem 
          component={Link} 
          href="/cart" 
          sx={{ 
            py: 2,
            '&:hover': { 
              bgcolor: 'primary.main',
              color: 'white',
              '& .MuiListItemText-primary': { color: 'white' }
            }
          }}
        >
          <ListItemText 
            primary="Cart" 
            primaryTypographyProps={{
              sx: { 
                fontWeight: 500,
                fontSize: '1.1rem',
              }
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  if (!mounted) return null;

  return (
    <>
      <MotionAppBar
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        position="sticky"
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ 
            minHeight: { xs: 60, md: 70 },
            px: { xs: 2, md: 0 }
          }}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    letterSpacing: '.1rem',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    textTransform: 'uppercase',
                  }}
                >
                  Restaurant
                </Typography>
              </Link>
            </Box>

            {isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  component={Link}
                  href="/cart"
                  sx={{ 
                    color: 'primary.main',
                    position: 'relative',
                    p: 1,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white',
                    }
                  }}
                >
                  <Badge 
                    badgeContent={items.length} 
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 18,
                        minWidth: 18,
                        p: '0 4px',
                      }
                    }}
                  >
                    <ShoppingCartIcon sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }} />
                  </Badge>
                </IconButton>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: 'primary.main',
                    p: 1,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white',
                    }
                  }}
                >
                  <MenuIcon sx={{ fontSize: { xs: '1.8rem', md: '2rem' } }} />
                </IconButton>
              </Box>
            ) : (
              <Stack direction="row" spacing={3} alignItems="center">
                <Button
                  component={Link}
                  href="/"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': { 
                      color: 'primary.main',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Home
                </Button>
                <Button
                  component={Link}
                  href="/menu"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': { 
                      color: 'primary.main',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Menu
                </Button>
                <Button
                  component={Link}
                  href="/offers"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': { 
                      color: 'primary.main',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Offers
                </Button>
                <IconButton
                  component={Link}
                  href="/cart"
                  sx={{ 
                    color: 'primary.main',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white',
                    }
                  }}
                >
                  <Badge 
                    badgeContent={items.length} 
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: 'primary.main',
                        color: 'white',
                      }
                    }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Stack>
            )}
          </Toolbar>
        </Container>
      </MotionAppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 300,
              bgcolor: 'background.paper',
              borderLeft: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Box sx={{ 
            p: 3, 
            borderBottom: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Navigation
            </Typography>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: 'text.secondary' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <List sx={{ p: 0 }}>
            {[
              { text: 'Home', href: '/' },
              { text: 'Menu', href: '/menu' },
              { text: 'Offers', href: '/offers' }
            ].map((item) => (
              <ListItem 
                key={item.text}
                component={Link}
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{ 
                  py: 2.5,
                  px: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { 
                    bgcolor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemText-primary': { color: 'white' }
                  }
                }}
              >
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    sx: { 
                      fontWeight: 600,
                      fontSize: '1.2rem',
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>

      <Menu
        anchorEl={locationAnchor}
        open={Boolean(locationAnchor)}
        onClose={handleLocationClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleLocationScroll}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Our Location
            </Typography>
            <Typography variant="body2" color="text.secondary">
              123 Restaurant Street
              <br />
              City, State 12345
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" color="primary" />
              <Typography variant="body2">
                (123) 456-7890
              </Typography>
            </Box>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
} 