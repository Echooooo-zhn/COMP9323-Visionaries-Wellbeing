// return an avatar for the user wihch constains
// their profile image, and default image would be 
// the captial character of the firstname and lastname.
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

function stringAvatar(name) {
  if (name.split(' ').length >= 2) {
    return {
      sx: { fontSize: '15px', height: '30px' },

      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  } else {
    return {
      sx: { fontSize: '15px', height: '30px' },

      children: `${name[0]}${name[1]}`,
    };
  }
}

const Input = styled('input')({
  display: 'none',
});

const AvatarImage = (props) => {
  console.log(props.type);
  if (props.type === undefined) {
    if (props.profileImageSrc === "") {
      return (<Avatar
        {...stringAvatar(props.name)}
        sx={{ m: 1, bgcolor: 'primary.main', backgroundColor: '#000000', color: 'white', height: '40px', width: '40px', fontSize: '25px' }}
      >
      </Avatar>)
    } else {

      return (<Avatar
        src={props.profileImageSrc}
        sx={{ m: 1, bgcolor: 'primary.main', backgroundColor: '#000000', color: 'white', height: '40px', width: '40px', fontSize: '25px' }}
      >
      </Avatar>)
    }
  } else {
    if (props.profileImageSrc === "") {
      return (<Avatar
        {...stringAvatar(props.name)}
        sx={{ m: 1, bgcolor: 'primary.main', backgroundColor: '#000000', color: 'white', height: '80px', width: '80px', fontSize: '25px' }}
      >
      </Avatar>)
    } else {

      return (<Avatar
        src={props.profileImageSrc}
        sx={{ m: 1, bgcolor: 'primary.main', backgroundColor: '#000000', color: 'white', height: '80px', width: '80px', fontSize: '25px' }}
      >
      </Avatar>)
    }
  }






}
export default AvatarImage;