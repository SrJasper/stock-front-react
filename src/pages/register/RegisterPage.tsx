import { LoadingCard } from '../../components/LoadingCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import { useEffect, useState } from 'react';
import './RegisterStyle.css';
import { useTranslation } from 'react-i18next';

function RegisterPage(){

  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  const navigate = useNavigate();
  const Login = () => {
    navigate('/');
  }
  const [userName, setUserName] = useState("");  
  const [userEmail, setUserEmail] = useState("");  
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState("");
   

  const {error, isLoading, register} = useAuth()

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()

    await register({email: userEmail, name: userName, password: userPassword, confirmPassword: userPasswordConfirmation})

    if(!error) {
      navigate("/")
    }
  }
  
  return (
    <main>
      {isLoading && <LoadingCard/>}
      <form onSubmit={handleSubmit} className='register-form'>
        <div className='title'>
          {t("register-title")/* {Registrar nova conta} */}
        </div>
        <div className='orientation-text'>
          {t("register-nickname")/* apelido */}
        </div>
        <input className='use-width default-input' type='text' value={userName} onChange={(e) => setUserName(e.target.value)}/>
        <div className='orientation-text padding-top'>
          e-mail
        </div>
        <input className='use-width default-input' type='text' value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/>
        <div className='orientation-text padding-top'>
          {t("password")/* senha */}
        </div>    
        <input type='password' className='use-width default-input' value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/>
        <div className='orientation-text padding-top'>
          {t("confirm-password")/* confirme sua senha */}
        </div>
        <input type='password' className='use-width default-input' value={userPasswordConfirmation} onChange={(e) => setUserPasswordConfirmation(e.target.value)}/>
     
        <div className='next-buttons padding-top'>
          <button type='submit' className='green-button small-font'>{t("register")/*register*/}</button>
          <button type='button' className='small-font' onClick={Login}>{t("back")/*voltar*/}</button>
        </div>
      </form>
    </main>
  );
}

export default RegisterPage;