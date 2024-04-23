import { useNavigate } from 'react-router-dom';
import './RegisterStyle.css';

function RegisterPage(){

  const navigate = useNavigate();
  const Login = () => {
    navigate('/home');
  }
  const Register = () => {
    navigate('/register');
  }

  return (
    <main>
      <form className="register-form">
        <div className="title" id="1">
            Stocks <br/> registrar
        </div>
        <div className="orientation-text">
            e-mail
        </div>
        <input type="text" id="emailInput"/>


        <div className="orientation-text padding-top">
            senha
        </div>
        <input type="password" id="firstPassword"/>

        <div className="orientation-text padding-top">
            confirme sua senha
        </div>
        <input type="password" id="confirmationPassword"/>
        {/* <div className="error" id="error-message">
            senhas diferentes!
        </div> */}


        <div className="next-buttons padding-top">
            <button type="button" className="entry-button" id="registerButton" onClick={Register}>register</button>
            <button type="button" className="entry-button" id="loginButton" onClick={Login}>login</button>
        </div>
    </form>
    </main>
  );
}

export default RegisterPage;