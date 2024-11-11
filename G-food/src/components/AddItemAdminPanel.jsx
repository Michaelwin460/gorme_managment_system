import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddItemAdminPanel = () => {
  const navigate = useNavigate();

  const {id} = useParams()

  const [category, setCategory] = useState([{}]);
  const [item, setItem] = useState({
    item_category: "",
    item_name: "",
    item_description: "",
    item_id: "",
    employee_id: id,
    start_date: new Date().toISOString().split("T")[0],
    status: "active"
  });

  useEffect(() => {
    axios
    .get("http://localhost:3000/auth/equipment_category")
    .then((res) => {
      if (res.data.Status) setCategory(res.data.Result);
      else alert(res.data.Error);
    })
    // .then((res) => {console.log(res.data.Result);})
    .catch((err) => console.log(err));
  }, [])

  // console.log(category);
  


  const handleSubmit = (event) => {
    event.preventDefault();

    if (!item.item_category) {
        alert("Please select a category.");
        return;
      }
  
    axios
      .post("http://localhost:3000/auth/insert_new_item/", item)
      .then((res) => {  
        console.log(res.data);
              
        if (res.data.Status) navigate("/admin/user_details/" + id);
        else alert(res.data.Error + " on submit form");
      })
      .catch((err) => console.log(err));
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center mt-3 ">
      <div className="p-3 rounded w-50 border ">
        <h2 className="text-center">Add Item</h2>
        <form className="row g-1" onSubmit={handleSubmit}>
        <div className="col-12">
            <label for="category" className="form-label">
              <strong>Select Category</strong>
            </label>
            <select
              name="item_category"
              id="category"
              className="form-select"
              onChange={(e) => {
                setItem({ ...item, item_category: e.target.value });
              }}
            >
            <option value="">Select Category</option>
              {category.map((c) => {
                return <option key={c.id} value={c.id}>{c.category_name}</option>;
              })}
            </select>
          </div>
          <div className="col-12">
            <label for="inputName" className="form-label">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              id="inputName"
              autoComplete="off"
              placeholder="Enter Item name"
              className="form-control rounded-0"
              onChange={(e) =>
                setItem({ ...item, item_name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label for="inputDescription" className="form-label">
              <strong>Description</strong>
            </label>
            <input
              type="text"
              id="inputDescription"
              autoComplete="off"
              placeholder="Enter Description"
              className="form-control rounded-0"
              onChange={(e) =>
                setItem({ ...item, item_description: e.target.value })
              }
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label" for="item_id">
              Item ID
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="item_id"
              name="item_id"
              placeholder="Enter car number, serial number etc"
              onChange={(e) =>
                setItem({ ...item, item_id: e.target.value })
              }
            />
          </div>

          <button className="btn btn-success w-100 rounded-0 mb-2">Add Item to list</button>
        </form>
      </div>
    </div>
  );
};

export default AddItemAdminPanel;
