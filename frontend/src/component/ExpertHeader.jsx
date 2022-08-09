/* eslint-disable no-unused-vars */
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import StarIcon from '@mui/icons-material/Star';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../Main';
import MAIN from './img/staff_header.png';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const theme = createTheme({
  palette: {
    primary: {
      light: '#000000',
      main: '#000000',
      dark: '#000000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#000000',
      main: '#000000',
      dark: '#000000',
      contrastText: '#000',
    },
  },

});

// The header for the expert side which contian the 
// functionalities such as logout and go to the 
// profile detailed page
export default function ExpertHeader() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  const id = localStorage.getItem('id');
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/expert_profile'); handleMenuClose(); }}>My Profile</MenuItem>
      <Divider />
      <MenuItem onClick={() => {
        apiCall('/logout', 'POST', { id: id });
        localStorage.removeItem('id');
        navigate('/login'); handleMenuClose()
      }}>Logout</MenuItem>
    </Menu>
  );


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, marginLeft: 0 }}>
        <AppBar position="static" sx={
          { position: 'relative', backgroundColor: '#c01901', borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Toolbar>
            <CardMedia
              component="img"
              sx={{ width: 270, height: '100%', margin: '10px' }}
              image={MAIN}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {localStorage.getItem('name') === 'Administer' ?
                <IconButton
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={() => { navigate('/addExpert') }}
                  color="inherit"
                >
                  <SupervisorAccountIcon fontSize="large" />
                </IconButton>
                :
                <></>
              }

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </Box>
    </ThemeProvider>
  )
}