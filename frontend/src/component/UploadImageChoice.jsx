import * as React from 'react';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import UPLOAD from '@mui/icons-material/UploadFile';
import { apiCall } from '../Main';
const Input = styled('input')({
  display: 'none',
});

// Return a imge upload from wither the local device or the imaeg url.
const UploadImageChoice = (props) => {
  const [imgSrc, setImgSrc] = React.useState("");
  const handleImage = async (target) => {
    if (target.value) {
      const file = target.files[0];
      const size = file.size;
      if (size >= 1 * 1024 * 1024) {
        alert('image over limit');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Not an image');
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function (e) {
          const dataimg = e.target.result;
          const text = `<img height='80px' src="${dataimg}" alt={'replyimg'}></img>`
          await apiCall('reply', 'POST', { thread_id: props.tid, body: text });
          props.getThreads();
        }

      }
    }
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [dialogOpen, setDiaOpen] = React.useState(false);

  const handleDialogClose = () => {
    setDiaOpen(false);
  };

  const handleClickOpen = () => {
    setDiaOpen(true);
  };

  return (
    <div>
      <IconButton color="primary" component="span" onClick={handleClick}>
        <PhotoCamera style={{ color: '#809A6F' }} />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem>
          <div onClick={handleClickOpen}>
            Paste Image URL
          </div>
          <Dialog
            fullWidth={true}
            maxWidth={"lg"}
            open={dialogOpen}
            onClose={handleDialogClose}
          >
            <DialogContent sx={{ marginLeft: '5%', marginRight: '5%', marginTop: '10px' }}>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '50px' }}>
                Enhancement your recipe image URL here:
              </Typography>
              <div>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="imageURL"
                      name="imageURL"
                      label="Enhancement your recipe image URL here"
                      fullWidth={true}
                      variant="standard"
                      onChange={e => { setImgSrc(e.target.value); }}
                    />
                  </Grid>
                </Grid>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { handleDialogClose(); handleClose(); }}>CANCLE</Button>
              <Button onClick={async () => { const text = `<img height='80px' src="${imgSrc}" alt={'replyimg'}></img>`; await apiCall('reply', 'POST', { thread_id: props.tid, body: text }); props.getThreads(); handleDialogClose(); handleClose(); }}>SUMBIT</Button>
            </DialogActions>
          </Dialog>
        </MenuItem>
        <MenuItem >
          <div>
            <label htmlFor="icon-button-file">
              From Device
              <Input accept="image/*" id="icon-button-file" type="file" onChange={(e) => { handleImage(e.target); handleClose(); }} />
              <Tooltip
                title={'Upload your image'}
                placement="top"
              >
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <UPLOAD />
                </IconButton>
              </Tooltip>
            </label>
          </div>
        </MenuItem>
      </Menu>
    </div>
  )
}
export default UploadImageChoice;