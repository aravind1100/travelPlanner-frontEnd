import React from 'react';
import axiosInstance from '../Api/axios.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../ContextApi.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Import Formik components
import * as Yup from 'yup'; // Import Yup for validation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons

const Login = () => {
  const [error, setError] = React.useState(''); // Define error state
  const navigate = useNavigate();
  const { login } = useAuth();

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.post('/auth/login', values);
      // localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
      login(response.data.token);
    } catch (err) { // Use a different variable name for the caught error
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center mt-25 pb-20">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <div className="flex items-center border rounded-lg">
                <FontAwesomeIcon icon={faEnvelope} className="ml-2 text-gray-500" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-70 p-2 border-none outline-none"
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <div className="flex items-center border rounded-lg">
                <FontAwesomeIcon icon={faLock} className="ml-2 text-gray-500" />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-70 p-2 border-none outline-none"
                />
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-5 flex items-center justify-center gap-x-2 hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="text-white" />
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
      <p className='mb-2'>Didn't have an account? </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => navigate("/signup")}> 
        Signup
      </button>
    </div>
  );
};

export default Login;
