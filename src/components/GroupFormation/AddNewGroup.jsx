import React, { useState, useEffect } from "react";
import "./AddNewGroup.css";
import { FaTrashAlt } from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux';
import {addGroup} from '../../features/groupSlice';

const mockUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    profileImage: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    profileImage: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    profileImage: "https://picsum.photos/200/300",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    profileImage: "https://picsum.photos/200/300",
  },
  {
    id: 5,
    name: "Eva Martinez",
    email: "eva@example.com",
    profileImage: "https://picsum.photos/200/300",
  },
  {
    id: 1,
    name: "Julic Doe",
    email: "doe@example.com",
    profileImage: "https://picsum.photos/200/300",
  },
];

const AddNewGroup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const dispatch= useDispatch();
  const currentUser= useSelector(state => state.auth.user);

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const filteredUsers = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) &&
        !selectedUsers.find((selected) => selected.id === user.id)
    );
    setSuggestions(searchText ? filteredUsers : []);
  }, [searchText, selectedUsers]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchText("");
    setSuggestions([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
     const newGroup= {
      name: groupName,
      members:[
         
        // include current user as a member of group
        {
          id: currentUser.id,
          name:currentUser.name,
          email:currentUser.email,
          profileImage:'https://picsum.photos/200/300',
        },
        ...selectedUsers
      ],
      createdBy: currentUser.id,
      image:`https://ui-avatars.com/api/?name=${encodeURIComponent(groupName)}&background=random`
     }

     dispatch(addGroup(newGroup));
     onClose();
     resetForm();
    }
  };

  const resetForm = () => {
    setGroupName("");
    setSelectedUsers([]);
    setSearchText("");
    setSuggestions([]);
  };

  return (
    <div className="group-dialog-main-container">
      <div className="group-dialog-overlay"></div>
      <div className="group-dialog-container">
        <button className="group-dialog-close" onClick={onClose}>
          ✕
        </button>
        <div className="group-dialog-header">
          <h2 className="group-dialog-title">Create New Group</h2>
        </div>

        <div>
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="group-dialog-input"
          />
        </div>

        <div className="group-dialog-suggestions">
          <input
            type="text"
            placeholder="Search users to add"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="group-dialog-input"
          />
          {suggestions.length > 0 && (
            <div className="group-dialog-suggestions-list">
              {suggestions.map((user) => (
                <div
                  key={user.id}
                  className="group-dialog-suggestion-item"
                  onClick={() => handleSelectUser(user)}
                >
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="group-dialog-user-image"
                  />
                  <div>
                    <div>{user.name}</div>
                    <div className="group-dialog-email">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedUsers.length > 0 && (
          <div className="group-dialog-selected-users">
            <h3 className="global-heading-h2">Selected Users</h3>

            <div className="group-dialog-selected-user-list">
              {selectedUsers.map((user) => (
                <div key={user.id} className="group-dialog-selected-user">
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="group-dialog-user-image"
                  />
                  <span>{user.name}</span>

                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="group-dialog-remove-user"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleCreateGroup}
          disabled={!groupName.trim() || selectedUsers.length === 0}
          className="group-dialog-button"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default AddNewGroup;
