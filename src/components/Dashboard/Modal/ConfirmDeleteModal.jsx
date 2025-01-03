import React from 'react';
import './ConfirmDeleteModal.css'

const ConfirmDeleteModal = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message || 'Are you sure you want to delete?'}</p>
        <div className="confirm-delete-actions">
          <button className="submit-button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;