import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const SearchBarUser = ({ onClose }) => {
  const [searchField, setSearchField] = useState("orderId");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFields = [
    { value: "orderId", label: "Order ID" },
    { value: "paymentId", label: "Payment ID" },
    { value: "amount", label: "Amount" },
    { value: "contact", label: "Contact Number" },
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/payments?${searchField}=${searchQuery}`
      );
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" >
      <DialogTitle>
        Search Payments
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{scrollbarWidth:'thin'}}>
        <Box display="flex" gap={2} mb={2} >
          <TextField
            select
            label="Search By"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            fullWidth
          >
            {searchFields.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Search Query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!searchQuery || loading}
          >
            Search
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClearSearch}>
          Clear Search
        </Button>
        </Box>
        <Box minHeight="400px" >
          {loading && <Typography>Loading...</Typography>}
          {!loading && searchResults.length === 0 && (
            <Typography>No results found</Typography>
          )}
          {searchResults.map((payment) => (
            <Card key={payment._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  Order ID: {payment.razorpay_order_id}
                </Typography>
                <Typography>Payment ID: {payment.razorpay_payment_id || "N/A"}</Typography>
                <Typography>Amount: ₹{payment.amount}</Typography>
                <Typography>Contact: {payment.contact || "N/A"}</Typography>
                <Typography>
                  Status: {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        
      </DialogContent>
    </Dialog>
  );
};

export default SearchBarUser;
