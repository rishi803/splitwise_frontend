import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { debounce } from 'lodash';
import api from '../../utils/api';
import './AddExpenseModal.css';

const CreateGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const queryClient = useQueryClient();

  const searchUsers = useCallback(
    debounce(async (term) => {
      if (term.length < 2) return;
      try {
        const { data } = await api.get(`/users/search?q=${term}&limit=10`);
        setSearchResults(data.users);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }, 300),
    []
  );

  const createGroupMutation = useMutation(
    (groupData) => api.post('/groups', groupData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('groups');
        onClose();
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createGroupMutation.mutate({
      name: groupName,
      memberIds: selectedUsers.map(user => user.id)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Group</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                searchUsers(e.target.value);
              }}
              className="form-input"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  className="search-result-item"
                  onClick={() => {
                    setSelectedUsers(prev => [...prev, user]);
                    setSearchResults([]);
                    setSearchTerm('');
                  }}
                >
                  {user.name} ({user.email})
                </div>
              ))}
            </div>
          )}

          <div className="selected-users">
            {selectedUsers.map(user => (
              <div key={user.id} className="selected-user">
                {user.name}
                <button
                  type="button"
                  onClick={() => setSelectedUsers(prev => 
                    prev.filter(u => u.id !== user.id)
                  )}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button type="submit" className="submit-button">
              Create Group
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;