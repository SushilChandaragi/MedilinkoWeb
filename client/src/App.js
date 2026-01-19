import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList';
import CreateUser from './pages/CreateUser';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:qrCodeId" element={<UserProfile />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/create-user" element={<CreateUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
