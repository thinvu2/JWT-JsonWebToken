import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if(!user) return <Navigate to="/login" replace={true}></Navigate>
  return <Outlet></Outlet>
}

const UnauthorizedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if(user) return <Navigate to="/dashboard" replace={true}></Navigate>
  return <Outlet></Outlet>
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace={true} />
      } />

      
      <Route element={<UnauthorizedRoute />}>
      <Route path='/login' element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
      
    </Routes>
  )
}

export default App
