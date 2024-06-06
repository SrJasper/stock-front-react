import RecoverPassword from "./pages/recover/RecoverPassword.tsx";
import UpdatePage from "./pages/updateAccount/UpdatePage.tsx";
import RegisterPage from "./pages/register/RegisterPage.tsx";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import { useAuth } from "./store/useAuth.ts";
import { useEffect, useState } from "react";
import { api } from "./config/api.ts";

function App() {
  const { user, getUser } = useAuth();
  const [loadendUser, setLoadedUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await getUser();
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setLoadedUser(false);
    };
    loadUser();
  }, []);

  if (loadendUser) return <>Carregando...</>;

  return (
    <>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={!user ? <LoginPage /> : <Navigate to="/home" />}
          />
          <Route
            path="/recover"
            element={!user ? <RecoverPassword /> : <Navigate to="/home" />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/home" />}
          />
          <Route path="/update" element={<UpdatePage />} />
          <Route
            path="/home"
            element={user ? <HomePage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
