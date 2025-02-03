import React, { useRef } from "react";
import { Formik, Field, Form, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";

const Filters = ({ onFilter,setFilteredTrips,trips }) => {
  const validationSchema = Yup.object({
    startDate: Yup.date().nullable(),
    endDate: Yup.date().nullable(),

    budget: Yup.number().min(0, "Budget must be at least 0"),

  
  });

  const handleSubmit = (values) => {
    onFilter(values);
  };
  const formikRef = useRef(null);
  
  const handleClearFilter = () => {
    formikRef.current.resetForm();
    setFilteredTrips(trips)
  };
  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        startDate: "",
        endDate: "",
        budget:""
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({}) => (
        <Form className="space-y-4 flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex flex-col sm:w-1/2">
            <label htmlFor="startDate" className="block text-gray-700">
              Start Date
            </label>
            <Field
              type="date"
              name="startDate"
              placeholder="Start Date"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="startDate"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex flex-col sm:w-1/2">
            <label htmlFor="endDate" className="block text-gray-700">
              End Date
            </label>
            <Field
              type="date"
              name="endDate"
              placeholder="End Date"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="endDate"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex flex-col sm:w-1/2">
            <label htmlFor="budget" className="block text-gray-700">
              Budget
            </label>
            <Field
              type="number"
              name="budget"
              placeholder="Budget"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage
              name="budget"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex items-center space-x-4 sm:w-1/2">
            <button
              type="submit"
              className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-blue-500"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={handleClearFilter}
              className="px-4 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Filters;
