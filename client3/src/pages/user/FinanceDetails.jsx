import { useState, useEffect } from 'react';
import { addPersonalDetails, reset } from '../../features/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function FinanceDetails() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    feedingMoney: '',
    desiredMonthlySavings: '',
    mescellenious: '',
    monthlyBudget: '',
  });

  const { monthlyIncome, feedingMoney,desiredMonthlySavings, mescellenious, monthlyBudget } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.userauth);

  useEffect(() => {
    if (isError) {
      console.log("There was an error");
    }
    // if (isSuccess || user) {
    //   navigate('/setup');
    // }
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form submission or data handling here
    
    const userData = {
      feeding: feedingMoney,
      monthlyIncome: monthlyIncome,
      desiredMonthlySavings:desiredMonthlySavings,
      mescellenious: mescellenious,
      monthlyBudget: monthlyBudget
    };

    dispatch(addPersonalDetails(userData));
    navigate('/home');

    // Reset form inputs
    setFormData({
      monthlyIncome: '',
      feedingMoney: '',
      desiredMonthlySavings: '',
      mescellenious: '',
      monthlyBudget: '',
    });
  };

  if (isLoading) {
    return (
     <div className="mt-32 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h1 className="text-2xl font-bold text-blue-700 mb-4">Monthly Income (NGN)</h1>
            <input
              id="income"
              type="number"
              name="monthlyIncome"
              value={monthlyIncome}
              onChange={handleInputChange}
              placeholder="N000000"
              className="border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-4 py-3 w-full text-lg"
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <h1 className="text-2xl font-bold text-blue-700 mb-4">Feeding Money (NGN)</h1>
            <input
              id="feedingMoney"
              type="number"
              name="feedingMoney"
              value={feedingMoney}
              onChange={handleInputChange}
              placeholder="N000000"
              className="border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-4 py-3 w-full text-lg"
              required
            />
          </>
        );
      case 3:
        return (
          <>
            <h1 className="text-2xl font-bold text-blue-700 mb-4">Desired Savings (NGN)</h1>
            <input
              id="desiredMonthlySavings"
              type="number"
              name="desiredMonthlySavings"
              value={desiredMonthlySavings}
              onChange={handleInputChange}
              placeholder="N000000"
              className="border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-4 py-3 w-full text-lg"
              required
            />
          </>
        );
        case 4:
          return (
            <>
              <h1 className="text-2xl font-bold text-blue-700 mb-4">Monthly Budget(NGN)</h1>
              <input
                id="monthlyBudget"
                type="number"
                name="monthlyBudget"
                value={monthlyBudget}
                onChange={handleInputChange}
                placeholder="N000000"
                className="border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-4 py-3 w-full text-lg"
                required
              />
            </>
          );
      case 5:
        return (
          <>
            <h1 className="text-2xl font-bold text-blue-700 mb-4">mescellenious (NGN)</h1>
            <input
              id="mescellenious"
              type="number"
              name="mescellenious"
              value={mescellenious}
              onChange={handleInputChange}
              placeholder="N000000"
              className="border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-4 py-3 w-full text-lg"
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-12 bg-gray-100 px-4 md:px-8">
      <p className="text-4xl text-gray-700 mt-20 mb-8">Setup Finance Details On <span className='text-blue-700'>PR!ME</span></p>
      <form onSubmit={handleSubmit} className="bg-transparent mt-8">
        <div>{renderStepContent()}</div>

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              className="text-blue-700 hover:underline text-lg"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              className="bg-blue-700 text-white py-3 px-8 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 text-lg"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-700 text-white py-3 px-8 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 text-lg"
            >
              Finish
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FinanceDetails;
