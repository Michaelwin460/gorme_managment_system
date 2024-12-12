import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import '../styles/Dashboard.css'

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios
      .get('http://localhost:3000/auth/logout')
      .then((res) => {
        if (res.data.Status) {
          localStorage.removeItem('valid');
          logout();
          navigate('/');
        } else alert(res.data.Error);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 sidebar-custom">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-dark min-vh-100">
            <Link to="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-decoration-none">
              <img src="errm_logo.png" alt="Logo" className="dashboard-logo" />
            </Link>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="w-100">
                <Link to="/admin" className="nav-link text-dark px-0 align-middle">
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/admin/user" className="nav-link px-0 align-middle text-dark">
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Users</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/admin/depAndCat" className="nav-link px-0 align-middle text-dark">
                  <i className="fs-4 bi-grid ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logistic Category</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/admin/report" className="nav-link px-0 align-middle text-dark">
                  <i className="fs-4 bi-file-earmark-bar-graph ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Reports</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/admin/notifications" className="nav-link px-0 align-middle text-dark">
                  <i className="fs-4 bi-bell ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Notifications</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/admin/equipment" className="nav-link px-0 align-middle text-dark">
                  <i className="fs-4 bi-box2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Stock</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/admin/requests" className="nav-link px-0 align-middle text-dark">
                  <i className="fs-4 bi-inbox ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Users Requests</span>
                </Link>
              </li>
              <li className="w-100">
                <Link className="nav-link px-0 align-middle text-dark">
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline" onClick={handleLogout}>
                    Logout
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col p-0 m-0">
          {/* Top Bar */}
          <div className="p-2 d-flex justify-content-center shadow top-bar">
            <h4>Equipment Request and Return Manager</h4>
          </div>
          <div>

          <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
