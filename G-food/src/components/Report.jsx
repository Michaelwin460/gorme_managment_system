import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from './AuthContext';
import axios from 'axios';
import '../styles/Reports.css';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 

const Report = () => {
  const { user } = useContext(AuthContext);
  const [equipment, setEquipment] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [dateRange, setDateRange] = useState(0);
  const [historyDateRange, setHistoryDateRange] = useState(0);
  const [isEquipmentManager, setIsEquipmentManager] = useState(-1);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user && user.item_category_managment !== -1) 
        setIsEquipmentManager(user.item_category_managment);

    axios.get(`http://localhost:3000/auth/equipment_by_category_and_user/${isEquipmentManager}`)
      .then(res => setEquipment(res.data.Status ? res.data.Result : []))
      .then(res => console.log(equipment))
      .catch(err => console.log(err));
  }, []);

  const filterItemsByDate = (items, range) => {
    const now = new Date();
    
    // Define date ranges using milliseconds for accurate time manipulation
    const ranges = [
      new Date(), // today
      new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
      new Date(now.setMonth(now.getMonth() + 3)) // 3 month later
    ];
  
    const endDate = ranges[range];
    
    // Compare item dates to the range end date
    return items.filter(item => {
      const itemDate = new Date(item.leave_date); // Convert to Date object
      // console.log("leave_date:", itemDate, "end Date:", endDate);
    
      // Return items where the item leave_date is before or equal to the endDate
      return itemDate <= endDate;
    });
  };
  
  const filteredItems = filterItemsByDate(
    equipment.filter(e => 
      (e.status.includes('leaving')) &&
      (e.item_name.toLowerCase().includes(nameSearch.toLowerCase()) || nameSearch === '') &&
      (e.item_id.includes(idSearch) || idSearch === '') 
    ),
    dateRange
  );

  const filterDoneItemsByDateRange = (items, range) => {
    const now = new Date();
    const ranges = [
      new Date(), // today
      new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days earlier
      new Date(now.setMonth(now.getMonth() - 1)), // 1 month earlier
      new Date(now.setMonth(now.getMonth() - 3)) // 3 month earlier
    ];
    const startDate = ranges[range];
    return items.filter(item => 
      (item.status === "done") && (new Date(item.leave_date) >= startDate)
    );
  };

  const doneItems = filterDoneItemsByDateRange(equipment, historyDateRange);
  
  const handleDownloadReportTasks = () => {
    const doc = new jsPDF();
    
    // Report title and metadata
    doc.setFontSize(18);
    doc.text(`TO DO LIST ITEMS REPORT:`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
    // Prepare data for the table
    const tableColumn = ["Name", "Email", "Phone", "Item name", "Description", "Return Date"];
    const tableRows = filteredItems.map(item => [
      item.name,
      item.email,
      item.phone,
      item.item_name,
      item.item_description,
      item.leave_date.toString().split("T")[0]
    ]);
  
    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      bodyStyles: { fillColor: [245, 245, 245] },
      styles: { cellPadding: 3, fontSize: 10 },
      margin: { top: 20 },
    });
  
    // Save the PDF
    doc.save("tasks_report.pdf");
  };

  const handleDownloadReportHistory = () => {
    const doc = new jsPDF();
    
    // Report title and metadata
    doc.setFontSize(18);
    doc.text(`ITEMS HISTORY REPORT:`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
    // Prepare data for the table
    const tableColumn = ["Name", "Email", "Phone", "Item name", "Description", "Return Date"];
    const tableRows = doneItems.map(item => [
      item.name,
      item.email,
      item.phone,
      item.item_name,
      item.item_description,
      item.leave_date.toString().split("T")[0]
    ]);
  
    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      bodyStyles: { fillColor: [245, 245, 245] },
      styles: { cellPadding: 3, fontSize: 10 },
      margin: { top: 20 },
    });
  
    // Save the PDF
    doc.save("history_report.pdf");
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
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="small-input"
            >
              <option value="0">Select Date Range</option>
              <option value="1">Today</option>
              <option value="2">Next Week</option>
              <option value="3">Next Month</option>
            </select>
            <button onClick={() => handleDownloadReportTasks()} className="btn btn-download">
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
                      <td>{new Date(item.leave_date).toISOString().split("T")[0]}</td>
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
              onChange={(e) => setHistoryDateRange(Number(e.target.value))} 
              className="small-input">
              <option value="0">Select Timeframe</option>
              <option value="1">Last Week</option>
              <option value="2">Last Month</option>
              <option value="3">Last Year</option>
            </select>
            <button onClick={() => handleDownloadReportHistory()} className="btn btn-download">
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
                      <td>{new Date(item.leave_date).toISOString().split("T")[0]}</td>
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
