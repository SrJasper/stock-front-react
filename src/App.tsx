import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/login/LoginPage.tsx"
import RegisterPage from "./pages/register/RegisterPage.tsx"
import HomePage from "./pages/home/HomePage.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/home' element={<HomePage/>} />
      </Routes>    
    </BrowserRouter>
  )
}

export default App
