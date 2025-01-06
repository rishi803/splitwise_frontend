import { useState, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { debounce } from "lodash";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// import "./AddGroupMembersModal.css";

const AddGroupMembersModal = ({ onClose, groupId }) => {

    const {user}= useSelector((state)=> state.auth)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const queryClient = useQueryClient();

  const notify = () =>
    toast.success("Member(s) added successfully!", {
      autoClose: 2000,
    });

 // Fetch existing group members
 const { data: existingMembers = [] } = useQuery(
    ["groupMembers", groupId],
    () => api.get(`/groups/${groupId}/members`).then((res) => res.data),
    {
      enabled: !!groupId
    }
  );


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
  const { data: searchFriends = [] } = useQuery(
    ["searchFriends", debouncedSearchTerm],
    () => api.get(`/users/?search=${debouncedSearchTerm}&limit=10`).then((res) => res.data.users),
    {
      enabled: debouncedSearchTerm.length > 0,
    }
  );

  const addGroupMembersMutation = useMutation(
    (memberData) => api.post(`/groups/${groupId}/members`, memberData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["groupMembers", groupId]);
        queryClient.invalidateQueries("groups");
        queryClient.invalidateQueries("group");
        notify();
        onClose();
      },
    }
  );

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleDeselectUser = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const filteredSearchResults = useMemo(() => {
    return searchFriends.filter(
      (userItem) =>
        user.id !== userItem.id && // Exclude current user
        !selectedUsers.some((selected) => selected.id === userItem.id) && // Exclude already selected users
        !existingMembers.some((member) => member.id === userItem.id) // Exclude existing group members
    );
  }, [searchFriends, selectedUsers, existingMembers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const memberIds = selectedUsers.map((user) => user.id);
    
    if (memberIds.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    addGroupMembersMutation.mutate({ memberIds });
  };

 

  const isSubmitDisabled = addGroupMembersMutation.isLoading || selectedUsers.length === 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Group Members</h2>
        <form onSubmit={handleSubmit}>
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
                {filteredSearchResults.map((user) => {
                  const isExistingMember = existingMembers.some(
                    (member) => member.id === user.id
                  );

                  return (
                    <div
                      key={user.id}
                      className={`search-result-item ${
                        isExistingMember ? "disabled" : ""
                      }`}
                      onClick={() => !isExistingMember && handleSelectUser(user)}
                    >
                      {user.name} ({user.email})
                      {isExistingMember && (
                        <span className="existing-member-tag">
                          Existing Member
                        </span>
                      )}
                    </div>
                  );
                })}
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
              {addGroupMembersMutation.isLoading ? "Adding..." : "Add Members"}
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

export default AddGroupMembersModal;