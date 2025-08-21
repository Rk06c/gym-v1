// src/components/MemberTable.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMembers, addMember, updateMember, deleteMember } from '../api/members';
import MemberModal from './MemberModal';



function MemberTable() {
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
  });

  const addMemberMutation = useMutation({
    mutationFn: addMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['members']);
      setShowModal(false);
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, member }) => updateMember(id, member),
    onSuccess: () => {
      queryClient.invalidateQueries(['members']);
      setShowModal(false);
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: ({ id, member }) => deleteMember(id, member),
    onSuccess: () => {
      queryClient.invalidateQueries(['members']);
      queryClient.invalidateQueries(['deleteHistory']);
    },
  });

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase().trim());
  };

  const filteredMembers = members.filter((member) =>
    Object.values(member).some(
      (value) => value && value.toString().toLowerCase().includes(searchText)
    )
  );

  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.toString().replace(regex, '<span class="highlight">$1</span>');
  };

  const openModal = (member = null) => {
    setEditingMember(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleDelete = (id) => {
    const member = members.find((m) => m.id === id);
    if (member && window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      deleteMemberMutation.mutate({ id, member });
      alert(`${member.name} has been deleted.`);
    }
  };

  const handleSubmit = (memberData) => {
    if (editingMember) {
      updateMemberMutation.mutate({ id: editingMember.id, member: memberData });
    } else {
      addMemberMutation.mutate(memberData);
    }
  };

  const getStatus = (member) => {
    const today = new Date();
    const expiryDate = new Date(member.expiryDate);
    if (member.freeze) return { text: 'Frozen', class: 'status-frozen' };
    if (expiryDate < today) return { text: 'Expired', class: 'status-expired' };
    return { text: 'Active', class: 'status-active' };
  };

  return (
    <>
      <div className="header">
        <h1>Gym Members Management</h1>
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              id="searchInput"
              className="search-box"
              placeholder="Search members by any field..."
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <span>+ Add New Member</span>
          </button>
          <button className="btn btn-history" onClick={() => setShowHistory(!showHistory)}>
            <span>View Delete History</span>
          </button>
        </div>
      </div>

      <div className="results-info">
        {isLoading
          ? 'Loading...'
          : filteredMembers.length === 0
          ? 'No members found'
          : `Showing ${filteredMembers.length} of ${members.length} members`}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Membership</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Trainer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="10" className="no-results">
                  Loading members...
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-results">
                  No members match your search.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => {
                const { text: statusText, class: statusClass } = getStatus(member);
                return (
                  <tr key={member.id} onClick={() => openModal(member)}>
                    <td data-label="ID">{member.id}</td>
                    <td
                      data-label="Name"
                      dangerouslySetInnerHTML={{ __html: highlightText(member.name, searchText) }}
                    />
                    <td
                      data-label="Email"
                      dangerouslySetInnerHTML={{ __html: highlightText(member.email, searchText) }}
                    />
                    <td
                      data-label="Phone"
                      dangerouslySetInnerHTML={{ __html: highlightText(member.phone, searchText) }}
                    />
                    <td data-label="Join Date">{member.joinDate}</td>
                    <td data-label="Membership">{member.membershipType}</td>
                    <td data-label="Expiry">{member.expiryDate}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${statusClass}`}>{statusText}</span>
                    </td>
                    <td data-label="Trainer">{member.trainer || '—'}</td>
                    <td data-label="Actions" className="action-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(member);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(member.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <MemberModal
          member={editingMember}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}

export default MemberTable;