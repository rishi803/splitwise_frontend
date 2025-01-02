import { useState, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import api from "../../utils/api";
import { toast } from "react-toastify";

import "./AddExpenseModal.css";

const CreateGroupModal = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);

  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const queryClient = useQueryClient();

  const notify = () =>
    toast.success(`Group ${groupName} created successfully!`, {
      autoClose: 2000,
    });

  // Debounce search term update
  const debounceSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debounceSearch(term); // Update the debounced search term
  };

  // Fetch users based on debounced search term
  const { data: searchResults = [] } = useQuery(
    ["searchFriends", debouncedSearchTerm],
    () => api.get(`/users/search?q=${debouncedSearchTerm}&limit=10`).then((res) => res.data.users),
    {
      enabled: debouncedSearchTerm.length > 0, // Only fetch if the search term is valid
    }
  );

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleDeselectUser = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const filteredSearchResults = useMemo(() => {
    return searchResults.filter(
      (userItem) =>
        user.id !== userItem.id &&
        !selectedUsers.some((selected) => selected.id === userItem.id)
    );
  }, [searchResults, selectedUsers]);

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

  const handleGroupNameChange = (e) => {
    const value = e.target.value;
    setGroupName(value);
    if (value.trim().length < 2) {
      setGroupNameError("Group name must be at least 2 characters long.");
    } else {
      setGroupNameError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim().length < 2) {
      setGroupNameError("Group name must be at least 2 characters long.");
      return;
    }
    const allMembers = selectedUsers.map((user) => user.id);
    createGroupMutation.mutate({
      name: groupName,
      memberIds: [user.id, ...allMembers],
    });
  };

  const isSubmitDisabled =  createGroupMutation.isLoading;

  console.log("is ",isSubmitDisabled)
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
              onChange={handleGroupNameChange}
              className={`form-input`}
            />
          </div>
          <div className="form-group-error"> {groupNameError && <span className="error-message-text">{groupNameError}</span>}</div>
         

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
                    onClick={() => handleSelectUser(user)}
                  >
                    {user.name} ({user.email})
                  </div>
                ))}
              </div>
            )
          )}

          <div className="selected-users">
            {selectedUsers.length > 0 &&
              selectedUsers.map((user) => (
                <div key={user.id} className="selected-user">
                  {user.name}
                  <button type="button" onClick={() => handleDeselectUser(user)}>
                    ×
                  </button>
                </div>
              ))}
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitDisabled}
            >
              {createGroupMutation.isLoading ? "Creating..." : "Create Group"}
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
