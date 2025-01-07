import { data, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaPlus,
  FaTimes,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
import api from "../utils/api";
import AddExpenseModal from "../components/Dashboard/Modal/AddExpenseGroupModal";
import SidebarToggle from "../components/common/SideToggleGroup";

import "./GroupDetails.css";
import ExpenseChart from "../components/Dashboard/ExpenseChart";

export const GroupDetails = () => {
  const { id } = useParams();

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 767);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 767;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: group, isLoading: groupLoading } = useQuery(["group", id], () =>
    api.get(`/groups/${id}`)
  );

  const { data: expenses, isLoading: expensesLoading } = useQuery(
    ["groupExpenses", id],
    () => api.get(`/groups/${id}/expenses`)
  );

  // const { data: chartData, isLoading: chartLoading } = useQuery(
  //   ["expenseChart", id],
  //   () => api.get(`/groups/${id}/expenses/chart`)
  // );

  if (groupLoading || expensesLoading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="page-container">
      <button
        className={`menu-toggle ${sidebarOpen ? "menu-open" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <SidebarToggle
        isOpen={sidebarOpen}
        isMobile={isMobile}
        groupId={group?.data.id}
        groupName={group?.data.name}
      />

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        <header className="page-header">
          <h1>{group?.data.name}</h1>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>Total Members</h3>
              <p>{group?.data.memberCount}</p>
              {/* {2.5 && (
                    <span
                      className={`trend ${trend > 0 ? "positive" : "negative"}`}
                    >
                      {trend > 0 ? "+" : ""}
                      {trend}%
                    </span>
                  )} */}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaMoneyBillWave />
            </div>
            <div className="stat-content">
              <h3>Total Expenses</h3>
              <p>{group?.data.totalExpense}</p>
              {/* {-1.2 && (
                    <span
                      className={`trend ${trend > 0 ? "positive" : "negative"}`}
                    >
                      {trend > 0 ? "+" : ""}
                      {trend}%
                    </span>
                  )} */}
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Member Balances */}
          <section className="balance-section glass-panel">
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
                    {member.balance >= 0 ? "+" : "-"}₹
                    {Math.abs(member.balance).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Expense Chart */}
          {/* <section className="chart-section glass-panel"> */}
          {/* <h2>Expense Trends</h2> */}
          <ExpenseChart groupId={id} />
          {/* </section> */}

          {/* Recent Expenses */}
          <section className="expenses-section glass-panel">
            <h2>Recent Expenses</h2>
            <div className="expense-list">
              {expenses?.data.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <h3>{expense.description}</h3>
                    <p>Paid by {expense.paid_by_name}</p>
                  </div>
                  <div className="expense-meta">
                    <span className="amount">
                      ₹{expense.amount.toLocaleString()}
                    </span>
                    <span className="date">
                      {new Date(expense.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <button
        className="add-expense-button"
        onClick={() => setShowExpenseModal(true)}
      >
        <FaPlus /> <span>Add Expense</span>
      </button>

      {showExpenseModal && (
        <AddExpenseModal
          groupId={group?.data.id}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  );
};

export default GroupDetails;
