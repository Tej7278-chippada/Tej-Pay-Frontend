// Header.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem, Dialog, List, ListItem, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Header = ({ username }) => {
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState(username || '');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loggedInUsers, setLoggedInUsers] = useState([]);


  // Load logged-in users from localStorage
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
    setLoggedInUsers(users);

    // Load the last active user from localStorage if available
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
      const tokens = JSON.parse(localStorage.getItem('authTokens')) || {};
    const activeToken = tokens[username];
    if (activeToken) {
      localStorage.setItem('authToken', activeToken); // Ensure the correct token is set
    }
      setCurrentUsername(activeUser);
    }
  }, [username]);

  // After successful login, update loggedInUsers and authTokens in localStorage
  useEffect(() => {
    if (username) {
      const users = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
      if (!users.includes(username)) {
        users.push(username);
        localStorage.setItem('loggedInUsers', JSON.stringify(users));
      }

      // Store each user's auth token
      const tokens = JSON.parse(localStorage.getItem('authTokens')) || {};
      tokens[username] = localStorage.getItem('authToken'); // Save current token
      localStorage.setItem('authTokens', JSON.stringify(tokens));
      setCurrentUsername(username); // Set initial username on login
      localStorage.setItem('activeUser', username); // Save active user
    }
  }, [username]);

  const handleLogout = () => {
    const tokens = JSON.parse(localStorage.getItem('authTokens')) || {};
    delete tokens[currentUsername]; // Remove current user's token
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    
    // Remove current user from logged-in users list
    const updatedUsers = loggedInUsers.filter(user => user !== currentUsername);
    localStorage.setItem('loggedInUsers', JSON.stringify(updatedUsers));
    setLoggedInUsers(updatedUsers);
    localStorage.removeItem('authToken'); // Clear current session token
    setAnchorEl(null);
    setCurrentUsername('');
    localStorage.removeItem('activeUser'); 
    localStorage.removeItem('tokenUsername'); 
    localStorage.removeItem('userId'); 
    localStorage.removeItem('currentPage'); 
    localStorage.removeItem('rzp_checkout_anon_id'); 
    localStorage.removeItem('rzp_device_id'); 
    localStorage.removeItem('rzp_stored_checkout_id'); 
    // localStorage.clear();
    navigate('/');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleSwitchProfile = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectUser = (user) => {
    if (user === 'Login with another account') {
      navigate('/');
    } else {
      const tokens = JSON.parse(localStorage.getItem('authTokens')) || {};
      const authToken = tokens[user];
  
      if (!authToken) {
        console.error(`No auth token found for ${user}`);
        return;
      }
  
      // Set the selected user's token as the active auth token
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('activeUser', user); // Set active user in localStorage
      setCurrentUsername(user); // Update current username state
      navigate('/paymentForm');
    }
    setOpenDialog(false);
  };

  const openUserProfile = () => {
    const userId = localStorage.getItem('userId'); 
    navigate(`/user/${userId}`); //, { replace: true }
  };
  
  
  
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

          
          {currentUsername && (
            <>
              <IconButton onClick={handleProfileClick} color="inherit">
                <AccountCircleIcon />
                <Typography variant="body1">{currentUsername}</Typography>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => openUserProfile()}>My Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={handleSwitchProfile}>Switch Profile</MenuItem>
              </Menu>
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <List style={{ cursor: 'pointer' }}>
                  <ListItem button onClick={() => handleSelectUser('Login with another account')}>
                    <ListItemText primary="Login with another account" />
                  </ListItem>
                  {loggedInUsers.map((user) => (
                    <ListItem button key={user} onClick={() => handleSelectUser(user)}>
                      <ListItemText primary={user} />
                    </ListItem>
                  ))}
                </List>
              </Dialog>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
