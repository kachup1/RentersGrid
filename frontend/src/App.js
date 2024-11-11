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
import AddAReview from './components/AddAReview';
import AddALandlord from './components/AddALandlord';
import ReportProblem from './components/ReportProblem';
import ReportProblemConfirmation from './components/ReportProblemConfirmation'
import ReportReview from './components/ReportReview';
import ReportReviewConfirmation from './components/ReportReviewConfirmation'

import MyAccount from './components/MyAccount';
import MyRatings from './components/MyRatings';


import { useState } from 'react';
import axios from 'axios';


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
                <Route path="/LandlordProfile/:landlordId" element={<LandlordProfile />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route path="/resetpasswordupdate" element={<ResetPasswordUpdate />} />
                <Route path="/addproperty/:landlordId" element={<AddProperty />} />
                <Route path="/AddAReview/:landlordId" element={<AddAReview />} />
                <Route path="/AddALandlord" element={<AddALandlord />} />
                <Route path="/myaccount" element={<MyAccount />} />
                <Route path="/myratings" element={<MyRatings />} />
                <Route path="/ReportProblem/:landlordId" element={<ReportProblem />} />
                <Route path="/ReportProblemConfirmation" element={<ReportProblemConfirmation />} />
                <Route path="/ReportReview" element={<ReportReview />} />
                <Route path="/ReportReviewConfirmation" element={<ReportReviewConfirmation />} />



                {/* Other Routes */}
            </Routes>
        </Router>
    );
}

export default App;  
