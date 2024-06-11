import { useNavigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { api } from '../../config/api';
import { useTranslation } from 'react-i18next';


function RecoverPassword() {

  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

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
          {t("site-title") /* Gestor de ações */}
        </h1>
        <div className='field-box'>
          <label className='orientation-text'>
            e-mail
          </label>
          <input className='use-width default-input' type='text' onChange={(e) => setUser(e.target.value)} />
        </div>

        <div className='next-buttons padding-top'>
          <button type='submit' >{t("recover")/*recuperar*/}</button>
          <button className='green-button' type='button' onClick={goToLoginPage}>{t("back")/*voltar*/}</button>
        </div>
      </form>

    </main>
  )
}

export default RecoverPassword;