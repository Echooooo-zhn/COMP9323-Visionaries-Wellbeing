import * as React from 'react';
import StudentHeader from '../component/StudentHeader'
import Typography from '@mui/material/Typography';
import MAIN from './img/vaccinations.jpg';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import D1 from './img/doctor-img2.png'
import D2 from './img/online-doctor-appointment.png'
import StudentBookingTime from '../component/StudentBookingTime';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiCall } from '../Main';
import AvatarImage from '../component/AvatarImage'
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

import PageReturnButton from '../component/PageReturnButton';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const StudentFindExpert = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const value = state !== null ? state["date"] : new Date();
  const categoryid = useParams().categoryid;
  const [category, setCategory] = React.useState('');
  const [categoriesName, setCategoriesName] = React.useState([]);
  const [categoriesId, setCategoriesId] = React.useState([]);

  const [categoriesImage, setCategoriesImage] = React.useState('');
  const time = ['09:00am-9:30am', '09:30am-10:00am', '10:00am-10:30am', '10:30am-11:00am', '11:00am-11:30am', '01:00pm-1:30am', '01:30pm-02:00pm', '02:00pm-02:30am', '02:30pm-03:00pm', '03:00pm-03:30am', '03:30pm-04:00pm', '04:00pm-04:30am', '04:30pm-05:00pm'];
  const getCategories = async () => {
    const data = await apiCall('/categories', 'GET', {}, navigate);
    setCategoriesName(data.categories.map((cate) => { return cate.category_name }));
    setCategoriesId(data.categories.map((cate) => { return cate.id }));
    const cate = data.categories.filter((cate) => { return cate.id.toString() === categoryid.toString() })[0]

    setCategory(cate.category_name);
    setCategoriesImage(cate.category_image_src);
  };

  const [experts, setExperts] = React.useState([]);

  // Define the date type.
  Date.prototype.Format = function (fmt) {
    const o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'H+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'S+': this.getMilliseconds()
    };

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
      }
    }
    return fmt;
  };


  // Ge the availabilities of the experts.
  const getTimeTable = async () => {
    const datevalue = value.Format('yyyy-MM-dd');
    const data2 = await apiCall(`/get_experts_availabilities_by_week_and_categories?category_ids=${categoryid}&date=${datevalue}`, 'GET', {}, navigate);
    const l = [];
    data2.result.map((re) => {
      const d = {}
      d['expert'] = re.expert;
      const t = []
      let un = 0
      re.availabilities.map((day) => {
        const oneday = [];
        day.map((timeslot) => {
          if (timeslot.status === 'available') {
            oneday.push(true);
          } else {
            un += 1
            oneday.push(false);
          }
        })
        t.push(oneday);
      })
      d['time'] = t;
      if (un !== 0) {
        l.push(d);
      }
    });

    setExperts(l);
  }
  const [i, setI] = React.useState(1);
  if (i === 1) {

    getCategories();
    getTimeTable();
    setI(i + 1);
  }

  // Filter the experts by the category.
  const FilterCategory = () => {
    return (
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={categoriesName}
        value={category}
        onChange={(e) => { navigate(`/student_main/find_expert/${categoriesId[e.target.getAttribute("data-option-index")]}`, { state: { date: value } }); setI(1); }}
        renderInput={(params) => <TextField {...params} label="Category" />}
        size="small"
        fullWidth
      />
    );
  }

  // The input list containes the lanugage choice.
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

  return (
    <div>
      <StudentHeader />
      <div style={{ display: 'flex', marginLeft: '200px', marginTop: '40px', marginRight: '200px' }}>
        <Typography variant="h2" sx={{ marginTop: '30px' }}>{category}</Typography>
        <img
          style={{ marginLeft: '30px', height: '100px' }}
          src={categoriesImage}
          alt='ingred'
        />
        <div style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          margin: 'auto',
          width: '100px',
          paddingLeft: '40px',
          paddingTop: '40px',
          paddingRight: '0px'

        }}>Catgory: <FilterCategory /></div>

      </div>
      <div style={{ marginLeft: '100px', marginTop: '40px' }}>
        <PageReturnButton address={'/student_main'} />
        {experts.map((e, i) => {
          return (
            <div key={i} style={{ width: '100%', marginBottom: '30px' }}>
              <Grid container spacing={0} cent sx={{ width: '100%' }}>
                <Grid item xs={2} sx={{ fontWeight: 'bold', textAlign: 'center' }}>

                  <div style={{ display: 'flex' }}><div style={{ margin: 'auto' }}><AvatarImage profileImageSrc={e.expert.profile_image_src} name={e.expert.username} /></div></div>
                  <div>{e.expert.username}</div>
                </Grid>
                <Grid item xs={5} sx={{}} >
                  <div><span style={{ fontWeight: 'bold' }}>{"Email: "}</span> {e.expert.email}</div>
                  <div><span style={{ fontWeight: 'bold' }}>{"Languages: "}</span><InputInList list={e.expert.languages} /></div>
                  <div><span style={{ fontWeight: 'bold' }}>{"Biography: "}</span></div>
                  <div>{e.expert.biography}</div>
                </Grid>
                <Grid item xs={5} >
                  <StudentBookingTime timeTable={e.time} name={e.expert.name} date={value} expert={e.expert} experts={experts} setExperts={setExperts} />
                </Grid>
              </Grid>
            </div>
          )
        })}
      </div>

    </div>
  )
}
export default StudentFindExpert;