import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../styles/AdminDisplayUser.css'

const AdminDisplayUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [equipment, setEquipment] = useState([]);
  const [status, setStatus] = useState("");
  const [isDeleteUserEnabled, setIsDeleteUserEnabled] = useState(false);
  const [leavingDate, setLeavingDate] = useState("");

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
  
  const handleDeleteItem = (itemId) => {
    const item = equipment.find((item) => item.item_id === itemId);
    const enableItemDeletion = item && item.status !== "active";
    if(enableItemDeletion)
    {
      // Confirm before deleting an equipment item
      if (window.confirm("Are you sure you want to delete this item?")) {
        axios
          .delete(`http://localhost:3000/auth/delete_item/${itemId}`)
          .then((res) => {
            if (res.data.Status) {
              setEquipment(equipment.filter((item) => item.item_id !== itemId));
            } else alert(res.data.Error);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const handleUpdateStatusItem = (itemId) => {
    const item = equipment.find((item) => item.item_id === itemId);
    const enableItemUpdate = item && item.status !== "done";
    const currentDate = new Date().toISOString().split("T")[0];
    if(enableItemUpdate)
    {
      // Confirm before deleting an equipment item
      if (window.confirm("Are you sure you want to update this item?")) {
        axios
          .put(`http://localhost:3000/auth/update_item_status/${itemId}`, { update_status: "done", leave_date: currentDate })
          .then((res) => {
            if (res.data.Status) {
              const updatedEquipment = equipment.map((item) =>
                item.item_id === itemId ? { ...item, status: "done", leave_date: currentDate} : item
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

  return (
    <div className="user-details-container p-2">
      {/* Employee Details Section */}
      <div className="user-details p-4 mb-2 bg-light border rounded">
        <h2 className="text-center mb-3 ">User Details</h2>
        <table className="table border">
          <tbody>
            <tr>
              <td className="text-center mb-3 "><strong>User ID:</strong></td>
              <td>{user.user_id}</td>
              <td className="text-center mb-3 "><strong>Name:</strong></td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td className="text-center mb-3 "><strong>Phone:</strong></td>
              <td>{user.phone}</td>
              <td className="text-center mb-3 "><strong>Email:</strong></td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td className="text-center mb-3 "><strong>Department:</strong></td>
              <td>{user.department_name}</td>
              <td className="text-center mb-3 "><strong>Status:</strong></td>
              <td>{status}</td>
            </tr>
            <tr>
              <td className="text-center mb-3 "><strong>Start Date:</strong></td>
              <td>{new Date().toISOString().split("T")[0]}</td>
              {status !== "active" && (
              <>
                <td className="text-center mb-3 "><strong>Leaving Date:</strong></td>
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
      </div>

      {/* Equipment List Section */}
      <div className="equipment-list p-4 mb-2 bg-light border rounded">
        <h4 className="text-center mb-3">Equipment Assigned</h4>
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr >
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>
                <td>{item.item_description}</td>
                <td>{item.status}</td>
                <td>{new Date().toISOString().split("T")[0]}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm m-2"
                    onClick={() => handleDeleteItem(item.item_id)}
                    disabled={item.status === "active"}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-danger btn-sm m-2"
                    onClick={() => handleUpdateStatusItem(item.item_id)}
                  >
                    Return Item
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Control Panel Section */}
      <div className="control-panel d-flex justify-content-between p-4 bg-light border rounded">
        <button
          className="btn btn-primary me-2"
          onClick={() => navigate(`/admin/edit_user/${id}`)}
        >
          Edit Details
        </button>

        <button
          className="btn btn-success me-2"
          onClick={() => navigate(`/admin/add_item/user/${id}`)}
        >
          Add Item
        </button>

        <button
          className="btn btn-danger me-2"
          onClick={handleDeleteUser}
          disabled={!isDeleteUserEnabled}
          // equipment.some((item) => item.status !== "returned")
        >
          Delete User
        </button>

        <button
          className="btn btn-warning"
          onClick={handleLeaveProcess}
          disabled={status === "leaving"}
        >
          Start Leave Process
        </button>
      </div>
    </div>
  );
};

export default AdminDisplayUser;
