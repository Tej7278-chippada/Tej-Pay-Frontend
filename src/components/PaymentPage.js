// src/components/PaymentForm.js
import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("https://tej-pay-d30700a52203.herokuapp.com/api/payments", { amount });
      const options = {
        key: "rzp_live_SOG0BZHIb1FCq1",
        amount: data.amount,
        currency: data.currency,
        name: "Tej Pay",
        description: "Test Transaction",
        order_id: data.id,
        handler: (response) => {
          alert("Payment successful!");
          console.log(response);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "1234567890",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Header/>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh" sx={{ maxWidth: 500, margin: "auto", textAlign: "center" }}>
        <Typography variant="h4" mb={2}>Payment Transfer</Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </Box>
      <Footer/>
    </div>
  );
};

export default PaymentForm;
