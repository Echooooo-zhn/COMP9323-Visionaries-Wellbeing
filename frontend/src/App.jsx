import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import StudentMain from './page/StudentMain';
import ExpertMain from './page/ExpertMain';
import StudentProfile from './page/StudentProfile';
import ExpertProfile from './page/ExpertProfile';
import Login from './page/Login';
import StudentRegister from './page/StudentRegister.jsx';
import QACategory from './page/QACategory'
import ExpertAva from './page/ExpertAva.jsx';
import StudentFindExpert from './page/StudentFindExpert.jsx';
import QAadd from './page/QAadd.jsx';
import QuestionThread from './page/QuestionThread.jsx';
import ReviewPost from './page/ReviewPost.jsx';
import StudentQuestionThread from './page/StudentQuestionThread.jsx';
import AddExpert from './page/AddExpert.jsx';
import StudentBookedMeeting from './page/StudentBookedMeeting.jsx'
import ExpertBookedMeeting from './page/ExpertBookedMeeting';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<StudentMain />} />
        <Route path="/student_register" element={<StudentRegister />} />
        <Route path="/student_main" element={<StudentMain />} />
        <Route path="/expert_main" element={<ExpertMain />} />
        <Route path="/student_profile" element={<StudentProfile />} />
        <Route path="/expert_profile" element={<ExpertProfile />} />
        <Route path="/QACategory" element={<QACategory />} />
        <Route path="/QACategory/:categoryid" element={<QACategory />} />
        <Route path="/expert_ava" element={<ExpertAva />} />
        <Route path="/student_main/find_expert/:categoryid" element={<StudentFindExpert />} />
        <Route path="/qaAdd" element={<QAadd />}></Route>
        <Route path="/question_thread" element={<QuestionThread />}> </Route>
        <Route path="/student_question_thread" element={<StudentQuestionThread />}> </Route>
        <Route path="/review_post" element={<ReviewPost />}> </Route>
        <Route path="/addExpert" element={<AddExpert />}> </Route>
        <Route path="/student_booked_meeting" element={<StudentBookedMeeting />}></Route>
        <Route path="/expert_booked_meeting" element={<ExpertBookedMeeting />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
