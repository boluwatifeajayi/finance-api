import { useState, useEffect } from 'react';
import { FaUser, FaArrowRight, FaMoneyBillAlt, FaSearch } from 'react-icons/fa';
import useri from '../../media/Group 20104.png';
import BottomNavigation from '../../components/BottomNavigation';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo, createIncome, createExpense, reset, getAllExpenses, getAllIncomes, createSavings, getAllSavings } from '../../features/user/userSlice';
import { toast } from 'react-toastify';


function Savings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');


  const handleAddIncome = () => {
    setShowAddIncomeModal(true);
  };

  const handleAddExpense = () => {
    setShowAddExpenseModal(true);
  };

  const { user, userDetails, budgets,savings, incomes, expenses, isLoading, isError, isSuccess, message } = useSelector((state) => state.userauth);

  useEffect(() => {
    if (isError) {
      console.log('We ran into a problem');
    }

    const fetchData = async () => {
      try {
        await dispatch(getUserInfo());
        await dispatch(getAllSavings());
        await dispatch(getUserInfo());
      } catch (error) {
        console.log('Failed to fetch data');
      }
    };

    fetchData();

    return () => {
      dispatch(reset());
    };
  }, []);

  console.log(savings)

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
        navigate("/login") // Not recommended, better to update state
        // You can dispatch an action here to update the budgets state
      })
      .catch(() => {
        console.log('Failed to create saving');
      });
  };

 

  const handleIncomeCancel = () => {
    setShowAddIncomeModal(false);
  };

  const handleExpenseCancel = () => {
    setShowAddExpenseModal(false);
  };



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
  <p className="text-sm text-white text-center mt-4">You have Saved</p>
  <p className="text-3xl font-bold text-white text-center mt-2">₦{userDetails?.savingsBalance?.toLocaleString()}</p>
  <p className="text-md text-white opacity-75 text-center mt-2">
    of ₦{userDetails?.desiredMonthlySavings} for the month
  </p>
  {/* <div className="flex justify-between items-center mt-4">
    <button className="bg-yellow-500 w-full text-white px-4 py-2 rounded-full mr-2" >
      Add To Savings
    </button>
  </div> */}

  {/* Progress Bar */}
  <div className="bg-gray-300 h-2 rounded-lg mt-4">
    <div
      className="bg-green-500 h-full rounded-lg"
      style={{
        width: `${
          userDetails?.savingsBalance >= userDetails?.desiredMonthlySavings
            ? "100%"
            : `${(userDetails?.savingsBalance / userDetails?.desiredMonthlySavings) * 100}%`
        }`,
      }}
    ></div>
  </div>

  {/* Conditional Text */}
  {userDetails?.savingsBalance >= userDetails?.desiredMonthlySavings ? (
    <p className="text-md text-white text-center mt-4">Congratulations! You reached your savings goal.</p>
  ) : userDetails?.savingsBalance >= userDetails?.desiredMonthlySavings * 0.75 ? (
    <p className="text-md text-white text-center mt-4">Almost there! Keep going.</p>
  ) : userDetails?.savingsBalance >= userDetails?.desiredMonthlySavings * 0.5 ? (
    <p className="text-md text-white text-center mt-4">Halfway there. Keep up the good work.</p>
  ) : userDetails?.savingsBalance >= userDetails?.desiredMonthlySavings * 0.25 ? (
    <p className="text-md text-white text-center mt-4">Just getting started. Keep saving.</p>
  ) : null}
</div>


      {/* Add Income Modal */}
      {showAddIncomeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg mx-10 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Create new Saving </h2>
            <form onSubmit={handleIncomeSubmit}>
              <input
                type="text"
                placeholder="Name of Saving"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-100 px-4 py-2 rounded-lg mb-2 w-full"
              />
              <input
                type="date"
                placeholder="Target Date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
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

     
      <div className="bg-blue-800 rounded-lg mt-8 p-4 flex items-center" onClick={handleAddIncome}>
        <FaMoneyBillAlt className="text-blue-500 text-2xl" />
        <p className="text-md ml-4 text-white">
          Add To Savings
          <br />
          {/* <span className="text-white text-md opacity-75">Get points for sorting your transactions</span> */}
        </p>
        <div className="bg-blue-600 rounded-full p-2 ml-auto">
          <FaArrowRight className="text-white" />
        </div>
      </div>

      <p className="text-md opacity-75 text-white mt-4 mb-4">Savings History</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Render the savings section cards dynamically */}
            {savings.map((saving) => (
              <div key={saving.id} className="bg-blue-600 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{saving.name}</p>
                  <p className="text-green-500 font-bold">N{saving.amount}</p>
                </div>
                <div>
                  <p className="text-white opacity-75">{saving.targetDate}</p>
                </div>
              </div>
            ))}
          </div>

      {/* <p className="text-md opacity-75 text-white mt-4">Savings History</p> */}

      {/* <div className="bg-blue-600 text-white rounded-lg mt-4 p-4">
        <div className="flex justify-between items-center mb-2">
        </div>
        <div className="flex justify-between items-center mb-2">
          <div>
            <p>Project</p>
            <p className="text-sm text-white opacity-75">June 16, 2023 10:30 AM</p>
          </div>
          <p className="text-red-500">- ₦50</p>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div>
            <p>Divine Negedege</p>
            <p className="text-sm text-white opacity-75">June 15, 2023 2:45 PM</p>
          </div>
          <p className="text-green-500">+ ₦30</p>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div>
            <p>Food </p>
            <p className="text-sm text-white opacity-75">June 14, 2023 8:20 AM</p>
          </div>
          <p className="text-red-500">- ₦10</p>
        </div>
      </div> */}
      <BottomNavigation/>
    </div>
  );
}

export default Savings;
