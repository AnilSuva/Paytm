
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Signin from './pages/Signin'
import Signup from './pages/Signup'


import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Redirect root (/) to /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace></Navigate>}></Route>

          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch-all route to redirect any unknown URLs to the dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
