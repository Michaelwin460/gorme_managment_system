import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddUser.css"

const AddUser = () => {
  const navigate = useNavigate();

  const [department, setDepartment] = useState([]);
  const [user, setUser] = useState({
    user_id: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    image: "",
    department_id: "",
    start_date: new Date().toLocaleDateString("en-CA"),
    leave_date: "",
    status: "active",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/department")
      .then((res) => {
        if (res.data.Status) setDepartment(res.data.Result);
        else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => formData.append(key, value));

    axios
      .post("http://localhost:3000/auth/add_user", formData)
      .then((res) => {
        if (res.data.Status) navigate(`/admin/user_details/${user.user_id}`);
        else alert(res.data.Error + " on submit form");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="add-user-container">
      <div className="form-wrapper">
        <h2 className="form-title">Add User</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">User ID</label>
            <input
              type="text"
              placeholder="Enter ID"
              className="form-control"
              value={user.user_id}
              onChange={(e) => setUser({ ...user, user_id: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="form-control"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="form-control"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              placeholder="Enter phone number"
              className="form-control"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="form-control"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={user.department_id}
              onChange={(e) => setUser({ ...user, department_id: e.target.value })}
            >
              <option value="">Select Department</option>
              {department.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setUser({ ...user, image: e.target.files[0] })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={user.start_date}
              onChange={(e) => setUser({ ...user, start_date: e.target.value })}
            />
          </div>
          <button type="submit" className="btn submit-btn">
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
