import React from 'react';
import HomePage from './components/HomePage'; 
import NoAccountHomepage from './components/NoAccountHomepage'
import SignIn from './components/SignIn';
import SearchResults from './components/SearchResults'
import SignUp from './components/SignUp'
import { useState } from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<NoAccountHomepage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/SearchResults" element={<SearchResults />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        {/* Other Routes */}
      </Routes>
    </Router>
  );
}
export default App;  