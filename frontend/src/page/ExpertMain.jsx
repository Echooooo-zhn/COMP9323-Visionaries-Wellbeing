/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import ExpertHeader from "../component/ExpertHeader";
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit';
import QAICON from './img/q&a.png'
import POSTICON from './img/post.png'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BallotIcon from '@mui/icons-material/Ballot';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { apiCall } from '../Main';

const theme = createTheme({
  status: {
    danger: '#000000',
  },
  palette: {
    primary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#ffffff',
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

const ExpertMain = () => {

  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [qaList, setQaList] = React.useState([])
  const [replyText, setReplyText] = React.useState('');
  const [currentTid, setCurrentTid] = React.useState(0);
  const handleReply = async (tid) => {
    await apiCall('reply', 'POST', { thread_id: tid, body: replyText }, navigate);
    getQuestions();

  }

  // Get the unanswered and unresolved thread.
  const getQuestions = async () => {
    const data = await apiCall(`/unanswered_unresolved_threads`, 'GET', {}, navigate);
    setQaList(data.threads);
  }
  const [i, setI] = React.useState(1);
  if (i === 1) {
    getQuestions();

    setI(i + 1);
  }

  // Reuturn a component contains a single QA content.
  const SingleQA = (props) => {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: '0px', marginBottom: '3px', marginRight: '10px' }}> <Typography sx={{ fontSize: '6px' }}>{props.data.created_at.split('T')[0]} </Typography></div>
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ flex: 3 }}> <Typography >{props.data.user.username}: </Typography></div>
          <div style={{ flex: 5 }}>
            <Typography sx={{ marginLeft: '10px' }}>{props.data.body} </Typography>
          </div>
          <div style={{ flex: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <IconButton
              size="middle"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={() => { setCurrentTid(props.data.id); handleClickOpen() }}
            >
              <EditIcon fontSize="middle" />
            </IconButton>
          </div>
        </div>
      </div>
    )
  }

  // Return all QAs.
  const PotantialQA = () => {
    return (
      <div>
        {qaList.map((data, i) => {
          return (
            <div key={i} style={{ marginTop: '5px', width: '98%', marginBottom: '5px' }}>
              <Accordion fullWidth expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)}>
                <AccordionSummary

                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${i}bh-content`}
                  id={`panel${i}bh-header`}
                >
                  <Typography sx={{ flexShrink: 0 }}>
                    {data.title}
                  </Typography>
                  <div style={{ width: '100%', marginRight: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>

                    <Chip
                      label={data.category.category_name}
                      size="small"
                    />
                  </div>

                </AccordionSummary>
                <AccordionDetails>

                  <SingleQA data={data} />
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <ExpertHeader />
      <div style={{ display: 'flex', marginLeft: '200px', marginTop: '40px' }}>

      </div>
      <Container disableGutters maxWidth="lg" component="main" sx={{ pt: 8, pb: 6, paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0, marginBottom: '30px' }}>
        <div style={{ display: 'flex', width: '100%', backgroundColor: '#ffffff', borderRadius: '10px', marginBottom: '10px' }}>
          <Box
            sx={{
              alignItems: 'center',
              margin: 'auto',
              flex: 3,
              width: '100%',
              paddingTop: '0px',
              paddingBottom: '40px',
              borderRight: '2.0px solid rgb(230, 230, 230)',
              paddingLeft: '40px',
              paddingRight: '40px',
              height: '560px'
            }}
          >
            <Typography variant='h3' sx={{ color: '#454545', fontWeight: 'bold', marginBottom: '10px' }}>Students' Question</Typography>
            <div style={{ paddingRight: '10px', background: '#a9a9a9', borderRadius: '15px', padding: '30px' }}>
              <div style={{ overflow: 'hidden', height: '270px', overflowY: 'scroll' }}>
                <PotantialQA />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center', marginTop: '20px' }}>
              <div style={{ borderRadius: '10px', flex: 2, height: '155px', background: '#c01901', padding: '5px', margin: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center' }}>
                <div>
                  <img style={{ width: '65px', height: '65px' }} src={QAICON} alt={'image'} />
                </div>
                <Button sx={{ marginTop: '5px', borderColor: 'white', height: '80px', color: 'black', background: 'white' }} fullWidth variant="outlined" onClick={() => { navigate('/question_thread'); }}>Follow my Answered Questions</Button>
              </div>
              <div style={{ borderRadius: '10px', border: '1px solid black', height: '155px', flex: 3, background: '#454545', padding: '5px', margin: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center' }}>
                <div>
                  <img style={{ width: '65px', height: '65px' }} src={POSTICON} alt={'image'} />
                </div>
                <Button sx={{ marginTop: '5px', flex: 1, color: '#b25977', background: 'white' }} fullWidth variant="outlined" onClick={() => { navigate('/qaAdd'); }}>{"Add a New Q&A task"} </Button>
                <Button color='primary' sx={{ marginTop: '5px', flex: 1, color: '#b25977', background: 'white' }} fullWidth variant="outlined" onClick={() => { navigate('/review_post'); }}>Manage My Posts</Button>


              </div>
            </div>

          </Box>
          <Box
            sx={{
              paddingTop: '150px',
              paddingLeft: '60px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              verticalAlign: 'middle',
              flex: 1,
              width: '100%',
              borderRadius: '0px 10px 10px 0px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyItems: 'center' }}>
              <div><CalendarMonthIcon sx={{ margin: 'auto', fontSize: 60, color: '#454545' }} /> </div>
              <Button sx={{ marginTop: '5px', borderColor: 'gray', height: '55px', color: '#c01901' }} fullWidth variant="outlined" onClick={() => { navigate('/expert_ava'); }}>AVAILABILITY</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyItems: 'center', marginTop: '85px' }}>
              <div><BallotIcon sx={{ margin: 'auto', fontSize: 60, color: '#c01901' }} /> </div>
              <Button sx={{ marginTop: '5px', borderColor: 'gray', height: '55px', color: '#454545' }} fullWidth variant="outlined" onClick={() => { navigate('/expert_booked_meeting'); }}>VIEW SCHEDULE</Button>
            </div>
          </Box>
        </div>
        <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={open}
          onClose={handleClose}
        >
          <DialogContent sx={{ marginLeft: '5%', marginRight: '5%', marginTop: '10px' }}>
            <div>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Return your answer:
                  </Typography>
                  <TextField
                    required
                    id="recipeName"
                    name="recipeName"
                    label="Answer"
                    fullWidth={true}
                    value={replyText}
                    variant="standard"
                    onChange={e => { setReplyText(e.target.value) }}
                  />
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <button onClick={handleClose} >CANCLE</button>
            <button onClick={async () => { await handleReply(currentTid); handleClose() }}>SUMBIT</button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );

}
export default ExpertMain;