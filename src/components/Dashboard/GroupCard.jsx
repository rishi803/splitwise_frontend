import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaMoneyBillWave } from 'react-icons/fa';
// import ExpenseChart from './ExpenseChart';
import AddExpenseModal from './AddExpenseGroupModal';
import './GroupCard.css';

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  // const [showChart, setShowChart] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

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
      {showExpenseModal && (
        <AddExpenseModal 
          groupId={group.id} 
          onClose={() => setShowExpenseModal(false)} 
        />
      )}
    </div>
  );
};

export default GroupCard