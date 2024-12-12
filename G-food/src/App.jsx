import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import User from './components/User'
import Report from './components/Report'
import Notifications from './components/Notifications.jsx'
import DepAndCat from './components/DepAndCat'
import AddDepartment from './components/AddDepartment'
import AddCategory from './components/AddCategory.jsx'
import AddUser from './components/AddUser'
import EditUser from './components/EditUser'
import EmployeeDetails from './components/EmployeeDetails'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDisplayUser from './components/AdminDisplayUser'
import AddItemAdminPanel from './components/AddItemAdminPanel'
import { AuthProvider } from './components/AuthContext';
import Stock from './components/Equipment.jsx'
import AddItemToStock from './components/AddItemToStock.jsx'
import ManageItemInStock from './components/ManageItemInStock.jsx'
import Requests from './components/Requests.jsx'
import AddRequestEmployee from './components/AddRequestEmployee.jsx'
import EmployeeLayout from './components/EmployeeLayout.jsx'
import AdminManageRequest from './components/AdminManageRequest.jsx'


 


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Login />} />

          <Route path='/employee' element={
              <ProtectedRoute>
                <EmployeeLayout />
              </ProtectedRoute>
            } >
            <Route path=':id' element={<EmployeeDetails/>}></Route>
            <Route path='add_req/:id' element={<AddRequestEmployee/>}></Route>
          </Route>

          <Route path='/admin' element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } >
            <Route path='' element={<Home/>}></Route>
            <Route path='/admin/user' element={<User/>}></Route>
            <Route path='/admin/user_details/:id' element={<AdminDisplayUser/>}></Route>
            <Route path='/admin/report' element={<Report/>}></Route>
            <Route path='/admin/notifications' element={<Notifications/>}></Route>
            <Route path='/admin/depAndCat' element={<DepAndCat/>}></Route>
            <Route path='/admin/add_department' element={<AddDepartment/>}></Route>
            <Route path='/admin/add_equipment_category' element={<AddCategory/>}></Route>
            <Route path='/admin/add_user' element={<AddUser/>}></Route>
            <Route path='/admin/Edit_user/:id' element={<EditUser/>}></Route>
            <Route path='/admin/add_item/user/:id' element={<AddItemAdminPanel/>}></Route>
            <Route path='/admin/equipment' element={<Stock/>}></Route>
            <Route path='/admin/add_item_to_stock' element={<AddItemToStock/>}></Route>
            <Route path='/admin/manage_item_in_stock/:id' element={<ManageItemInStock/>}></Route>
            <Route path='/admin/requests' element={<Requests/>}></Route>
            <Route path='/admin/manage_request/:id' element={<AdminManageRequest/>}></Route>
          </Route >
        </Routes>
      </BrowserRouter>
      
    </AuthProvider>
  )
}

export default App
