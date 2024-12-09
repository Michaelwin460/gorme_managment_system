import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddRequestEmployee.css";

const AddRequestEmployee = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [request, setRequest] = useState({
    user_id: id,
    user_department_name: "",
    request_category: "",
    status: "by_department_manager",
    header: "",
    body: "",
    request_date: new Date().toISOString().split("T")[0],
    note: "",
  });

  useEffect(() => {
    fetchUser();
    fetchCategories();
  }, []);

  const fetchUser = () => {
    axios
      .get(`http://localhost:3000/auth/users/${id}`)
      .then((res) => {
        if (res.data.Status) setUser(res.data.Result[0]);
        else alert(res.data.Error);
      })
      .catch((err) => console.error(err));
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:3000/auth/equipment_category")
      .then((res) => {
        if (res.data.Status) setCategory(res.data.Result);
        else alert(res.data.Error);
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(user);

    if (user)
      setRequest({ ...request, user_department_name: user.department_name });
    else {
      alert("user details are not loaded corectly");
      return;
    }

    if (!request.request_category || !request.header) {
      alert("Missing header or category");
      return;
    }

    axios
      .post("http://localhost:3000/auth/insert_new_request/", request)
      .then((res) => {
        if (res.data.Status) navigate(`/employee/${id}`);
        else alert(res.data.Error + " on submit form");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="add-item-container d-flex justify-content-center align-items-center mt-3">
      <div className="add-item-form p-3 rounded w-50">
        <h2 className="text-center">Send Request to your boss:</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Category Selection */}
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              <strong>Selest the category you wish:</strong>
            </label>
            <select
              name="request_category"
              id="category"
              className="form-select"
              onChange={(e) =>
                setRequest({ ...request, request_category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {category.map((c) => (
                <option key={c.id} value={c.category_name}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* request header */}
          <div className="col-12">
            <label htmlFor="inputHeader" className="form-label">
              <strong>Insert Request Header:</strong>
            </label>
            <input
              type="text"
              id="inputHeader"
              autoComplete="off"
              placeholder="Enter Request Header"
              className="form-control rounded-0"
              onChange={(e) =>
                setRequest({ ...request, header: e.target.value })
              }
            />
          </div>

          {/* request body */}
          <div className="col-12">
            <label htmlFor="inputBody" className="form-label">
              <strong>Insert Request Body:</strong>
            </label>
            <input
              type="text"
              id="inputHeader"
              autoComplete="off"
              placeholder="Enter Request Body"
              className="form-control rounded-0"
              onChange={(e) => setRequest({ ...request, body: e.target.value })}
            />
          </div>

          {/* request Note */}
          <div className="col-12">
            <label htmlFor="inputDescription" className="form-label">
              <strong>Add A Note</strong>
            </label>
            <input
              type="text"
              id="inputNote"
              autoComplete="off"
              placeholder="Enter Request Note"
              className="form-control rounded-0"
              onChange={(e) => setRequest({ ...request, note: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRequestEmployee;
