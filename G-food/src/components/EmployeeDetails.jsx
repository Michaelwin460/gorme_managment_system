import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/employeeDetails.css";
import { AuthContext } from "./AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [equipment, setEquipment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [filter, setFilter] = useState("details");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
    fetchEquipment();
    fetchRequests();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/equipment/employee/${id}`
      );
      if (response.data.Status) {
        setEquipment(response.data.Result);
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error("Error fetching equipment data: ", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/users/${id}`
      );
      if (response.data.Status) {
        setUserDetails(response.data.Result[0]);
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/requests_by_user/${id}`
      );
      if (response.data.Status) {
        setRequests(response.data.Result);
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error("Error fetching requests: ", error);
    }
  };

  const handleDeleteRequest = async (requestId) => {    
    try {
      const response = await axios.delete(
        `http://localhost:3000/auth/delete_request_by/${requestId}`
      );
      if (response.data.Status) {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error("Error deleting request: ", error);
    }
  };

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((res) => {
        if (res.data.Status) {
          localStorage.removeItem("valid");
          logout();
          navigate("/");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="employee-details-container hall-component">
      {/* Header */}
      <h1 className="employee-header">Hello {userDetails.name || "User"}!</h1>
      <h2 className="employee-subheader">
        Here you can manage your details, equipment, and requests
      </h2>

      {/* Navbar Section */}
      <nav className="employee-navbar">
        <div
          className={`navbar-section ${filter === "details" ? "selected" : ""}`}
          onClick={() => setFilter("details")}
        >
          Your Details
        </div>
        <div
          className={`navbar-section ${
            filter === "equipment" ? "selected" : ""
          }`}
          onClick={() => setFilter("equipment")}
        >
          Your Equipment
        </div>
        <div
          className={`navbar-section ${
            filter === "requests" ? "selected" : ""
          }`}
          onClick={() => setFilter("requests")}
        >
          Your Requests
        </div>
      </nav>

      {/* Content Section */}
      <div className="employee-content">
        {filter === "details" && (
          <table className="employee-table">
            <tbody>
              <tr>
                <th>User ID</th>
                <td>{userDetails.id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{userDetails.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{userDetails.email}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{userDetails.phone}</td>
              </tr>
              <tr>
                <th>Start Date</th>
                <td>
                  {userDetails.start_date
                    ? new Date(userDetails.start_date)
                        .toISOString()
                        .split("T")[0]
                    : "N/A"}
                </td>
              </tr>
              {userDetails.status === "leaving" && (
                <tr>
                  <th>Leave Date</th>
                  <td>
                    {
                      new Date(userDetails.leave_date)
                        .toISOString()
                        .split("T")[0]
                    }
                  </td>
                </tr>
              )}
              <tr>
                <th>Status</th>
                <td>{userDetails.status}</td>
              </tr>
            </tbody>
          </table>
        )}

        {filter === "equipment" &&
          equipment.map((item) => (
            <table className="employee-table" key={item.item_id}>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{item.item_name}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{item.item_description}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{item.status}</td>
                </tr>
                <tr>
                  <th>Start Date</th>
                  <td>
                    {item.start_date
                      ? new Date(item.start_date).toISOString().split("T")[0]
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          ))}

        {filter === "requests" &&
          requests.map((request) => (
            <table className="employee-table" key={request.id}>
              <tbody>
                <tr>
                  <th>Status</th>
                  <td>{request.status}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>
                    {request.request_date
                      ? new Date(request.request_date)
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <th>Header</th>
                  <td>{request.header}</td>
                </tr>
                <tr>
                  <th>Body</th>
                  <td>{request.body}</td>
                </tr>
                <tr>
                  <th>Note</th>
                  <td>{request.note}</td>
                </tr>
                <tr>
                  <th>Actions</th>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteRequest(request.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`../add_req/${id}`)}
        >
          Add Request
        </button>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {/* <Outlet/> */}
    </div>
  );
};

export default EmployeeDetails;
