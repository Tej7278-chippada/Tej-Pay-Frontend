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
} from "@mui/material";
import SearchBar from "./SearchBar";
// import SearchBarUser from "./SearchBarUser";

const PaymentsHistory = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  // const [searchDialogUserOpen, setSearchDialogUserOpen] = useState(false);

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
    <Box sx={{ bgcolor: '#f5f5f5', borderRadius: '8px', margin: '8px', paddingInline: '8px', paddingTop: '1rem', paddingBottom: '1rem', display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      
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
              <span style={{ color: getStatusColor(payment.status) }}>
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
                {selectedPayment.refund_status && (
                <Typography>Refund Status: {selectedPayment.refund_status}</Typography>
              )}
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
    {/* {searchDialogUserOpen && <SearchBarUser onClose={() => setSearchDialogUserOpen(false)} />} */}

    <Dialog open={searchDialogOpen} onClose={closeSearchDialog} maxWidth="md" fullWidth>
        <DialogTitle>Search Results
        <Button style={{ float: 'right', marginTop: '-10px' }} variant="text" onClick={closeSearchDialog}>Close</Button>
        </DialogTitle>
        <DialogContent sx={{scrollbarWidth:'thin'}}>
        <Box
        sx={{
          bgcolor: '#f5f5f5', borderRadius: '8px', margin: '8px', paddingInline: '8px', paddingTop: '1rem', paddingBottom: '1rem',
          display: "grid", minHeight: '400px',
          gap: 1,
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
          {searchResults.length > 0 ? (
            searchResults.map((payment) => (
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
                  <Typography>Amount: ₹{payment.amount }</Typography>
                  <Typography style={{ color: getStatusColor(payment.status) }}>
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
                  {payment.refund_status && (
                    <Typography>Refund Status: {payment.refund_status}</Typography>
                  )}
                  <Typography>Payment Method: {payment.method || "N/A"}</Typography>
                  <Typography>Contact: {payment.contact || "N/A"}</Typography>
                  <Typography>Email: {payment.email || "N/A"}</Typography>
                  <Typography>
                    Created At: {new Date(payment.created_at ).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No results found.</Typography>
          )}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsHistory;
