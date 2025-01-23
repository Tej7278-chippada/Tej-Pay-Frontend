// src/components/PaymentPage.js
import React, { useState } from "react";
import { Button, TextField, Typography, Box, useMediaQuery, ThemeProvider, createTheme, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
// import { useNavigate } from "react-router-dom";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const PaymentForm = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankVerified, setBankVerified] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm')); // Media query for small screens
  // const navigate = useNavigate();

  const verifyBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/validationRazorPayRoutes/validate-bank`,
        { accountNumber, ifscCode }
      );

      if (response.data.success) {
        setBankVerified(true);
        setAlert({ open: true, message: "Bank account details verified successfully!", severity: "success" });
      } else {
        throw new Error("Bank verification failed");
      }
    } catch (error) {
      console.error("Bank verification failed:", error);
      setAlert({ open: true, message: "Invalid bank account details, please check again.", severity: "error" });
      setBankVerified(false);
    } finally {
      setLoading(false);
    }
  };




  // Regex to validate UPI ID format
  const validateUpiIdFormat = (upiId) => {
    const upiRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z]{2,4}$/;
    return upiRegex.test(upiId);
  };

  const verifyUpiId = async () => {
    setLoading(true);
    if (!validateUpiIdFormat(upiId)) {
      setAlert({ open: true, message: "Invalid UPI ID format", severity: "error" });
      setUpiVerified(false);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/validationRazorPayRoutes/validate-upi`,
        { upiId });

      if (response.data.success) {
        setUpiVerified(true);
        setAlert({ open: true, message: "UPI ID verified successfully!", severity: "success" });
      } else {
        setAlert({ open: true, message: "Invalid UPI ID, please enter a valid UPI ID.", severity: "error" });
        setUpiVerified(false);
      }
    } catch (error) {
      console.error("UPI verification failed:", error.response?.data || error.message);
      setAlert({ open: true, message: "Error validating UPI ID. Please try again later.", severity: "error" });
      setUpiVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken'); // Adjust this to where you store your token
      // "https://tej-pay-d30700a52203.herokuapp.com/api/payments"
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments`, { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      const options = {
        key: "rzp_live_SOG0BZHIb1FCq1",
        amount: data.amount,
        currency: data.currency,
        name: "Tej Pay",
        description: "Test Transaction",
        order_id: data.id,
        handler: async (response) => {
          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/update`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setAlert({
              open: true,
              message: `Payment successful! Order ID: ${response.razorpay_order_id}, Payment ID: ${response.razorpay_payment_id}`,
              severity: "success",
            });
          } catch (error) {
            console.error("Failed to update payment details:", error);
            setAlert({
              open: true,
              message: `Payment successful but failed to update details. Order ID: ${response.razorpay_order_id}`,
              severity: "warning",
            });
          }
          setAlert({
            open: true,
            message: `Payment done successfully on Order ID: ${data.id} and Payment ID: ${response.razorpay_payment_id}`,
            severity: "success",
          });
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "1234567890",
        },
        modal: {
          ondismiss: async () => {
            setAlert({
              open: true,
              message: `Payment cancelled by User on Order ID: ${data.id}`,
              severity: "warning",
            });
            try {
              await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/update`, {
                razorpay_order_id: data.id,
                razorpay_payment_id: data.razorpay_payment_id,
                status: "Decliened",
                contact: data.contact, // Replace with actual user contact
                email: data.email, // Replace with actual user email
                payment_method: data.payment_method, // Replace with actual payment method if applicable
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            } catch (error) {
              console.error("Error updating failed payment:", error);
            }
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async (response) => {
        setAlert({
          open: true,
          message: `Payment failed on Order ID: ${data.id}. Reason: ${response.error.description}`,
          severity: "error",
        });
      });
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/update`, {
          razorpay_order_id: data.id,
          status: "failed",
          contact: data.contact, // Replace with actual user contact
          email: data.email, // Replace with actual user email
          payment_method: data.payment_method, // Replace with actual payment method if applicable
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error updating failed payment:", error);
      }
      rzp.open();
    } catch (error) {
      setAlert({ open: true, message: "Failed to initiate payment.", severity: "error" });
      console.error("Payment initiation failed:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
      <Header/>
      
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh" sx={{ maxWidth: 500, margin: "auto", textAlign: "center" }}
      padding={isMobile ? 2 : 4} // Adjust padding for mobile
      >
        <Typography variant={isMobile ? "h5" : "h4"} mb={2}>Payment Transfer</Typography>
        {/* UPI ID Input Step */}
        {/* {!upiVerified && (
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={verifyUpiId}
                disabled={loading || !upiId.trim()}
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </>
          )} */}

          {/* Bank Account Number and IFSC Code Input Step */}
          {/* {!bankVerified && (
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter Bank Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Enter IFSC Code"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={verifyBankDetails}
                disabled={loading || !accountNumber.trim() || !ifscCode.trim()}
              >
                {loading ? "Verifying..." : "Verify Bank Details"}
              </Button>
            </>
          )} */}


          {/* Amount Input Step */}
          {/* {upiVerified && ( */}
            {/* // <> */}
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
        {/* </> */}
          {/* )} */}
      </Box>
      <Snackbar
          open={alert.open}
          autoHideDuration={9000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Snackbar>
      <Footer/>
      </ThemeProvider>
    </div>
  );
};

export default PaymentForm;
