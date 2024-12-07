import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/AddItemAdminPanel.css'

const AddItemAdminPanel = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] = useState([]);
  const [item, setItem] = useState({
    item_category: "",
    item_name: "",
    item_description: "",
    item_id: "",
    employee_id: id,
    start_date: new Date().toISOString().split("T")[0],
    status: "active",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/equipment_category")
      .then((res) => {
        if (res.data.Status) setCategory(res.data.Result);
        else alert(res.data.Error);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFileUpload = (event, item) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("item_name", item.item_name);

      // Upload the file to the backend
      axios
        .post("http://localhost:3000/auth/upload_item_file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.Status) {
            console.log("File uploaded successfully!");
          } else {
            console.log(res.data.Error);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!item.item_category) {
      alert("Please select a category.");
      return;
    }

    axios
      .post("http://localhost:3000/auth/insert_new_item/", item)
      .then((res) => {
        if (res.data.Status) navigate(`/admin/user_details/${id}`);
        else alert(res.data.Error + " on submit form");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="add-item-container d-flex justify-content-center align-items-center mt-3">
      <div className="add-item-form p-3 rounded w-50">
        <h2 className="text-center">Add Item</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              <strong>Select Category</strong>
            </label>
            <select
              name="item_category"
              id="category"
              className="form-select"
              onChange={(e) =>
                setItem({ ...item, item_category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {category.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
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
            <label htmlFor="inputDescription" className="form-label">
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
          <div className="col-12">
            <label htmlFor="item_id" className="form-label">
              <strong>Item ID</strong>
            </label>
            <input
              type="text"
              id="item_id"
              name="item_id"
              placeholder="Enter car number, serial number, etc."
              className="form-control rounded-0"
              onChange={(e) =>
                setItem({ ...item, item_id: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <strong>Upload File</strong>
            </label>
            <input
              type="file"
              accept=".pdf"
              className="form-control"
              onChange={(event) => handleFileUpload(event, item)}
            />
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">
              Add Item to List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemAdminPanel;
