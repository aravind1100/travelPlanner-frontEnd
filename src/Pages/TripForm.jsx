import React, { useState, useEffect } from "react";
import axiosInstance from "../Api/axios.js";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../ContextApi.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faPen, faClipboardList, faCalendarAlt, faDollarSign } from '@fortawesome/free-solid-svg-icons';


const TripForm = () => {
  const { tripId } = useParams();
  const{selectedTrip}=useAuth();
  
  
  const [trip, setTrip] = useState({
    name: selectedTrip ? selectedTrip.tripName:"",
    description: selectedTrip ? selectedTrip.tripDescription:"",
    startDate: "",
    endDate: "",
    budget: 0,
  });
  const navigate = useNavigate();
  
  const validationSchema = Yup.object({
    name: Yup.string().required("Trip Name is required"),
    description: Yup.string().required("Description is required"),
    startDate: Yup.date().required("Start Date is required").nullable(),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End Date cannot be before Start Date")
      .required("End Date is required")
      .nullable(),
    budget: Yup.number()
      .min(0, "Budget must be at least 0")
      .required("Budget is required"),
  });

  useEffect(() => {
    if (tripId) {
      const fetchTrip = async () => {
        try {
          const response = await axiosInstance.get(`/trips/${tripId}`);
          const tripData = response.data;
          // Format dates to YYYY-MM-DD
          tripData.startDate = tripData.startDate.split("T")[0];
          tripData.endDate = tripData.endDate.split("T")[0];
          setTrip(tripData);
        } catch (error) {
          console.error(
            "Failed to fetch trip:",
            error.response?.data?.message || error.message
          );
        }
      };
      fetchTrip();
    }
  }, [tripId]);

  const handleSubmit = async (values) => {
    try {
      if (tripId) {
        await axiosInstance.put(`/trips/${tripId}`, values);
      } else {
        await axiosInstance.post("/trips", values);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Failed to save trip:",
        error.response?.data?.message || error.message
      );
    }
  };

 
  
  return (
    <>
      {tripId ? (
        <h1 className="text-3xl p-5 m-5 text-center font-bold text-blue-500">
          Edit your trip,
        </h1>
      ) : (
        <h1 className="text-3xl p-5 m-5 text-center font-bold text-blue-700">
          Plan your Trips, Great and Wise!
        </h1>
      )}
  
      {tripId && !trip.name ? (
        <div>Loading...</div>
      ) : (
        <Formik
          initialValues={{
            name: trip.name,
            description: trip.description,
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-8 mt-5 p-4">
            <div className="flex flex-col w-full lg:w-1/2">
              <div className="mb-4">
                <label htmlFor="name" className="block text-green-700 flex items-center">
                  <FontAwesomeIcon icon={faPen} className="text-green-500 mr-2" />
                  Trip Name
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Trip Name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
  
              <div className="mb-4">
                <label htmlFor="description" className="block text-green-700 flex items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="text-green-500 mr-2" />
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Description"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 lg:h-45"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
  
            <div className="flex flex-col w-full lg:w-1/2">
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-green-700 flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 mr-2" />
                  Start Date
                </label>
                <Field
                  type="date"
                  name="startDate"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
  
              <div className="mb-4">
                <label htmlFor="endDate" className="block text-green-700 flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 mr-2" />
                  End Date
                </label>
                <Field
                  type="date"
                  name="endDate"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
  
              <div className="mb-4">
                <label htmlFor="budget" className="block text-green-700 flex items-center">
                  <FontAwesomeIcon icon={faDollarSign} className="text-green-500 mr-2" />
                  Budget
                </label>
                <Field
                  type="number"
                  name="budget"
                  placeholder="Budget"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="budget"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
  
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 border border-green-300 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FontAwesomeIcon icon={faRocket} className="text-white mx-2" />
                {tripId ? "Update Trip" : "Create Trip"}
              </button>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
  
}
  export default TripForm;
  