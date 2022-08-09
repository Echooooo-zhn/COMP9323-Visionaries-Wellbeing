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
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../Main';
import CardMedia from '@mui/material/CardMedia';
import MAIN from './img/student_header.png'

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
      dark: '#ba000d',
      contrastText: '#000',
    },
  },

});

// The header for the studnet site which contains the 
// log out or view current student's profile choice.
export default function StudentHeader(props) {
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
  const RenderMenu = () => {
    return (
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
        <MenuItem onClick={() => { navigate('/student_profile'); handleMenuClose(); }}>My Profile</MenuItem>

        <MenuItem onClick={() => { navigate('/student_booked_meeting'); handleMenuClose(); }}>My booked meetings</MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          apiCall('/logout', 'POST', { id: id }, navigate);
          localStorage.removeItem('id');
          navigate('/login'); handleMenuClose()
        }}>Logout</MenuItem>
      </Menu>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={
          { backgroundColor: '#ffdc00', position: 'relative', borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Toolbar>
            <CardMedia
              component="img"
              sx={{ width: 200, height: '100%', margin: '10px' }}
              image={MAIN}
            />

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

              {id == null
                ? <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="primary"
                  onClick={() => { navigate('/student_login') }}
                >
                  <AssignmentIcon fontSize="middle" />
                </IconButton>
                : <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="primary"
                  onClick={() => { navigate('/student_question_thread') }}
                >
                  <AssignmentIcon fontSize="middle" />
                </IconButton>}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="primary"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              {
                props.type !== undefined ?
                  <div>
                    <button
                      style={{ width: '50px', height: '50px', marginLeft: '20px', backgroundColor: 'black', borderRadius: '30px', display: 'flex' }}
                      onClick={() => props.toggleBot((prev) => !prev)}
                    >
                      <svg viewBox="0 0 640 512" style={{ width: '45px', height: '45px', paddingBottom: '15px', fill: 'white' }}>
                        <path d="M192,408h64V360H192ZM576,192H544a95.99975,95.99975,0,0,0-96-96H344V24a24,24,0,0,0-48,0V96H192a95.99975,95.99975,0,0,0-96,96H64a47.99987,47.99987,0,0,0-48,48V368a47.99987,47.99987,0,0,0,48,48H96a95.99975,95.99975,0,0,0,96,96H448a95.99975,95.99975,0,0,0,96-96h32a47.99987,47.99987,0,0,0,48-48V240A47.99987,47.99987,0,0,0,576,192ZM96,368H64V240H96Zm400,48a48.14061,48.14061,0,0,1-48,48H192a48.14061,48.14061,0,0,1-48-48V192a47.99987,47.99987,0,0,1,48-48H448a47.99987,47.99987,0,0,1,48,48Zm80-48H544V240h32ZM240,208a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,240,208Zm160,0a48,48,0,1,0,48,48A47.99612,47.99612,0,0,0,400,208ZM384,408h64V360H384Zm-96,0h64V360H288Z"></path>
                      </svg>
                    </button>

                  </div>
                  :
                  <></>
              }

            </Box>
          </Toolbar>
        </AppBar>
        <RenderMenu />
      </Box>
    </ThemeProvider>
  )
}