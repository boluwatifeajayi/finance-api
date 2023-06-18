import React, { useState, useEffect } from 'react';
import { FaUser, FaArrowRight, FaMoneyBillAlt, FaSearch } from 'react-icons/fa';
import useri from '../../media/Group 20104.png';
import BottomNavigation from '../../components/BottomNavigation';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo, createIncome, createExpense, reset, getAllExpenses, getAllIncomes } from '../../features/user/userSlice';
import { toast } from 'react-toastify';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [incomeTitle, setIncomeTitle] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('');
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);

  const handleAddIncome = () => {
    setShowAddIncomeModal(true);
  };

  const handleAddExpense = () => {
    setShowAddExpenseModal(true);
  };

  const { user, userDetails, incomes, expenses, isLoading, isError, isSuccess, message } = useSelector((state) => state.userauth);

  useEffect(() => {
    if (isError) {
      toast.error("we ran into a problem");
    }

    dispatch(getUserInfo());
    dispatch(getAllExpenses());
    dispatch(getAllIncomes());

    return () => {
      dispatch(reset());
    };
  }, []);

  console.log(userDetails)

  const handleIncomeSubmit = (e) => {
    e.preventDefault();

    const incomeData = {
      incomeTitle: incomeTitle,
      incomeCategory: incomeCategory,
      incomeAmount: incomeAmount,
    };

    dispatch(createIncome(incomeData))
      .then(() => {
        setShowAddIncomeModal(false);
        setIncomeTitle('');
        setIncomeCategory('');
        setIncomeAmount('');
        toast.success('Income created successfully');
        window.location.reload();
      })
      .catch(() => {
        toast.error('Failed to create income');
      });
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();

    const expenseData = {
      expenseTitle: expenseTitle,
      expenseCategory: expenseCategory,
      expenseAmount: expenseAmount,
    };

    dispatch(createExpense(expenseData))
      .then(() => {

        setShowAddExpenseModal(false);
        setExpenseTitle('');
        setExpenseCategory('');
        setExpenseAmount('');
        toast.success('Expense created successfully');
        window.location.reload();
      })
      .catch(() => {
        toast.error('Failed to create expense');
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
    <div className="flex flex-col min-h-screen bg-blue-700 p-4 pb-40 md:p-8">
      <h1 className="text-2xl text-white mb-2 mt-10">
        Hello <span className="font-bold">{userDetails?.firstname} !</span>
      </h1>
      <p className="text-white opacity-75 mb-8">Your finances are looking good</p>

      <div className="flex justify-end mb-8">
        <FaUser className="text-white  opacity-75 text-lg cursor-pointer" />
        <FaSearch className="text-white  opacity-75 text-lg ml-7 cursor-pointer" />
      </div>

      <div className="bg-blue-800 rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-white h-24 w-24 flex items-center justify-center">
            <img src={useri} alt="User" className="rounded-full h-20 w-20" />
          </div>
        </div>
        <p className="text-lg text-white text-center mt-4">Your available balance is</p>
        <p className="text-4xl font-bold text-white text-center mt-2">₦ {userDetails?.balance?.toLocaleString()}</p>

        <p className="text-sm text-white text-center mt-2">You are spending slightly higher this month than last month</p>
        <div className="flex justify-between items-center mt-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2" onClick={handleAddIncome}>
            Add Income
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={handleAddExpense}>
            Add Expense
          </button>
        </div>
      </div>

      {/* Add Income Modal */}
      {showAddIncomeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg mx-10 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Add Income</h2>
            <form onSubmit={handleIncomeSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={incomeTitle}
                onChange={(e) => setIncomeTitle(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="text"
                placeholder="Category"
                value={incomeCategory}
                onChange={(e) => setIncomeCategory(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="number"
                placeholder="Amount"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-4 w-full"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
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

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg  mx-10 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
            <form onSubmit={handleExpenseSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="text"
                placeholder="Category"
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="number"
                placeholder="Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-4 w-full"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Submit
                </button>
                <button type="button" className="text-gray-500" onClick={handleExpenseCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-blue-800 rounded-lg mt-8 p-4 flex items-center">
        <FaMoneyBillAlt className="text-blue-500 text-2xl" />
        <p className="text-md ml-4 text-white">
          Sort your transactions
          <br />
          <span className="text-white text-md opacity-75">Get points for sorting your transactions</span>
        </p>
        <div className="bg-blue-500 rounded-full p-2 ml-auto">
          <FaArrowRight className="text-white" />
        </div>
      </div>

      <p className="text-md opacity-75 text-white mt-4">My Budgets</p>

      <div className="bg-blue-500 text-white rounded-lg mt-4 p-4 flex flex-col">
        <p className="text-md mb-2">You have Spent</p>
        <p className="text-3xl font-bold mb-4">{totalExpenses?.toLocaleString()}</p>
        <div className="relative h-2 bg-blue-900 rounded-full">
          <div className="absolute inset-0 bg-green-500 rounded-full" style={{ width: '60%', height: '100%' }}></div>
          <div className="flex items-center justify-center h-full"></div>
        </div>
        <p className="mt-4">😱 Sapa go soon catch you bros, calm down!!</p>
      </div>

      <p className="text-md opacity-75 text-white mt-4">Transactions</p>

      <div className="bg-blue-500 text-white rounded-lg mt-4 p-4">
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

export default Home;
