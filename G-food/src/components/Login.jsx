import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles/Styles.css'

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3000/verify")
      .then((result) => {
        if (result.data.Status) {
          if(result.data.role == "admin")
            navigate('/admin');
          else
            navigate('/employee/' + result.data.id);
        } 
        else 
          console.log("Error: " + result.data.Error);
      })
      .catch((err) => {
        console.log("MY ERROR: " + err);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/login', values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          const userData = {
            role: result.data.role,
            item_category_managment: result.data.item_category_managment,  
            category_name: result.data.category_name,
            department_managment: result.data.department_managment,
            department_name: result.data.department_name,
            id: result.data.id,
            email: result.data.email,
          };
          login(userData); 
          const role = result.data.role;
          if (role === "admin" || role === "itemCategoryAdmin") {
            navigate('/admin');
          } else if (role === "employee") {
            navigate(`/employee/${result.data.id}`);
          }
          // Add more role handling as needed
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => {
        console.log("MY ERROR: " + err);
      });
  };
  

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>

      <div className='p-3 rounded w-25 border loginForm'>
        <div className='text-warning'>
          {error && error}
        </div>
        <h2 className='text-center'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              name='email'
              autoComplete='off'
              placeholder='Enter email'
              className='form-control rounded-0'
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              name='password'
              autoComplete='off'
              placeholder='Enter password'
              className='form-control rounded-0'
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
          </div>
          <button className='btn btn-success w-100 rounded-0 mb-2'>Log in</button>
          <div className='mb-1'>
            <input type="checkbox" name="tick" id="tick" className='me-2' />
            <label htmlFor="tick">You agree with terms & conditions</label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

