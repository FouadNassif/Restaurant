import { Box, Paper, Typography, Link } from "@mui/material";
import NextLink from 'next/link';

interface QuickLinksProps {
  title: string;
  description: string;
  href: string;
  onClick?: () => void;
}

export default function QuickLinks({title, description, href, onClick}: QuickLinksProps) {
    return(
      <NextLink href={href} passHref>
        <Paper 
          elevation={3} 
          onClick={onClick}
          sx={{
            backgroundColor: 'primary.main',
            width: { xs: '100%', sm: '48%' },
            padding: 3,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            }
          }}
        >
          <Typography 
            sx={{
              textAlign: "center", 
              fontWeight: '900', 
              color: 'white', 
              fontSize: { xs: 20, md: 24 },
              mb: 1
            }}
          >
            {title}
          </Typography>
          <Typography 
            sx={{
              textAlign: "center", 
              fontWeight: '500', 
              color: 'white', 
              fontSize: { xs: 16, md: 18 },
              opacity: 0.9
            }}
          >
            {description}
          </Typography>
        </Paper>
      </NextLink>
    );
}