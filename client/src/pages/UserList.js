import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' ? '/api/users' : `/api/users?role=${filter}`;
      const response = await axios.get(url);
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
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
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-list-page">
      <div className="header">
        <div className="header-content">
          <Link to="/" className="logo">🏥 MediLinko</Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/create-user">Create User</Link>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="page-header">
          <h1>All Users</h1>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({users.length})
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

        {error && <div className="error">{error}</div>}

        {users.length === 0 ? (
          <div className="card">
            <p className="no-users">No users found. <Link to="/create-user">Create one now</Link></p>
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
                  {user.email && <p><strong>Email:</strong> {user.email}</p>}
                  {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                  <p><strong>Profile:</strong> {user.isProfileComplete ? '✅ Complete' : '⚠️ Incomplete'}</p>
                </div>

                <div className="user-card-footer">
                  <Link to={`/profile/${user.qrCodeId}`} className="btn btn-primary btn-sm">
                    View Profile
                  </Link>
                  <button 
                    onClick={() => showQRCode(user)} 
                    className="btn btn-secondary btn-sm"
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
                <h2>QR Code for {selectedUser.fullName || 'User'}</h2>
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
