import React, { useEffect } from 'react';
import NoAccountHomepage from './components/NoAccountHomepage';
import SignIn from './components/SignIn';
import SearchResults from './components/SearchResults';
import SignUp from './components/SignUp';
import Bookmark from './components/Bookmark';
import LandlordProfile from './components/LandlordProfile';
import ResetPassword from './components/ResetPassword';
import ResetPasswordConfirmation from './components/ResetPasswordConfirmation';
import ResetPasswordUpdate from './components/ResetPasswordUpdate';
import AddProperty from './components/AddProperty';
import AddAReview from './components/AddAReview';
import AddALandlord from './components/AddALandlord';
import ReportProblem from './components/ReportProblem';
import ReportProblemConfirmation from './components/ReportProblemConfirmation';
import ReportReview from './components/ReportReview';
import ReportReviewConfirmation from './components/ReportReviewConfirmation';
import MyAccount from './components/MyAccount';
import MyRatings from './components/MyRatings';
import Test from './components/Test';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// PageWrapper component to dynamically set document title
const PageWrapper = ({ title, children }) => {
    useEffect(() => {
        document.title = `Renters Grid – ${title}`;
    }, [title]);

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PageWrapper title="Welcome!">
                            <NoAccountHomepage />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/SearchResults"
                    element={
                        <PageWrapper title="Search Results">
                            <SearchResults />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/SignIn"
                    element={
                        <PageWrapper title="Sign In">
                            <SignIn />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/SignUp"
                    element={
                        <PageWrapper title="Sign Up">
                            <SignUp />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/bookmarks"
                    element={
                        <PageWrapper title="My Bookmarks">
                            <Bookmark />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/LandlordProfile/:landlordId"
                    element={
                        <PageWrapper title="Landlord Profile">
                            <LandlordProfile />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/resetpassword"
                    element={
                        <PageWrapper title="Reset Password">
                            <ResetPassword />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/reset-password/:token"
                    element={
                        <PageWrapper title="Reset Password Update">
                            <ResetPasswordUpdate />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/ResetPasswordConfirmation"
                    element={
                        <PageWrapper title="Reset Password Confirmation">
                            <ResetPasswordConfirmation />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/addproperty/:landlordId"
                    element={
                        <PageWrapper title="Add A Property">
                            <AddProperty />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/AddALandlord"
                    element={
                        <PageWrapper title="Add A Landlord">
                            <AddALandlord />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/myaccount"
                    element={
                        <PageWrapper title="My Account">
                            <MyAccount />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/myratings"
                    element={
                        <PageWrapper title="My Ratings">
                            <MyRatings />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/ReportProblem/:landlordId"
                    element={
                        <PageWrapper title="Report A Problem">
                            <ReportProblem />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/ReportProblemConfirmation"
                    element={
                        <PageWrapper title="Report A Problem Confirmation">
                            <ReportProblemConfirmation />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/ReportReview/:landlordId/:ratingId"
                    element={
                        <PageWrapper title="Report A Review">
                            <ReportReview />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/ReportReviewConfirmation"
                    element={
                        <PageWrapper title="Report A Review Confirmation">
                            <ReportReviewConfirmation />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/AddAReview/:landlordId/:ratingId?"
                    element={
                        <PageWrapper title="Add A Review">
                            <AddAReview />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/Test"
                    element={
                        <PageWrapper title="Test Page">
                            <Test />
                        </PageWrapper>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
