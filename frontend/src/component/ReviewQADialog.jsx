import React from 'react';
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../page/QAadd.css'
import TextField from '@mui/material/TextField';
import { stateFromHTML } from 'draft-js-import-html';
import draftToHtml from 'draftjs-to-html';
import { apiCall } from '../Main';
import Typography from '@mui/material/Typography';
import DOMPurify from 'dompurify';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from '@mui/material/Button';

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

function tagChecked(list, id) {
  for (const tag in list) {
    if (tag.id === id) {
      return true;
    } else {
      return false;
    }
  }
}

// The dialog contain the detailed infomration of the cliked QA
// and the expert can edit the detail.
const ReviewQADialog = (props) => {
  const initalContent = props.clickedItem;

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    }
  }

  function cleanBodyString(str) {
    let str_no_figure = str.replace(/(<figure>|<\/figure>)/g, '');
    const match_pattern = /<img src=.*\/>/;
    let match = match_pattern.exec(str_no_figure);
    if (match !== null) {
      const target = "<figure>" + match[0] + "</figure>"
      return str_no_figure.replace(match[0], target)
    }
    return str

  }

  const blocksFromHTML = convertFromHTML(cleanBodyString(initalContent.body));
  const [editorState, setEditorState] = React.useState(EditorState.createWithContent(ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap,
  ))) // ContentState JSON
  const [categories, setCategories] = React.useState([]);

  const getCategories = async () => {
    const data = await apiCall('/categories', 'GET');
    setCategories(data.categories);
    const data2 = await apiCall('/tags', 'GET');
    data2.tags.map((tag, i) => { tagChecked(initalContent.tags, tag.id) === true ? tag.checked = true : tag.checked = false; return tag });
    setSubCategories(data2.tags);
  };
  const [subCategories, setSubCategories] = React.useState([]);

  React.useEffect(() => {
    getCategories();
  }, []);

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  }
  const [value, setValue] = React.useState(initalContent.category.category_name);
  const [question, setquestion] = React.useState(initalContent.title);
  const [video, setVideo] = React.useState(initalContent.video_url);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const [convertedContent, setConvertedContent] = React.useState(null);
  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToRaw(editorState.getCurrentContent());
    const markup = draftToHtml(
      currentContentAsHTML,
    );
    setConvertedContent(markup);
  }


  // the selection af the group.
  const RadioButtonsGroup = () => {
    return (
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Category</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
        >
          {categories.map((cate, i) => {
            return <FormControlLabel value={cate.category_name} control={<Radio />} label={cate.category_name} />
          })}
        </RadioGroup>
      </FormControl>
    );
  }
  const [i, setI] = React.useState(0);
  const setChecked = (value, index) => {
    subCategories[index].checked = value;
    setI(i + 1)
  }
  const handleSubmit = () => {
    const submitData = {
      body: convertedContent,
      title: question,
      category_id: categories.filter((category) => { return category.category_name === value })[0].id,
      tag_ids: subCategories.filter((category) => { return category.checked }).map((category) => { return category.id })

    }
    apiCall(`/qa/${initalContent.rid}`, 'PUT', submitData);

  }
  const handleSubmitTag = async () => {
    const info = {
      tag_name: tagName
    }
    await apiCall('/tag', 'POST', info);
    console.log(info);
    const data2 = await apiCall('/tags', 'GET');
    data2.tags.map((tag, i) => { tag.checked = false; return tag });
    setSubCategories(data2.tags);
    handleClose();
  }

  const CheckBoxButtonsGroup = () => {
    return (
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Sub-Category</FormLabel>

        {subCategories.map((cate, i) => {
          if (cate.checked) {
            return <FormControlLabel checked control={<Checkbox />} label={cate.tag_name} onClick={(e) => { setChecked(e.target.checked, i); }} />
          } else {
            return <FormControlLabel value={cate.checked} control={<Checkbox />} label={cate.tag_name} onClick={(e) => { setChecked(e.target.checked, i); }} />
          }

        })}
      </FormControl>
    );
  }
  const handleClose = () => {
    setOpen(false);
  };
  const [open, setOpen] = React.useState(false);
  const [tagName, setTageName] = React.useState('');

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
      >
        <DialogContent sx={{ marginLeft: '5%', marginRight: '5%', marginTop: '10px' }}>
          <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', marginBottom: '50px' }}>
            Create A New Tag:
          </Typography>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Tag Name:
                </Typography>
                <TextField
                  required
                  id="tagName"
                  name="tagName"
                  label="Add a new tag"
                  fullWidth={true}
                  variant="standard"
                  onChange={e => { setTageName(e.target.value) }}
                />
              </Grid>

            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCLE</Button>
          <Button onClick={handleSubmitTag}>SUMBIT</Button>
        </DialogActions>
      </Dialog>
      <div style={{ display: 'flex', marginLeft: '80px', marginTop: '40px' }}>
        <Typography variant="h3" sx={{ padding: 0, margin: 0 }}>Review the content</Typography>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: '80px' }}><button style={{}} onClick={handleSubmit}>Submit</button></div>
      <div style={{ display: 'flex', marginLeft: '30px', marginRight: '30px', marginTop: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid gray', height: '750px', borderRadius: '30px', width: '100%', padding: '30px' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ flex: 1 }}><RadioButtonsGroup /></div>
            <div style={{ flex: 1 }}><CheckBoxButtonsGroup /><button onClick={() => { setOpen(true); }}>Add subcategory</button></div>
            <div style={{ flex: 3, width: '100%' }}>
              <div style={{ marginRight: '15px', color: 'gray' }}>{"Q&A detail:"}</div>
              <div style={{ display: 'flex' }}>
                <div style={{ marginTop: '20px', marginRight: '15px', width: '100px' }}>Question:</div>
                <div style={{ width: '100%' }}>
                  <TextField
                    required
                    id="question"
                    name="question"
                    label="Question"
                    fullWidth
                    variant="standard"
                    value={question}
                    onChange={(e) => setquestion(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', marginTop: '15px' }}>
                <div style={{ marginTop: '0px', marginRight: '15px', width: '100px' }}>Youtube Video URL:</div>
                <div style={{ width: '100%' }}>
                  <TextField
                    required
                    id="question"
                    name="question"
                    label="Video"
                    fullWidth
                    variant="standard"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginTop: '15px', marginBottom: '5px' }}>Answer:</div>
              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                toolbar={{
                  inline: { inDropdown: true },
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  history: { inDropdown: true },
                  image: { alt: { present: true, mandatory: true } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider >
  )
}
export default ReviewQADialog;