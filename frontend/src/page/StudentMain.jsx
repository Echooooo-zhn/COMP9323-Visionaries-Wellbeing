/* eslint-disable no-unused-vars */
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import StudentHeader from '../component/StudentHeader';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useNavigate } from 'react-router-dom';
import QACard from '../component/QACard';
import CareerAdvice from './img/career_advice.jpg';
import COVID19 from './img/covid-19.jpg';
import MentalHealth from './img/mental_health_amid.jpg';
import Others from './img/others.jpg';
import StudyFromHome from './img/study_from_home.jpg';
import Vaccinations from './img/vaccinations.jpg';
import WellBeing from '../component/img/well-being.jpg';
import { apiCall } from '../Main';
import WellBeingBot from "../component/WellBeingBot"

// The main page for the studnetts,
// which contain the all the categories.
const StudentMain = () => {

	const navigate = useNavigate();
	if (localStorage.getItem('type') === 'expert') {
		navigate('/expert_main')
	}
	const [categories, setCategories] = React.useState([]);
	const [showBot, toggleBot] = React.useState(false);
	const getCategories = async () => {
		const data = await apiCall('/categories', 'GET', {}, navigate);
		setCategories(data.categories);
	};
	const imageL = [StudyFromHome, MentalHealth, Vaccinations, COVID19, CareerAdvice]

	React.useEffect(() => {
		getCategories();
	}, []);

	const CategoryCard = () => {
		const cards = categories.map((c, i) => {
			const cProp = {
				id: c.id,
				category_name: c.category_name,
				category_image_url: c.category_image_src,
				category_description: c.category_description,
				key: i
			};
			return (
				<QACard category={cProp} key={i} image={cProp.category_image_url}></QACard>
			)
		});
		return (
			<Grid container spacing={5}>
				{cards}
			</Grid>
		)
	}

	return (
		<div style={{ backgroundSize: '100% 100%' }}>
			<GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
			<CssBaseline />
			<StudentHeader toggleBot={toggleBot} type={'bot'} />
			<Container disableGutters maxWidth="sm" component="main" sx={{ textAlign: 'center', display: 'flex', marginTop: '15px' }}>
				<img width="80%"
					height="30%"
					src={WellBeing}
					alt={"recipe_image"} />
			</Container>
			<Container maxWidth="lg" component="main" sx={{ paddingTop: '20px' }}>
				<CategoryCard />
			</Container>
			{showBot && (
				<div>
					<WellBeingBot />
				</div>
			)}

			<Container
				maxWidth="md"
				component="footer"
				sx={{
					mt: 8,
					py: [3, 6],
				}}
			>
			</Container>
		</div >
	);
}
export default StudentMain;