import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './UserProfile.css';

// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UserProfile() {
  const { qrCodeId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCodeId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users/qr/${qrCodeId}`);
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user data');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${user.fullName || 'user'}-qr-code.png`;
    link.href = url;
    link.click();
  };

  if (loading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="error">User not found</div>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const currentUrl = window.location.href;

  return (
    <div className="profile-page">
      <div className="header">
        <div className="header-content">
          <Link to="/" className="logo">🏥 MediLinko</Link>
          <nav className="nav">
            <Link to="/users">All Users</Link>
          </nav>
        </div>
      </div>

      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="profile-header-info">
            <h1>{user.fullName || 'Unknown User'}</h1>
            <p className={`role-badge role-${user.role}`}>{user.role ? user.role.toUpperCase() : 'USER'}</p>
          </div>
          <button onClick={() => setShowQR(!showQR)} className="btn btn-primary">
            {showQR ? 'Hide QR Code' : 'Show QR Code'}
          </button>
        </div>

        {/* QR Code Section */}
        {showQR && (
          <div className="card qr-section">
            <h2>QR Code</h2>
            <div className="qr-container">
              <QRCodeCanvas 
                value={currentUrl}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-info">Scan this code to access this profile</p>
            <button onClick={downloadQR} className="btn btn-secondary">
              Download QR Code
            </button>
          </div>
        )}

        {/* Basic Information */}
        <div className="card">
          <h2>Basic Information</h2>
          <div className="info-grid">
            {user.email && (
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{user.phone}</span>
              </div>
            )}
            {user.isProfileComplete !== undefined && (
              <div className="info-item">
                <span className="info-label">Profile Status:</span>
                <span className="info-value">{user.isProfileComplete ? '✅ Complete' : '⚠️ Incomplete'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location Info */}
        {user.location && user.location.coordinates && user.location.coordinates[0] !== 0 && (
          <div className="card">
            <h2>📍 Location</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Latitude:</span>
                <span className="info-value">{user.location.coordinates[1]}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Longitude:</span>
                <span className="info-value">{user.location.coordinates[0]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Information */}
        {user.role === 'doctor' && (
          <div className="card">
            <h2>👨‍⚕️ Doctor Information</h2>
            <div className="info-grid">
              {(user.clinicLatitude && user.clinicLongitude) && (
                <>
                  <div className="info-item">
                    <span className="info-label">Clinic Latitude:</span>
                    <span className="info-value">{user.clinicLatitude}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Clinic Longitude:</span>
                    <span className="info-value">{user.clinicLongitude}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Pharmacist Information */}
        {user.role === 'pharmacist' && (
          <div className="card">
            <h2>💊 Pharmacist Information</h2>
            <div className="info-grid">
              {(user.pharmacyLatitude && user.pharmacyLongitude) && (
                <>
                  <div className="info-item">
                    <span className="info-label">Pharmacy Latitude:</span>
                    <span className="info-value">{user.pharmacyLatitude}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Pharmacy Longitude:</span>
                    <span className="info-value">{user.pharmacyLongitude}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="card metadata">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">QR Code ID:</span>
              <span className="info-value code">{user.qrCodeId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Created:</span>
              <span className="info-value">{new Date(user.createdAt).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">{new Date(user.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
