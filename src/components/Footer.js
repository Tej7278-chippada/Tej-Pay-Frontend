// Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div>
        <Box sx={{ bgcolor: 'background.paper', p: 3, mt: 'auto', textAlign: 'center' }}>
        {/* <Typography variant="body2" color="textSecondary">
            &copy; Tej Pay 2024
        </Typography> */}
        </Box>
        <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="body2" color="textSecondary">
        &copy; 2024 Tej Pay |{" "}
        <Link to="/privacy-policy">Privacy Policy</Link> |{" "}
        <Link to="/contact">Contact</Link> |{" "}
        <Link to="/terms-conditions">Terms and Conditions</Link> |{" "}
        <Link to="/cancellation-refund">Cancellation and Refund</Link> |{" "}
        <Link to="/shipping-delivery">Shipping and Delivery</Link>
        </Typography>
    </Box>
  </div>
  );
};

export default Footer;
