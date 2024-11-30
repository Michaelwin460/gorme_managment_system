import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/styles.css";

const User = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/users")
      .then((res) => {
        if (res.data.Status) setUsers(res.data.Result);
        else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredUsers = users.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-5 mt-2">
      <div className="pt-3 d-flex justify-content-center">
        <h4>Users List</h4>
      </div>

      <div
        className="p-2 d-flex justify-content-between align-items-center"
        style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
      >
        <div>
          <Link 
              to="/admin/add_user" 
              className="btn btn-success"
              style={{ backgroundColor: '#001f3f', color: 'white' }}
            >
            Add User
          </Link>
        </div>
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Search by user name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3 d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>
                    <img
                      src={`http://localhost:3000/Images/` + e.image}
                      alt=""
                      className="employee_img"
                    />
                  </td>
                  <td>{e.email}</td>
                  <td>
                    <Link
                      to={`/admin/user_details/` + e.user_id}
                      className="btn btn-info btn-sm me-2"
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
  );
};

export default User;
