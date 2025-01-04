import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from 'jspdf'
import '../styles/AdminDisplayUser.css'
import "bootstrap-icons/font/bootstrap-icons.css"; // For icons


const AdminDisplayUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [equipment, setEquipment] = useState([]);
  const [status, setStatus] = useState("");
  const [isDeleteUserEnabled, setIsDeleteUserEnabled] = useState(false);
  const [leavingDate, setLeavingDate] = useState("");
  const [showDetails, setShowDetails] = useState(false); 


  useEffect(() => {
    // Fetch user details
    axios
      .get("http://localhost:3000/auth/users/" + id)
      .then((res) => {
        if (res.data.Status) {
          console.log(res.data.Result[0]);
          setUser(res.data.Result[0]);          
          setStatus(res.data.Result[0].status);
        } else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
      
    // Fetch equipment assigned to the employee
    axios
      .get(`http://localhost:3000/auth/equipment/employee/${id}`)
      .then((res) => {
        if (res.data.Status) setEquipment(res.data.Result);
        else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
  }, [id, status]);
  
  useEffect(() => {
    if(status !== "active")
      setIsDeleteUserEnabled(true);
    else 
      setIsDeleteUserEnabled(false);
  }, [status])

  useEffect(() => {
    if(leavingDate)
      {
        console.log(leavingDate);
        // setLeavingDate(new Date().toISOString().split("T")[0])
        axios
        .put(`http://localhost:3000/auth/update_user_leaving_date/${id}`, { leaving_date: leavingDate })
        .then((res) => {
          if (!res.data.Status) alert(res.data.Error);
        })
        .catch((err) => console.log(err));
      }
      console.log(leavingDate);
  }, [leavingDate, id])

  const handleDeleteUser = () => {

    const confirmDelete = window.confirm(`Are you sure you want to delete ${user.name}?`);
  
    // If the user confirms, proceed with deletion
    if (confirmDelete) {
      if (status !== 'active') {
        axios
          .delete("http://localhost:3000/auth/delete_user/" + id)
          .then((res) => {
            if (res.data.Status) {
              // Delete employee equipment too
              axios
                .delete(`http://localhost:3000/auth/delete_equipment_by_employee/${id}`)
                .then((res) => {
                  if (res.data.Status) {
                    navigate("/admin/user");
                  } else alert(res.data.Error);
                })
                .catch((err) => console.log(err));
            } else alert(res.data.Error);
          })
          .catch((err) => console.log(err));
      } else {
        alert("Leaving process not completed yet! Please finish the leaving process before deleting.");
      }
    } else {
      // User rejected the confirmation
      console.log("Deletion canceled by admin");
    }
  };
  

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
            console.log("File uploaded successfully!")
          } else {
            console.log(res.data.Error);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleUpdateStatusItem = (itemId) => {
    const item = equipment.find((item) => item.item_id === itemId);
    const enableItemUpdate = item && item.status !== "available";
    const currentDate = new Date().toISOString().split("T")[0];
    if(enableItemUpdate)
    {
      // Confirm before deleting an equipment item
      if (window.confirm("Are you sure you want to update this item?")) {
        axios
          .put(`http://localhost:3000/auth/update_item_status/${itemId}`,
               { update_status: "available", leave_date: currentDate })
          .then((res) => {
            if (res.data.Status) {
              const updatedEquipment = equipment.map((item) =>
                item.item_id === itemId ? { ...item, status: "available", leave_date: currentDate} : item
              );
              setEquipment(updatedEquipment);            
            } else alert(res.data.Error);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const handleLeaveProcess = () => {
    if (status !== "leaving") {
      const requested_status = (equipment.length === 0) ? "done" : "leaving";
      const defaultLeavingDate = new Date();
      defaultLeavingDate.setMonth(defaultLeavingDate.getMonth() + 3);
      const formattedDate = defaultLeavingDate.toISOString().split("T")[0];

      setLeavingDate(leavingDate ? leavingDate : formattedDate);
      setStatus(requested_status);

      // Update user status to 'requested_status' in the backend
      axios
        .put(`http://localhost:3000/auth/update_user_status/${id}`, { update_status: requested_status, leave_date: formattedDate })
        .then((res) => {
          if (!res.data.Status) alert(res.data.Error);
        })
        .catch((err) => console.log(err));

      // Update user's equipment status to 'requested_status' in the backend
      axios
      .put(`http://localhost:3000/auth/update_all_items_status/${id}`, { update_status: requested_status, leave_date: formattedDate })
      .then((res) => {
        if (!res.data.Status) alert(res.data.Error);
      })
      .catch((err) => console.log(err));
    }
  };

  const handleUpdateLeavingDate = (date) => {
    if(date)
      setLeavingDate(date);
  }

  const generateItemFile = () => {
    const doc = new jsPDF();
  
    // Add content to the PDF
    doc.setFontSize(16);
    doc.text("Item Request Form", 10, 10);
    doc.setFontSize(12);
    doc.text(`Date: ____/__/__`, 10, 30);
    doc.text(`User Name: ___________________________`, 10, 40);
    doc.text(`Phone: ___________________________`, 10, 50);
    doc.text(`Item Name: ___________________________`, 10, 60);
    doc.text(`Description: ___________________________`, 10, 70);
    doc.text(`Employee Signature: ___________________________`, 10, 90);
  
    // Save the file
    doc.save(`example_file_request.pdf`);
  };

  return (
    <div className="user-details-container p-4 mt-4">
      {/* Header Section */}
      <header className="header-section">
        <h1>User Management</h1>
      </header>
  
      {/* User Info Header */}
      <div className="user-info-header">
        <h5>Name: {user.name}</h5>
        {/* <h5>Name: Yael Mashan</h5> */}
        <h5>Department: {user.department_name}</h5>
        {/* <h5>Department: Human Resources</h5> */}
        {/* <h5>ID: 1654356</h5> */}
        <h5>ID: {user.user_id}</h5>
      </div>
  
      {/* Navbar Section */}
      <nav className="navbar-custom mb-4">
        <button
          className="custom-btn "
          style={{backgroundColor: 'gray', color: 'white'}}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "View Details"}
        </button>
        <button
          className="custom-btn primary-btn"
          onClick={() => navigate(`/admin/edit_user/${id}`)}
        >
          Edit Details
        </button>
        <button
          className="custom-btn primary-btn"
          onClick={handleDeleteUser}
          disabled={!isDeleteUserEnabled}
        >
          Delete User
        </button>
        <button
          className="custom-btn "
          style={{backgroundColor: "#fdcc4d", color: 'white'}}
          onClick={handleLeaveProcess}
          disabled={status === "leaving"}
        >
          Start Leave Process
        </button>
      </nav>
  
      {/* Details Section */}
      {showDetails && (
        <table className="table border">
          <tbody>
            <tr>
              <td className="text-center mb-3"><strong>User ID:</strong></td>
              <td>{user.user_id}</td>
              <td className="text-center mb-3"><strong>Name:</strong></td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td className="text-center mb-3"><strong>Phone:</strong></td>
              <td>{user.phone}</td>
              <td className="text-center mb-3"><strong>Email:</strong></td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td className="text-center mb-3"><strong>Department:</strong></td>
              <td>{user.department_name}</td>
              <td className="text-center mb-3"><strong>Status:</strong></td>
              <td>{status}</td>
            </tr>
            <tr>
              <td className="text-center mb-3"><strong>Start Date:</strong></td>
              <td>{new Date().toISOString().split("T")[0]}</td>
              {status !== "active" && (
                <>
                  <td className="text-center mb-3"><strong>Leaving Date:</strong></td>
                  <td>
                    {status === "leaving" ? (
                      <input
                        type="date"
                        value={leavingDate}
                        onChange={(e) => handleUpdateLeavingDate(e.target.value)}
                      />
                    ) : (
                      user.leaving_date
                    )}
                  </td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      )}
  
      {/* Equipment Section */}
      <div className="equipment-section p-3 mb-4">
        <h3 className="section-title">Equipment Assigned</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              item.status != 'available' &&
              <tr key={item.id}>
                <td>{item.item_name}</td>
                <td>{item.item_description}</td>
                <td>{item.status}</td>
                <td className="table-actions">
                  <button
                    className="yellow-btn "
                    onClick={() => handleUpdateStatusItem(item.item_id)}
                  >
                    Return Item
                  </button>
                  <label className="gray-btn">

                    Add File
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(event) => handleFileUpload(event, item)}
                      style={{ display: "none"}}
                    />
                  </label>
                  <a
                    href={`http://localhost:3000/images/${item.file_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn gray-btn "
                  >
                    View File
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Actions Section */}
      <div className="actions-section">
        <button
          className="custom-btn"
          style={{backgroundColor: '#fdcc4d', color: 'white'}}
          onClick={() => navigate(`/admin/add_item/user/${id}`)}
        >
          <i className="bi bi-plus"></i> Add Item
        </button>
        <button
          className="custom-btn primary-btn"
          onClick={generateItemFile}
        >
          Download Request Template
        </button>
      </div>
    </div>
  );
  
  

};

export default AdminDisplayUser;
