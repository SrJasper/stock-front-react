import { LoadingCard } from '../../components/LoadingCard';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './RegisterStyle.css';
import { useAuth } from '../../store/useAuth';

function RegisterPage(){

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
      <form onSubmit={handleSubmit} className="register-form">
        <div className="title">
            registrar nova conta
        </div>
        <div className="orientation-text">
            nome
        </div>
        <input className='use-width' type="text" value={userName} onChange={(e) => setUserName(e.target.value)}/>
        <div className="orientation-text padding-top">
            e-mail
        </div>
        <input className='use-width' type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/>
        <div className="orientation-text padding-top">
            senha
        </div>    
        <input type="password" className='use-width' value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/>
        <div className="orientation-text padding-top">
            confirme sua senha
        </div>
        <input type="password" className='use-width' value={userPasswordConfirmation} onChange={(e) => setUserPasswordConfirmation(e.target.value)}/>
     
        


        <div className="next-buttons padding-top">
            <button type="submit" className="green-button">register</button>
            <button type="button" className="gray-button" onClick={Login}>voltar</button>
        </div>
    </form>
    </main>
  );
}

export default RegisterPage;