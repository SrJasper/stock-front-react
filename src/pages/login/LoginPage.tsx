import { LoadingCard } from "../../components/LoadingCard";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { useEffect, useState } from "react";
import "./LoginStyle.css";

function LoginPage() {

  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);


  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, error, login } = useAuth();

  const navigate = useNavigate();
  const goToRegisterPage = () => {
    navigate("/register");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (user === "" || password === "")
      return alert("Preencha todos os campos");
    await login({ email: user, password: password });
  }

  return (
    <main className="login">
      {isLoading && <LoadingCard />}
      <form onSubmit={handleSubmit} className="register-form">
        <h1 className="title">{t("site-title") /* Gestor de ações */}</h1>
        <div className="field-box">
          <label className="orientation-text">e-mail</label>
          <input
            className="use-width default-input"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className="field-box">
          <label className="orientation-text padding-top">{t("password")/*senha*/}</label>
          <input
            className="use-width default-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && error.message && (
          <div className="pass-rec">
            <p> {error.message} </p> {/* TRADUZIR */}
            <a href="/recover">{t("forgot-password")/*Esqueci a senha*/}</a>
          </div>
        )}
        <div className="next-buttons padding-top">
          <button
            className="small-font"
            type="button"
            onClick={goToRegisterPage}
          >
            {t("register")/*registrar*/}
          </button>
          <button className="small-font green-button" type="submit">
            login
          </button>
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
