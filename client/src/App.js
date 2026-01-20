import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList';
import CreateUser from './pages/CreateUser';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:qrCodeId" element={<UserProfile />} />
          <Route path="/users" element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          } />
          <Route path="/create-user" element={
            <ProtectedRoute>
              <CreateUser />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
