import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// An notification componenet which constains
// which contain the succeffule error.S
export default function SuccessSnackbar(props) {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={20} ref={ref} variant="filled" {...props} />;
  });
  return (
    <div>
      <Snackbar
        open={props.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
      
      
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}