import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaUserPlus, FaPlus } from "react-icons/fa";
import NewGroupDialog from '../GroupFormation/AddNewGroup';

import './Dashboard.css'
const Dashboard = () => {

  const [isOpen, setIsOpen] = useState(false); 
  
  // getting group data from redux store

  const groups= useSelector(state => state.groups.groups);
  const currentUser= useSelector(state => state.auth.user);

  const handleClose= ()=>{
    setIsOpen(false);
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button 
          className="dashboard-button-outline"
          onClick={() => {setIsOpen(true)}}
        >
          <FaUserPlus className="dashboard-icon" />
          New Group
        </button>
      </div>

      <div>
        <h2 className="dashboard-subtitle">Welcome {currentUser.username}</h2>
      </div>

      <div className="dashboard-grid">
        {groups.map(group => (
          <div key={group.id} className="dashboard-card">
            <div className="dashboard-card-header">
              <img 
                src={group.image} 
                alt={group.name}
                className="dashboard-card-image"
              />
              <h2 className="dashboard-card-title">{group.name}</h2>
            </div>
            <div className="dashboard-card-content">
              <p className="dashboard-card-text">
                {group.members.length} members
              </p>
              <p className="dashboard-card-expenses">
                Total Expenses: ${group.totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <NewGroupDialog isOpen={isOpen} onClose={handleClose}/>

      <button 
        className="dashboard-add-expense-button"
        onClick={() => {/* Handle new expense */}}
      >
        <FaPlus className="dashboard-icon" /> Add Expense
      </button>
    </div>
  );
};

export default Dashboard;


