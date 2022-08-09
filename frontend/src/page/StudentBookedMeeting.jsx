import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';

import StudentHeader from '../component/StudentHeader'

// date-fns
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { apiCall } from '../Main';
import AvatarImage from '../component/AvatarImage'
import { useNavigate } from 'react-router-dom';

import PageReturnButton from '../component/PageReturnButton';

const ListItem = styled('li')(({ theme }) => ({
	margin: theme.spacing(0.5),
}));

// Get the students availabilities.
const StudentBookedMeeting = () => {
	const navigate = useNavigate();
	const time = ['09:00am-9:30am', '09:30am-10:00am', '10:00am-10:30am', '10:30am-11:00am', '11:00am-11:30am', '01:00pm-1:30am', '01:30pm-02:00pm', '02:00pm-02:30am', '02:30pm-03:00pm', '03:00pm-03:30am', '03:30pm-04:00pm', '04:00pm-04:30am', '04:30pm-05:00pm'];
	const [i, setI] = React.useState(1);
	const [qaList, setQAList] = React.useState([]);
	const getQADetail = async (id) => {
		const data = await apiCall(`/get_student_upcoming_availabilities/${localStorage.getItem('id')}`, 'GET', {}, navigate);

		setQAList(data.availabilities);
	}

	if (i === 1) {
		getQADetail();
		setI(i + 1);
	};

  // The list contains the language choice.
	const InputInList = (propsN) => {
		return (
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					listStyle: 'none',
					p: 0.5,
					m: 0,
				}}
				component="ul"
			>
				<ListItem>
					<Chip
						label={'English'}
						size="small"

					/>
				</ListItem>
				{propsN.list.map((data, i) => {
					return (
						<ListItem key={i}>
							<Chip
								label={data.language_name}
								size="small"
							/>
						</ListItem>
					);
				})}
			</Box>
		);
	}

  // Return the meeting schedule of the student.
	const PotentialMeeting = (props) => {
		const [expanded, setExpanded] = React.useState(false);

		const handleChange = (panel) => (event, isExpanded) => {
			setExpanded(isExpanded ? panel : false);
		};
		return (
			<div>
				{props.qaList.map((data, i) => {
					return (
						<div key={i} style={{ marginTop: '5px', width: '100%', marginBottom: '5px' }}>
							<Accordion fullWidth expanded={expanded === `panel${i}`} onChange={handleChange(`panel${i}`)}>
								<AccordionSummary

									expandIcon={<ExpandMoreIcon />}
									aria-controls={`panel${i}bh-content`}
									id={`panel${i}bh-header`}
								>
									<Typography sx={{ flexShrink: 0, width: '95%' }}>
										<div style={{ display: 'flex' }}>
											<div style={{ flex: 5 }}>
												Meeting {i}: {data.date + ' ' + time[data.time_range.id]}
											</div>

											<div style={{ flex: 1 }}>
												<a href={data.meeting_metadata}>click to view</a>
											</div>
										</div>
									</Typography>

								</AccordionSummary>
								<AccordionDetails>
									<div>

										<Grid container spacing={0} cent sx={{ width: '100%' }}>
											<Grid item xs={3} sx={{ fontWeight: 'bold', textAlign: 'center' }}>

												<div style={{ display: 'flex' }}><div style={{ margin: 'auto' }}><AvatarImage profileImageSrc={data.expert.profile_image_src} name={data.expert.username} type={'meeting'} /></div></div>
												<div>{data.expert.username}</div>
											</Grid>
											<Grid item xs={9} sx={{}} >
												<div><span style={{ fontWeight: 'bold' }}>{"Email: "}</span> {data.expert.email}</div>
												<div><span style={{ fontWeight: 'bold' }}>{"Languages: "}</span><InputInList list={data.expert.languages} /></div>
												<div><span style={{ fontWeight: 'bold' }}>{"Biography: "}</span></div>
												<div>{data.expert.biography}</div>
											</Grid>
										</Grid>

									</div>
								</AccordionDetails>
							</Accordion>
						</div>
					);
				})}
			</div>
		);
	}


	return (
		<div>
			<StudentHeader />
			<div style={{ display: 'flex', marginLeft: '200px', marginTop: '40px' }}>
				<Typography variant="h2" sx={{ marginTop: '30px' }}>Your Booked Meetings</Typography>
			</div>
      <PageReturnButton address={'/student_main'}/>
			<Container disableGutters maxWidth="lg" component="main" sx={{ pt: 8, pb: 6, padding: 0 }}>
				<div style={{ display: 'flex', width: '100%', backgroundColor: '#ffffff', borderRadius: '10px', marginBottom: '10px', paddingBottom: '80px', }}>
					<Box
						sx={{
							alignItems: 'center',
							margin: 'auto',
							flex: 3,
							width: '100%',
							paddingTop: '40px',
							paddingBottom: '40px',
							paddingLeft: '40px',
							paddingRight: '40px',
							height: '400px'

						}}
					>
						<div style={{ width: '100%' }}>
							<PotentialMeeting qaList={qaList} />
						</div>
					</Box>
				</div>
			</Container >
		</div >
	);
}
export default StudentBookedMeeting;