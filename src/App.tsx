import RecoverPasswordMobile from "./pages/recover/RecoverPasswordMobile.tsx";
import UpdatePageMobile from "./pages/updateAccount/UpdatePageMobile.tsx";
import RecoverPassword from "./pages/recover/RecoverPassword.tsx";
import UpdatePage from "./pages/updateAccount/UpdatePage.tsx";
import RegisterPage from "./pages/register/RegisterPage.tsx";
import HomePageMobile from "./pages/home/HomePageMobile.tsx";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import { useAuth } from "./store/useAuth.ts";
import { useEffect, useState } from "react";
import "./indexMobile.css";
import RegisterPageMobile from "./pages/register/RegisterPageMobile.tsx";
import { api } from "./config/api.ts";

function App() {
  const { user, getUser } = useAuth();
  const [loadendUser, setLoadedUser] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  const checkWindowSize = () => {
    let windowWidth: number;
    if (typeof window !== "undefined") {
      windowWidth = window.innerWidth;
      if (windowWidth >= 1024) {
        setIsDesktop(true);
      } else {
        setIsDesktop(false);
      }
    } else {
      console.log("vish kk");
    }
  };

  useEffect(() => {
    checkWindowSize();
  }, [isDesktop]);

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
      {isDesktop ? (
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
      ) : (
        <div className="app">
          <Routes>
            <Route
              path="/"
              element={!user ? <LoginPage /> : <Navigate to="/home" />}
            />
            <Route
              path="/recover"
              element={
                !user ? <RecoverPasswordMobile /> : <Navigate to="/home" />
              }
            />
            <Route
              path="/register"
              element={!user ? <RegisterPageMobile /> : <Navigate to="/home" />}
            />
            <Route path="/update" element={<UpdatePageMobile />} />
            <Route
              path="/home"
              element={user ? <HomePageMobile /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
