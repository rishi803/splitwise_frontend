import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
// import ExpenseChart from './ExpenseChart';
import {useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../utils/api';
import AddExpenseModal from "./AddExpenseGroupModal";
import "./GroupCard.css";

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  // const [showChart, setShowChart] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const queryClient = useQueryClient();

  const notify = () => toast.success(`Group ${group.name}  deleted successfully!`,{
    autoClose: 2000,
  });

  const deleteGroup= async(id)=>{
       try{
        await api.delete(`/groups/${id}`);
        notify();
       }
       catch(error){
           alert('Error deleting group');
       }
  }

  const deleteGroupMutation= useMutation({
    mutationFn: deleteGroup,
    onSuccess: ()=>{
      queryClient.invalidateQueries('groups');
    }
  })

  return (
    <div className="group-card">


      <h3>{group.name}</h3>
      <div className="group-info">
        <div>
          <FaUsers /> {group.memberCount} members
        </div>
        <div>
          <FaMoneyBillWave /> Total: ${group.totalExpense}
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
        <button className='delete-card-icon' onClick={
          ()=> deleteGroupMutation.mutate(group.id)
        } ><FaTrash /></button>
     
      </div>
      
      {showExpenseModal && (
        <AddExpenseModal
          groupId={group.id}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  );
};

export default GroupCard;
