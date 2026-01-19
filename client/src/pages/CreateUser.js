import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateUser.css';
// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    // Allergies & Medications
    allergies: '',
    // Doctor fields
    specialization: '',
    qualification: '',
    experience: '',
    clinicName: '',
    clinicAddress: '',
    consultationFee: '',
    // Pharmacist fields
    pharmacyName: '',
    pharmacyAddress: '',
    licenseNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data based on role
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      };

      // Add common fields
      if (formData.dateOfBirth) userData.dateOfBirth = formData.dateOfBirth;
      if (formData.gender) userData.gender = formData.gender;
      if (formData.bloodGroup) userData.bloodGroup = formData.bloodGroup;
      if (formData.address) userData.address = formData.address;

      // Emergency contact
      if (formData.emergencyContactName) {
        userData.emergencyContact = {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship,
        };
      }

      // Allergies
      if (formData.allergies) {
        userData.allergies = formData.allergies.split(',').map(a => a.trim());
      }

      // Role-specific fields
      if (formData.role === 'doctor') {
        if (formData.specialization) userData.specialization = formData.specialization;
        if (formData.qualification) userData.qualification = formData.qualification;
        if (formData.experience) userData.experience = parseInt(formData.experience);
        if (formData.clinicName) userData.clinicName = formData.clinicName;
        if (formData.clinicAddress) userData.clinicAddress = formData.clinicAddress;
        if (formData.consultationFee) userData.consultationFee = parseFloat(formData.consultationFee);
      }

      if (formData.role === 'pharmacist') {
        if (formData.pharmacyName) userData.pharmacyName = formData.pharmacyName;
        if (formData.pharmacyAddress) userData.pharmacyAddress = formData.pharmacyAddress;
        if (formData.licenseNumber) userData.licenseNumber = formData.licenseNumber;
      }

      const response = await axios.post(`${API_URL}/api/users`, userData);
      setSuccess(true);
      
      // Redirect to user profile after 2 seconds
      setTimeout(() => {
        navigate(`/profile/${response.data.qrCodeId}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-page">
      <div className="header">
        <div className="header-content">
          <Link to="/" className="logo">🏥 MediLinko</Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/users">All Users</Link>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="form-container">
          <h1>Create New User</h1>

          {error && <div className="error">{error}</div>}
          {success && (
            <div className="success">
              ✅ User created successfully! Redirecting to profile...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="user">User/Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="form-section">
              <h2>Emergency Contact</h2>
              
              <div className="form-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
              </div>
            </div>

            {/* User/Patient specific */}
            {formData.role === 'user' && (
              <div className="form-section">
                <h2>Medical Information</h2>
                
                <div className="form-group">
                  <label>Allergies</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="input"
                    placeholder="Comma-separated (e.g., Penicillin, Peanuts)"
                  />
                  <small>Enter allergies separated by commas</small>
                </div>
              </div>
            )}

            {/* Doctor specific */}
            {formData.role === 'doctor' && (
              <div className="form-section">
                <h2>Doctor Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Cardiology"
                    />
                  </div>

                  <div className="form-group">
                    <label>Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., MBBS, MD"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="input"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Consultation Fee (₹)</label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      className="input"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Clinic Name</label>
                  <input
                    type="text"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label>Clinic Address</label>
                  <textarea
                    name="clinicAddress"
                    value={formData.clinicAddress}
                    onChange={handleChange}
                    className="input"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Pharmacist specific */}
            {formData.role === 'pharmacist' && (
              <div className="form-section">
                <h2>Pharmacist Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Pharmacy Name</label>
                    <input
                      type="text"
                      name="pharmacyName"
                      value={formData.pharmacyName}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label>License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pharmacy Address</label>
                  <textarea
                    name="pharmacyAddress"
                    value={formData.pharmacyAddress}
                    onChange={handleChange}
                    className="input"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            )}

            <div className="form-actions">
              <Link to="/" className="btn btn-secondary">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;
