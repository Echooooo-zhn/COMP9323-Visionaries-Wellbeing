import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';

function stringAvatar(name) {
  return {
    sx: { fontSize: '15px', height: '40px' },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const Input = styled('input')({
  display: 'none',
});

// The profile image can be changeed by clicking this button.
const ImageButton = (props) => {

  // Chang the image into base64 string.
  const handleImage = (target) => {
    if (target.value) {
      const file = target.files[0];
      const size = file.size;
      if (size >= 1 * 900 * 900) {
        alert('image over limit');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(file.type)) {
        alert('Not an image');
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          const dataimg = e.target.result;
          props.setProfileImageSrc(dataimg);
          props.update();
        }
      }
    }
  }

  // If no profile image provedided, and then show the image in teh avater.
  return (
    <>
      {props.profileImageSrc === ""
      ? <label htmlFor="icon-button-file">
          <Input accept="image/*" id="icon-button-file" type="file" onChange={(e) => {handleImage(e.target);} }/>
          <Tooltip
            title={'Upload your image'}
            placement="top"
          >
            <Avatar
              {...stringAvatar(props.name)} 
              sx={{ m: 1, bgcolor: 'primary.main', backgroundColor:'#000000',color:'white', height:'60px', width:'60px', fontSize:'25px' }}
            >   
            </Avatar>
          </Tooltip>
        </label>
      : <label htmlFor="icon-button-file">
          <Input accept="image/*" id="icon-button-file" type="file" onChange={(e) => {handleImage(e.target);} }/>
          <Tooltip
            title={'Upload your image'}
            placement="top"
          >
            <Avatar
              src={props.profileImageSrc}
              sx={{ m: 1, bgcolor: 'primary.main', backgroundColor:'#000000',color:'white', height:'60px', width:'60px', fontSize:'25px' }}
            >
            </Avatar>
          </Tooltip>
        </label> 
      }
    </>
  )
}
export default ImageButton;