import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/AdminManageRequest.css";
import { AuthContext } from "./AuthContext";

const AdminManageRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [request, setRequest] = useState({
    user_id: "",
    user_name: "",
    user_department_name: "",
    request_category: "",
    header: "",
    body: "",
    request_date: "",
    note: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = () => {
    axios
      .get(`http://localhost:3000/auth/request_by/${id}`)
      .then((res) => {
        if (res.data.Status) {
          const result = res.data.Result[0];
          setRequest({
            user_id: result.user_id || "",
            user_name: result.user_name || "",
            user_department_name: result.user_department_name || "",
            request_category: result.request_category || "",
            header: result.header || "",
            body: result.body || "",
            request_date: result.request_date?.split("T")[0] || "",
            note: result.note || "",
          });
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error("Error fetching request details:", err));
  };

  const sentFeedbackToUser = () => {
    axios
      .put(`http://localhost:3000/auth/send_feedback/${id}`, { status: 'by_user', note: request.note })
      .then((res) => {
        if (res.data.Status) {
          setIsEditing(false);
          alert("Feedback was sent successfully.");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSaveNote = () => {
    axios
      .put(`http://localhost:3000/auth/update_request_note/${id}`, { note: request.note })
      .then((res) => {
        if (res.data.Status) {
          setIsEditing(false);
          alert("Note saved successfully.");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleApprove = () => {
    axios
      .put(`http://localhost:3000/auth/update_request_status/${id}`, {status: "approve"})
      .then((res) => {
        if (res.data.Status) {
          alert("Request approved successfully.");
          navigate("/admin/requests");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleReject = () => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      axios
        .put(`http://localhost:3000/auth/update_request_status/${id}`, {status: "reject"})
        .then((res) => {
          if (res.data.Status) {
            alert("Request rejected successfully.");
            navigate("/admin/requests");
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="request_admin-container d-flex flex-column align-items-center mt-5">
      <div className="request_admin-header text-center">
        <h2 className="request_admin-title">Inspect Request Details</h2>
        <p className="request_admin-description">
          Add a note, approve, or reject the request below.
        </p>
      </div>
      <div className="request_admin-form w-75 p-4 rounded">
        {[
          { label: "Request Header", key: "header" },
          { label: "Request Body", key: "body" },
        ].map(({ label, key }) => (
          <div className="request_admin-field" key={key}>
            <label className="request_admin-label">{label}</label>
            <textarea
              className="request_admin-textbox"
              value={request[key]}
              onChange={(e) => setRequest({ ...request, [key]: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        ))}
        <div className="request_admin-field">
          <label className="request_admin-label">Note</label>
          <textarea
            className="request_admin-textbox request_admin-textbox-note"
            value={request.note}
            onChange={(e) => setRequest({ ...request, note: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>
      <div className="request_admin-navbar mt-4 navbar-custom">
        <button
          className="btn request_admin-navbar-button-primary"
          onClick={() => sentFeedbackToUser}
        >
          Send Feedback
        </button>
        <button
          className={`btn ${
            isEditing ? "request_admin-navbar-button-save" : "request_admin-navbar-button-edit"
            } navbar-button ${isEditing ? "selected" : ""}`
        }
          onClick={() => (isEditing ? handleSaveNote() : setIsEditing(true))}
        >
          {isEditing ? "Save Note" : "Edit Note"}
        </button>
        <button
          className="btn request_admin-navbar-button-stock"
          onClick={() => navigate('../equipment')}
        >
          Check in Stock
        </button>
        <button
          className="btn request_admin-navbar-button-success"
          onClick={handleApprove}
        >
          Approve
        </button>
        <button
          className="btn request_admin-navbar-button-danger"
          onClick={handleReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default AdminManageRequest;
