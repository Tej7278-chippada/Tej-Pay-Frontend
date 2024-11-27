// src/components/PaymentDetails.js
import React from "react";
import { Box, Typography, Divider, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

const PaymentDetails = ({ payment, onClose }) => {
  return (
    <Box padding={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Payment Details</Typography>
        <IconButton onClick={onClose}>
          {/* <CloseIcon /> */}
        </IconButton>
      </Box>
      <Divider />
      <Box mt={3}>
        <Typography variant="body1"><strong>Payment ID:</strong> {payment.id}</Typography>
        <Typography variant="body1"><strong>Amount:</strong> ₹{payment.amount / 100}</Typography>
        <Typography variant="body1"><strong>Status:</strong> {payment.status}</Typography>
        <Typography variant="body1"><strong>Created At:</strong> {new Date(payment.created_at * 1000).toLocaleString()}</Typography>
        <Typography variant="body1"><strong>Customer Email:</strong> {payment.email}</Typography>
        <Typography variant="body1"><strong>Contact:</strong> {payment.contact}</Typography>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Typography variant="h6">Timeline</Typography>
        <ul>
          <li>Payment Created</li>
          <li>Payment Authorized</li>
          <li>Payment Captured</li>
          <li>Settlement</li>
          <li>To be Deposited by: Thu, Nov 28, 2024 1:00 PM</li>
        </ul>
      </Box>
    </Box>
  );
};

export default PaymentDetails;
