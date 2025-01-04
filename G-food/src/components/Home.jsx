import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import "../styles/Home.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [requestsTotal, setRequestsTotal] = useState(0);
  const [leavingUsersTotal, setLeavingUsersTotal] = useState(0);
  const [stockTotal, setStockTotal] = useState(0);
  const [leavingItemsRecord, setLeavingItemsRecord] = useState([]);
  const [isEquipmentManager, setIsEquipmentManager] = useState(-1);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search

  // useEffect(() => {
  //   // Initialize Bootstrap Popovers
  //   const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));
  //   popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));
  // }, []);

  useEffect(() => {
    if (user){
      requestCount();
      handleLeavingUsersCount();
      handleLeavingItemsRecords();
    } 
  }, [user]);

  const requestCount = () => {
    // console.log(user.role);
    
    axios
      .post("http://localhost:3000/auth/count_requests", {role: user.role})
      .then((res) => {
        if (res.data.Status) setRequestsTotal(res.data.Requests);
        else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
  };

  const handleLeavingUsersCount = () => {
    axios
      .get("http://localhost:3000/auth/count_leaving_users")
      .then((res) => {
        if (res.data.Status) setLeavingUsersTotal(res.data.Result[0].users);
        else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
  };

  const handleLeavingItemsRecords = () => {
    if (user && user.item_category_managment !== -1) {
      setIsEquipmentManager(user.item_category_managment);
      // console.log(isEquipmentManager);
      
      
    }
    // console.log(user);
    axios
      .get(
        `http://localhost:3000/auth/equipment_by_category/${user.item_category_managment}`
      )
      .then((res) => {
        if (res.data.Status) {
          setLeavingItemsRecord(res.data.Result);
          // console.log(user.item_category_managment);
          
          if (user.item_category_managment != -1 || (user && user.role === 'admin')) 
            setStockTotal(res.data.Result.length)

        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const filteredItems = leavingItemsRecord
    .filter((item) => item.status == "leaving")
    .filter(
      (item) =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toString().includes(searchQuery)
    );

  return (
    <div className="home-container">
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="summary-card ">
          <h4>Pending Requests:</h4>
          <p className="text-center">Review and Approve</p>
          <hr />
          <div className="summary-total">
            <h5>Total:</h5>
            <h5>{requestsTotal}</h5>
          </div>
        </div>

        <div className="summary-card">
          <h4>Manage Stock:</h4>
          <p className="text-center">Edit and Track Equipment</p>
          <hr />
          <div className="summary-total">
            <h5>In Stock:</h5>
            <h5>{stockTotal}</h5>
          </div>
          {/* <div>
            //question mark with popover explanation
            <i
              className="bi bi-question-circle"
              data-bs-toggle="popover"
              data-bs-placement="top"
              title="Explanation"
              data-bs-content="This is the explanation of the section. Click this icon for more details."
              style={{ cursor: 'pointer', fontSize: '18px', color: '#007bff', marginLeft: '10px' }}
            ></i>
          </div> */}
        </div>

        <div className="summary-card">
          <h4>Offboarding Users</h4>
          <p className="text-center">Review & Approve</p>
          <hr />
          <div className="summary-total">
            <h5>Total:</h5>
            <h5>{leavingUsersTotal}</h5>
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex flex-column align-items-center">
        <div className="table-container">
          <div className="table-header">
            <h3 className="text-center">Process Equipment Return:</h3>
            <input
              type="text"
              placeholder="Search by Name or Item ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control search-input"
            />
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-light">
                <tr>
                  <th>Item Name</th>
                  <th>Item Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((e) => (
                  <tr key={e.id}>
                    <td>{e.item_name}</td>
                    <td>{e.item_description}</td>
                    <td>
                      <Link
                        to={`/admin/user_details/${e.employee_id}`}
                        className="btn btn-info btn-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
