import { useState, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import api from "../../utils/api";
import { toast } from 'react-toastify';

import "./AddExpenseModal.css";

const CreateGroupModal = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);

  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allSearchResults, setAllSearchResults] = useState([]); 
  const [selectedUsers, setSelectedUsers] = useState([user]);
  const queryClient = useQueryClient();

  const notify = () => toast.success(`Group ${groupName} created successfully!`, {
    autoClose: 2000,
  });

  const searchUsers = useCallback(
    debounce(async (term) => {
      if (term.length < 2) return;
      try {
        const { data } = await api.get(`/users/search?q=${term}&limit=10`);
        setAllSearchResults(data.users); // Store the raw results
      } catch (error) {
        console.error("Search failed:", error);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchUsers(term);
  };

  const handleSelectUser  = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleDeselectUser  = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const filteredSearchResults = useMemo(() => {
    return allSearchResults.filter(
      (user) => !selectedUsers.some((selected) => selected.id === user.id)
    );
  }, [allSearchResults, selectedUsers]);

  const createGroupMutation = useMutation(
    (groupData) => api.post("/groups", groupData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("groups");
        notify();
        onClose();
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createGroupMutation.mutate({
      name: groupName,
      memberIds: selectedUsers.map((user) => user.id),
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
              onChange={handleSearchChange}
              className="form-input"
            />
          </div>

          {searchTerm.length > 1 && filteredSearchResults.length === 0 ? (
            <div>No friends found</div>
          ) : (
            filteredSearchResults.length > 0 && (
              <div className="search-results">
                {filteredSearchResults.map((user) => (
                  <div
                    key={user.id}
                    className="search-result-item"
                    onClick={() => handleSelectUser (user)}
                  >
                    {user.name} ({user.email})
                  </div>
                ))}
              </div>
            )
          )}

          <div className="selected-users">
            {selectedUsers.length > 1 && selectedUsers.map((user) => (
              <div key={user.id} className="selected-user">
                {user.name}
                <button
                  type="button"
                  onClick={() => handleDeselectUser (user)}
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
            <button type="button" onClick={onClose } className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;