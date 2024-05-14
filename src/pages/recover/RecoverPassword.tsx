import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


function RecoverPassword() {

  const [user, setUser] = useState("");

  const navigate = useNavigate();
  const goToLoginPage = () => {
    navigate('/');
  }

  async function RecoverPassword () {
    console.log('user: ', user);
    const response = await axios.get("https://stock-project-seven.vercel.app/users/info/" + user);
    console.log(response.data)
  }

  return (
    <main>
      <form className="register-form">
        <h1 className="title">
            Stocks
        </h1>
        <div className="field-box">
          <label className="orientation-text">
              e-mail
          </label>
          <input className='use-width' type="text" onChange={(e) => setUser(e.target.value)}/>
        </div>
        
        <div className="next-buttons padding-top">
            <button className='gray-button' type='button'onClick={RecoverPassword} >recuperar e-mail</button>
            <button className='green-button' type='button'onClick={goToLoginPage}>voltar</button>
        </div>
      </form>
      
    </main>
  )
}

export default RecoverPassword;