import React, { useState } from 'react'
import '../styles.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const EmployeeLogin = () => {

  const navigate = useNavigate()

  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post('http://localhost:3000/employee/employeelogin', values)
    .then((result) => {
      if(result.data.loginStatus){
        localStorage.setItem("valid", true);
        navigate('/employee_details/' + result.data.id)
      } 
      else setError(result.data.Error)
    })
    .catch((err) => {
        console.log("MY ERROR: "+err)
    })
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded w-25 border loginForm'>
        <div className='text-warning'>
          {error && error}
        </div>
        <h2 className='text-center'>Employee Login page</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor="email"><strong>Email</strong></label>
                <input type="email" name='email' autoComplete='off' placeholder='Enter email'
                    className='form-control rounded-0' onChange={(e) => 
                        setValues({...values, email: e.target.value})} />
            </div>
            <div className='mb-3'>
                <label htmlFor="password"><strong>Password</strong></label>
                <input type="password" name='password' autoComplete='off' placeholder='Enter password'
                    className='form-control rounded-0' onChange={(e) => 
                        setValues({...values, password: e.target.value})}/>
            </div>
            <button className='btn btn-success w-100 rounded-0 mb-2'>Log in</button>
            <div className='mb-1'>
                <input type="checkbox" name="tick" id="tick" className='me-2'/>
                <label htmlFor="password">You are agree with terms & conditions</label>
            </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeLogin