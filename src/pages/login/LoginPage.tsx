import { LoadingCard } from '../../components/LoadingCard';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './LoginStyle.css';
import { useAuth } from '../../store/useAuth';


function LoginPage() {

  const [user, setUser] = useState("");  
  const [password, setPassword] = useState("");  

  const navigate = useNavigate();
  const goToRegisterPage = () => {
    navigate('/register');
  }

  const {isLoading, error,login} = useAuth()


  async function handleSubmit(e:React.FormEvent){
    e.preventDefault()

    await login({email: user, password: password})
  }

  return (
    <main className='login'>
      
      {isLoading && <LoadingCard/>}
      <form onSubmit={handleSubmit} className="register-form">
        <h1 className="title">
            Stocks
        </h1>
        <div className="field-box">
          <label className="orientation-text">
              e-mail
          </label>
          <input className='use-width' type="text" value={user} onChange={(e) => setUser(e.target.value)}/>
        </div>
        <div className="field-box">
          <label className="orientation-text padding-top">
              senha
          </label>
          <input className='use-width' type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        {/* <div  className="pass-rec centralize">
            <button type="button">Esqueceu a senha</button>
        </div> */}
        {error && error.message && <p> {error.message} </p>}
        <div className="next-buttons padding-top">
            <button className='gray-button' type='button' onClick={goToRegisterPage}>registrar</button>
            <button className='green-button' type='submit'>login</button>
        </div>
      </form>
    </main>
  )
}

export default LoginPage;
