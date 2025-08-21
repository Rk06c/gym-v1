// src/components/MemberModal.jsx
import { useState, useEffect } from 'react';

function MemberModal({ member, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    joinDate: '',
    membershipType: '',
    expiryDate: '',
    trainer: '',
    freeze: 'false',
    guestPasses: 0,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        joinDate: member.joinDate,
        membershipType: member.membershipType,
        expiryDate: member.expiryDate,
        trainer: member.trainer || '',
        freeze: member.freeze.toString(),
        guestPasses: member.guestPasses,
      });
    } else {
      const today = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(today.getFullYear() + 1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        joinDate: today.toISOString().split('T')[0],
        membershipType: '',
        expiryDate: nextYear.toISOString().split('T')[0],
        trainer: '',
        freeze: 'false',
        guestPasses: 0,
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      freeze: formData.freeze === 'true',
      guestPasses: parseInt(formData.guestPasses) || 0,
    });
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{member ? 'Edit Member' : 'Add New Member'}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="joinDate">Join Date</label>
              <input
                type="date"
                name="joinDate"
                id="joinDate"
                className="form-control"
                value={formData.joinDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="membershipType">Membership Type</label>
              <select
                name="membershipType"
                id="membershipType"
                className="form-control"
                value={formData.membershipType}
                onChange={handleChange}
                required
              >
                <option value="">Select Membership Type</option>
                <option value="Normal">Normal</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                id="expiryDate"
                className="form-control"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="trainer">Trainer</label>
              <select
                name="trainer"
                id="trainer"
                className="form-control"
                value={formData.trainer}
                onChange={handleChange}
              >
                <option value="">No Trainer</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="David Kim">David Kim</option>
                <option value="Emma Wilson">Emma Wilson</option>
                <option value="Mike Thompson">Mike Thompson</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="freezeStatus">Freeze Status</label>
              <select
                name="freeze"
                id="freezeStatus"
                className="form-control"
                value={formData.freeze}
                onChange={handleChange}
                required
              >
                <option value="false">Active</option>
                <option value="true">Frozen</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="guestPasses">Guest Passes</label>
              <input
                type="number"
                name="guestPasses"
                id="guestPasses"
                className="form-control"
                value={formData.guestPasses}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-save">
                Save Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MemberModal;