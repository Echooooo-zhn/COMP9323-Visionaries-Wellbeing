import { useNavigate } from 'react-router-dom';
import React from 'react';

// The button used to navigate to the provided address
const PageReturnButton = (props) => {
  const navigate = useNavigate();
  return (
    <div style={{display:'flex', alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom:'10px', width: '90%'}}>
      <button 
        variant="outlined" 
        style={{backgroundColor: '#000000', color: 'white', right: '0px'}} 
        onClick={() => { navigate(props.address) }}
      >
        Return
      </button>
    </div>
  )
}
export default PageReturnButton;