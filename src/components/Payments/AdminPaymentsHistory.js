// src/components/PaymentsHistory.js
import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import axios from "axios";
import PaymentDetails from "./PaymentDetails";

const PaymentsHistory = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments-history`);
        setPayments(data);
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "captured":
        return "green";
      case "created":
        return "grey";
      case "failed":
        return "red";
      case "refunded":
        return "blue";
      default:
        return "black";
    }
  };

  const handleCardClick = async (payment) => {
    // try {
    //   const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/${paymentId}`);
    //   setSelectedPayment(data);
    //   setDialogOpen(true);
    // } catch (error) {
    //   console.error("Failed to fetch payment details:", error);
    // }
    setSelectedPayment(payment);
    setDialogOpen(true);
  };

  return (
    <div>
    <Typography variant="h5" sx={{marginLeft:'2rem', marginTop: '1rem'}} gutterBottom>Admin Payments History</Typography>
    <Box sx={{ padding: 3, display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      
      {payments.map((payment) => (
        <Card key={payment.id} onClick={() => handleCardClick(payment)} sx={{ cursor: "pointer", borderRadius: '8px',}}>
          <CardContent>
            <Typography variant="h6">Order ID: {payment.razorpay_order_id || "N/A"}</Typography>
            <Typography>
              Payment ID:{" "}
              <span style={{ color: payment.status === "captured" ? "blue" : "grey" }}>
                {payment.id || "N/A"}
              </span>
            </Typography>
            <Typography>Amount: ₹{payment.amount/100}</Typography>
            <Typography style={{ color: getStatusColor(payment.status) }}>
              Status: {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Typography>
            {payment.refund_status && (
              <Typography>Refund Status: {payment.refund_status}</Typography>
            )}
            <Typography>Created At: {new Date(payment.created_at * 1000).toLocaleString()}</Typography>
            <Typography>Payment Method: {payment.method || "N/A"}</Typography>
            <Typography>Contact: {payment.contact}</Typography>
            <Typography>Email: {payment.email}</Typography>
          </CardContent>
        </Card>
      ))}
      {selectedPayment && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} >
          {/* <PaymentDetails payment={selectedPayment} /> */}
          <DialogTitle>Payment Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Order ID: {selectedPayment.razorpay_order_id || "N/A"}</Typography>
            {/* <Typography>Payment ID: {selectedPayment.id || "N/A"}</Typography> */}
            <Typography>
                  Payment ID:{" "}
                  <span style={{ color: selectedPayment.status === "captured" ? "blue" : "grey" }}>
                  {selectedPayment.id || "N/A"}
                  </span>
                </Typography>
            <Typography>Amount: ₹{selectedPayment.amount /100}</Typography>
            {/* <Typography>Status: {selectedPayment.status}</Typography> */}
            <Typography>
                  Status:{" "}
                  <span style={{ color: selectedPayment.status === "captured" ? "green" : "red" }}>
                  {selectedPayment.status || "N/A"}
                  </span>
                </Typography>
            <Typography>Payment Method: {selectedPayment.method}</Typography>
            <Typography>Contact: {selectedPayment.contact}</Typography>
            <Typography>Email: {selectedPayment.email}</Typography>
            <Typography>Created At: {new Date(selectedPayment.created_at * 1000).toLocaleString()}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </Box>
    </div>
  );
};

export default PaymentsHistory;
