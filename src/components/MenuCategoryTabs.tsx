import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

interface MenuCategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function MenuCategoryTabs({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: MenuCategoryTabsProps) {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    onCategoryChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
      <Tabs 
        value={selectedCategory} 
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
            height: 3,
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'medium',
            fontSize: '1rem',
          }
        }}
      >
        {categories.map(category => (
          <Tab key={category} label={category} value={category} />
        ))}
      </Tabs>
    </Box>
  );
} 