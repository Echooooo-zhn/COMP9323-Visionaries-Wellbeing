import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from '@mui/material/Typography';

// TEH checkbocx group for user ot select more than one language type.
const LanguageChoice = (props) => {

  const languageList = props.languageIds;

  const handleClick = (e) => {
    const id = parseInt(e);
    if (props.languageIds.indexOf(id) === -1) {
      props.languageIds.push(id);
      props.setLanguageIds(props.languageIds);
      console.log(props.languageIds);
    }
    else {
      props.languageIds.map((val, i) => {
        if (val === id) {
          props.languageIds.splice(i, 1);
          props.setLanguageIds(props.languageIds);
          console.log(props.languageIds);
        }
      })
    }
  }

  const AutoCheckBox = (props) => {
    const id_str = props.id.toString();
    if (languageList.indexOf(props.id) === -1) {
      return (
        <Checkbox 
          id={id_str}
          style={{color: '#000000'}}
          onChange={(e)=> {handleClick(e.target.getAttribute("id"))}}
        />
      )
    } else {
      return (
        <Checkbox 
          id={id_str}
          defaultChecked
          style={{color: '#000000'}}
          onChange={(e)=> {handleClick(e.target.getAttribute("id"))}}
        />
      )
    }
  }

  
  return (
    <Box sx={{ width: "100%" }}>
      <Typography component="h2" variant="h6">
        Prefered Languages: 
      </Typography>
      <FormControlLabel
        control={
          <Checkbox defaultChecked disabled/>
        }
        label="English"
      />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <AutoCheckBox id={1}/>
            }
            label="Mandarin"
          />
          <FormControlLabel
            control={
              <AutoCheckBox id={2}/>
            }
            label="Cantonese"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <AutoCheckBox id={3}/>
            }
            label="Korean"
          />
          <FormControlLabel
            control={
              <AutoCheckBox id={4}/>
            }
            label="Japanese"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
              control={
                <AutoCheckBox id={5}/>
              }
              label="Italian"
          />
          <FormControlLabel
              control={
                <AutoCheckBox id={6}/>
              }
              label="French"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <AutoCheckBox id={7} />
            }
            label="Vietnamese"
          />
          <FormControlLabel
            control={
              <AutoCheckBox id={8}/>
            }
            label="Thai"
          />
        </Grid>
      </Grid>
    </Box>
  )
}
export default LanguageChoice;