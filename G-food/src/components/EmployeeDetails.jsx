import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext } from 'react'
import { AuthContext } from './AuthContext';


const EmployeeDetails = () => {

  const { id } = useParams();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch user details
    axios
      .get("http://localhost:3000/auth/users/" + id)
      .then((res) => {
        if (res.data.Status) {
          console.log(res.data.Result[0]);
          setUser(res.data.Result[0]);          
        } else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
      
    // Fetch equipment assigned to the employee
    axios
      .get(`http://localhost:3000/auth/equipment/employee/${id}`)
      .then((res) => {
        if (res.data.Status) setEquipment(res.data.Result);
        else alert(res.data.Error);
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
      }
      else alert(res.data.Error);
    })
    .catch((err) => console.log(err));
  }

  return (
    <div className="user-details-container p-4">
      {/* Employee Details Section */}
      <div className="user-details p-1 mt-1 mb-2 bg-light border rounded">
        <h2 className="text-center mb-3 ">User Details</h2>
        <table className="table border">
          <tbody>
            <tr>
              <td className="text-center mb-3 "><strong>User ID:</strong></td>
              <td>{id}</td>
              <td className="text-center mb-3 "><strong>Name:</strong></td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td className="text-center mb-3 "><strong>Phone:</strong></td>
              <td>{user.phone}</td>
              <td className="text-center mb-3 "><strong>Email:</strong></td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td className="text-center mb-3 "><strong>Department:</strong></td>
              <td>{user.department_id}</td>
              <td className="text-center mb-3 "><strong>Status:</strong></td>
              <td>{user.status}</td>
            </tr>
            <tr>
              <td className="text-center mb-3 "><strong>Start Date:</strong></td>
              <td>{user.start_date ? user.start_date.toString().split("T")[0] : user.start_date}</td>
              {user.status !== "active" && (
              <>
                <td className="text-center mb-3 "><strong>Leaving Date:</strong></td>
                <td>{user.leaving_date}</td>
              </>
            )}

            </tr>
          </tbody>
        </table>
      </div>

      {/* Equipment List Section */}
      <div className="equipment-list p-4 mb-2 bg-light border rounded">
        <h4 className="text-center mb-3">Equipment Assigned</h4>
        <table className="table border">
          <thead className="thead-dark">
            <tr >
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

      {/* Control Panel Section */}
      <div className="control-panel w-10px d-flex justify-content-center p-2 bg-light border rounded">
        <button
          className="btn btn-primary me-2 w-50"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
