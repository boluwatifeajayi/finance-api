import React, { useState, useEffect } from 'react';
import { FaUser, FaArrowRight, FaMoneyBillAlt, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNavigation from '../../components/BottomNavigation';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo, createBudget, reset, getAllExpenses, getAllIncomes, getAllBudgets } from '../../features/user/userSlice';

function Budget() {
  const dispatch = useDispatch();
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState('');
  const [budgetTitle, setBudgetTitle] = useState('');
  const [limit, setLimit] = useState('');

  const handleAddIncome = () => {
    setShowAddIncomeModal(true);
  };

  const handleAddExpense = () => {
    setShowAddExpenseModal(true);
  };

  const { user, userDetails, budgets, incomes, expenses, isLoading, isError, isSuccess, message } = useSelector((state) => state.userauth);

  useEffect(() => {
    if (isError) {
      toast.error('We ran into a problem');
    }

    const fetchData = async () => {
      try {
        await dispatch(getUserInfo());
        await dispatch(getAllBudgets());
        await dispatch(getAllExpenses());
        await dispatch(getAllIncomes());
        await dispatch(getUserInfo());
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };

    fetchData();

    return () => {
      dispatch(reset());
    };
  }, []);

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    const budgetData = {
      budgetTitle: budgetTitle,
      budgetCategory: budgetCategory,
      limit: limit,
    };
    dispatch(createBudget(budgetData))
      .then(() => {
        setShowAddIncomeModal(false);
        toast.success('Budget created successfully');
        // window.location.reload(); // Not recommended, better to update state
        // You can dispatch an action here to update the budgets state
      })
      .catch(() => {
        toast.error('Failed to create budget');
      });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.expenseAmount, 0);

  const handleIncomeCancel = () => {
    setShowAddIncomeModal(false);
  };

  const handleExpenseCancel = () => {
    setShowAddExpenseModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-700 p-4 md:p-8">
      <h1 className="text-2xl text-white mb-2 mt-10">
        Hi, <span className="font-bold">{userDetails?.firstname}</span>
      </h1>
      <p className="text-white opacity-75 mb-8 text-xl">Over spend No More with Budgets</p>

      <div className="flex justify-end mb-8">
        <Link to="/account">
          <FaUser className="text-white  opacity-75 text-lg cursor-pointer" />
        </Link>
        
      </div>

      <div className="bg-blue-800 rounded-lg p-8">
        <div className="flex items-center justify-center">
          {/* <div className="rounded-full bg-white h-24 w-24 flex items-center justify-center">
            <img src={useri} alt="User" className="rounded-full h-20 w-20" />
          </div> */}
        </div>
        {/* <p className="text-lg text-white text-center mt-4">Your Total Savings is</p> */}
        <p className="text-3xl font-bold text-white text-center mt-2">₦{(userDetails?.monthlyBudget - totalExpenses)?.toLocaleString()} left</p>
        <p className=" text-white text-center mt-4 opacity-75">Out of ₦{userDetails?.monthlyBudget} budgeted for the Month</p>
        {/* <p className="text-sm text-white text-center mt-2">You are spending slightly higher this month than last month</p> */}
        <div className="flex justify-between items-center mt-4">
          <button className="bg-white w-full text-gray-900 px-4 py-2 rounded-full mr-2" onClick={handleAddIncome}>
            + Set Up New Budget
          </button>
        </div>
      </div>

      {/* Add Income Modal */}
      {showAddIncomeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg mx-10 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Create New Budget</h2>
            <form onSubmit={handleIncomeSubmit}>
              <input
                type="text"
                placeholder="Budget Title"
                value={budgetTitle}
                onChange={(e) => setBudgetTitle(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="text"
                placeholder="Category"
                value={budgetCategory}
                onChange={(e) => setBudgetCategory(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="number"
                placeholder="Amount"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-4 w-full"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
                  Submit
                </button>
                <button type="button" className="text-gray-500" onClick={handleIncomeCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className="text-md opacity-75 text-white mt-4">Budgets</p>

      {budgets?.map((budget) => (
        <div className="bg-blue-600 text-white rounded-lg mt-4 p-4 flex flex-col" key={budget._id}>
          <p className="text-md mb-2 font-bold">{budget.budgetTitle}</p>
          <p className="text-md mb-2">You Have Spent</p>
          <p className="text-xl mb-4">₦0 Out Of ₦{budget.limit}</p>
          <div className="relative h-2 bg-blue-900 rounded-full">
            <div className="absolute inset-0 bg-green-500 rounded-full" style={{ width: '0%', height: '100%' }}></div>
            <div className="flex items-center justify-center h-full"></div>
          </div>
          <p className="mt-4">You are doing great!</p>
        </div>
      ))}

      <p className="text-md opacity-75 text-white mt-4">Transactions</p>

      <div className="bg-blue-600 text-white rounded-lg mt-4 p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-white font-bold">Transaction</p>
          </div>
          <div>
            <p className="text-white font-bold">Amount</p>
          </div>
        </div>

        {/* Sort the expenses by date */}
        {[...expenses].sort((a, b) => new Date(a.expenseDate) - new Date(b.expenseDate)).map((expense) => (
          <div className="flex justify-between items-center mb-2" key={expense.id}>
            <div>
              <p>{expense.expenseTitle}</p>
              <p className="text-sm text-white opacity-75">{expense.expenseDate}</p>
            </div>
            <p className="text-red-500 font-bold">- ₦{expense.expenseAmount}</p>
          </div>
        ))}

        {/* Sort the incomes by date */}
        {[...incomes].sort((a, b) => new Date(a.incomeDate) - new Date(b.incomeDate)).map((income) => (
          <div className="flex justify-between items-center mb-2" key={income.id}>
            <div>
              <p>{income.incomeTitle}</p>
              <p className="text-sm text-white opacity-75">{income.incomeDate}</p>
            </div>
            <p className="text-green-500 font-bold">+ ₦{income.incomeAmount}</p>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
}

export default Budget;
