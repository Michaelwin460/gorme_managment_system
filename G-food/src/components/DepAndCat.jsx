import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/DepAndCat.css'

const DepAndCat = () => {
  const [department, setDepartment] = useState([]);
  const [category, setCategory] = useState([]);
  const [currentView, setCurrentView] = useState('department');
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    
    axios.get('http://localhost:3000/auth/department')
      .then((res) => {
        if (res.data.Status) {
          setDepartment(res.data.Result);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios.get('http://localhost:3000/auth/equipment_category')
      .then((res) => {
        if (res.data.Status) {
          setCategory(res.data.Result);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (index, row) => {
    setEditingRow(index);
    setEditedData({ ...row });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    const endpoint = currentView === 'department' 
      ? `http://localhost:3000/auth/update_department`
      : `http://localhost:3000/auth/update_category`;

    // console.log(editedData);
    

    axios.put(endpoint, editedData)
      .then((res) => {
        if (res.data.Status) {
          setEditingRow(null);
          setEditedData({});
          fetchData();
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="px-5 mt-4">
      <div className="d-flex justify-content-center p-2 mb-3" style={{ borderBottom: '2px solid #ccc' }}>
        <h4 className="mb-0">
          Control Company Departments or Logistic Equipment Category:
        </h4>
      </div>

      {/* Navbar */}
      <div className="navbar-custom d-flex justify-content-center align-items-center p-3 mb-4 rounded shadow">
        <button
          className={`btn mx-2 w-25`}
          onClick={() => setCurrentView('department')}
        >
          Department
        </button>
        <button
          className={`btn mx-2 w-25`}
          onClick={() => setCurrentView('category')}
        >
          Category
        </button>
      </div>

      {/* Content Header */}
      <div className="d-flex justify-content-center p-2 mb-3" style={{ borderBottom: '2px solid #ccc' }}>
        <h4 className="mb-0">{currentView === 'department' ? 'Department List' : 'Equipment Category List'}</h4>
      </div>

      {/* Table */}
      <div className="mt-3">
        <table className="table table-striped table-custom">
          <thead className="text-center">
            <tr>
              <th>Name</th>
              <th>Manager Name</th>
              <th>Manager Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {(currentView === 'department' ? department : category).map((item, index) => (
              <tr key={index}>
                {editingRow === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name={currentView === 'department' ? 'name' : 'category_name'}
                        value={editedData.name || editedData.category_name || ''}
                        onChange={handleInputChange}
                        className="form-control input-edit"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="manager_name"
                        value={editedData.manager_name || ''}
                        onChange={handleInputChange}
                        className="form-control input-edit"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="manager_email"
                        value={editedData.manager_email || ''}
                        onChange={handleInputChange}
                        className="form-control input-edit"
                      />
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={handleSave}>Save</button>
                      <button className="btn btn-secondary btn-sm ms-2" onClick={() => { setEditingRow(null); setEditedData({}); }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.name || item.category_name}</td>
                    <td>{item.manager_name}</td>
                    <td>{item.manager_email}</td>
                    <td>
                      <button className="btn btn-warning btn-sm edit-btn" onClick={() => handleEdit(index, item)}>
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Button */}
      <Link
        to={currentView === 'department' ? '/admin/add_department' : '/admin/add_equipment_category'}
        className="btn add-btn"
      >
        {currentView === 'department' ? 'Add Department' : 'Add Category To Equipment'}
      </Link>
    </div>
  );
};

export default DepAndCat;
