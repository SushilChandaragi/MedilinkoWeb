import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './UserList.css';

// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? `${API_URL}/api/users` : `${API_URL}/api/users?role=${filter}`;
      const response = await axios.get(url);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUsername');
    navigate('/login');
  };

  const showQRCode = (user) => {
    setSelectedUser(user);
  };

  const downloadQR = (user) => {
    const canvas = document.querySelector(`#qr-${user._id} canvas`);
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${user.fullName || 'user'}-qr-code.png`;
    link.href = url;
    link.click();
  };

  const getProfileUrl = (user) => {
    return `${window.location.origin}/profile/${user.qrCodeId}`;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-list-page">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="brand-icon">🏥</span>
            <span className="brand-text">MediLinko Admin</span>
          </div>
          <div className="navbar-actions">
            <Link to="/create-user" className="nav-btn">
              <span>➕</span>
              New User
            </Link>
            <button onClick={handleLogout} className="nav-btn logout-btn">
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <div className="header-left">
            <h1>User Management</h1>
            <p>Manage all registered users and their profiles</p>
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'user' ? 'active' : ''}`}
              onClick={() => setFilter('user')}
            >
              Users
            </button>
            <button 
              className={`filter-btn ${filter === 'doctor' ? 'active' : ''}`}
              onClick={() => setFilter('doctor')}
            >
              Doctors
            </button>
            <button 
              className={`filter-btn ${filter === 'pharmacist' ? 'active' : ''}`}
              onClick={() => setFilter('pharmacist')}
            >
              Pharmacists
            </button>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No users found</h2>
            <p>Get started by creating your first user</p>
            <Link to="/create-user" className="btn-primary">
              Create User
            </Link>
          </div>
        ) : (
          <div className="users-grid">
            {users.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="user-info">
                    <h3>{user.fullName || 'Unknown User'}</h3>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role ? user.role.toUpperCase() : 'USER'}
                    </span>
                  </div>
                </div>

                <div className="user-card-body">
                  {user.email && (
                    <div className="info-row">
                      <span className="info-icon">📧</span>
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="info-row">
                      <span className="info-icon">📱</span>
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-icon">{user.isProfileComplete ? '✅' : '⚠️'}</span>
                    <span>{user.isProfileComplete ? 'Complete Profile' : 'Incomplete Profile'}</span>
                  </div>
                </div>

                <div className="user-card-footer">
                  <Link to={`/profile/${user.qrCodeId}`} className="btn-card btn-view">
                    View Profile
                  </Link>
                  <button 
                    onClick={() => showQRCode(user)} 
                    className="btn-card btn-qr"
                  >
                    Show QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Code Modal */}
        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>QR Code</h2>
                <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
              </div>
              <div className="modal-body">
                <div id={`qr-${selectedUser._id}`} className="qr-display">
                  <QRCodeCanvas 
                    value={getProfileUrl(selectedUser)}
                    size={300}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="qr-url">{getProfileUrl(selectedUser)}</p>
                <div className="modal-actions">
                  <button onClick={() => downloadQR(selectedUser)} className="btn btn-primary">
                    Download QR Code
                  </button>
                  <Link 
                    to={`/profile/${selectedUser.qrCodeId}`} 
                    className="btn btn-secondary"
                    onClick={() => setSelectedUser(null)}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserList;
