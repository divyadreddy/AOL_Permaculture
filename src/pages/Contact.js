import React from 'react';
import { Container, Box, Typography } from '@mui/material';

function Contact() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box>
        <Typography variant="h2" sx={{ mb: 3, textTransform: 'none' }}>
          Contact
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          For inquiries or support, please reach out to us at:
        </Typography>
        <Typography variant="body1">artoflivingpermaculture@gmail.com</Typography>
      </Box>
    </Container>
  );
}

export default Contact;


