import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
// import ExpenseChart from './ExpenseChart';
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../../../utils/api";
import AddExpenseModal from "../Modal/AddExpenseGroupModal";
import ConfirmDeleteModal from "../Modal/ConfirmDeleteModal";

import "./GroupCard.css";

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const [showChart, setShowChart] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const notify = () =>
    toast.success(`Group ${group.name}  deleted successfully!`, {
      autoClose: 2000,
    });

  const notifyDelete = () =>
    toast.error(`You are not authorised to delete this group.`);

  const deleteGroup = async (id) => {
    try {
      await api.delete(`/groups/${id}`);
      notify();
    } catch (error) {
      notifyDelete(error.response.data.message);
    }
  };

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries("groups");
    },
  });

  const handleConfirmDelete = async () => {
    await deleteGroupMutation.mutate(group.id);
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="group-card">

      <div className="group-card-heading">
      <h3>{group.name}</h3>
      </div>
      
      <div className="group-info">
        <div>
          <FaUsers /> {group.memberCount} members
        </div>
        <div>
          <FaMoneyBillWave /> Total: ₹{group.totalExpense}
        </div>
      </div>
      <div className="group-actions">
        <button
          className="view-details"
          onClick={() => navigate(`/groups/${group.id}`)}
        >
          View Details
        </button>
        <button
          className="add-expense"
          onClick={() => setShowExpenseModal(true)}
        >
          Add Expense
        </button>
        {/* <button 
          className="toggle-chart"
          onClick={() => setShowChart(!showChart)}
        >
          {showChart ? 'Hide Chart' : 'Show Chart'}
        </button> */}
      </div>
      {/* {showChart && <ExpenseChart groupId={group.id} />} */}
      <div>
        <button
          className="delete-card-icon"
          onClick={() => setShowDeleteConfirmation(true)}
        >
          <FaTrash />
        </button>
      </div>

      {showExpenseModal && (
        <AddExpenseModal
          groupId={group.id}
          onClose={() => setShowExpenseModal(false)}
        />
      )}

      {showDeleteConfirmation && (
        <div className="confirm-delete-container">
          <ConfirmDeleteModal
            message={`Are you sure you want to delete the group "${group.name}"?`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </div>
      )}
    </div>
  );
};

export default GroupCard;
