import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
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
import Photo from './img/OIP.jpg'
import Paper from '@mui/material/Paper';
import CVDialog from '../component/CVDialog';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const theme = createTheme();

const StudentRegister = () => {
	const navigate = useNavigate();
	const [email, setEmail] = React.useState('');
	const [errorMessage, setErrorMessage] = React.useState('');
	const [open, setOpen] = React.useState(false);
	const [password, setPassword] = React.useState('');
	const [name, setName] = React.useState('');
	const value = 1;

	const register = async () => {
		// When register an new account chekc the name, email, password
		// filed has the vlaid format.
    // eslint-disable-next-line prefer-regex-literals
		const reg = new RegExp(/^z+([0-9._-])+@+(ad|student)+(.unsw.edu.au)/);
		const nameReg = new RegExp(/^[0-9A-Za-z]+ [0-9A-Za-z]+/);
		if (email === '') {
			setErrorMessage('Email should not be none');
			setOpen(true);
		} else if (password === '') {
			setErrorMessage('Password should not be none');
			setOpen(true);
		} else if (name.length < 3) {
			setErrorMessage('Your name should have at least 3 characters');
			setOpen(true);
		} else if (!(nameReg.test(name))) {
			setErrorMessage('The format of your name should be: "Firstname LastName"');
			setOpen(true);
		} else if (!(reg.test(email))) {
			setErrorMessage('Not a vaild email');
			setOpen(true);
		} else {
			const student = {
				email: email,
				password: password,
				username: name,
			}
			const data = await apiCall('/register', 'POST', student, navigate);
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
				}
			}
		}
	}

	const [dialogOpen, setDiaOpen] = React.useState(false);

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" sx={{ width: '50%' }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, display: 'flex' }} style={{ backgroundColor: '#ffffff', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(30px)', boxShadow: '0 15px 25px rgba(0,0,0,0.1)', marginBottom: '10px' }}>
					<CardMedia
						component="img"
						sx={{ height: '500px', width: '50%' }}
						image={Photo}
					/>
					<CssBaseline />
					<Box
						sx={{
							marginTop: 8,
							display: 'flex',
							marginLeft: 3,
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
						<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						</Avatar>
						<Typography component="h1" variant="h5">
							Register
						</Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: '10px' ,width: '100%'}}>
              
              <IconButton aria-label="upload picture" component="label" style={{right: '0px'}} onClick={()=>{setDiaOpen(true);}}>
                <PhotoCamera />
              </IconButton>
            </div>
						<Box component="form" noValidate sx={{ mt: 3 }}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										autoComplete="name"
										name="Name"
										required
										fullWidth
										id="Name"
										label="Name"
										value={name}
										autoFocus
										onChange={e => setName(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										id="email"
										label="Email Address"
										name="email"
										autoComplete="email"
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										name="password"
										label="Password"
										type="password"
										id="password"
										autoComplete="new-password"
										onChange={e => setPassword(e.target.value)}
									/>
								</Grid>
							</Grid>
							<Button
								fullWidth
								id="submit_Register"
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								onClick={register}>
								Sign Up
							</Button>
						</Box>
					</Box>
				</Paper>
				<BottomNavigation
					showLabels
					value={value}
					onChange={(event, newValue) => {
						if (newValue === 0) {
							navigate('/login');
						}
					}}
				>
					<BottomNavigationAction label="Login" icon={<LoginIcon />} />
					<BottomNavigationAction label="Register" icon={<AssignmentIndIcon />} />
					<CVDialog dialogOpen={dialogOpen} setDiaOpen={setDiaOpen} setName={setName} setEmail={setEmail} setOpen={setOpen} />
				</BottomNavigation>
			</Container>
		</ThemeProvider>
	);
}
export default StudentRegister;