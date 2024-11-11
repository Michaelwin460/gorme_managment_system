import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from './AuthContext';
import axios from 'axios';
import './Home.css'; // Import the CSS file

const Home = () => {
  const { user } = useContext(AuthContext); 
  const [taskTotal, setTaskTotal] = useState(0);
  const [leavingUsersTotal, setLeavingUsersTotal] = useState(0);
  const [leavingItemsRecord, setLeavingItemsRecord] = useState([]);
  const [isEquipmentManager, setIsEquipmentManager] = useState(-1);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search

  useEffect(() => {
    taskCount();
    handleLeavingUsersCount();
    handleLeavingItemsRecords();
  }, []);

  const taskCount = () => {
    axios
      .get("http://localhost:3000/auth/count_tasks_count")
      .then((res) => {
        if (res.data.Status) setTaskTotal(res.data.Tasks);
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
    }
    axios
      .get(`http://localhost:3000/auth/equipment_by_category/${isEquipmentManager}`)
      .then((res) => {
        if (res.data.Status) {
          setLeavingItemsRecord(res.data.Result);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const filteredItems = leavingItemsRecord
    .filter(item => item.status == "leaving")
    .filter(item => 
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.id.toString().includes(searchQuery)
    );

  return (
    <div className="home-container">
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="summary-card">
          <h4>Tasks To Complete:</h4>
          <hr />
          <div className="summary-total">
            <h5>Total:</h5>
            <h5>{taskTotal}</h5>
          </div>
        </div>
        <div className="summary-card">
          <h4>Users About To Leave:</h4>
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
            <h3 className="text-center">Items About To Return:</h3>
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