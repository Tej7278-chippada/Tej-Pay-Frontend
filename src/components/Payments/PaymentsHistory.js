import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";

const PaymentsHistory = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments`);
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, []);

  const fetchLatestPaymentDetails = async (orderId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/${orderId}`);
      setSelectedPayment(data);
    } catch (error) {
      console.error("Error fetching latest payment details:", error);
      setSelectedPayment({ error: "Failed to fetch payment details" });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (payment) => {
    setDialogOpen(true);
    fetchLatestPaymentDetails(payment.razorpay_order_id);
  };

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

  return (
    <div>
      <Typography variant="h5" sx={{marginLeft:'2rem', marginTop: '1rem'}} gutterBottom>Payments History</Typography>
    <Box sx={{ padding: 3, display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      
      {payments.map((payment) => (
        <Card
          key={payment._id}
          sx={{ borderRadius:'8px', cursor: "pointer" }}
          onClick={() => handleCardClick(payment)}
        >
          <CardContent>
            <Typography variant="h6">Order ID: {payment.razorpay_order_id}</Typography>
            <Typography>
              Payment ID:{" "}
              <span style={{ color: payment.status === "captured" ? "blue" : "grey" }}>
                {payment.razorpay_payment_id || "N/A"}
              </span>
            </Typography>
            <Typography>Amount: ₹{payment.amount}</Typography>
            {/* <Typography style={{ color: getStatusColor(payment.status) }}>
              Status: {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Typography> */}
            <Typography>
              Status:{" "}
              <span style={{ color: payment.status === "captured" ? "green" : "grey" }}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1) || "N/A"}
              </span>
            </Typography>
            <Typography>
              Created On: {new Date(payment.created_at).toLocaleString() || "N/A"}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Dialog for Payment Details */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : selectedPayment && selectedPayment.error ? (
            <Typography color="error">{selectedPayment.error}</Typography>
          ) : (
            selectedPayment && (
              <>
                <Typography variant="h6">Order ID: {selectedPayment.orderDetails?.id || "N/A"}</Typography>
                <Typography>
                  Payment ID:{" "}
                  <span style={{ color: selectedPayment.paymentDetails?.status === "captured" ? "blue" : "grey" }}>
                  {selectedPayment.paymentDetails?.id || "N/A"}
                  </span>
                </Typography>
                {/* <Typography>Payment ID: {selectedPayment.paymentDetails?.id || "N/A"}</Typography> */}
                <Typography>Amount: ₹{selectedPayment.paymentDetails?.amount / 100 || "N/A"}</Typography>
                {/* <Typography>Status: {selectedPayment.paymentDetails?.status || "N/A"}</Typography> */}
                <Typography>
                  Status:{" "}
                  <span style={{ color: selectedPayment.paymentDetails?.status === "captured" ? "green" : "red" }}>
                  {selectedPayment.paymentDetails?.status || "N/A"}
                  </span>
                </Typography>
                <Typography>Method: {selectedPayment.paymentDetails?.method || "N/A"}</Typography>
                <Typography>Contact: {selectedPayment.paymentDetails?.contact || "N/A"}</Typography>
                <Typography>Email: {selectedPayment.paymentDetails?.email || "N/A"}</Typography>
                <Typography>Created At: {new Date(selectedPayment.paymentDetails?.created_at * 1000).toLocaleString() || "N/A"}</Typography>
                
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </Box>
    </div>
  );
};

export default PaymentsHistory;
