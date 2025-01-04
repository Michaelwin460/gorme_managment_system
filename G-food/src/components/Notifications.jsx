import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import '../styles/Notifications.css';
import axios from 'axios';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [dateRange, setDateRange] = useState(" ");
  const [timeRange, setTimeRange] = useState(" ");


  const submitTime = () => {
    // console.log("date " + dateRange, "time " + timeRange);
    // console.log("email " + user.email);
    
    axios.put(`http://localhost:3000/auth/update_user_time_alarm/${user.email}`, {date_range: dateRange, time_range: timeRange} )
    .then((res) => {
      if (!res.data.Status) alert(res.data.Error);
      else alert("successfuly update alarm date")
    })
    .catch((err) => console.log(err));
    
  };

  return (
    <div className="notif-container container d-flex justify-content-center">
      {/* Main Content Wrapper */}
      <div className="content-wrapper" style={{ maxWidth: '600px', width: '100%' }}>
        {/* Header Section */}
        <header className="header navbar bg-light mb-4 rounded shadow-sm mt-3">
          <h1 className="mx-auto py-2">Email Notifications Settings</h1>
        </header>

        {/* Content Section */}
        <div className="content-section p-4 bg-light rounded shadow">
          <h4 className="notif-header mb-4">Set Tasks Reminder:</h4>

          {/* Selection Options */}
          <div className="row g-4">
            {/* Date Cycle Selector */}
            <div className="col-12">
              <div className="card shadow-sm p-3 border-primary">
                <h5 className="text-secondary">Select Date Cycle:</h5>
                <select
                  value={dateRange || ""}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="form-select"
                >
                  <option value="0">Choose a Date Range</option>
                  <option value="daily">Every Day</option>
                  <option value="weekly">Once A Week</option>
                  <option value="monthly">Every Month</option>
                </select>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="col-12">
              <div className="card shadow-sm p-3 border-primary">
                <h5 className="text-secondary">Select Time Cycle:</h5>
                <select
                  value={timeRange || ""}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="form-select"
                >
                  <option value="0">Choose a Time Range</option>
                  <option value="10:00:00">On 10:00 AM</option>
                  <option value="12:00:00">On 12:00 AM</option>
                  <option value="14:00:00">On 14:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              onClick={submitTime}
              className="btn btn-primary btn-lg px-4 shadow-sm"
            >
              Update Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
