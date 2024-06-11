  import { LoadingCard } from "../../components/LoadingCard";
import { useEffect, useState } from "react";
import "./UpdateStyle.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import { useTranslation } from "react-i18next";

function RegisterPage() {

  const navigate = useNavigate();
  const goToHomePage = () => {
    navigate("/Home");
  };

  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      name: userName,
      language: language,
      password: password,
    };

    if (password !== passwordConfirmation) {
      alert("Senhas não conferem");
      return;
    } else {
      setLoading(true);
      console.log(data);
      await api.patch("/users/patch/", data);
    }
    goToHomePage();
    setLoading(false);
    return "Usuário atualizado com sucesso!";
  }

  async function dellStocks() {
    setLoading(true);
    await api.delete("/stocks/dellall");
    setLoading(false);
    return "Registros deletados com sucesso!";
  }

  return (
    <main>
      {loading && <LoadingCard />}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="title">{t("update-title")/*Atualizar dados da conta*/}</div>
        
        <div className='line-display'>
          <div>
            <div className='orientation-text'>
              {t("register-nickname")/* apelido */}
            </div>
            <input className='use-width default-input' type='text' value={userName} onChange={(e) => setUserName(e.target.value)}/>
          </div>      
          <div className=''>
            <div className='orientation-text'>
              {t("register-language")/* Idioma */}
            </div>
            <select className='default-select use-width' value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">en</option>
              <option value="pt">pt</option>
            </select>

          </div>
        </div>

        <div className="orientation-text padding-top">{t("password")/*senha*/}</div>
        <input
          type="password"
          className="use-width default-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="orientation-text padding-top">{t("confirm-password")/*confirme sua senha*/}</div>
        <input
          type="password"
          className="use-width default-input"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />

        <div className="next-buttons padding-top">
          <button type="submit" className="green-button small-font">
            {t("update")/* atualizar */}
          </button>
          <button type="button" className="small-font" onClick={goToHomePage}>
            {t("back")/* voltar */}
          </button>
        </div>
        <div>
          <button
            type="button"
            className="red-button dell-button use-width small-font"
            onClick={dellStocks}
          >
            {t("delete-account")/* deletar conta */}
          </button>
        </div>
      </form>
    </main>
  );
}

export default RegisterPage;
