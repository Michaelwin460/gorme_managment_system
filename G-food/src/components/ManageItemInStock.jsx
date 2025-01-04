import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ManageItemInStock.css"; // Reusing the AddItemToStock styles
import { AuthContext } from "./AuthContext";

const ManageItemInStock = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming `id` is the item ID from the URL
  const { user } = useContext(AuthContext);
  const [isEquipmentManager, setIsEquipmentManager] = useState(-1);
  const [category, setCategory] = useState([]);
  const [item, setItem] = useState({
    item_category: "",
    item_name: "",
    item_description: "",
    item_id: "",
    employee_id: "",
    start_date: "",
    leave_date: "",
    status: "available",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user && user.item_category_managment !== -1) {
      setIsEquipmentManager(user.item_category_managment);
    } else {
      fetchCategories();
    }
    fetchItemDetails();
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

  const fetchItemDetails = () => {
    axios
      .get(`http://localhost:3000/auth/equipment_by_item/${id}`)
      .then((res) => {
        if (res.data.Status) {
          console.log("Fetched item details:", res.data.Result);
  
          const result = res.data.Result[0];
          setItem({
            item_category: result.item_category || "",
            item_name: result.item_name || "",
            item_description: result.item_description || "",
            item_id: result.item_id || "",
            employee_id: result.employee_id || "",
            start_date: result.start_date
              ? result.start_date.split("T")[0]
              : "", // Format the date
            leave_date: result.leave_date
              ? result.leave_date.split("T")[0]
              : "", // Format the date
            status: result.status || "available",
          });
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error("Error fetching item details:", err));
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchItemDetails(); // Reset changes to the original data
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (user.item_category_managment === -1 && !item.item_category) {
      alert("Please select a category.");
      return;
    }

    if (item.status === "active" && !item.employee_id) {
      alert("Please provide Employee ID to set status to 'active'.");
      return;
    }

    axios
      .put(`http://localhost:3000/auth/update_item/${id}`, item)
      .then((res) => {
        if (res.data.Status) {
          setIsEditing(false);
          alert("Item updated successfully.");
          navigate('/admin/equipment')
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios
        .delete(`http://localhost:3000/auth/delete_item/${id}`)
        .then((res) => {
          if (res.data.Status) {
            alert("Item deleted successfully.");
            navigate(`/admin/equipment`);
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="manage-item-container d-flex justify-content-center align-items-center flex-column mt-5">
      {/* Header */}
      <div className="header-container text-center mb-3">
        <h2 className="header-title">Edit Item</h2>
        <p className="header-description">
          Update the details of the selected equipment item below.
        </p>
      </div>
  
      {/* Form */}
      <div className="form-container p-4 rounded w-50">
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
                value={item.item_category || ""}
                onChange={(e) =>
                  setItem({ ...item, item_category: e.target.value })
                }
                disabled={!isEditing}
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
  
          {/* Remaining Fields */}
          {[
            { label: "Item Name", key: "item_name" },
            { label: "Description (Optional)", key: "item_description" },
            { label: "Item ID", key: "item_id" },
            { label: "Employee ID (Optional)", key: "employee_id" },
            { label: "Start Date (Optional)", key: "start_date", type: "date" },
            { label: "Leave Date (Optional)", key: "leave_date", type: "date" },
          ].map(({ label, key, type = "text" }) => (
            <div className="col-12" key={key}>
              <label htmlFor={key} className="form-label">
                <strong>{label}</strong>
              </label>
              <input
                type={type}
                id={key}
                value={item[key] || ""}
                className="form-control rounded-0"
                onChange={(e) =>
                  setItem({ ...item, [key]: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
          ))}
  
          {/* Status */}
          <div className="col-12">
            <label htmlFor="status" className="form-label">
              <strong>Status</strong>
            </label>
            <select
              id="status"
              value={item.status || ""}
              className="form-select"
              onChange={(e) =>
                setItem({ ...item, status: e.target.value })
              }
              disabled={!isEditing}
            >
              <option value="available">Available</option>
              <option value="active">Active</option>
              <option value="leaving">Leaving</option>
            </select>
          </div>
  
          {/* Buttons */}
          <div className="col-12 text-center">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary mx-2"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger mx-2"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-primary my-bot mx-2"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mx-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
  
  
};

export default ManageItemInStock;
