import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { apiCall } from '../Main';
import { useNavigate } from 'react-router-dom';
import ExpertHeader from '../component/ExpertHeader';
import { styled } from '@mui/material/styles';
import PageReturnButton from '../component/PageReturnButton';

const theme = createTheme();

// style for button color
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText('#000000'),
  backgroundColor: '#000000',
  '&:hover': {
    backgroundColor: '#000000',
  },
}));

export default function AddExpert() {
  const navigate = useNavigate();
  
  // Before submit the infomation, check the name, email format
  // are valid, and then submit it to add a new expert.
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const interested_category_ids = categories.filter((category, i) => { return category.checked }).map((categorie) => { return categorie.id });
    const body = ({
      username: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      interested_category_ids: interested_category_ids

    });
    const nameReg = new RegExp(/^[0-9A-Za-z]+ [0-9A-Za-z]+/);
    const reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    if (data.get('name').length < 3) {
      alert('The expert name should have at least 3 characters');
    } else if (!(nameReg.test(data.get('name')))) {
      alert('The expert name format should be "Firstname Lastname"');
    } else if (!(reg.test(data.get('email')))) {
      alert('The expert email format is not valid');
    } else {
      const data2 = await apiCall('/register_expert_account', 'POST', body, navigate);
      if (typeof (data2) === 'string' && (!data2.startsWith('200') || !data2.startsWith('201'))) {
        alert('something wrong')
      } else {
        alert('You have successfully add an expert');
      }
    }
  };

  // set the categories to be checked.
  const setChecked = (value, index) => {
    categories[index].checked = value;
  }
  const [categories, setCategories] = React.useState([]);

  // Get the categories list.
  const getCategories = async () => {
    const data = await apiCall('/categories', 'GET', {}, navigate);
    data.categories.map((categorie, i) => { categorie.checked = false; return categorie });
    setCategories(data.categories);
  };
  const [i, setI] = React.useState(1);
  if (i === 1) {
    getCategories();
    setI(i + 1);
  }
  return (
    <ThemeProvider theme={theme}>
      <ExpertHeader/>
      <div style={{display:'flex', alignItems: 'flex-end', justifyContent: 'flex-end', width: '85%', paddingTop: '50px'}}>
        <button 
          variant="outlined" 
          style={{backgroundColor: '#000000', color: 'white', right: '0px'}} 
          onClick={() => { navigate('/expert_main') }}
        >
          Return
        </button>
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
      
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', backgroundColor: '#000000', color: 'white' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add Expert
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
            />

            <div>
              {
                categories.map((category, i) => {
                  return (<FormControlLabel
                    key={i}
                    control={<Checkbox value="remember" color="primary" onClick={(e) => { setChecked(e.target.checked, i); }} />}
                    label={category.category_name}
                  />)
                })
              }
            </div>

            <ColorButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </ColorButton>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}