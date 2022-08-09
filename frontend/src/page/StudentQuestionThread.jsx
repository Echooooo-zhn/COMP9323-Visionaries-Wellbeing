import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StudentHeader from "../component/StudentHeader";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import AvatarImage from '../component/AvatarImage'
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import UploadImageChoice from '../component/UploadImageChoice';
import { IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { apiCall } from '../Main';
import DOMPurify from 'dompurify';

import PageReturnButton from '../component/PageReturnButton';

import { useNavigate } from 'react-router-dom';
const theme = createTheme({
  components: {
    MuiButton: {
      Paper: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          backGround: 'rgba(255, 255, 255, 0.1)',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 15px 25px rgba(0,0,0,0.1)',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#D82148'
    }
  },
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -23,
    top: 8,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

// Get the first character in firstname and lastname.
function stringAvatar(name) {
  return {
    sx: { fontSize: '15px', height: '40px' },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function StudentQuestionThread() {
  const navigate = useNavigate();
  const messagesEndRef = React.useRef(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({});
    }
  }

  const me = localStorage.getItem('name');

  // Get the current content
  const getThreads = async () => {
    const data = await apiCall(`/threads`, 'GET', {}, navigate);
    setQaList(data.threads);
    scrollToBottom();
  }
  const [i, setI] = React.useState(1);
  if (i === 1) {
    getThreads();
    setI(isNaN + 1);
    scrollToBottom();
  }
  const [value, setValue] = React.useState(0);
  const [qaList, setQaList] = React.useState([
    { name: 'Rhea Chang', time: '04/09/2022', question: 'Why do I need two vaccines?', category: 'vacation', discription: 'According to the current recommendation, why do I need two caccines? Does two vaccines can protect me from attacking by COVID-19.', new: 1, reply: [{ name: 'Jimmy Oliver', time: '2022/7/5 22:30', body: 'Hi I think you should go and get another booster' }, { name: 'Rhea Chang', time: '2022/7/5 22:31', body: 'Thanks a lot, but can I take it in UNSW?' }, { name: 'Rhea Chang', time: '2022/7/5 22:32', body: 'Do I need to book 1?' }, { name: 'Jimmy Oliver', time: '2022/7/5 22:32', body: 'Yes, you should do on hotdoc' }, { name: 'Rhea Chang', time: '2022/7/5 22:30', body: 'Thanks' }, { name: 'Rhea Chang', time: '2022/7/5 22:32', body: 'byebye' }, { name: 'Jimmy Oliver', time: '2022/7/5 22:32', body: 'byebye' }] },
    { name: 'Echo', time: '10/09/2022', question: 'Worried about sharing your concerns?', category: 'mentor', discription: 'All information we gather is completely confidential. Your personal information will not be shared with anyo ', new: 0, reply: [{ name: 'Jimmy Oliver', time: '2022/7/5 22:30', body: 'Hi I think you should go ' }, { name: 'Rhea Chang', time: '2022/7/5 22:31', body: 'Hi I think you should go too' }, { name: 'Rhea Chang', time: '2022/7/5 22:32', body: 'byebye' }, { name: 'Jimmy Oliver', time: '2022/7/5 22:32', body: 'byebye' }] },
    { name: 'Skylar', time: '04/06/2022', question: 'What can I expect if offered an appointment?', category: 'vacation', discription: 'Appointments are scheduled to last around 30 minutes. We will ask you some questions to help work', new: 0, reply: [{ name: 'Jimmy Oliver', time: '2022/7/5 22:30', body: 'Hi I think you should go ' }, { name: 'Rhea Chang', time: '2022/7/5 22:31', body: 'Hi I think you should go too' }, { name: 'Rhea Chang', time: '2022/7/5 22:32', body: 'byebye' }, { name: 'Jimmy Oliver', time: '2022/7/5 22:32', body: 'byebye' }] },

  ])

  // And the mark up tp the content
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }

  // when the thread question has changed, update the value
  // and keep the screen in on the bottom of the thread.
  const handleChange = async (event, newValue) => {
    await setValue(newValue);
    scrollToBottom();
  };

  const timeString = (time) => {
    return time.split('T').join(' ');
  }

  const HandleReply = (props) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', height: '350px', width: '850px', overflow: 'hidden', overflowY: 'scroll' }}>
        {
          props.q.replies != undefined ?
            props.q.replies.map((r, i) => {

              if (r.user.username !== me) {
                return (
                  <div>
                    <div style={{ display: 'flex', marginBottom: '3px', }}>
                      <div style={{ display: 'flex', flex: 1, alignContent: 'flex-end', justifyContent: 'flex-end', marginRight: '10px' }}><AvatarImage profileImageSrc={r.user.profile_image_src} name={r.user.username} /></div>
                      <div style={{ display: 'flex', flex: 8 }}>
                        <div style={{ borderRadius: '15px', background: '#F4F9F9', paddingLeft: '15px', paddingRight: '15px', paddingTop: '8px', paddingBottom: '8px' }}>
                          <div className="preview" dangerouslySetInnerHTML={createMarkup(r.body)}></div>
                        </div>
                      </div>
                      <div style={{ flex: 4, fontSize: '5px', color: 'gray', margin: '5px', marginTop: '0px' }}></div>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                      <div style={{ flex: 1 }}></div>
                      <div style={{ marginLeft: '10px', display: 'flex', flex: 8, fontSize: '5px', color: 'gray', marginTop: '0px', alignContent: 'flex-end', justifyContent: 'flex-start' }}>{timeString(r.created_at)}</div>
                      <div style={{ flex: 4 }}></div>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div>
                    <div style={{ display: 'flex', marginBottom: '3px' }}>
                      <div style={{ display: 'flex', flex: 4 }}></div>
                      <div style={{ display: 'flex', flex: 8, alignContent: 'flex-end', justifyContent: 'flex-end' }}>
                        <div style={{ borderRadius: '15px', background: '#EFEFEF', paddingLeft: '15px', paddingRight: '15px', paddingTop: '8px', paddingBottom: '8px' }}>
                          <div className="preview" dangerouslySetInnerHTML={createMarkup(r.body)}></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flex: 1, alignContent: 'flex-end', justifyContent: 'flex-start', marginLeft: '10px' }}><AvatarImage profileImageSrc={r.user.profile_image_src} name={r.user.username} /></div>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                      <div style={{ flex: 4 }}></div>
                      <div style={{ display: 'flex', flex: 8, fontSize: '5px', color: 'gray', marginRight: '10px', marginTop: '0px', alignContent: 'flex-end', justifyContent: 'flex-end' }}>{timeString(r.created_at)}</div>
                      <div style={{ flex: 1 }}></div>
                    </div>
                  </div>

                )
              }
            })
            :
            <></>
        }
        <div ref={messagesEndRef}></div>
      </div>
    )

  }

  const handleResolve = async (tid) => {
    await apiCall(`/set_thread_resolved/${tid}`, 'PUT', { thread_id: tid }, navigate);
    await getThreads();
    setValue(0);
  }

  // When the thread is answered.
  const HandleThread = (props) => {
    const [replyText, setReplyText] = React.useState('');
    const handleReply = async (tid) => {
      await apiCall('reply', 'POST', { thread_id: tid, body: replyText }, navigate);
      getThreads();
    }
    return (
      <div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
          <div style={{ flex: 5 }}>
            <div style={{ display: 'flex' }}><div style={{ fontWeight: 'bold', flex: 1 }}>Category: </div> <div style={{ flex: 6 }}>{props.q.category.category_name}</div></div>
            <div style={{ display: 'flex' }}> <div style={{ fontWeight: 'bold', flex: 1 }}>Discription: </div><div style={{ flex: 6 }}>{props.q.body}</div></div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignContent: 'flex-end', justifyContent: 'flex-end' }}>
            <button onClick={() => { handleResolve(props.q.id) }}>RESOLVED</button>
          </div>
        </div>

        <div>
          <HandleReply q={props.q} />
        </div>
        <div style={{ display: 'flex', marginTop: '10px', background: '#F7F7F7', padding: '15px', borderRadius: '15px' }}>
          <div style={{ width: '700px', marginRight: '4px' }}>
            <TextField fullWidth size="small" id="fullWidth" value={replyText} onChange={(e) => { setReplyText(e.target.value) }} />
          </div>
          <div style={{ width: '40px' }}>
            <IconButton onClick={() => { handleReply(props.q.id) }}>
              <ArrowUpwardIcon></ArrowUpwardIcon>
            </IconButton>
          </div>
          <div style={{ width: '40px' }}>
            <UploadImageChoice tid={props.q.id} getThreads={getThreads} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>

      <StudentHeader />
      <div style={{ display: 'flex', marginLeft: '80px', marginTop: '40px' }}>
        <Typography variant="h3" sx={{ padding: 0, margin: 0 }}>Questions</Typography>
      </div>
      <PageReturnButton address={'/student_main'}/>
      <div style={{ marginLeft: '80px', marginRight: '80px' }}>
        <Box
          sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 524 }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{
              borderRight: 1, borderColor: 'divider', minwidth: '450px', maxwidth: '450px', float: 'left',
            }}
          >
            {qaList.map((q, i) => {
              if (q.new !== undefined) {
                return (
                  <Tab classes={{ wrapper: { textAlign: "right" } }} label={<StyledBadge color="secondary"><div style={{ textAlign: 'left', width: '100%' }}>{q.title}</div></StyledBadge>}{...a11yProps(i)} sx={{ minWidth: '450px', width: '450px', right: '0', alignItems: "flex-start", paddingRight: 5 }} />
                )
              } else {
                return (
                  <Tab classes={{ wrapper: { textAlign: "right" } }} label={<div style={{ textAlign: 'left' }}>{q.title}</div>}{...a11yProps(i)} sx={{ minWidth: '300px', width: '300px', right: '0', alignItems: "flex-start" }} />
                )
              }
            })}
          </Tabs>
          {qaList.map((q, i) => {
            return (
              <TabPanel value={value} index={i} sx={{ borderRight: 1, borderColor: 'divider', minwidth: '450px', maxwidth: '450px', float: 'left', }}>
                {< HandleThread q={q} />}
              </TabPanel>
            )
          })}
        </Box>
      </div>
    </ThemeProvider>
  );
}