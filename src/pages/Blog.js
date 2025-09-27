import React from 'react';
import { Container, Box, Typography } from '@mui/material';

function Blog() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box>
        <Typography variant="h2" sx={{ mb: 3, textTransform: 'none' }}>
          Blog
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stories and updates on sustainable farming, permaculture practices, and community highlights.
        </Typography>
      </Box>
    </Container>
  );
}

export default Blog;


