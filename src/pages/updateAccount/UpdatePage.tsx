import { LoadingCard } from "../../components/LoadingCard";
import { useState } from "react";
import "./UpdateStyle.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";

function RegisterPage() {
  const navigate = useNavigate();
  const goToHomePage = () => {
    navigate("/Home");
  };

  const [loading, setLoading] = useState(false);

  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      name: userName,
      password: userPassword,
    };

    if (userPassword !== userPasswordConfirmation) {
      alert("Senhas não conferem");
      return;
    } else {
      setLoading(true);
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
        <div className="title">Atualizar dados da conta</div>
        <div className="orientation-text">nome</div>
        <input
          className="use-width default-input"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <div className="orientation-text padding-top">senha</div>
        <input
          type="password"
          className="use-width default-input"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <div className="orientation-text padding-top">confirme sua senha</div>
        <input
          type="password"
          className="use-width default-input"
          value={userPasswordConfirmation}
          onChange={(e) => setUserPasswordConfirmation(e.target.value)}
        />

        <div className="next-buttons padding-top">
          <button type="submit" className="green-button small-font">
            atualizar
          </button>
          <button type="button" className="small-font" onClick={goToHomePage}>
            voltar
          </button>
        </div>
        <div>
          <button
            type="button"
            className="red-button dell-button use-width small-font"
            onClick={dellStocks}
          >
            deletar registros
          </button>
        </div>
      </form>
    </main>
  );
}

export default RegisterPage;
