// src/components/DeleteHistoryPanel.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDeleteHistory, restoreMember } from '../api/members';

function DeleteHistoryPanel() {
  const queryClient = useQueryClient();

  const { data: deleteHistory = [], isLoading } = useQuery({
    queryKey: ['deleteHistory'],
    queryFn: fetchDeleteHistory,
  });

  const restoreMutation = useMutation({
    mutationFn: ({ index, member }) => restoreMember(index, member),
    onSuccess: () => {
      queryClient.invalidateQueries(['members']);
      queryClient.invalidateQueries(['deleteHistory']);
    },
  });

  const handleRestore = (index, member) => {
    if (window.confirm(`Are you sure you want to restore ${member.name}?`)) {
      restoreMutation.mutate({ index, member });
      alert(`${member.name} has been restored.`);
    }
  };

  return (
    <div className="history-panel" style={{ display: deleteHistory.length > 0 ? 'block' : 'none' }}>
      <div className="history-header">
        <div className="history-title">Recently Deleted Members (Last 5)</div>
        <button className="close-history">&times;</button>
      </div>
      <div className="history-list">
        {isLoading ? (
          <div className="no-results">Loading delete history...</div>
        ) : deleteHistory.length === 0 ? (
          <div className="no-results">No deletion history found</div>
        ) : (
          deleteHistory.slice(-5).map((item, index) => (
            <div className="history-item" key={index}>
              <div className="history-info">
                <div className="history-name">{item.name}</div>
                <div className="history-details">
                  ID: {item.id} | {item.membershipType} Membership | Deleted: {item.deletionDate}
                </div>
              </div>
              <div className="history-actions">
                <button
                  className="restore-btn"
                  onClick={() => handleRestore(index, item)}
                >
                  Restore
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DeleteHistoryPanel;