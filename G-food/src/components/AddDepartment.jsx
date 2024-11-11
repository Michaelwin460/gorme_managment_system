import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';



const AddDepartment = () => {
    const [department, setDepartment] = useState({
      name: "",
      manager_name: "",
      manager_email: ""
    });

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(department.name);
        console.log(department.manager_name);
        console.log(department.manager_email);
        
        axios.post('http://localhost:3000/auth/add_department', department)
        .then((res) => {
            if(res.data.Status)
                navigate('/admin/department')
            else
                alert(res.data.Error)
        })
        .catch(err => console.log(err)
        )
    }

  return (
    <div className='d-flex justify-content-center align-items-center h-100 '>
      <div className='p-3 rounded w-25 border '>
        <h2 className='text-center'>Add Department</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor="add_department"><strong>Department Name</strong></label>
                <input 
                  type="text" 
                  autoComplete='off' 
                  placeholder='Enter Department Name'
                  className='form-control rounded-0' 
                  value={department.name}
                  onChange={(e) => 
                      setDepartment({...department, name: e.target.value})
                  } />
            </div>
            <div className='mb-3'>
                <label htmlFor="add_department"><strong>Manager Name</strong></label>
                <input 
                  type="text" 
                  autoComplete='off' 
                  placeholder='Enter Manager Name'
                  className='form-control rounded-0' 
                  value={department.manager_name}
                  onChange={(e) => 
                      setDepartment({...department, manager_name: e.target.value})
                  } />
            </div>
            <div className='mb-3'>
                <label htmlFor="add_department"><strong>Manager Email</strong></label>
                <input 
                  type="text" 
                  autoComplete='off' 
                  placeholder='Enter Manager Email'
                  className='form-control rounded-0' 
                  value={department.manager_email}
                  onChange={(e) => 
                      setDepartment({...department, manager_email: e.target.value})
                  } />
            </div>

            <button className='btn btn-success w-100 rounded-0 mb-2'>Add</button>

        </form>
      </div>
    </div>
  )
}

export default AddDepartment
