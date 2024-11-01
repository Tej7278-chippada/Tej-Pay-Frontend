// src/pages/PrivacyPolicy.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const PrivacyPolicy = () => (
  <Container>
    <Box py={4}>
      <Typography variant="h4">Privacy Policy</Typography>
      <Typography variant="body1" paragraph>
        Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information.
      </Typography>
      {/* Add more details about your privacy practices here */}
    </Box>
  </Container>
);

export default PrivacyPolicy;