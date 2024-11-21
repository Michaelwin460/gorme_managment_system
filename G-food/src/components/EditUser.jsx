import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const navigate = useNavigate();

  const {id} = useParams()

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
    start_date: "",
    leave_date: "",
    status: ""
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/users/" + id)
      .then((res) => {
        if (res.data.Status){
          setUser({
            ...user,
            user_id: res.data.Result[0].user_id,
            name: res.data.Result[0].name,
            email: res.data.Result[0].email,
            password: " ",
            phone: res.data.Result[0].phone,
            image: res.data.Result[0].image,
            department_id: res.data.Result[0].department_id,
            // rol: res.data.Result[0].rol,
            start_date: res.data.Result[0].start_date,
            leave_date: res.data.Result[0].leave_date,
            status: res.data.Result[0].status,
          });
        }
        else alert(res.data.Error);
      })
      .catch((err) => console.log(err));

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

    axios
      .put("http://localhost:3000/auth/update_user/" + id, formData)
      .then((res) => {        
        if (res.data.Status) navigate("/admin/user");
        else alert(res.data.Error + " on submit form");
      })
      .catch((err) => console.log(err));

      navigate(`/admin/user_details/${id}`)
  };

  const handleTurnActive = () => {
          // Update user status to 'leaving' in the backend
          axios
          .put(`http://localhost:3000/auth/update_user_status/${id}`, { update_status: "active" , leave_date: null })
          .then((res) => {
            if (!res.data.Status) alert(res.data.Error);
          })
          .catch((err) => console.log(err));
  
        // Update user's equipment status to 'leaving' in the backend
        axios
        .put(`http://localhost:3000/auth/update_all_items_status/${id}`, { update_status: "active", leave_date: null })
        .then((res) => {
          if (!res.data.Status) alert(res.data.Error);
        })
        .catch((err) => console.log(err));

        navigate(`/admin/user_details/${id}`)
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3 ">
      <div className="p-3 rounded w-50 border ">
        <h2 className="text-center">Edit User</h2>
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
              value={user.phone}
              className="form-control rounded-0"
              onChange={(e) =>
                setUser({ ...user, phone: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <strong>Inser New Password</strong>
            </label>
            <input
              type="text"
              id="inputPassword"
              autoComplete="off"
              placeholder="Enter New Password"
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
              <strong>New Start Date (optional)</strong>
            </label>
            <input
              type="date"
              id="inputStartDate"
              className="form-control rounded-0"
              value={user.start_date}
              onChange={(e) => {
                const time = e.target.value;
                setUser({...user, start_date : time.toString().split('T')[0]});
              }}
            />
          </div>
          {user.status === "leaving" ? (
            <div className="col-12">
              <label className="form-label">
                <strong>Insert New Date of Leaving </strong>
              </label>
              <input
                type="date"
                id="inputStartDate"
                className="form-control rounded-0"
                value={user.leave_date}
                onChange={(e) => {
                  const time = e.target.value;
                  setUser({...user, start_date : time.toString().split('T')[0]});  
                }
              }
              />
            </div>
          ) : (
            <div></div>
          )}
          <button className="btn btn-success w-100 rounded-0 mb-2">Update</button>
          <button
          className="btn btn-warning"
          onClick={handleTurnActive}
          disabled={user.status === "active"}
          >
            Turn Active Again
          </button>        
        </form>
      </div>

    </div>
  );
};

export default EditUser;
