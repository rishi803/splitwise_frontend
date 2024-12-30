import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import './Dashboard.css';

const GroupCard = ({ group }) => {
  const navigate = useNavigate();

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
      </div>
      
    </div>
  );
};

export default GroupCard