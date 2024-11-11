import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from './AuthContext';
import axios from 'axios';
import './Reports.css';

const Report = () => {
  const { user } = useContext(AuthContext);
  const [equipment, setEquipment] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [historyDateRange, setHistoryDateRange] = useState('');
  const [isEquipmentManager, setIsEquipmentManager] = useState(-1);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user && user.item_category_managment !== -1) 
        setIsEquipmentManager(user.item_category_managment);

    axios.get(`http://localhost:3000/auth/equipment_by_category/${isEquipmentManager}`)
      .then(res => setEquipment(res.data.Status ? res.data.Result : []))
      .catch(err => console.log(err));
  }, []);

  const filterItemsByDate = (items, range) => {
    const now = new Date();
    const ranges = {
      today: new Date(),
      nextWeek: new Date(now.setDate(now.getDate() + 7)),
      nextMonth: new Date(now.setMonth(now.getMonth() + 1)),
    };
    const endDate = ranges[range];
    return items.filter(item => new Date(item.leave_date) <= endDate);
  };

  const filteredItems = filterItemsByDate(
    equipment.filter(e => 
      (e.item_name.toLowerCase().includes(nameSearch.toLowerCase()) || nameSearch === '') &&
      (e.item_id.toString().includes(idSearch) || idSearch === '')
    ),
    dateRange
  );

  const filterDoneItemsByDateRange = (items, range) => {
    const now = new Date();
    const dateRanges = {
      lastWeek: new Date(now.setDate(now.getDate() - 7)),
      lastMonth: new Date(now.setMonth(now.getMonth() - 1)),
      lastYear: new Date(now.setFullYear(now.getFullYear() - 1))
    };
    const startDate = dateRanges[range];
    return items.filter(item => 
      item.status === "done" && new Date(item.leave_date) >= startDate
    );
  };

  const doneItems = filterDoneItemsByDateRange(equipment, historyDateRange);

  const handleDownloadReport = async (type) => {
    const searchParams = type === 'tasks'
      ? { name: nameSearch, id: idSearch, dateRange }
      : { dateRange: historyDateRange };

    try {
      const response = await axios.post(`http://localhost:3000/auth/download-${type}-report`, searchParams, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <div className="report-container">
      <header className="navbar">
        <h1>Reports</h1>
      </header>

      <div className="content-section">
        
        {/* Tasks Report Section (First Section) */}
        <section className="section">
          <div className="section-header">
            <h4>Export tasks report:</h4>
            <button onClick={() => setShowEquipment(!showEquipment)} className="toggle-button">
              {showEquipment ? "Hide" : "Show More"}
            </button>
          </div>
          <p>Filter items in task by:</p>
          <div className="input-group">
            <input
              type="text"
              placeholder="Items Name"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="small-input"
            />
            <input
              type="text"
              placeholder="Items ID"
              value={idSearch}
              onChange={(e) => setIdSearch(e.target.value)}
              className="small-input"
            />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="small-input"
            >
              <option value="">Select Date Range</option>
              <option value="today">Today</option>
              <option value="nextWeek">Next Week</option>
              <option value="nextMonth">Next Month</option>
            </select>
            <button onClick={() => handleDownloadReport('tasks')} className="btn btn-download">
              Download Report
            </button>
          </div>
          <p className="summary-count">Items about to return: {filteredItems.length}</p>
          {showEquipment && (
            <div className="scrollable-content">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Date Issued</th>
                    <th>Inspect Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.item_id}>
                      <td>{item.item_id}</td>
                      <td>{item.item_name}</td>
                      <td>{item.item_description}</td>
                      <td>{item.leave_date}</td>
                      <td>
                        <Link to={`/admin/user_details/` + item.employee_id} className="btn btn-custom btn-sm">
                          View Details
                        </Link>                  
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="section-separator"></div>

        {/* History Report Section (Second Section) */}
        <section className="section">
          <div className="section-header">
            <h4>Export actions history report:</h4>
            <button onClick={() => setShowHistory(!showHistory)} className="toggle-button">
              {showHistory ? "Hide" : "Show More"}
            </button>
          </div>
          <p>View items with 'done' status by date range:</p>
          <div className="input-group">
            <select 
              value={historyDateRange} 
              onChange={(e) => setHistoryDateRange(e.target.value)} 
              className="small-input">
              <option value="">Select Timeframe</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastYear">Last Year</option>
            </select>
            <button onClick={() => handleDownloadReport('history')} className="btn btn-download">
              Download Report
            </button>
          </div>
          <p className="summary-count">Items with 'done' status: {doneItems.length}</p>
          {showHistory && (
            <div className="scrollable-content">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Leaving Date</th>
                    <th>Inspect Details</th>
                  </tr>
                </thead>
                <tbody>
                  {doneItems.map(item => (
                    <tr key={item.item_id}>
                      <td>{item.item_id}</td>
                      <td>{item.item_name}</td>
                      <td>{item.item_description}</td>
                      <td>{item.leave_date}</td>
                      <td>
                        <Link to={`/admin/user_details/` + item.employee_id} className="btn btn-custom btn-sm">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Report;
