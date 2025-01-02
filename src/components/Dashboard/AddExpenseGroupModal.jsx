import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import "./AddExpenseModal.css";

const AddExpenseGroupModal = ({ groupId = null, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentPage } = useSelector((state) => state.page);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(groupId);
  const [paidBy, setPaidBy] = useState(user.id);
  const [selectedMembers, setSelectedMembers] = useState([]);
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
    { enabled: !!selectedGroup }
  );

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
        queryClient.invalidateQueries(["groupExpenses", selectedGroup]);
        queryClient.invalidateQueries("groups");
        onClose();
      },
    }
  );

  const handleMemberSelection = (memberId) => {
    if (memberId === "all") {
      setSelectedMembers(groupMembers?.data.map((m) => m.id) || []);
    } else {
      setSelectedMembers((prev) => {
        if (prev.includes(memberId)) {
          return prev.filter((id) => id !== memberId);
        }
        return [...prev, memberId];
      });
    }
  };

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
              step="10"
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
              <select
                value={paidBy}
                onChange={(e) => {
                  setPaidBy(e.target.value);
                  setErrors((prev) => ({ ...prev, paidBy: "" }));
                }}
                className={`form-input ${
                  errors.paidBy ? "input-error" : ""
                }`}
                required
              >
                {groupMembers?.data.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
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
