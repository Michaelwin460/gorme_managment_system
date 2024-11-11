import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Start = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3000/verify")
      .then((result) => {
        if (result.data.Status) {
          if(result.data.role == "admin")
            navigate('/admin');
          else
            navigate('/employee_details/' + result.data.id);
        } 
        else 
          console.log("Error: " + result.data.Error);
      })
      .catch((err) => {
        console.log("MY ERROR: " + err);
      });
  }, []);
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <h2 className="text-center">Login As</h2>
        <div className="d-flex justify-content-between mt-5 mb-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/adminlogin")}
          >
            Admin
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate("/employeelogin")}
          >
            Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
