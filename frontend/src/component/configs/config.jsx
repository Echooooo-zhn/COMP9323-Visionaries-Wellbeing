// the config for chatbot
import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

import BotAvatar from "../BotAvatar/BotAvatar";
import Options from "../Options/Options";
import OptionsMeeting from "../Options/OptionsMeeting";
import OptionsMeetingTure from "../Options/OptionsMeetingTure";
import OptionsQuestion from "../Options/OptionsQuestion";
import UserAvatar from "../UserAvatar/UserAvatar";
import MyLinks from "../Link/MyLinks.jsx"
import OptionsQuestionVideo from "../Options/OptionsQuestionVideo";
import OptionsQuestionGuide from "../Options/OptionsQuestionGuide";
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import PostForm from "../PostForm"
import Grid from '@mui/material/Grid';
import Dialog from "@mui/material/Dialog";
import Typography from '@mui/material/Typography';
import DialogContent from "@mui/material/DialogContent";
import DOMPurify from 'dompurify';
import { apiCall } from "../../Main";
import { padding } from "@mui/system";

// a herfwidget for video links and titles
const HerfWidget = ({ src }) => {
  console.log('memem');
  console.log('herfwidge');
  console.log(src)
  return (
    <div style={{ marginLeft: '10px', marginRight: '10px', padding: '10px', padding: '10px', border: '1px black solid', borderRadius: '10px' }}>
      {src.link.map((s) => {
        return (<div style={{ display: 'flex', fontSize: '4pt', marginBottom: '10px' }}>
          <div style={{ color: 'black', flex: 1 }}>{s.text}</div>
          <div style={{ flex: 1 }}><a href={s.herf}>{s.herf}</a></div>
        </div>
        )
      })}
    </div>
  )
}

// a herf for guides
const HerfGuideWidget = ({ src }) => {
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }
  const [open, setOpen] = React.useState(false);
  const [qa, setQa] = React.useState({});
  const handleOpen = async (id) => {
    const data = await apiCall(`qa/${id}`, 'GET');
    setQa(data.qa);
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }
  return (
    <div style={{ color: 'black', fontSize: '4pt' }}>
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
      >
        <DialogContent sx={{ marginLeft: '5%', marginRight: '5%', marginTop: '10px' }}>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <Typography variant="h6" gutterBottom>
                  Question:
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography gutterBottom>
                  {qa.title}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h6" gutterBottom>
                  Answer:
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography gutterBottom>
                  <div className="preview" dangerouslySetInnerHTML={createMarkup(qa.body)}></div>
                </Typography>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
      {
        src.QAs.length !== 0 ?
          <div>
            <div style={{ marginLeft: '10px', marginRight: '10px' }}>
              There are some answers from our site
            </div>
            <div style={{ marginLeft: '10px', marginRight: '10px', padding: '10px', padding: '10px', border: '1px black solid', borderRadius: '10px' }}>
              {src.QAs.map((s) => {
                return (<div style={{ display: 'flex', fontSize: '4pt', marginBottom: '10px' }}>
                  <div style={{ flex: 5 }}>{s.question}</div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}><IconButton aria-label="delete" sx={{ color: 'black' }} onClick={() => { handleOpen(s.id) }}><VisibilityIcon /></IconButton></div>
                </div>
                )
              })}
            </div>
          </div>
          :
          <></>
      }
      <div style={{ marginLeft: '10px', marginRight: '10px' }}>
        There are some answers we find form authority sites
      </div>
      <div style={{ marginLeft: '10px', marginRight: '10px', padding: '10px', padding: '10px', border: '1px black solid', borderRadius: '10px' }}>
        {src.link.map((s) => {
          return (<div style={{ display: 'flex', fontSize: '4pt', marginBottom: '10px' }}>
            <div style={{ color: 'black', flex: 1 }}>{s.text}</div>
            <div style={{ flex: 1 }}><a href={s.herf}>{s.herf}</a></div>
          </div>
          )
        })}
      </div>

    </div>

  )
}

const config = {
  botName: "Wellbing Bot",
  initialMessages: [
    createChatBotMessage(`Hi. I'm here to help you, please ask any you want to know`)
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#5F6769"
    },
    chatButton: {
      backgroundColor: "white"
    }
  },

  customComponents: {
    header: () => (
      <div
        style={{
          backgroundColor: "black",
          padding: "10px",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
          display: "flex",
          fontSize: "0.85rem",
          paddingLeft: "12.5px",
          fontWeight: "700",

          alignItems: "center",
          fontSize: '20px',
          color: "white"
        }}
      >
        Wellbing BOT
      </div>
    ),
    botAvatar: (props) => <BotAvatar {...props} />,
    userAvatar: (props) => <UserAvatar {...props} />,
  },

  state: {
    src: {},
  },

  widgets: [

    {
      widgetName: "optionsquestion",
      widgetFunc: (props) => <OptionsQuestion {...props} />,

    },
    {
      widgetName: "optionsquestionvideo",
      widgetFunc: (props) => <OptionsQuestionVideo {...props} />,
    },
    {
      widgetName: "optionsquestionguide",
      widgetFunc: (props) => <OptionsQuestionGuide {...props} />,
    },
    {
      widgetName: "optionsmeeting",
      widgetFunc: (props) => <OptionsMeeting {...props} />,

    },
    {
      widgetName: "optionsmeetingfield",
      widgetFunc: (props) => <OptionsMeetingTure  {...props} />,
    },
    {
      widgetName: "meetingmentalhealth",
      widgetFunc: (props) => <MyLinks {...props} />,
      props: {
        url: './find_expert/2'
      }
    },

    {
      widgetName: "meetingcovid19",
      widgetFunc: (props) => <MyLinks {...props} />,
      props: {
        url: './find_expert/4'
      }
    },

    {
      widgetName: "meetingmvaccation",
      widgetFunc: (props) => <MyLinks {...props} />,
      props: {
        url: './find_expert/3'
      }
    },
    {
      widgetName: "meetingstayathome",
      widgetFunc: (props) => <MyLinks {...props} />,
      props: {
        url: './find_expert/1'
      }
    },
    {
      widgetName: "meetingcareeradvice",
      widgetFunc: (props) => <MyLinks {...props} />,
      props: {
        url: './find_expert/5'
      }
    },
    {
      widgetName: "postform",
      widgetFunc: (props) => <PostForm {...props} />,
    },
    {
      widgetName: "herfWidget",
      widgetFunc: (props) => <HerfWidget {...props} />,
      mapStateToProps: ["src"]
    },
    {
      widgetName: "herfGuideWidget",
      widgetFunc: (props) => <HerfGuideWidget {...props} />,
      mapStateToProps: ["src"]
    }

  ]
};

export default config;