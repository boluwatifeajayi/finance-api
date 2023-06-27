import React, { useState, useEffect } from 'react';
import { FaUser, FaArrowRight, FaMoneyBillAlt, FaSearch, FaBell } from 'react-icons/fa';
import useri from '../../media/Group 20104.png';
import BottomNavigation from '../../components/BottomNavigation';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo, createIncome, createExpense, reset, getAllExpenses, getAllIncomes, getAllBillReminders, savingsInclined, feedingInclined, } from '../../features/user/userSlice';
import AddBillModal from '../../components/AddBillModal';
import BillRemindersModal from '../../components/BillRemindersModal';
import { toast } from 'react-toastify';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [incomeTitle, setIncomeTitle] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('hhh');
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('jjj');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [unpaidBillsCount, setUnpaidBillsCount] = useState(0);

  const handleAddIncome = () => {
    setShowAddIncomeModal(true);
  };

  const handleAddExpense = () => {
    setShowAddExpenseModal(true);
  };

  const { user, userDetails, incomes, expenses, billReminders, isLoading, isError, isSuccess, message } = useSelector((state) => state.userauth);

  useEffect(() => {
    if (isError) {
      console.log("we ran into a problem");
    }

    if(!user){
      navigate('/login')
    }

    dispatch(getUserInfo());
    dispatch(getAllExpenses());
    dispatch(getAllIncomes());
    dispatch(getAllBillReminders());
    dispatch(getUserInfo());


    return () => {
      dispatch(reset());
    };
  }, []);

  

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
        dispatch(savingsInclined())

        setIncomeTitle('');
        setIncomeCategory('');
        setIncomeAmount('');
        toast.success('Income created successfully');
        navigate("/login")
        const newBill = {
          id: Date.now(),
          name: expenseTitle,
          dueDate: new Date().toISOString(),
          isPaid: false,
        };
        setBills([...bills, newBill]);
      })
      .catch(() => {
        console.log('Failed to create income');
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
        navigate("/login")
        const newBill = {
          id: Date.now(),
          name: expenseTitle,
          dueDate: new Date().toISOString(),
          isPaid: false,
        };
        setBills([...bills, newBill]);
      })
      .catch(() => {
        console.log('Failed to create expense');
      });
  };

  function getProgressColor(totalExpenses, monthlyBudget) {
    const progress = (totalExpenses / monthlyBudget) * 100;
  
    if (progress < 50) {
      return 'bg-green-500';
    } else if (progress >= 50 && progress < 70) {
      return 'bg-yellow-500';
    } else if (progress >= 70 && progress < 90) {
      return 'bg-orange-500';
    } else {
      return 'bg-red-500';
    }
  }
  
  function getProgressMessage(totalExpenses, monthlyBudget) {
    const progress = (totalExpenses / monthlyBudget) * 100;
  
    if (progress < 50) {
      return 'Looking good, keep under the budget 😙';
    } else if (progress >= 50 && progress < 70) {
      return 'You don dey spend';
    } else if (progress >= 70 && progress < 90) {
      return 'You don dey spend too much, calm down';
    } else {
      return 'Sapa go soon catch you, calm down 😱';
    }
  }

  function formatExpenseDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' };
    const formattedDate = date.toLocaleString('en-US', options);
  
    // Get the day suffix (e.g., '1st', '2nd', '3rd')
    const day = date.getDate();
    const daySuffix = getDaySuffix(day);
  
    // Add the day suffix to the formatted date
    return formattedDate.replace(`${day}`, `${day}${daySuffix}`);
  }
  
  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
  
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  // Load bills from local storage on component mount
  useEffect(() => {
    const storedBills = JSON.parse(localStorage.getItem('bills')) || [];
    setBills(storedBills);
  }, []);

  // Save bills to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  // Calculate the number of unpaid bills
  useEffect(() => {
    const unpaidCount = bills.filter((bill) => !bill.isPaid).length;
    setUnpaidBillsCount(unpaidCount);
  }, [bills]);

  const handleBellIconClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddBill = (billName, dueDate) => {
    const newBill = {
      id: Date.now(),
      name: billName,
      dueDate,
      isPaid: false,
    };
    setBills([...bills, newBill]);
  };
  

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.expenseAmount, 0);


  const handleIncomeCancel = () => {
    setShowAddIncomeModal(false);
  };

  const handleExpenseCancel = () => {
    setShowAddExpenseModal(false);
  };

  if(isLoading){
    return <div className="flex items-center justify-center h-screen bg-blue-700">
    <p className="text-white text-3xl font-bold">Loading PRIME...</p>
  </div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-700 p-4 pb-40 md:p-8">
      <h1 className="text-2xl text-white mb-2 mt-10">
        Hello <span className="font-bold">{userDetails?.firstname} 👋</span>
      </h1>
      <p className="text-white opacity-75 mb-8">Your finances are looking good</p>

      <div className="flex justify-end mb-8">
        <Link to="/account">
          <Link to="/account">
          <FaUser className="text-white  opacity-75 text-lg cursor-pointer" />
        </Link>
        </Link>
       
        <FaBell className="text-white opacity-75 text-lg ml-7 cursor-pointer" onClick={handleBellIconClick} />
          
          <span className="unpaid-bills-count pb-10 text-white text-xs rounded-full px-2 py-1">
            {billReminders.length}
          </span>
          
          {isModalOpen && (
            <>
              <BillRemindersModal closeModal={handleModalClose} />
              {/* <AddBillModal addBill={handleAddBill} closeModal={handleModalClose} />  */}
            </>
          )}
      </div>

      <div className="bg-blue-800 rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-white h-24 w-24 flex items-center justify-center">
            <img src={useri} alt="User" className="rounded-full h-20 w-20" />
          </div>
        </div>
        <p className="text-lg text-white text-center mt-4">Your available balance is</p>
        <p className="text-4xl font-bold text-white text-center mt-2">₦ {userDetails?.balance?.toLocaleString()}</p>

        <p className="text-sm text-white text-center mt-2">Just Getting Started 🚀</p>
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
                placeholder="Name "
                value={incomeTitle}
                onChange={(e) => setIncomeTitle(e.target.value)}
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
                placeholder="Name "
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
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
        <div className="bg-blue-600 rounded-full p-2 ml-auto">
          <FaArrowRight className="text-white" />
        </div>
      </div>

      <p className="text-md opacity-75 text-white mt-4">My Budgets</p>

  

{userDetails?.savingsFeeding != 0 && 
  <Link to='/budget'>
  <div className="bg-blue-600 text-white rounded-lg mt-4 p-4 flex flex-col">
    <p className="text-md mb-2">You have Spent</p>
    <p className="text-3xl font-bold mb-4">₦ {totalExpenses?.toLocaleString()}</p>
    <p className="text-sm mb-4 opacity-75">Of ₦{userDetails.savingsFeeding?.toLocaleString()} budgeted</p>
    <div className="relative h-2 bg-blue-900 rounded-full">
      <div className="absolute inset-0 rounded-full" style={{ width: '100%', height: '100%' }}>
        <div className={`absolute left-0 top-0 ${getProgressColor(totalExpenses, userDetails.savingsFeeding)} rounded-full`} style={{ width: `${Math.min((totalExpenses / userDetails.savingsFeeding) * 100, 100)}%`, height: '100%' }}></div>
      </div>
    </div>
    <p className="mt-4 text-md">{getProgressMessage(totalExpenses, userDetails.savingsFeeding)}</p>
  </div>
</Link>
}

{userDetails?.feedingBudget != 0 && 
  <Link to='/budget'>
  <div className="bg-blue-600 text-white rounded-lg mt-4 p-4 flex flex-col">
    <p className="text-md mb-2">You have Spent</p>
    <p className="text-3xl font-bold mb-4">₦ {totalExpenses?.toLocaleString()}</p>
    <p className="text-sm mb-4 opacity-75">Of ₦{userDetails.feedingBudget?.toLocaleString()} budgeted</p>
    <div className="relative h-2 bg-blue-900 rounded-full">
      <div className="absolute inset-0 rounded-full" style={{ width: '100%', height: '100%' }}>
        <div className={`absolute left-0 top-0 ${getProgressColor(totalExpenses, userDetails.feedingBudget)} rounded-full`} style={{ width: `${Math.min((totalExpenses / userDetails.feedingBudget) * 100, 100)}%`, height: '100%' }}></div>
      </div>
    </div>
    <p className="mt-4 text-md">{getProgressMessage(totalExpenses, userDetails.feedingBudget)}</p>
  </div>
  </Link>
}




      <p className="text-md opacity-75 text-white mt-4">My Savings</p>
      {userDetails?.savingFeeding != 0 && 
  <Link to='/savings'>
  <div className="bg-blue-600 text-white rounded-lg mt-4 p-4 flex flex-col">
    <p className="text-md mb-2">You have Saved</p>
    <p className="text-3xl font-bold mb-4">₦{userDetails.savingsBalance?.toLocaleString()}</p>
    <p className="text-sm mb-4 opacity-75">Of ₦{userDetails.savingsBudget?.toLocaleString()}</p>
    <div className="relative h-2 bg-blue-900 rounded-full">
      <div className="absolute inset-0 bg-green-500 rounded-full" style={{ width: `${(userDetails.savingsBalance / userDetails.savingsBudget) * 100}%`, height: '100%' }}></div>
    </div>
    <p className="mt-4 text-md">Things are looking good, keep it up 👍</p>
  </div>
</Link>

      }


{userDetails?.feedingSavings != 0 && 
  <Link to='/savings'>
  <div className="bg-blue-600 text-white rounded-lg mt-4 p-4 flex flex-col">
    <p className="text-md mb-2">You have Saved</p>
    <p className="text-3xl font-bold mb-4">₦{userDetails.savingsBalance?.toLocaleString()}</p>
    <p className="text-sm mb-4 opacity-75">Of ₦{userDetails.feedingSavings?.toLocaleString()}</p>
    <div className="relative h-2 bg-blue-900 rounded-full">
      <div className="absolute inset-0 bg-green-500 rounded-full" style={{ width: `${(userDetails.savingsBalance / userDetails.feedingSavings) * 100}%`, height: '100%' }}></div>
    </div>
    <p className="mt-4 text-md">Things are looking good, keep it up 👍</p>
  </div>
</Link>

      }


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
      <p className="text-sm text-white opacity-75">{formatExpenseDate(expense.expenseDate)}</p>
    </div>
    <p className="text-red-500 font-bold">- ₦{expense.expenseAmount}</p>
  </div>
))}

{/* Sort the incomes by date */}
{[...incomes].sort((a, b) => new Date(a.incomeDate) - new Date(b.incomeDate)).map((income) => (
  <div className="flex justify-between items-center mb-2" key={income.id}>
    <div>
      <p>{income.incomeTitle}</p>
      <p className="text-sm text-white opacity-75">{formatExpenseDate(income.incomeDate)}</p>
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
