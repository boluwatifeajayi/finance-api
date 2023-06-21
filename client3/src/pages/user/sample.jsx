import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportsComponent = () => {
  const [expenseReport, setExpenseReport] = useState(null);
  const [budgetReport, setBudgetReport] = useState(null);
  const [savingsReport, setSavingsReport] = useState(null);

  useEffect(() => {
    // Function to fetch the expense report
    const fetchExpenseReport = async () => {
      try {
        const response = await axios.get('/users/reports/expenses', {
          headers: { Authorization: `Bearer ${yourJwtToken}` }
        });
        setExpenseReport(response.data);
      } catch (error) {
        console.error('Error fetching expense report:', error);
      }
    };

    // Function to fetch the budget report
    const fetchBudgetReport = async () => {
      try {
        const response = await axios.get('/users/reports/budgets', {
          headers: { Authorization: `Bearer ${yourJwtToken}` }
        });
        setBudgetReport(response.data);
      } catch (error) {
        console.error('Error fetching budget report:', error);
      }
    };

    // Function to fetch the savings report
    const fetchSavingsReport = async () => {
      try {
        const response = await axios.get('/users/reports/savings', {
          headers: { Authorization: `Bearer ${yourJwtToken}` }
        });
        setSavingsReport(response.data);
      } catch (error) {
        console.error('Error fetching savings report:', error);
      }
    };

    fetchExpenseReport();
    fetchBudgetReport();
    fetchSavingsReport();
  }, []);

  return (
    <div>
      <h2>Expense Report</h2>
      {expenseReport && (
        <div>
          <p>Total Expenses: {expenseReport.totalExpenses}</p>
          {/* Display other relevant fields */}
        </div>
      )}

      <h2>Budget Report</h2>
      {budgetReport && (
        <div>
          <p>Total Budget Limits: {budgetReport.totalBudgetLimits}</p>
          {/* Display other relevant fields */}
        </div>
      )}

      <h2>Savings Report</h2>
      {savingsReport && (
        <div>
          <p>Total Savings Amount: {savingsReport.totalSavingsAmount}</p>
          {/* Display other relevant fields */}
        </div>
      )}
    </div>
  );
};

export default ReportsComponent;
