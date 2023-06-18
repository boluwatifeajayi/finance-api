import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../../features/user/userSlice';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const { firstname, lastname, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.userauth);

  useEffect(() => {
    if (isError) {
      toast.error("account already exsists");
    }
    if (isSuccess || user) {
      navigate('/setup');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      firstname,
      lastname,
      email,
      password,
    };

    dispatch(register(userData));
  };

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-12 bg-gray-100 px-4 md:px-72">
      <h1 className="text-3xl font-bold text-blue-700 mt-8">Welcome To PR!ME</h1>
      {/* <h2 className="text-2xl font-bold text-left text-blue-700 ml-8 mt-4">Welcome to PRIME</h2> */}
      <p className="text-gray-700 mt-3 mb-8">Complete the sign up to get started</p>

      <form onSubmit={onSubmit} className="bg-transparent">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <input
            id="firstname"
            type="text"
            name="firstname"
            value={firstname}
            onChange={onChange}
            placeholder="First Name"
            required
            className="rounded-full bg-white px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          <input
            id="lastname"
            type="text"
            name="lastname"
            value={lastname}
            onChange={onChange}
            placeholder="Last Name"
            required
            className="rounded-full bg-white px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            required
            className="rounded-full bg-white px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            required
            minLength="6"
            className="rounded-full bg-white px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div className="flex items-center mb-6">
          <input type="checkbox" id="terms" required className="mr-2" />
          <label htmlFor="terms" className="text-gray-700">
            By signing up you agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-700 text-white py-4 px-8 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 mb-8"
        >
          Register
        </button>

        <div>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-700 hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
