import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from './AuthContext';


const Dashboard = () => {

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios
    .get("http://localhost:3000/auth/logout")
    .then((res) => {
      if (res.data.Status) {
        localStorage.removeItem("valid");
        logout();
        navigate('/');
      }
      else alert(res.data.Error);
    })
    .catch((err) => console.log(err));
  }

  return (
    <div className='container-fluid'>
      <div className='row flex-nowrap'>
        <div className='col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark'
          style={{ position: 'sticky', top: 0, height: '100vh' , overflowY: 'auto'}}
        >
          <div className='d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100'>
            <Link to='/dashboard'
              className='d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none'
                ><span className="fs-5 fw-bolder d-none d-sm-inline">
                Welcome to G-Food
              </span></Link>
            <ul 
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/admin"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/admin/user"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Manage Users
                  </span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/admin/depAndCat"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-columns ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Departments & Equipment Category</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/admin/report"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-person ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Reports</span>
                </Link>
              </li>
              <li className="w-100" >
              <Link
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline" 
                    onClick={handleLogout}>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='col p-0 m-0'>
          <div className='p-2 d-flex justify-content-center shadow'
            style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff' }}
          >
            <h4>Equipment Managment System</h4>
          </div>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
