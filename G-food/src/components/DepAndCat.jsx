import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const DepAndCat = () => {
  const [department, setDepartment] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <div className='px-5 mt-2'>
      <div className='d-flex justify-content-center mt-3'>
        <h4>Department List</h4>
      </div>
      <div className='mt-3'>
      <table className='table' style={{ border: "1px solid black", color: "black" }}>
      <thead className="text-center mb-3 ">
            <tr>
              <th>Name</th>
              <th>Manager Name</th>
              <th>Manager Email</th>
            </tr>
          </thead>
          <tbody className="text-center mb-3 ">
            {
              department.map((d, index) => (
                <tr key={index}>
                  <td>{d.name}</td>
                  <td>{d.manager_name}</td>
                  <td>{d.manager_email}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <Link 
        to='/admin/add_department' 
        className='btn btn-primary mb-3'
        style={{ width: '50%', backgroundColor: '#001f3f', color: 'white', margin: '0 auto', display: 'block' }}
      >
        Add Department
      </Link>


      <div className='d-flex justify-content-center mt-3'>
        <h4>Equipment Category List</h4>
      </div>
      <div className='mt-3'>
      <table className='table' style={{ border: "1px solid black", color: "black" }}>
      <thead className="text-center mb-3 ">
            <tr>
              <th>Category Name</th>
              <th>Manager Name</th>
              <th>Manager Email</th>
            </tr>
          </thead>
          <tbody className="text-center mb-3 ">
            {
              category.map((c, index) => (
                <tr key={index}>
                  <td>{c.category_name}</td>
                  <td>{c.manager_name}</td>
                  <td>{c.manager_email}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <Link 
        to='/admin/add_department' 
        className='btn btn-primary mb-3'
        style={{ width: '50%', backgroundColor: '#001f3f', color: 'white', margin: '0 auto', display: 'block' }}
      >
        Add Category To Equipment
      </Link>
    </div>
  );
}

export default DepAndCat;

