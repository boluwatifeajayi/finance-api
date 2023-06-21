import React, { useState } from 'react';
import { createBillReminder } from '../features/user/userSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AddBillModal = ({ addBill, closeModal }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleBillSubmit = (e) => {
    e.preventDefault();

    const billReminderData = {
      name: name,
      dueDate: dueDate,
    };

    dispatch(createBillReminder(billReminderData))
      .then(() => {
        toast.success('Reminder created successfully');
        closeModal();
        window.location.reload();
      })
      .catch(() => {
        toast.error('Failed to create reminder');
      });
  };

  return (
    <div className="modal fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-content bg-white rounded-lg shadow-lg p-8 w-96">
        <h2 className="modal-title text-2xl font-bold mb-4">Add New Bill</h2>
        <form onSubmit={handleBillSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bill Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Due Date"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          <div className="flex justify-end">
            <button
              className="modal-add bg-blue-500 text-white rounded-lg px-6 py-2 mr-2 font-semibold"
              type="submit"
            >
              Add Bill
            </button>
            <button
              className="modal-close bg-gray-300 text-gray-700 rounded-lg px-6 py-2 font-semibold"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBillModal;
