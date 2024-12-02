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


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Login />} />
          <Route path='/employee_details/:id' element={
              <ProtectedRoute>
                <EmployeeDetails />
              </ProtectedRoute>
            } />
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
          </Route >
        </Routes>
      </BrowserRouter>
      
    </AuthProvider>
  )
}

export default App
