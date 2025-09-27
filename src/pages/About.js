import React from 'react';
import { Container, Box, Typography } from '@mui/material';

function About() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box>
        <Typography variant="h2" sx={{ mb: 3, textTransform: 'none' }}>
          About Us
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Permaculture Market is an initiative of The Art of Living Foundation, connecting
          communities with local permaculture farmers and sustainable, organic produce.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Our mission is to support eco-friendly farming practices and make fresh, local food
          accessible to everyone.
        </Typography>
      </Box>
    </Container>
  );
}

export default About;


