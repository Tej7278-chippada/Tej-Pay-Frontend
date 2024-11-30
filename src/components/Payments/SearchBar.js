import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputAdornment,
  Grid2,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Order ID");

  const handleSearch = () => {
    onSearch(searchTerm, filterType);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <Box sx={{ p: 1, paddingTop: '1rem', width: "100%" }}>
      <Grid2 container spacing={2} alignItems="center">
        {/* Dropdown */}
        <Grid2 item xs={12} sm={4} md={3}>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            fullWidth
            variant="outlined"
            sx={{
              bgcolor: "background.paper",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          >
            <MenuItem value="Order ID">Order ID</MenuItem>
            <MenuItem value="Payment ID">Payment ID</MenuItem>
            <MenuItem value="Amount">Amount</MenuItem>
            <MenuItem value="Contact">Contact</MenuItem>
          </Select>
        </Grid2>

        {/* Search Field */}
        <Grid2 item xs={12} sm={8} md={7}>
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search by ${filterType}`}
            size="small"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* Search Button */}
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                  {/* Clear Button */}
                  {searchTerm && (
                    <IconButton onClick={handleClear}>
                      <CloseIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: "background.paper",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default SearchBar;
