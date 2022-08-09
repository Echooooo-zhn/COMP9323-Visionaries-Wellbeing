import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { apiCall } from '../Main';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

// Convert the date format.
function timeFormat(date) {
	if (!date || typeof (date) === "string") {
		this.error("error");
	}
	const y = date.getFullYear();
	const m = date.getMonth() + 1;
	const d = date.getDate();

	return m + "/" + d;
}

// Get the week content of a date.
function getFirstDayOfWeek(date, i) {
	const weekday = date.getDay() || 7;
	date.setDate(date.getDate() - weekday + i);
	return timeFormat(date);
}

// Convert all the date record.
function getDays(date) {
	const l = []
	for (let i = 1; i < 6; i++) {
		l.push(getFirstDayOfWeek(date, i))
	}
	return l
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const StudentBookingTime = (props) => {
	const time = ['09:00am', '09:30am', '10:00am', '10:30am', '11:00am', '01:00pm', '01:30pm', '02:00pm', '02:30pm', '03:00pm', '03:30pm', '04:00pm', '04:30pm'];
	const [date, setDate] = React.useState(props.date);
	const [l, setL] = React.useState(getDays(date))
	const [i, setI] = React.useState(1)
	const [string, setString] = React.useState('')
	const timeTable = props.timeTable
	const week = ['#ffdc00', '#edcf0b', '#ffdc00', '#edcf0b', '#ffdc00']
	const week2 = ['#7a7a7ad0', '#5F6769', '#7a7a7ad0', '#5F6769', '#7a7a7ad0']
	const [selectTime, setSelectTime] = React.useState(-1)
	const [selectDate, setSelectDate] = React.useState('')
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const getTimeTableNew = async () => {
		const datevalue = date.Format('yyyy-MM-dd');
		const data2 = await apiCall(`/get_expert_availabilities_by_week?expert_id=${props.expert.id}&date=${datevalue}`, 'GET')
		console.log(data2);
		console.log(data2.availabilities);
		const t = []
		data2.availabilities.map((day) => {
			const oneday = [];
			day.map((timeslot) => {
				if (timeslot.status === 'available') {
					oneday.push(true);
				} else {
					oneday.push(false);
				}
			})
			t.push(oneday);
		})
		console.log(t);
		const expertsCopy = [...props.experts]

		for (const e of expertsCopy) {
			if (e.expert.id === props.expert.id) {
				e.time = t;
				break;
			}
		}
		props.setExperts(expertsCopy);
		console.log(l);
	}

	function getFirstDayOfNextWeek() {

		const weekday = date.getDay() || 7;

		date.setDate(date.getDate() - weekday + 8);
		getTimeTableNew();
		setL(getDays(date))
		return date;
	}
	function getFirstDayOfLastWeek() {

		const weekday = date.getDay() || 7;

		date.setDate(date.getDate() - weekday - 6);
		getTimeTableNew();
		setL(getDays(date))
		return date;
	}

	const [ok, setOk] = React.useState(false);
	function SimpleDialog(propsSD) {
		const { onClose, open } = propsSD;
		const hclose = () => {
			onClose();
			setOk(false);
		};
		const handleOk = async () => {
			const data = await apiCall('/make_booking', 'POST', {
				"date": selectDate,
				"expert_id": props.expert.id,
				"student_id": localStorage.getItem('id'),
				"time_range_id": selectTime
			});
			setString('You have successfully booked a meeting: ' + data.meeting.meeting_metadata);
			setOk(true);
			await getTimeTableNew();
		}
		return (
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={hclose}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>{"Are you sure to book the meeting?"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						{string}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					{
						!ok ?
							<Button onClick={handleOk}>Ok</Button>
							:
							<></>
					}

					<Button onClick={hclose}>Cancel</Button>
				</DialogActions>
			</Dialog>
		);
	}


	const TimeTables = () => {
		const ll = []
		for (let j = 0; j < 13; j++) {
			const lll = []
			for (let z = 0; z < 5; z++) {
				lll.push(timeTable[z][j])
			}
			ll.push(lll)
		}
		return ll.map((lls, x) => {
			return (
				<div>
					<div style={{ display: 'flex' }}>
						{lls.map((bo, y) => {
							if (bo) {

								return (
									<div style={{ flex: 1, display: 'flex', height: '22px', background: week2[y] }}> <button onClick={() => { setString('You have booked a meeting with ' + props.name + ' on ' + l[y] + ' ' + time[x]); setSelectTime(x + 1); setSelectDate('2022-' + l[y].split('/').join('-')); setOpen(true) }} style={{ border: 'none', borderRadius: '8px', margin: 'auto', height: '18px', width: '80%', background: week[y], fontWeight: 'bold', color: 'black', fontSize: '5px', textAlign: 'center' }}>{time[x]}</button></div>
								)

							} else {
								return (<div style={{ flex: 1, height: '22px', background: week2[y] }} ></div>)
							}

						})}
					</div>
				</div>
			)
		})
	}
	return (
		<div style={{ width: '400px', height: '300px' }} >
			<div style={{ width: '100%', display: 'flex' }}>
				<div style={{ flex: 1, textAlign: 'center' }}> <IconButton size='small' onClick={() => { console.log('hehe'); setDate(getFirstDayOfLastWeek(date)); setI(i + 1) }}><KeyboardDoubleArrowLeftIcon size='small' /></IconButton></div>
				<div style={{ flex: 12, textAlign: 'center' }}> <Grid container spacing={0} cent>
					<Grid item xs={2.4} sx={{ background: 'black', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
						MON
					</Grid>
					<Grid item xs={2.4} sx={{ background: 'black', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
						TUE
					</Grid>
					<Grid item xs={2.4} sx={{ background: 'black', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
						WED
					</Grid>
					<Grid item xs={2.4} sx={{ background: 'black', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
						THU
					</Grid>
					<Grid item xs={2.4} sx={{ background: 'black', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
						FRI
					</Grid>
				</Grid>
					<Grid container spacing={0}>
						{l.map((d, i) => <Grid item xs={2.4} sx={{ background: week[i], fontWeight: 'bold', color: 'white', fontSize: '12px', textAlign: 'center' }}>{d}</Grid>)}
					</Grid>
					<TimeTables></TimeTables></div>
				<div style={{ flex: 1, textAlign: 'center' }}> <IconButton size='small' onClick={() => { console.log('hehe'); setDate(getFirstDayOfNextWeek()); setI(i + 1) }}><KeyboardDoubleArrowRightIcon size='small' /></IconButton></div>
			</div>
			<SimpleDialog
				open={open}
				onClose={handleClose}
			/>

		</div >

	);
}
export default StudentBookingTime;