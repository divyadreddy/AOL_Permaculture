import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.neutral.dark,
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="inherit">
            © 2025 Permaculture Market. Supporting sustainable farming practices.
          </Typography>
          
          <Button
            variant="contained"
            component="a"
            href="/products"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
