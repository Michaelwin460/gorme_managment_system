import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Equipment.css";
import { AuthContext } from "./AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css"; // For icons

const Stock = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isEquipmentManager, setIsEquipmentManager] = useState(-1);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.item_category_managment !== -1)
      setIsEquipmentManager(user.item_category_managment);
    fetchEquipment();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [equipment, searchTerm, filter]);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/equipment_by_category/${user.item_category_managment}`
      );
      if (response.data.Status) {
        setEquipment(response.data.Result);
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error("Error fetching equipment data: ", error);
    }
  };

  const filterEquipment = () => {
    let filteredData = [...equipment];

    if (searchTerm.trim()) {
      filteredData = filteredData.filter((item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === "available") {
      filteredData = filteredData.filter((item) => item.status === "available");
    } else if (filter === "in_use") {
      filteredData = filteredData.filter(
        (item) => item.status === "leaving" || item.status === "active"
      );
    }

    setFilteredEquipment(filteredData);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleInspectItem = (id) => {
    navigate(`/admin/manage_item_in_stock/${id}`)
  };



  return (
    <div className="stock-container">
      {/* Header */}
      <h2 className="stock-header">Track and Manage Your Stock</h2>

      {/* Search Section */}
      <div className="search-bar-container">
        <i className="bi bi-search"></i>
        <input
          type="text"
          value={searchTerm}
          className="search-bar"
          placeholder="Search equipment..."
          onChange={handleSearchChange}
        />
      </div>

      {/* Navbar Section */}
      <nav className="navbar-custom">
        <div
          className={`navbar-section ${filter === "all" ? "selected" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </div>
        <div
          className={`navbar-section ${filter === "available" ? "selected" : ""}`}
          onClick={() => handleFilterChange("available")}
        >
          Available
        </div>
        <div
          className={`navbar-section ${filter === "in_use" ? "selected" : ""}`}
          onClick={() => handleFilterChange("in_use")}
        >
          In Use
        </div>
      </nav>

      {/* Equipment List Section */}
      <div className="equipment-list">
        {filteredEquipment.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>{item.item_description}</td>
                  <td>{item.status}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleInspectItem(item.id)}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">No equipment available</div>
        )}
      </div>

      {/* Add Item Button */}
      <div className="add-item-container">
      <button className="btn btn-primary" onClick={() => navigate('/admin/add_item_to_stock')}>
  <i className="bi bi-plus"></i> Add Item To Stock
</button>

      </div>
    </div>
  );
};

export default Stock;
