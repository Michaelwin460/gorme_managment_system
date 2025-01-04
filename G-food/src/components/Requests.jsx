import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Requests.css";
import { AuthContext } from "./AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css"; // For icons

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEquipmentManager, setIsEquipmentManager] = useState(-1);
  const [isdepartmentManager, setIsDepartmentManager] = useState(-1);
  const [role, setRole ] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/requests_by_role/${user.role}`
      );
      if (response.data.Status) {
        setRequests(response.data.Result);
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error("Error fetching requests data: ", error);
    }
  };

  const filterRequests = () => {
    let filteredData = [...requests];

    if (searchTerm.trim()) {
      filteredData = filteredData.filter((request) =>
        request.user_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filteredData);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInspectRequest = (id) => {
    navigate(`/admin/manage_request/${id}`);
  };

  return (
    <div className="requests-container">
      <h2 className="requests-header">Hello Manager!</h2>
      <h3 className="requests-subheader">
        Here you can answer requests from the users
      </h3>

      <div className="requests-search-bar">
        <i className="bi bi-search"></i>
        <input
          type="text"
          value={searchTerm}
          className="requests-search-input"
          placeholder="Search request by user ID..."
          onChange={handleSearchChange}
        />
      </div>

      <h3 className="requests-subheader">Requests List</h3>

      <div className="requests-list">
        {filteredRequests.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Header</th>
                <th>Body</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.user_id}</td>
                  <td>{request.header}</td>
                  <td>{request.body}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleInspectRequest(request.id)}
                    >
                      Inspect Request
                    </button>
                    {/* <button
                      className="btn btn-info btn-sm m-2"
                      onClick={() => navigate("../equipment")}
                    >
                      Check in stock
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      Reject
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="requests-no-data">No requests available</div>
        )}
      </div>

      <div className="requests-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/report")}
        >
          Download requests as report file
        </button>
      </div>
    </div>
  );
};

export default Requests;
