import React, { useEffect, useState } from 'react';
import AddBillModal from './AddBillModal';
import { getAllBillReminders, reset } from '../features/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const BillRemindersModal = ({ closeModal }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bills, setBills] = useState([]);

  const { user, userDetails, incomes, expenses, isLoading, isError, isSuccess, message, billReminders } = useSelector((state) => state.userauth);

  useEffect(() => {
    if (isError) {
      console.log('We ran into a problem');
    }

    dispatch(getAllBillReminders());

    return () => {
      dispatch(reset());
    };
  }, []);

  const handleBellIconClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  function formatExpenseDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long' };
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
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  const handleAddBill = (billName, dueDate) => {
    const newBill = {
      id: Date.now(),
      name: billName,
      dueDate,
      isPaid: false,
    };
    const updatedBills = [...bills, newBill];
    localStorage.setItem('bills', JSON.stringify(updatedBills)); // Update local storage first
    setBills(updatedBills); // Then update the state
    setIsModalOpen(false); // Close the modal after adding the bill
  };

  return (
    <div className="modal fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-content bg-white rounded-lg shadow-lg p-8 w-96">
        <div className="flex items-center justify-between mb-4">
          <h2 className="modal-title text-xl font-bold">Bill Reminders</h2>
          <button
            onClick={handleBellIconClick}
            className="bg-blue-300 hover:bg-blue-600 text-white rounded-full px-4 py-2"
          >
            Add new Bill
          </button>
        </div>
        <ul className="bill-list space-y-4 mb-3 mt-3">
          {billReminders?.map((bill) => (
            <li key={bill._id} className="bill-item">
              {bill.name} - {formatExpenseDate(bill.dueDate)}
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button
            className="modal-close bg-gray-300 text-gray-700 rounded-lg px-6 py-2 font-semibold"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
      {isModalOpen && (
        <AddBillModal addBill={handleAddBill} closeModal={handleModalClose} />
      )}
    </div>
  );
};

export default BillRemindersModal;
