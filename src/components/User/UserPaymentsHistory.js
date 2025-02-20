import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Grid, Dialog, DialogTitle, Button, DialogContent, CircularProgress } from '@mui/material';
import { fetchUserPayments } from '../../api/userApis';
import Layout from './Layout';
import SkeletonCards from '../Payments/SkeletonCards';
import axios from 'axios';

const UserPaymentsHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const paymentsData = await fetchUserPayments();
        setPayments(paymentsData);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "captured":
        return "green";
      case "created":
        return "grey";
      case "failed":
        return "red";
      case "Decliened":
        return "red";
      case "refunded":
        return "blue";
      default:
        return "black";
    }
  };

  const fetchLatestPaymentDetails = async (orderId) => {
    setLoading1(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/${orderId}`);
      setSelectedPayment(data);
    } catch (error) {
      console.error("Error fetching latest payment details:", error);
      setSelectedPayment({ error: "Failed to fetch payment details" });
    } finally {
      setLoading1(false);
    }
  };

  const handleCardClick = (payment) => {
    setDialogOpen(true);
    fetchLatestPaymentDetails(payment.razorpay_order_id);
  };

  if (loading) {
    return (
        <Layout>
        <Container>
          <Typography variant="h5" gutterBottom marginTop={2}>
            Payment History
          </Typography>
          <SkeletonCards/>
            {/* <CircularProgress /> */}
            {/* <Typography>Loading payment history...</Typography> */}
        </Container>
        </Layout>
    );
  }

  return (
    <Layout>
    <Container style={{marginTop:'1rem', marginBottom:'1rem'}}>
      <Typography variant="h5" gutterBottom>
        Payment History
      </Typography>
      {payments.length === 0 ? (
        <Typography variant="body1">No payment history available.</Typography>
      ) : (
        <Grid container spacing={1}>
          {payments.map((payment) => (
            <Grid item xs={12} sm={6} md={4} key={payment._id}>
              <Card sx={{cursor:'pointer', borderRadius:'6px'}} onClick={() => handleCardClick(payment)}>
                <CardContent>
                  {/* <Typography variant="h6">Order ID: {payment.razorpay_order_id}</Typography>
                  <Typography>Amount: ₹{payment.amount}</Typography>
                  <Typography>Status: {payment.status}</Typography>
                  <Typography>Payment Method: {payment.payment_method || 'N/A'}</Typography>
                  <Typography>Date: {new Date(payment.created_at).toLocaleString()}</Typography>
                  {payment.status === 'created' && (
                    <Button variant="contained" color="primary" onClick={() => navigate(`/paymentForm/${payment._id}`)}>
                      Complete Payment
                    </Button>
                  )} */}
                  <Typography variant="h6">Order ID: {payment.razorpay_order_id}</Typography>
                  <Typography>
                    Payment ID:{" "}
                    <span style={{ color: payment.status === "captured" ? "blue" : "grey" }}>
                      {payment.razorpay_payment_id || "N/A"}
                    </span>
                  </Typography>
                  <Typography sx={{display: 'inline-block',float: 'right'}}>
                    Status:{" "}
                    <span style={{ color: getStatusColor(payment.status) }}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1) || "N/A"}
                    </span>
                  </Typography>
                  <Typography>Amount: ₹{payment.amount}</Typography>
                  {/* <Typography style={{ color: getStatusColor(payment.status) }}>
                    Status: {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Typography> */}
                  
                  <Typography>
                    Created On: {new Date(payment.created_at).toLocaleString() || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}{/* Dialog for Payment Details */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Payment Details
        <Button style={{ float: 'right', marginTop: '-8px' }} variant="text" onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogTitle>
        
        <DialogContent sx={{padding: '1rem'}}>
        <Card sx={{bgcolor: '#f5f5f5', borderRadius: '8px', minHeight: '200px'}}>
          {loading1 ? (
            <CircularProgress style={{margin:'1rem'}}/>
          ) : selectedPayment && selectedPayment.error ? (
            <Typography color="error">{selectedPayment.error}</Typography>
          ) : (
            selectedPayment && (
              
                <CardContent>
                <Typography variant="h6">Order ID: {selectedPayment.orderDetails?.id || "N/A"}</Typography>
                <Typography>
                  Payment ID:{" "}
                  <span style={{ color: selectedPayment.paymentDetails?.status === "captured" ? "blue" : "grey" }}>
                  {selectedPayment.paymentDetails?.id || "N/A"}
                  </span>
                </Typography>
                {/* <Typography>Payment ID: {selectedPayment.paymentDetails?.id || "N/A"}</Typography> */}
                <Typography style={{display: 'inline-block',float: 'right'}}>
                  Status:{" "}
                  <span style={{ color: selectedPayment.paymentDetails?.status === "captured" ? "green" : "red" }}>
                  {selectedPayment.paymentDetails?.status || "N/A"}
                  </span>
                </Typography>
                <Typography>Amount: ₹{selectedPayment.paymentDetails?.amount / 100 || "N/A"}</Typography>
                {/* <Typography>Status: {selectedPayment.paymentDetails?.status || "N/A"}</Typography> */}
                
                {selectedPayment.refund_status && (
                <Typography style={{display: 'inline-block',float: 'right'}}>Refund Status: {selectedPayment.refund_status}</Typography>
              )}
                <Typography>Method: {selectedPayment.paymentDetails?.method || "N/A"}</Typography>
                <Typography>Contact: {selectedPayment.paymentDetails?.contact || "N/A"}</Typography>
                <Typography>Email: {selectedPayment.paymentDetails?.email || "N/A"}</Typography>
                <Typography>Created At: {new Date(selectedPayment.paymentDetails?.created_at * 1000).toLocaleString() || "N/A"}</Typography>
                </CardContent>
              
            )
          )}
          </Card>
        </DialogContent>
      </Dialog>

    </Container>
    </Layout>
  );
};

export default UserPaymentsHistory;
