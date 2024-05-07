import {  Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/login/LoginPage.tsx"
import RegisterPage from "./pages/register/RegisterPage.tsx"
import HomePage from "./pages/home/HomePage.tsx"
import { useAuth } from "./store/useAuth.ts"
import { useEffect } from "react"

function App() {

  const {user, getUser} = useAuth()

  useEffect(()=> {
    getUser()
  }, [])

  
  return (
    <div className="app">
      
      <Routes>
        <Route path='/'  element={!user ? <LoginPage/> : <Navigate to="/home" />} />
        <Route path='/register' element={!user ?<RegisterPage/>: <Navigate to="/home" />} />
        <Route path='/home' element={user ?<HomePage/> : <Navigate to="/" />} />
      </Routes>   
    </div>
  )
}

export default App
