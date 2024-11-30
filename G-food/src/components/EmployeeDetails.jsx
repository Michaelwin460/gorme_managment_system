import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const EmployeeDetails = () => {
  const { id } = useParams();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [user, setUser] = useState({});
  const [showDetails, setShowDetails] = useState(false); 
  
  useEffect(() => {
    // Fetch user details
    axios
      .get("http://localhost:3000/auth/users/" + id)
      .then((res) => {
        if (res.data.Status) {
          setUser(res.data.Result[0]);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch equipment assigned to the employee
    axios
      .get(`http://localhost:3000/auth/equipment/employee/${id}`)
      .then((res) => {
        if (res.data.Status) {
          setEquipment(res.data.Result);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.Status) {
          localStorage.removeItem("valid");
          logout();
          navigate('/');
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h2 className="text-primary">Hello, {user.name || "Employee"}!</h2>
        <p className="text-muted">Welcome to your profile page.</p>
      </div>

      {/* Button to Toggle Details */}
      <div className="text-center mb-4">
        <button
          className="btn btn-outline-primary btn-lg"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "Inspect Your Details"}
        </button>
      </div>

      {/* Employee Details Section */}
      {showDetails && (
        <div className="user-details bg-light border rounded p-4 mb-4">
          <h4 className="text-secondary mb-3">Employee Details</h4>
          <table className="table">
            <tbody>
              <tr>
                <td><strong>User ID:</strong></td>
                <td>{id}</td>
              </tr>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td><strong>Phone:</strong></td>
                <td>{user.phone}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td><strong>Department:</strong></td>
                <td>{user.department_id}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>{user.status}</td>
              </tr>
              <tr>
                <td><strong>Start Date:</strong></td>
                <td>{user.start_date ? user.start_date.toString().split("T")[0] : user.start_date}</td>
              </tr>
              {user.status !== "active" && (
                <tr>
                  <td><strong>Leaving Date:</strong></td>
                  <td>{user.leaving_date}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Equipment List Section */}
      <div className="equipment-list bg-light border rounded p-4">
        <h4 className="text-secondary mb-3 text-center">Equipment Assigned</h4>
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>
                <td>{item.item_description}</td>
                <td>{item.status}</td>
                <td>{item.start_date ? item.start_date.toString().split("T")[0] : item.start_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Logout Button */}
      <div className="text-center mt-4">
        <button
          className="btn btn-danger btn-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
