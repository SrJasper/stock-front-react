import RecoverPassword from "./pages/recover/RecoverPassword.tsx";
import UpdatePage from "./pages/updateAccount/UpdatePage.tsx";
import RegisterPage from "./pages/register/RegisterPage.tsx";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import { useAuth } from "./store/useAuth.ts";
import { useEffect, useState } from "react";
import { api } from "./config/api.ts";
import { useGuest } from "./store/useGuest.ts";

function App() {
  const { user, getUser } = useAuth();
  const { guest, getGuest } = useGuest();
  const [loadendUser, setLoadedUser] = useState(true);
  const [loadendGuest, setLoadedGuest] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await getUser();
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setLoadedUser(false);
    };
    loadUser();

    const loadGuest = async () => {
      const token = await getGuest();
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setLoadedGuest(false);
    };
    loadGuest();
  }, []);

  useEffect(() => {}, [user, guest]);

  if (loadendUser || loadendGuest) return <>Carregando...</>;

  return (
    <>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={!user && !guest ? <LoginPage /> : <Navigate to="/home" />}
          />
          <Route
            path="/recover"
            element={
              !user && !guest ? <RecoverPassword /> : <Navigate to="/home" />
            }
          />
          <Route
            path="/register"
            element={
              !user && !guest ? <RegisterPage /> : <Navigate to="/home" />
            }
          />
          <Route path="/update" element={<UpdatePage />} />
          <Route
            path="/home"
            element={user || guest ? <HomePage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
