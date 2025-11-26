import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Api/axios.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faKey } from '@fortawesome/free-solid-svg-icons'; 

const Signup = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);   
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${BASE_URL}/api/auth/signup`, {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      setSuccess("Signup successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);  // wait 2 seconds so user sees msg

    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-600 font-semibold mb-4">{success}</p>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4 flex items-center border rounded-lg">
              <FontAwesomeIcon icon={faUser} className="ml-2 text-gray-500" />
              <Field type="text" name="username" placeholder="Username" className="w-60 p-2 border-none outline-none" />
            </div>
            <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />

            <div className="mb-4 flex items-center border rounded-lg">
              <FontAwesomeIcon icon={faEnvelope} className="ml-2 text-gray-500" />
              <Field type="email" name="email" placeholder="Email" className="w-60 p-2 border-none outline-none" />
            </div>
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

            <div className="mb-4 flex items-center border rounded-lg">
              <FontAwesomeIcon icon={faLock} className="ml-2 text-gray-500" />
              <Field type="password" name="password" placeholder="Password" className="w-60 p-2 border-none outline-none" />
            </div>
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

            <div className="mb-4 flex items-center border rounded-lg">
              <FontAwesomeIcon icon={faKey} className="ml-2 text-gray-500" />
              <Field type="password" name="confirmPassword" placeholder="Confirm Password" className="w-60 p-2 border-none outline-none" />
            </div>
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />

            <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-5 hover:bg-blue-700">
             {isSubmitting ? 'Signing in...' : 'Signup'}
            </button>
          </Form>
        )}
      </Formik>

      <p className="mb-2">Already have an account?</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
};

export default Signup;
