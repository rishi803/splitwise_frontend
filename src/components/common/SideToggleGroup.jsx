import React, { useState } from "react";
import { FaPlus, FaUsers, FaUserMinus, FaTrash } from "react-icons/fa";

import AddGroupMembersModal from "../Dashboard/Modal/AddGroupMembersModal";

import RemoveGroupMembersModal from "../Dashboard/Modal/RemoveGroupMembersModal";

import ConfirmDeleteModal from "../Dashboard/Modal/ConfirmDeleteModal";

import useDeleteGroup from "../../hooks/useDeleteGroup";

import "./SideToggleGroup.css";
const SideToggleGroup = ({ isOpen, isMobile, groupId, groupName }) => {
  const deleteGroupMutation = useDeleteGroup();

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);

  const handleConfirmDelete = async () => {
    await deleteGroupMutation.mutate(groupId);
    setShowDeleteGroupModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteGroupModal(false);
  };

  return (
    <>
      <aside
        className={`sidebar ${isOpen ? "open" : ""} ${
          isMobile ? "mobile" : ""
        }`}
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="header-icon">
              <FaUsers />
            </div>
            <h2>Group Actions</h2>
          </div>

          <nav className="sidebar-nav">
            <button
              className="nav-button"
              onClick={() => setShowAddMemberModal(true)}
            >
              <FaPlus />
              <span>Add Member</span>
            </button>
            <button
              className="nav-button"
              onClick={() => setShowRemoveMemberModal(true)}
            >
              <FaUserMinus />
              <span>Remove Member</span>
            </button>
            <button
              className="nav-button danger"
              onClick={() => setShowDeleteGroupModal(true)}
            >
              <FaTrash />
              <span>Delete Group</span>
            </button>
          </nav>
        </div>
      </aside>
      {isMobile && isOpen && <div className="sidebar-overlay" />}

      {showAddMemberModal && (
        <AddGroupMembersModal
          onClose={() => setShowAddMemberModal(false)}
          groupId={groupId}
        />
      )}

      {showRemoveMemberModal && (
        <RemoveGroupMembersModal
          onClose={() => setShowRemoveMemberModal(false)}
          groupId={groupId}
        />
      )}

      {showDeleteGroupModal && (
        <div className="confirm-delete-container">
          <ConfirmDeleteModal
            message={`Are you sure you want to delete the group "${groupName}"?`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </div>
      )}
    </>
  );
};

export default SideToggleGroup;
