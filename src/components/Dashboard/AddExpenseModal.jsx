import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import './AddExpenseModal.css';

const AddExpenseModal = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const queryClient = useQueryClient();

  const { data: groups } = useQuery('userGroups', () => 
    api.get('/groups'),
  );

  const addExpenseMutation = useMutation(
    (expenseData) => api.post('/expenses', expenseData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['groupExpenses', selectedGroup]);
        queryClient.invalidateQueries('groups');
        onClose();
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description || !selectedGroup) return 'Please fill all fields';

    addExpenseMutation.mutate({
      groupId: selectedGroup,
      amount: parseFloat(amount),
      description,
      paidBy: user.id,
      splitType: 'EQUAL'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {console.log(groups)}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select Group</option>
              {groups?.data?.groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="submit-button">
              Add Expense
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

export default AddExpenseModal;