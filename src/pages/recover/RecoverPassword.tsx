import { useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { api } from '../../config/api';


function RecoverPassword() {

  const [user, setUser] = useState('');

  const navigate = useNavigate();
  const goToLoginPage = () => {
    navigate('/');
  }

  async function RecoverPassword(e: FormEvent) {
    e.preventDefault();
    const response = await api.post('/users/recovery', {
      email: user
    });
    console.log(response.data)
  }

  return (
    <main>
      <form onSubmit={RecoverPassword} className='register-form'>
        <h1 className='title'>
          Stocks
        </h1>
        <div className='field-box'>
          <label className='orientation-text'>
            e-mail
          </label>
          <input className='use-width default-input' type='text' onChange={(e) => setUser(e.target.value)} />
        </div>

        <div className='next-buttons padding-top'>
          <button type='submit' >recuperar</button>
          <button className='green-button' type='button' onClick={goToLoginPage}>voltar</button>
        </div>
      </form>

    </main>
  )
}

export default RecoverPassword;