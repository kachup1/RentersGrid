import React from 'react';
import HomePage from './components/HomePage'; 
import NoAccountHomepage from './components/NoAccountHomepage';
import SignIn from './components/SignIn';
import SearchResults from './components/SearchResults';
import SignUp from './components/SignUp';
import AddLandlord from './components/AddLandlord'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bookmark from './components/Bookmark';
import LandlordProfile from './components/LandlordProfile'; 
import { useState } from 'react';
import axios from 'axios';


function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<NoAccountHomepage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/SearchResults" element={<SearchResults />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/AddLandlord" element={<AddLandlord />} />
        <Route path="/LandlordProfile" element={<LandlordProfile />} />
        <Route path="/Bookmark" element={<Bookmark />} />
       
        {/* Other Routes */}
      </Routes>
    </Router>
  );
}
export default App;  