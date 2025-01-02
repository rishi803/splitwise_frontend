import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useState } from "react";
import { FaPlus, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../utils/api";
import AddExpenseModal from "../components/Dashboard/AddExpenseGroupModal";
import "./GroupDetails.css";

export const GroupDetails = () => {
  const { id } = useParams();
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const { data: group, isLoading: groupLoading } = useQuery(["group", id], () =>
    api.get(`/groups/${id}`)
  );

  const { data: expenses, isLoading: expensesLoading } = useQuery(
    ["groupExpenses", id],
    () => api.get(`/groups/${id}/expenses`)
  );

  const { data: chartData, isLoading: chartLoading } = useQuery(
    ["expenseChart", id],
    () => api.get(`/groups/${id}/expenses/chart`)
  );

  if (groupLoading || expensesLoading || chartLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="group-details">
      <header className="group-header">
        <h1>{group?.data.name}</h1>
        <div className="group-stats">
          <div className="stat">
            <FaUsers size={20} />
            <span>{group?.data.memberCount} members</span>
          </div>
          <div className="stat">
            <FaMoneyBillWave size={20} />
            <span>₹{group?.data.totalExpense}</span>
          </div>
        </div>
      </header>

      <div className="member-balances">
        <h2>Member Balances</h2>
        <div className="balance-list">
          {group?.data.memberBalances.map((member) => (
            <div key={member.id} className="balance-item">
              <span className="member-name">{member.username}</span>
              <span
                className={`balance-amount ${
                  member.balance >= 0 ? "positive" : "negative"
                }`}
              >
                {member.balance >= 0 ? "gets back" : "owes"} ₹
                {Math.abs(member.balance).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="expense-chart">
        <h2>Expense History</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData?.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#6366f1" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="expense-list">
        <div className="expense-header">
          <h2>Recent Expenses</h2>
          <button
            className="add-expense-button"
            onClick={() => setShowExpenseModal(true)}
          >
            <FaPlus /> <span>Add Expense</span>
          </button>
        </div>
        {expenses?.data.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-info">
              <span className="expense-description">{expense.description}</span>
              <span className="expense-amount">₹{expense.amount}</span>
            </div>
            <div className="expense-meta">
              <span>Paid by {expense.paid_by_name}</span>
              <span>{new Date(expense.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {showExpenseModal && (
        <AddExpenseModal
          groupId={id}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  );
};

export default GroupDetails;
