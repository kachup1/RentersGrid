import React from 'react';
import HomePage from './components/HomePage';
import NoAccountHomepage from './components/NoAccountHomepage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import ResetPasswordUpdate from './components/ResetPasswordUpdate';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
             
              <Route path="/" element={<NoAccountHomepage />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/SignIn" element={<SignIn />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/ResetPassword" element={<ResetPassword />} />
              <Route path="/ResetPasswordUpdate" element={<ResetPasswordUpdate />} />


        {/* Other Routes */}
      </Routes>
    </Router>
  );
}
export default App;  
