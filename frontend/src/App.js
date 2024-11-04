import React from 'react';
import NoAccountHomepage from './components/NoAccountHomepage';
import SignIn from './components/SignIn';
import SearchResults from './components/SearchResults';
import SignUp from './components/SignUp';
import Bookmark from './components/Bookmark';
import LandlordProfile from './components/LandlordProfile';
import ResetPassword from './components/ResetPassword';
import ResetPasswordUpdate from './components/ResetPasswordUpdate';
import AddProperty from './components/AddProperty';


import { useState } from 'react';
import axios from 'axios';
import AddAReview from './components/AddAReview';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<NoAccountHomepage />} />
                <Route path="/SearchResults" element={<SearchResults />} />
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/bookmarks" element={<Bookmark />} />
                <Route path="/LandlordProfile/:landlord" element={<LandlordProfile />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route path="/resetpasswordupdate" element={<ResetPasswordUpdate />} />
                <Route path="/addproperty" element={<AddProperty />} />

                {/* Other Routes */}
            </Routes>
        </Router>
    );
}

export default App;  