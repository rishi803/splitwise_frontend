import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import './AddExpenseModal.css';

const AddExpenseGroupModal = ({ groupId = null, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(groupId);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const queryClient = useQueryClient();

  const { data: groups } = useQuery(
    'userGroups',
    () => api.get('/groups'),
    { enabled: !groupId }
  );

  const { data: groupMembers } = useQuery(
    ['groupMembers', selectedGroup],
    () => api.get(`/groups/${selectedGroup}/members`),
    { enabled: !!selectedGroup }
  );

  useEffect(() => {
    if (groupId) {
      setSelectedGroup(groupId);
    }
  }, [groupId]);

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

  const handleMemberSelection = (memberId) => {
    if (memberId === 'all') {
      setSelectedMembers(groupMembers?.data.map(m => m.id) || []);
    } else {
      setSelectedMembers(prev => {
        if (prev.includes(memberId)) {
          return prev.filter(id => id !== memberId);
        }
        // console.log([...prev, memberId])
        return [...prev, memberId];
      
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!amount || !description || !selectedGroup || !selectedMembers.length) return 'Please fill all the details';

    addExpenseMutation.mutate({
      groupId: selectedGroup,
      amount: parseFloat(amount),
      description,
      paidBy: user.id,
      splitType: 'EQUAL',
      splitWith: selectedMembers
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Expense</h2>
        <form onSubmit={handleSubmit}>
          {!groupId && (
            <div className="form-group">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select Group</option>
                {groups?.data.groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              required
              min="0"
              step="10"
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

          {selectedGroup && (
            <div className="form-group">
              <label>Split with:</label>
              <div className="member-list">
                <label className="member-item">
                  <input
                    type="checkbox"
                    checked={selectedMembers.length === groupMembers?.data.length}
                    onChange={() => handleMemberSelection('all')}
                  />
                  All Members
                </label>
                {groupMembers?.data.map(member => (
                  <label key={member.id} className="member-item">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleMemberSelection(member.id)}
                      disabled={selectedMembers.length === groupMembers.data.length}
                    />
                    {member.name}
                  </label>
                ))}
              </div>
            </div>
          )}

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

export default AddExpenseGroupModal;