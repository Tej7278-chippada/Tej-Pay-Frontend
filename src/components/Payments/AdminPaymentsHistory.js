import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Toolbar,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import SearchBar from "./SearchBar";
import SkeletonCards from "./SkeletonCards";
import Layout from "../User/Layout";

const PaymentsHistory = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading1(true);
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/adminPayments/razorpay-history`);
        setPayments(data);
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
      } finally {
        setLoading1(false);
      }
    };

    fetchPayments();
    setLoading1(true);
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

  const handleSearch = (searchTerm, filterType) => {
    const filteredPayments = payments.filter((payment) => {
      const value =
        filterType === "Order ID"
          ? payment.order_id
          : filterType === "Payment ID"
          ? payment.id
          : filterType === "Amount"
          ? payment.amount / 100
          : filterType === "Contact"
          ? payment.contact
          : null;

      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    setSearchResults(filteredPayments);
    setSearchDialogOpen(true);
  };

  const closeSearchDialog = () => {
    setSearchDialogOpen(false);
    setSearchResults([]);
  };

  const handleCardClick = (payment) => {
    setSelectedPayment(payment);
    setDialogOpen(true);
  };

  return (
    <div>
      <Layout>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1, // Add spacing for small screens
        }}
      >
        {/* Title */}
        <Typography
          variant="h5"
          sx={{ marginLeft: "1rem", marginTop: "1rem", flex: "1 1 auto" }}
          gutterBottom
        >
          Admin Payments History
        </Typography>

        {/* SearchBar aligned to the right */}
        <Box
          sx={{
            flex: "0 1 auto", marginRight: '1rem',
            width: { xs: "100%", sm: "auto" }, // Full width on small screens
            textAlign: { xs: "center", sm: "right" }, // Center align for small screens
          }}
        >
          <SearchBar onSearch={handleSearch} onClose={closeSearchDialog} />
        </Box>
      </Toolbar>
      <Box 
        sx={{
          bgcolor: '#f5f5f5', borderRadius: '8px', margin: '8px', paddingInline: '8px', paddingTop: '1rem', paddingBottom: '1rem',
          // display: "grid",
          // gap: 2,
          // gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {loading1 ? (
            <SkeletonCards/>
          ) : (
        <Grid container spacing={2}>
        {payments.map((payment) => (
          <Grid item xs={12} sm={6} md={4} key={payment._id}>
          <Card
            key={payment.id}
            onClick={() => handleCardClick(payment)}
            sx={{ cursor: "pointer", borderRadius: "8px",
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Default shadow
            transition: 'transform 0.1s ease, box-shadow 0.2s ease', // Smooth transition for hover
             }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)'; // Revert shadow
            }}
          >
            <CardContent>
              <Typography variant="h6">
                Order ID: {payment.order_id || "N/A"}
              </Typography>
              <Typography>
                Payment ID:{" "}
                <span
                  style={{
                    color: payment.status === "captured" ? "blue" : "grey",
                  }}
                >
                  {payment.id || "N/A"}
                </span>
              </Typography>
              <Typography style={{ color: getStatusColor(payment.status), display: 'inline-block',float: 'right' }}>
                Status:{" "}
                {payment.status.charAt(0).toUpperCase() +
                  payment.status.slice(1)}
              </Typography>
              <Typography>Amount: ₹{payment.amount / 100}</Typography>
              
              {payment.refund_status && (
                <Typography style={{display: 'inline-block',float: 'right'}}>
                  Refund Status: {" "} <span style={{
                    color: payment.refund_status === "full" ? "green" : "grey",
                  }}>{payment.refund_status}</span>
                  </Typography>
              )}
              
              <Typography>Payment Method: {payment.method || "N/A"}</Typography>
              <Typography>Contact: {payment.contact}</Typography>
              <Typography>Email: {payment.email}</Typography>
              <Typography>
                Created At:{" "}
                {new Date(payment.created_at * 1000).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          </Grid>
        ))}
        </Grid>
        )}
        {selectedPayment && (
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Payment Details
            <Button style={{ float: 'right', marginTop: '-8px' }} variant="text" onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogTitle>
            <DialogContent sx={{padding: '1rem'}}>
              <Card sx={{bgcolor: '#f5f5f5', padding: '1rem', borderRadius: '8px', minHeight: '200px'}}>
              <Typography variant="h6">
                Order ID: {selectedPayment.order_id || "N/A"}
              </Typography>
              <Typography>
                Payment ID:{" "}
                <span
                  style={{
                    color:
                      selectedPayment.status === "captured"
                        ? "blue"
                        : "grey",
                  }}
                >
                  {selectedPayment.id || "N/A"}
                </span>
              </Typography>
              <Typography style={{ color: getStatusColor(selectedPayment.status), display: 'inline-block',float: 'right' }}>
                Status:{" "}
                <span
                  style={{
                    color:
                      selectedPayment.status === "captured"
                        ? "green"
                        : "red",
                  }}
                >
                  {selectedPayment.status || "N/A"}
                </span>
              </Typography>
              <Typography>Amount: ₹{selectedPayment.amount / 100}</Typography>
              
              {selectedPayment.refund_status && (
                <Typography style={{display: 'inline-block',float: 'right'}}>Refund Status: {" "} <span style={{
                  color: selectedPayment.refund_status === "full" ? "green" : "grey",
                }}>{selectedPayment.refund_status}</span></Typography>
              )}
              <Typography>
                Payment Method: {selectedPayment.method || "N/A"}
              </Typography>
              <Typography>Contact: {selectedPayment.contact}</Typography>
              <Typography>Email: {selectedPayment.email}</Typography>
              <Typography>
                Created At:{" "}
                {new Date(selectedPayment.created_at * 1000).toLocaleString()}
              </Typography>
              </Card>
            </DialogContent>
          </Dialog>
        )}
      </Box>
      <Dialog open={searchDialogOpen} onClose={closeSearchDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Search Results
        <Button style={{ float: 'right', marginTop: '-10px' }} variant="text" onClick={closeSearchDialog}>Close</Button>
        </DialogTitle>
        
        <DialogContent sx={{scrollbarWidth:'thin'}}>
        <Box
        sx={{
          bgcolor: '#f5f5f5', borderRadius: '8px', margin: '-1rem', paddingInline: '8px', paddingTop: '2rem', paddingBottom: '1rem',
          display: "grid", minHeight: '400px', 
          gap: 1,
          // gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        <Grid container spacing={2}>
          {searchResults.length > 0 ? (
            searchResults.map((payment) => (
              <Grid item xs={12} sm={6} md={4} key={payment._id}>
              <Card key={payment.id} sx={{ marginBottom: "0px", borderRadius: "8px" }}>
                <CardContent>
                  <Typography variant="h6">Order ID: {payment.order_id || "N/A"}</Typography>
                  <Typography>Payment ID:{" "}
                <span
                  style={{
                    color:
                      payment.status === "captured"
                        ? "blue"
                        : "grey",
                  }}
                >
                  {payment.id || "N/A"}
                </span></Typography>
                <Typography style={{ color: getStatusColor(payment.status), display: 'inline-block',float: 'right' }}>
                    Status:{" "}
                    <span
                      style={{
                        color:
                          payment.status === "captured"
                            ? "green"
                            : "red",
                      }}
                    >
                      {payment.status || "N/A"}
                    </span>
                  </Typography>
                  <Typography>Amount: ₹{payment.amount / 100}</Typography>
                  
                  {payment.refund_status && (
                    <Typography style={{display: 'inline-block',float: 'right'}}>Refund Status: {" "} <span style={{
                      color: payment.refund_status === "full" ? "green" : "grey",
                    }}>{payment.refund_status}</span></Typography>
                  )}
                  <Typography>Payment Method: {payment.method || "N/A"}</Typography>
                  <Typography>Contact: {payment.contact || "N/A"}</Typography>
                  <Typography>Email: {payment.email || "N/A"}</Typography>
                  <Typography>
                    Created At: {new Date(payment.created_at * 1000).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
              </Grid>
            ))
          ) : (
            <Typography style={{padding: '1rem'}}>No results found.</Typography>
          )}
          </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      </Layout>
    </div>
  );
};

export default PaymentsHistory;
