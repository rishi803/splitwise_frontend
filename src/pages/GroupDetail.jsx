import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {useState} from 'react';
import api from '../utils/api';
import './GroupDetails.css';

 const GroupDetails = () => {
  const { id } = useParams();

  const { data: group, isLoading: groupLoading } = useQuery(
    ['group', id],
    () => api.get(`/groups/${id}`)
  );

  const { data: expenses, isLoading: expensesLoading } = useQuery(
    ['groupExpenses', id],
    () => api.get(`/groups/${id}/expenses`)
  );

 

  if (groupLoading || expensesLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="group-details">
      <h1>{group?.data.name}</h1>
      
      <div className="expense-summary">
        <div className="total-expense">
          Total Expenses: ${group?.data.totalExpense}
        </div>
        
      </div>

     

      <div className="expense-list">
        <h2>Recent Expenses</h2>
        {expenses?.data.map(expense => (
          <div key={expense.id} className="expense-item">
            <div className="expense-info">
              <span className="expense-description">{expense.description}</span>
              <span className="expense-amount">${expense.amount}</span>
            </div>
            <div className="expense-meta">
              <span>Paid by {expense.paid_by_name}</span>
              <span>{new Date(expense.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default GroupDetails;