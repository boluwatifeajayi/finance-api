import { useState, useEffect } from 'react';
import { FaUser, FaArrowRight, FaMoneyBillAlt, FaSearch } from 'react-icons/fa';
import useri from '../../media/Group 20104.png';
import BottomNavigation from '../../components/BottomNavigation';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo, createIncome, createExpense, reset, getAllExpenses, getAllIncomes, createSavings, getAllSavings } from '../../features/user/userSlice';
import { allVisuals } from '../../features/visual/visualSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

function Insight() {
  const dispatch = useDispatch();
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [expenseReport, setExpenseReport] = useState(null);
  const [budgetReport, setBudgetReport] = useState(null);
  const [savingsReport, setSavingsReport] = useState(null);



  const handleAddIncome = () => {
    setShowAddIncomeModal(true);
  };

  const handleAddExpense = () => {
    setShowAddExpenseModal(true);
  };

  const { user, userDetails, budgets,savings, incomes, expenses, isLoading, isError, isSuccess, message } = useSelector((state) => state.userauth);

 

  const { visuals } = useSelector((state) => state.visual);

  useEffect(() => {
    if (isError) {
      toast.error('We ran into a problem');
    }

    const fetchData = async () => {
      try {
        await dispatch(getUserInfo());
        await dispatch(getAllExpenses());
        await dispatch(allVisuals());
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
    const savingsData = {
      name: name,
      amount: amount,
      targetDate: targetDate,
    };
    dispatch(createSavings(savingsData))
      .then(() => {
        setShowAddIncomeModal(false);
        toast.success('Saving created successfully');
        window.location.reload(); // Not recommended, better to update state
        // You can dispatch an action here to update the budgets state
      })
      .catch(() => {
        toast.error('Failed to create saving');
      });
  };

  
  const handleIncomeCancel = () => {
    setShowAddIncomeModal(false);
  };

  const handleExpenseCancel = () => {
    setShowAddExpenseModal(false);
  };

  useEffect(() => {
    // Function to fetch the expense report
    const fetchExpenseReport = async () => {
      try {
        const response = await axios.get('https://prime-app.cyclic.app/api/users/reports/expenses', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setExpenseReport(response.data);
      } catch (error) {
        console.error('Error fetching expense report:', error);
      }
    };

    // Function to fetch the budget report
    const fetchBudgetReport = async () => {
      try {
        const response = await axios.get('https://prime-app.cyclic.app/api/users/reports/budgets', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setBudgetReport(response.data);
      } catch (error) {
        console.error('Error fetching budget report:', error);
      }
    };

    // Function to fetch the savings report
    const fetchSavingsReport = async () => {
      try {
        const response = await axios.get('https://prime-app.cyclic.app/api/users/reports/savings', {
          headers: { Authorization: `Bearer ${user?.token}` }
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.expenseAmount, 0);
  const totalIncome = incomes.reduce((sum, income) => sum + income.incomeAmount, 0);




  return (
    <div className="flex flex-col min-h-screen bg-blue-700 pb-20 p-4 md:p-8">
      <h1 className="text-2xl text-white mb-2 mt-10">
        Hello <span className="font-bold">{userDetails?.firstname}</span>
      </h1>
      <p className="text-white opacity-75 mb-8 text-2xl">Savings</p>

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
  <p className="text-lg text-white text-center mt-4">See How Well You Have done With Your Finances</p>
  {/* <p className="text-3xl font-bold text-white text-center mt-2">₦{userDetails?.savingsBalance?.toLocaleString()}</p> */}
  
  {/* <div className="flex justify-between items-center mt-4">
    <button className="bg-yellow-500 w-full text-white px-4 py-2 rounded-full mr-2" >
      Add To Savings
    </button>
  </div> */}

  {/* Progress Bar */}
  
  <div className="flex justify-between items-center mt-4">
    <button className="bg-white w-full text-gray-900 px-4 py-2 rounded-full mr-2" onClick={handleAddIncome}>
        View Your Insights
    </button>
  </div>

  {/* Conditional Text */}
  {userDetails?.savingsBalance >= userDetails?.desiredMonthlySavings ? (
    <p className="text-md text-white text-center mt-4">“Financial freedom is infact freedom from fear”</p>
  ) : userDetails?.savingsBalance >= userDetails?.desiredMonthlySavings * 0.75 ? (
    <p className="text-md text-white text-center mt-4">“Financial freedom is infact freedom from fear”</p>
  ) : userDetails?.savingsBalance >= userDetails?.desiredMonthlySavings * 0.5 ? (
    <p className="text-md text-white text-center mt-4">“Financial freedom is infact freedom from fear”</p>
  ) : userDetails?.savingsBalance >= userDetails?.desiredMonthlySavings * 0.25 ? (
    <p className="text-md text-white text-center mt-4">“Financial freedom is infact freedom from fear”</p>
  ) : null}
</div>


      {/* Add Income Modal */}
      {showAddIncomeModal && (
        <div className="fixed inset-0 flex index items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg mx-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Your Insights For The Month </h2>

            <p className='font-semibold'>Total Income: {userDetails?.monthlyIncome}</p>
            <p className='font-semibold'>Total Expenses: {totalExpenses}</p>
            <p className='font-semibold'>Total Budget Limits: {budgetReport?.totalLimits}</p>
            <p className='mb-4 font-semibold'>Total Savings Amount: {savingsReport.totalSavings}</p>


            <hr/>

            <p className='text-yellow-500 mt-4 font-semibold'>Spent More On Feeding this month</p>
            <p className='text-green-500 font-semibold'>You Saved 2% more this month</p>
            <p className='text-blue-500 font-semibold'>You Kept Under Your Budget This month</p>

                <button type="button" className="text-white py-1 px-3 mt-4 bg-blue-500 rounded " onClick={handleIncomeCancel}>
                  Close
                </button>
          </div>
        </div>
      )}

     

      <p className="text-md opacity-75 text-white mt-4 mb-4">Latest Articles</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Render the savings section cards dynamically */}
            {visuals.map((visual) => (
            <Link to={`/article/${visual._id}`}>
                <div key={visual.id} className="bg-blue-600 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{visual.title}</p>
                  <p className="text-white opacity-75">By Pr!me</p>
                </div>
                {/* <div>
                  <p className="text-white opacity-75">{visual.createdAt}</p>
                </div> */}
              </div>
            </Link>
              
            ))}
          </div>

      <BottomNavigation/>
    </div>
  );
}

export default Insight;
