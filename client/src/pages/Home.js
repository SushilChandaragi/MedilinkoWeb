import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="header">
        <div className="header-content">
          <Link to="/" className="logo">🏥 MediLinko</Link>
          <nav className="nav">
            <Link to="/users">View All Users</Link>
          </nav>
        </div>
      </div>
      
      <div className="container">
        <div className="hero">
          <h1>Welcome to MediLinko</h1>
          <p>Healthcare Management System with QR Code Access</p>
          
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>QR Code Generation</h3>
              <p>Generate unique QR codes for each user profile</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>User Profiles</h3>
              <p>Comprehensive health profiles accessible via QR scan</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Access</h3>
              <p>Safe and secure information sharing</p>
            </div>
          </div>
          
          <div className="cta-buttons">
            <Link to="/users" className="btn btn-primary">View All Users</Link>
          </div>
        </div>
        
        <div className="info-section">
          <div className="card">
            <h2>How It Works</h2>
            <ol className="steps">
              <li>
                <strong>Browse Existing Users</strong>
                <p>View all users from the MediLinko database (patients, doctors, pharmacists)</p>
              </li>
              <li>
                <strong>QR Code Access</strong>
                <p>Each user has a unique QR code that links to their profile</p>
              </li>
              <li>
                <strong>Scan & View</strong>
                <p>Scan the QR code with any QR scanner (Google Lens, camera app, etc.) to view the profile instantly</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
