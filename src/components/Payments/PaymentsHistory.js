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
  Toolbar,
  Button,
  Grid,
} from "@mui/material";
import SearchBar from "./SearchBar";
import SkeletonCards from "./SkeletonCards";
// import SearchBarUser from "./SearchBarUser";

const PaymentsHistory = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  // const [searchDialogUserOpen, setSearchDialogUserOpen] = useState(false);

  useEffect(() => {
    setLoading1(true);
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments`);
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading1(false);
      }
    };
    fetchPayments();
    setLoading1(true);
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

  const handleSearch = (searchTerm, filterType) => {
    const filteredPayments = payments.filter((payment) => {
      const value =
        filterType === "Order ID"
          ? payment.razorpay_order_id
          : filterType === "Payment ID"
          ? payment.razorpay_payment_id
          : filterType === "Amount"
          ? payment.amount 
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

  return (
    <div>
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
          Payments History
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
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => setSearchDialogUserOpen(true)}
        >
          Search Payments
        </Button> */}
      </Toolbar>
      <div>
    <Box sx={{ bgcolor: '#f5f5f5', borderRadius: '8px', margin: '8px', paddingInline: '8px', paddingTop: '1rem', paddingBottom: '1rem',  }}>
    {loading1 ? (
            // renderSkeletonCards()
            <SkeletonCards/>
            // <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "50vh" }}>
            //   <CircularProgress />
            // </Box>
          ) : (
            <Grid container spacing={2}>
      {payments.map((payment) => (
        <Grid item xs={12} sm={6} md={4} key={payment._id}>
        <Card
          key={payment._id}
          sx={{ borderRadius:'8px', cursor: "pointer",
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Default shadow
            transition: 'transform 0.1s ease, box-shadow 0.2s ease', // Smooth transition for hover
             }} // onClick={() => openProductDetail(product)}
             onMouseEnter={(e) => {
               e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
               e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
               e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)'; // Revert shadow
             }}
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
    )}

      {/* Dialog for Payment Details */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Payment Details
        <Button style={{ float: 'right', marginTop: '-8px' }} variant="text" onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogTitle>
        
        <DialogContent sx={{padding: '1rem'}}>
        <Card sx={{bgcolor: '#f5f5f5', borderRadius: '8px', minHeight: '200px'}}>
          {loading ? (
            <CircularProgress />
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
      
    </Box>
    </div>
    {/* {searchDialogUserOpen && <SearchBarUser onClose={() => setSearchDialogUserOpen(false)} />} */}

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
      ><Grid container spacing={1}>
          {searchResults.length > 0 ? (
            searchResults.map((payment) => (
              <Grid item xs={12} sm={6} md={4} key={payment._id}>
              <Card key={payment.id} sx={{ marginBottom: "0px", borderRadius: "8px" }}>
                <CardContent>
                  <Typography variant="h6">Order ID: {payment.razorpay_order_id || "N/A"}</Typography>
                  <Typography>Payment ID:{" "}
                <span
                  style={{
                    color:
                      payment.status === "captured"
                        ? "blue"
                        : "grey",
                  }}
                >
                  {payment.razorpay_payment_id || "N/A"}
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
                  <Typography>Amount: ₹{payment.amount }</Typography>
                  
                  {payment.refund_status && (
                    <Typography style={{display: 'inline-block',float: 'right'}}>Refund Status: {" "} <span style={{
                      color: payment.refund_status === "full" ? "green" : "grey",
                    }}>{payment.refund_status}</span></Typography>
                  )}
                  <Typography>Payment Method: {payment.method || "N/A"}</Typography>
                  <Typography>Contact: {payment.contact || "N/A"}</Typography>
                  <Typography>Email: {payment.email || "N/A"}</Typography>
                  <Typography>
                    Created At: {new Date(payment.created_at ).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
              </Grid>
            ))
          ) : (
            <Typography>No results found.</Typography>
          )}
          </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsHistory;
