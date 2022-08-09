import * as React from 'react';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { apiCall } from '../Main';
const PostForm = () => {
  const [categoriesName, setCategoriesName] = React.useState([]);
  const [categoriesId, setCategoriesId] = React.useState([]);
  React.useEffect(() => {
    getCategories();

  }, [])
  const getCategories = async () => {
    const data = await apiCall('/categories', 'GET');
    setCategoriesName(data.categories.map((cate) => { return cate.category_name }));
    setCategoriesId(data.categories.map((cate) => { return cate.id }));
    setCategory(data.categories.map((cate) => { return cate.category_name })[0]);
    setQuestionCategory(data.categories.map((cate) => { return cate.id })[0])
  };

  const [questionName, setQuestionName] = React.useState('');
  const [questionCategory, setQuestionCategory] = React.useState(-1);
  const [category, setCategory] = React.useState('');
  const [questionDescription, setQuestionDescription] = React.useState('');
  const handleSubmit = () => {

    const info = {
      title: questionName,
      category_id: questionCategory,
      body: questionDescription,
    }

    apiCall('/thread', 'POST', info); 
  }

  return (
    <div>
      <div style={{ marginRight: '0px', padding: '10px', margin: '10px', width: '350px', color: 'black', border: '1px solid black', borderRadius: '10px' }}>
        <div style={{}}>
          <div>
            Question Name:
          </div>
          <TextField
            required
            id="recipeName"
            name="recipeName"
            fullWidth={true}
            variant="standard"
            value={questionName}
            onChange={e => { setQuestionName(e.target.value) }}
          />
        </div>
        <div style={{ display: 'flex', marginTop: '5px' }}>
          <div>
            Question Category:
          </div>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={categoriesName}
            sx={{ width: 150, marginLeft: '10px' }}
            value={category}
            renderInput={(params) => <TextField {...params } label="Type" />}
            onChange={(e) =>  {setCategory(categoriesName[e.target.getAttribute("data-option-index")]); setQuestionCategory(categoriesId[e.target.getAttribute("data-option-index")]) }}
          />
        </div>
        <div>
          <div>
            Description:
          </div>
          <TextField
            required
            id="recipeName"
            name="recipeName"
            label="Enhancement your detail question description here"
            fullWidth={true}
            variant="standard"
            value={questionDescription}
            onChange={e => { setQuestionDescription(e.target.value) }}
          />
        </div>
        <button onClick={() => { handleSubmit(); console.log(questionDescription); setQuestionCategory(''); setQuestionName(''); setQuestionDescription("") }}>Submit</button>
      </div>

    </div >

  )
}
export default PostForm;