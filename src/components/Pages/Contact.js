// src/pages/Contact.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Contact = () => (
  <Container>
    <Box py={4}>
      <Typography variant="h4">Contact Us</Typography>
      <Typography variant="body1" paragraph>
        If you have any questions or concerns, please feel free to reach out to us.
      </Typography>
      {/* Provide contact details or a form for inquiries */}
    </Box>
  </Container>
);

export default Contact;
