/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import Tooltip from '@mui/material/Tooltip';
import { apiCall } from '../Main';
import defaultJpg from './img/well-being.jpg';

const QACard = (props) => {

    const navigate = useNavigate();
    const id = props.category.id;

    return (
        <Grid item className="GC" key={props.category.key} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => navigate(`/QACategory/${id}`)}>
                {<CardMedia
                    componnet="img"
                    sx={{
                        // 16:9
                        pt: '55%',
                    }}
                    alt="Image of the Game"
                    image={props.image}
                    title="Image title"
                />
                }
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        <strong>{props.category.category_name}</strong>
                    </Typography>
                    <Typography>
                        <strong>{props.category.category_description}</strong>
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default QACard;
