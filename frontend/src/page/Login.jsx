import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../Main';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LoginIcon from '@mui/icons-material/Login';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CardMedia from '@mui/material/CardMedia';
import Photo from './img/OIP.jpg';


const theme = createTheme();

const Login = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const value = 0;
  const navigate = useNavigate();

  const login = async () => {
    // eslint-disable-next-line prefer-regex-literals
    const reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    if (email === '') {
      setErrorMessage('Email should not be none');
      setOpen(true);
      //} 
      //else if (password === '') {
      // setErrorMessage('Password should not be none');
      //  setOpen(true);
    } else if (!(reg.test(email))) {
      setErrorMessage('Not a vaild email');
      setOpen(true);
    } else {
      const info = {
        email: email,
        password: password,
      }
      const data = await apiCall('/login', 'POST', info, navigate);
      if (typeof (data) === 'string' && (!data.startsWith('200') || !data.startsWith('201'))) {
        setErrorMessage(data.slice(3,));
        setOpen(true);
      } else {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('name', data.user.username);
        localStorage.setItem('type', data.user.account_type);
        if (data.user.account_type === 'student') {
          navigate('/student_main');
        } else {
          navigate('/expert_main');
        }
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ width: '50%' }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, display: 'flex' }}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 15px 25px rgba(0,0,0,0.1)',
            marginBottom: '10px'
          }}
        >
          <CardMedia
            component="img"
            sx={{ height: '500px', width: '50%' }}
            image={Photo}
          />
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              marginLeft: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Collapse in={open}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  {errorMessage}
                </Alert>
              </Collapse>
            </Box>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                fullWidth
                id="submit_Login"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={login}
              >
                Log In
              </Button>
            </Box>
          </Box>
        </Paper>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            if (newValue === 1) {
              navigate('/student_register');
            }
            // else if (newValue === 2) {
            //   setDiaOpen(true);
            // }
          }}
        >
          <BottomNavigationAction label="Login" icon={<LoginIcon />} />
          <BottomNavigationAction label="Register" icon={<AssignmentIndIcon />} />

          {/* <CVDialog dialogOpen={dialogOpen} setDiaOpen={setDiaOpen}/> */}
        </BottomNavigation>
      </Container>
    </ThemeProvider>
  );
}
export default Login;