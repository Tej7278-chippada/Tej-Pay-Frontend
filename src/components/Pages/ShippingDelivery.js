// src/pages/ShippingDelivery.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';

const ShippingDelivery = () => (
  <div>
    <Header/>
    <Container>
      <Box py={4}>
        <Typography variant="h4">Shipping and Delivery Policy</Typography>
        <Typography variant="body1" paragraph>
          This policy outlines our shipping and delivery process.
        </Typography>
        {/* Add details about your shipping and delivery policies */}
      </Box>
    </Container>
    <Footer/>
  </div>
);

export default ShippingDelivery;
