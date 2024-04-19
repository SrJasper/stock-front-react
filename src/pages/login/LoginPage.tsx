import { useNavigate } from 'react-router-dom';
import './LoginStyle.css';


function LoginPage() {

  const navigate = useNavigate();
  const goToRegisterPage = () => {
    navigate('/register');
  }
  const goToHomePage = () => {
    navigate('/home');
  }

  return (
    <main>
      <form className="register-form">
        <div className="title" id="1">
            Stocks
        </div>
        <div className="orientation-text">
            e-mail
        </div>
        <input type="text" id="emailInput"/>
        <div className="orientation-text padding-top">
            senha
        </div>
        <input type="password" id="passwordInput"/>
        <div  className="pass-rec centralize">
            <button type="button" id="password-recuperation">Esqueceu a senha</button>
        </div>
        <div className="next-buttons padding-top">
            <button type="button" className="entry-button" onClick={goToRegisterPage}>registrar</button>
            <button type="button" className="entry-button" onClick={goToHomePage}>login</button>
        </div>
      </form>
    </main>
  )
}

export default LoginPage;
