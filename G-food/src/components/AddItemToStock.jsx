import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddItemToStock.css";
import { AuthContext } from "./AuthContext";

const AddItemToStock = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isEquipmentManager, setIsEquipmentManager] = useState(-1);

  const [category, setCategory] = useState([]);
  const [item, setItem] = useState({
    item_category: "",
    item_name: "",
    item_description: "",
    item_id: "",
    employee_id: "",
    start_date: new Date().toISOString().split("T")[0],
    leave_date: "",
    status: "availble",
  });

  useEffect(() => {
    if (user && user.item_category_managment !== -1) {
      setIsEquipmentManager(user.item_category_managment);
      setItem((prevItem) => ({
        ...prevItem,
        item_category: user.item_category_managment,
      }));
    } else {
      fetchCategories();
    }
  }, [user]);

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

    if (!item.item_category) {
      alert("Please select a category.");
      return;
    }

    if (item.status === "active" && item.employee_id != "") {
      alert("Please provide Employee ID to set status to 'active'.");
      return;
    }

    axios
      .post("http://localhost:3000/auth/insert_new_item/", item)
      .then((res) => {
        if (res.data.Status) navigate(`/admin/equipment`);
        else alert(res.data.Error + " on submit form");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="add-item-container d-flex justify-content-center align-items-center mt-3">
      <div className="add-item-form p-3 rounded w-50">
        <h2 className="text-center">Add Item</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Category Selection */}
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              <strong>Category</strong>
            </label>
            {isEquipmentManager === -1 ? (
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
            ) : (
              <input
                type="text"
                value={user.category_name}
                disabled
                className="form-control"
              />
            )}
          </div>

          {/* Item Name */}
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              <strong>Item Name</strong>
            </label>
            <input
              type="text"
              id="inputName"
              autoComplete="off"
              placeholder="Enter Item Name"
              className="form-control rounded-0"
              onChange={(e) =>
                setItem({ ...item, item_name: e.target.value })
              }
            />
          </div>

          {/* Item Description */}
          <div className="col-12">
            <label htmlFor="inputDescription" className="form-label">
              <strong>Description (Optional)</strong>
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

          {/* Item ID */}
          <div className="col-12">
            <label htmlFor="item_id" className="form-label">
              <strong>Item ID</strong>
            </label>
            <input
              type="text"
              id="item_id"
              name="item_id"
              placeholder="Enter Serial Number, etc."
              className="form-control rounded-0"
              onChange={(e) =>
                setItem({ ...item, item_id: e.target.value })
              }
            />
          </div>

          {/* Employee ID */}
          <div className="col-12">
            <label htmlFor="employee_id" className="form-label">
              <strong>Employee ID (Optional)</strong>
            </label>
            <input
              type="text"
              id="employee_id"
              value={item.employee_id}
              className="form-control rounded-0"
              onChange={(e) =>
                setItem({ ...item, employee_id: e.target.value })
              }
            />
          </div>

          {/* Start Date */}
          <div className="col-12">
            <label htmlFor="start_date" className="form-label">
              <strong>Start Date (Optional)</strong>
            </label>
            <input
              type="date"
              id="start_date"
              value={item.start_date}
              className="form-control rounded-0"
              onChange={(e) =>
                setItem({ ...item, start_date: e.target.value })
              }
            />
          </div>

          {/* Leave Date */}
          <div className="col-12">
            <label htmlFor="leave_date" className="form-label">
              <strong>Leave Date (Optional)</strong>
            </label>
            <input
              type="date"
              id="leave_date"
              value={item.leave_date}
              className="form-control rounded-0"
              onChange={(e) =>
                setItem({ ...item, leave_date: e.target.value })
              }
            />
          </div>

          {/* Status */}
          <div className="col-12">
            <label htmlFor="status" className="form-label">
              <strong>Status</strong>
            </label>
            <select
              id="status"
              value={item.status}
              className="form-select"
              onChange={(e) =>
                setItem({ ...item, status: e.target.value })
              }
            >
              <option value="availble">Available</option>
              <option value="active">Active</option>
              <option value="leaving">Leaving</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemToStock;
