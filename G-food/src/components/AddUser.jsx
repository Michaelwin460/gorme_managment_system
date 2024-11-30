import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    // rol: "",
    start_date: new Date().toLocaleDateString("en-CA"),
    leave_date: "",
    status: "active"
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
    formData.append("user_id", user.user_id);
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("phone", user.phone);
    formData.append("image", user.image);
    formData.append("department_id", user.department_id);
    // formData.append("role", user.rol);
    formData.append("start_date", user.start_date);
    formData.append("leave_date", user.leave_date);
    formData.append("status", user.status);

    axios
      .post("http://localhost:3000/auth/add_user", formData)
      .then((res) => {
        if (res.data.Status) navigate(`/admin/user_details/${user.user_id}`);
        else alert(res.data.Error + " on submit form");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3 ">
      <div className="p-3 rounded w-50 border ">
        <h2 className="text-center">Add User</h2>
        <form className="row g-1" onSubmit={handleSubmit}>
        <div className="col-12">
            <label className="form-label">
              <strong>ID</strong>
            </label>
            <input
              type="text"
              id="inputId"
              autoComplete="off"
              placeholder="Enter ID"
              className="form-control rounded-0"
              value={user.user_id}
              onChange={(e) =>
                setUser({ ...user, user_id: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              id="inputName"
              autoComplete="off"
              placeholder="Enter name"
              className="form-control rounded-0"
              value={user.name}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label  className="form-label">
              <strong>Email</strong>
            </label>
            <input
              type="text"
              id="inputEmail"
              autoComplete="off"
              placeholder="Enter Email"
              className="form-control rounded-0"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label">
              <strong>Phon Number</strong>
            </label>
            <input
              type="number"
              id="inputNumber"
              autoComplete="off"
              placeholder="Enter Phone Number"
              value={user.phone}
              className="form-control rounded-0"
              onChange={(e) =>
                setUser({ ...user, phone: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <strong>Insert Password</strong>
            </label>
            <input
              type="text"
              id="inputPassword"
              autoComplete="off"
              placeholder="Enter Password"
              className="form-control rounded-0"
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <strong>Department</strong>
            </label>
            <select
              name="department"
              id="department"
              className="form-select"
              value={user.department_id}
              onChange={(e) => {
                setUser({ ...user, department_id: e.target.value });
              }}
            >
              {department.map((d) => {
                return <option value={d.id}>{d.name}</option>;
              })}
            </select>
          </div>

          <div className="col-12 mb-3">
            <label className="form-label" for="inputGroupFile01">
              Select Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              name="image"
              onChange={(e) =>
                setUser({ ...user, image: e.target.files[0] })
              }
            />
          </div>

        <div className="col-12">
            <label className="form-label">
              <strong>Start Date (optional)</strong>
            </label>
            <input
              type="date"
              id="inputStartDate"
              className="form-control rounded-0"
              value={user.start_date}
              onChange={(e) => {
                const time = e.target.value;
                setUser({...user, start_date : time.toLocaleDateString("en-CA")});
              }}
            />
          </div>
          <button 
            className="btn btn-success w-100 rounded-0 mb-2"
            style={{ backgroundColor: '#001f3f', color: 'white' }}
          >Add</button>       
        </form>
      </div>

    </div>
  );
};

export default AddUser;
