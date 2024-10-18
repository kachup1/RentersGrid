import React, { useEffect} from 'react';
import HomePage from './components/HomePage';
import NoAccountHomepage from './components/NoAccountHomepage'
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SearchResults from './components/SearchResults';
import ResetPassword from './components/ResetPassword';
import ResetPasswordUpdate from './components/ResetPasswordUpdate';


function App() {
  return (
    <Router>
      <Routes>
             
              <Route path="/" element={<NoAccountHomepage />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/SearchResults" element={<SearchResults />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/resetpasswordupdate" element={<ResetPasswordUpdate />} />
        {/* Other Routes */}
      </Routes>
    </Router>
  );
}
export default App;  
