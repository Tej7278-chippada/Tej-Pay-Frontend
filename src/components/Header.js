// Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Header = () => {
  const navigate = useNavigate();
  
  
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-block' }}>
            Tej Pay
          </Link>
        </Typography>
        <Button
              variant="contained"
              onClick={() => navigate("/payments-history")}
              sx={{
                backgroundColor: '#1976d2', // Primary blue
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '24px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#1565c0', // Darker shade on hover
                },
                display: 'flex',
                alignItems: 'center',
                gap: '8px', marginRight: '1rem'
              }}
            >
              <ReceiptIcon sx={{ fontSize: '20px' }} />
              {/* <span style={{ fontSize: '14px', fontWeight: '500' }}>Payment History</span> */}
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/admin-payments-history")} //onClick={() => window.location.href = "/admin-payments-history"}
              sx={{
                backgroundColor: '#1976d2', // Primary blue
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '24px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#1565c0', // Darker shade on hover
                },
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AccountCircleIcon sx={{ fontSize: '20px' }} />
              {/* <span style={{ fontSize: '14px', fontWeight: '500' }}>Admin</span> */}
            </Button>
        
    
          {/* <Link to="/admin-payments-history" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Admin Page</Link>
          <Link to="/payments-history" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Payment History</Link> */}
        
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
