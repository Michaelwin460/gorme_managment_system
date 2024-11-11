import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';



const AddCategory = () => {
    const [category, setCategory] = useState({
      name: "",
      manager_name: "",
      manager_email: ""
    });

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(category.name);
        console.log(category.manager_name);
        console.log(category.manager_email);
        
        axios.post('http://localhost:3000/auth/add_equipment_category', category)
        .then((res) => {
            if(res.data.Status)
                navigate('/admin/depAndCat')
            else
                alert(res.data.Error)
        })
        .catch(err => console.log(err)
        )
    }

  return (
    <div className='d-flex justify-content-center align-items-center h-100 '>
      <div className='p-3 rounded w-25 border '>
        <h2 className='text-center'>Add Equipment Category</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor="add_category"><strong>Category Name</strong></label>
                <input 
                  type="text" 
                  autoComplete='off' 
                  placeholder='Enter Category Name'
                  className='form-control rounded-0' 
                  value={category.name}
                  onChange={(e) => 
                      setCategory({...category, name: e.target.value})
                  } />
            </div>
            <div className='mb-3'>
                <label htmlFor="add_category"><strong>Manager Name</strong></label>
                <input 
                  type="text" 
                  autoComplete='off' 
                  placeholder='Enter Manager Name'
                  className='form-control rounded-0' 
                  value={category.manager_name}
                  onChange={(e) => 
                      setCategory({...category, manager_name: e.target.value})
                  } />
            </div>
            <div className='mb-3'>
                <label htmlFor="add_category"><strong>Manager Email</strong></label>
                <input 
                  type="text" 
                  autoComplete='off' 
                  placeholder='Enter Manager Email'
                  className='form-control rounded-0' 
                  value={category.manager_email}
                  onChange={(e) => 
                      setCategory({...category, manager_email: e.target.value})
                  } />
            </div>

            <button className='btn btn-success w-100 rounded-0 mb-2'>Add</button>

        </form>
      </div>
    </div>
  )
}

export default AddCategory
