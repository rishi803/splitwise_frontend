import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import api from "../../../utils/api";
import { showSuccessNotification } from "../../../utils/notifications";
import "./AddExpenseModal.css";

const AddExpenseGroupModal = ({ groupId = null, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentPage } = useSelector((state) => state.page);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(groupId);
  const [paidBy, setPaidBy] = useState(user.id);
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const { data: groups } = useQuery(
    ["groups", currentPage],
    () => api.get(`/groups?page=${currentPage}`),
    { enabled: !groupId }
  );

  const { data: groupMembers } = useQuery(
    ["groupMembers", selectedGroup],
    () => api.get(`/groups/${selectedGroup}/members`),
    { enabled: !!selectedGroup,
      select: (response) => {
        // If response doesn't have a data property, normalize it
        if (Array.isArray(response)) {
          return { 
            data: response, 
            total: response.length 
          };
        }
        return response;
      }
     }
    
  );

// console.log('gm ',groupMembers);

  useEffect(() => {
    if (groupId) {
      setSelectedGroup(groupId);
    }
  }, [groupId]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedGroup) {
      newErrors.selectedGroup = "Please select a group.";
    }
    if (!amount) {
      newErrors.amount = "Please enter an amount.";
    }
    if (!description) {
      newErrors.description = "Please enter a description.";
    }
    if (!paidBy) {
      newErrors.paidBy = "Please select who paid.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addExpenseMutation = useMutation(
    (expenseData) => api.post("/expenses", expenseData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("groupExpenses");
        queryClient.invalidateQueries("groups");
        queryClient.invalidateQueries("group");
        queryClient.invalidateQueries("expenseChart");
        onClose();
      },
    }
  );


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const memberIds = groupMembers?.data.map((member) => member.id) || [];

    addExpenseMutation.mutate({
      groupId: selectedGroup,
      amount: parseFloat(amount),
      description,
      paidBy,
      splitType: "EQUAL",
      splitWith: memberIds,
    });

    showSuccessNotification('Expense added Successfully !')
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Expense</h2>
        <form onSubmit={handleSubmit}>
          {!groupId && (
            <div className="form-group select-border">
              <select
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setErrors((prev) => ({ ...prev, selectedGroup: "" }));
                }}
                className={`form-input ${
                  errors.selectedGroup ? "input-error" : ""
                }`}
                
              >
                <option value="">Select Group</option>
                {groups?.data.groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {errors.selectedGroup && (
            <div className="form-group-error">
              <span className="error-message-text">{errors.selectedGroup}</span>
            </div>
          )}

          <div className="form-group">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors((prev) => ({ ...prev, amount: "" }));
              }}
              className={`form-input ${errors.amount ? "input-error" : ""}`}
              min="0"
              step="0.01"
            />
          </div>

          {errors.amount && (
            <div className="form-group-error">
              <span className="error-message-text">{errors.amount}</span>
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
              className={`form-input ${
                errors.description ? "input-error" : ""
              }`}
            />
          </div>

          {errors.description && (
            <div className="form-group-error">
              <span className="error-message-text">{errors.description}</span>
            </div>
          )}

          {selectedGroup && (
            <div className="paid-by-container">
              <label>Paid By :</label>
              <div className="select-border">
              <select
                value={paidBy}
                onChange={(e) => {
                  setPaidBy(e.target.value);
                  setErrors((prev) => ({ ...prev, paidBy: "" }));
                }}
                className={`form-input ${errors.paidBy ? "input-error" : ""}`}
                required
              >
                {groupMembers?.data.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              </div>
            
            </div>
          )}

          {errors.paidBy && (
            <div className="form-group-error">
              <span className="error-message-text">{errors.paidBy}</span>
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
