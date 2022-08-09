/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import StudentHeader from '../component/StudentHeader';
import { apiCall } from '../Main';
import ErrorSnackbar from '../component/ErrorSnackBar';
import SuccessSnackbar from '../component/SuccessSnackBar';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/ArrowCircleLeft';
import { styled } from '@mui/material/styles';
import LanguageChoice from '../component/LanguageChoice';
import ImageButton from '../component/ImageButton';

// style for button color
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText('#000000'),
  backgroundColor: '#000000',
  '&:hover': {
    backgroundColor: '#000000',
  },
}));

export default function ExpertProfile() {
  const navigate = useNavigate();

  const [name, setName] = React.useState('AA BB');
  const [email, setEmail] = React.useState('');
  const [biography, setBiography] = React.useState('');
  const [interestedCategoryIds, setInterestCategoryIds] = React.useState([]);
  const [languageIds, setLanguageIds] = React.useState([]);
  const [profileImageSrc, setProfileImageSrc] = React.useState('');
  const [newpassword, setNewPassword] = React.useState('');
  const [confirm_password, setConfirmPassword] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [open2, setOpen2] = React.useState(false);

  React.useEffect(() => {
    getUserInfo();
  }, []);

  // Return a list contains the language ids.
  function getId(languageIds) {
    let ids = []
    languageIds.map((languageId) => {
      ids.push(languageId.id);
    })
    return ids;
  }

  // Get the expert information.
  const getUserInfo = async () => {
    const id = localStorage.getItem('id');
    const data = await apiCall(`/user_profile/${id}`, 'GET', {}, navigate);
    console.log("user:", data);
    if (typeof (data) === 'string' && (!data.startsWith('200') || !data.startsWith('201'))) {
      setErrorMessage(data.slice(3,));
      setOpen(true);
    } else {
      setName(data.user.username);
      setEmail(data.user.email);
      setBiography(data.user.biography);
      const ids = getId(data.user.languages)
      setLanguageIds(ids);
      const interIds = getId(data.user.interested_categories)
      setInterestCategoryIds(interIds);
      setProfileImageSrc(data.user.profile_image_src);
    }
  }

  // If the new password and the confirmed password is same
  // update the expert's password.
  const changePassword = async () => {
    const id = localStorage.getItem('id');
    if (newpassword === '' || confirm_password === ' ') {
      setErrorMessage('Password should not be none');
      setOpen(true);
      setNewPassword('');
      setConfirmPassword('');
    } else if (newpassword !== confirm_password) {
      setErrorMessage('The two passwords are not the same');
      setOpen(true);
      setNewPassword('');
      setConfirmPassword('');
    }

    else {
      const user = {
        new_password: confirm_password,
        user_id: id
      }
      console.log('update', user);
      const data = await apiCall('update_password', 'PUT', user, navigate);
      if (typeof (data) === 'string' && (!data.startsWith('200') || !data.startsWith('201'))) {
        setErrorMessage(data.slice(3,));
        setOpen(true);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setOpen2(true);
        setNewPassword('');
        setConfirmPassword('');
        navigate('/expert_profile');
      }
    }
  }

  // Before update the profile, check the email, name field value
  // meet the requirements, and then update the expert profile.
  const update = async () => {
    // eslint-disable-next-line prefer-regex-literals
    const reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    const nameReg = new RegExp(/^[0-9A-Za-z]+ [0-9A-Za-z]+/);
    if (email === '') {
      setErrorMessage('Email should not be none');
      setOpen(true);
    } else if (!(reg.test(email))) {
      setErrorMessage('Not a vaild email');
      setOpen(true);
      getUserInfo();
    } else if (name.length <= 3) {
      setErrorMessage('Your name should have at least 3 characters');
      setOpen(true);
      getUserInfo();
    } else if (!(nameReg.test(name))) {
      setErrorMessage('The format of your name should be: "Firstname LastName"');
      setOpen(true);
      getUserInfo();
    }
    else {
      const user = {
        biography: biography,
        interested_category_ids: interestedCategoryIds,
        profile_image_src: profileImageSrc,
        username: name,
        language_ids: languageIds
      }
      console.log('update', user);
      const data = await apiCall('user_profile', 'PUT', user, navigate);
      if (typeof (data) === 'string' && (!data.startsWith('200') || !data.startsWith('201'))) {
        setErrorMessage(data.slice(3, data.length));
        setOpen(true);
      }
      else {
        setOpen2(true);
        navigate('/expert_profile');
      }
    }
  }

  return (
    <div style={{ backgroundSize: '100% 100%' }}>
      <StudentHeader />
      <ErrorSnackbar open={open} setOpen={setOpen} message={errorMessage} />
      <SuccessSnackbar open={open2} setOpen={setOpen2} message={'You have successfully update your profile'}></SuccessSnackbar>
      <Container disableGutters maxWidth="lg" component="main" sx={{ pt: 8, pb: 6 }}>
        <div style={{ display: 'flex', width: '100%', backgroundColor: '#ffffff', borderRadius: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(30px)', boxShadow: '0 15px 25px rgba(0,0,0,0.1)', marginBottom: '10px' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: 'auto',
              flex: 2,
              paddingTop: '40px',
              paddingBottom: '40px',
              borderRight: '1.5px solid rgb(230, 230, 230)'

            }}
          >
            <Box sx={{ width: '35%', marginBottom: '15px' }}>
              <ImageButton profileImageSrc={profileImageSrc} setProfileImageSrc={setProfileImageSrc} name={name} update={update} />
            </Box>
            <Box component="form" noValidate sx={{ mt: 2, width: '60%' }}>
              <div style={{ marginRight: '5%', paddingRight: '5%' }}>

                <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-end', marginBottom: '15px' }}>
                  <Grid container spacing={0}>
                    <Grid item xs={3}>
                      <Typography component="h1" variant="h5">
                        Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        label="Enter Name Here"
                        fullWidth
                        variant="standard"
                        size="medium"
                        onChange={e => setName(e.target.value)}
                        value={name} />
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: '15px' }}>
                  <Grid container spacing={0}>
                    <Grid item xs={3}>
                      <Typography component="h1" variant="h5">
                        Email:
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography component="h6" variant="h6">
                        {email}
                      </Typography>

                    </Grid>
                  </Grid>
                </Box>
                <LanguageChoice languageIds={languageIds} setLanguageIds={setLanguageIds} />
                <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: '5%' }}>
                  <Grid container spacing={0}>
                    <Grid item xs={4}>
                      <Typography component="h1" variant="h5">
                        Biography:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <textarea
                        id="w3review" name="w3review" rows="4" cols="50"
                        style={{ width: '100%' }}
                        value={biography}
                        onChange={e => setBiography(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <ColorButton
                  fullWidth
                  id="submit_Login"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, color: 'white' }}
                  onClick={update}
                >
                  UPDATE
                </ColorButton>
              </div>
            </Box>
          </Box>

          <Box
            sx={{
              paddingLeft: '40px',
              paddingRight: '40px',
              paddingTop: '80px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              verticalAlign: 'middle',
              flex: 1,
              backgroundColor: 'rgb(240,240,240)',
              borderRadius: '0px 10px 10px 0px'
            }}
          >
            <Typography component="h1" variant="h5">
              Change Password
            </Typography>
            <div style={{ alignItems: 'center', flexDirection: 'column' }}>

              <Box component="form" noValidate sx={{ mt: 1 }}>

                <TextField
                  margin="normal"
                  fullWidth
                  id="newPassword"
                  label="new password"
                  name="new password"
                  autoComplete="new password"
                  value={newpassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="newPasswordConfirm"
                  label="re-enter new password"
                  name="re-enter new password"
                  autoComplete="new password"
                  value={confirm_password}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <ColorButton
                  fullWidth
                  id="submit_Login"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, color: 'white' }}
                  onClick={changePassword}
                >
                  CONFIRM
                </ColorButton>
              </Box>
            </div>
          </Box>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: '40px' }}>
          <Button size="large" sx={{ backgroundColor: '#000000', color: 'white' }} onClick={(event) => { navigate('/expert_main') }} endIcon={<KeyboardReturnOutlinedIcon size="large" />} >Return</Button>
        </div>
      </Container>
    </div>
  );
}