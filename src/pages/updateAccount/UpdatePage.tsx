import { LoadingCard } from '../../components/LoadingCard';
import { useState } from 'react';
import Cookies from "js-cookie";
import './UpdateStyle.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage(){

  const navigate = useNavigate();
  const goToHomePage = () => {
    navigate('/Home');
  }

  const [loading, setLoading] = useState(false);  
  const token = Cookies.get("refreshToken");

  const [userName, setUserName] = useState("");  
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState("");

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();

    const data = {
      name: userName,
      password: userPassword
    }

    if(userPassword !== userPasswordConfirmation){      
      alert("Senhas não conferem");
      return;
    } else{      
      setLoading(true);
      await axios.patch(
        "https://stock-project-seven.vercel.app/users/patch/", 
        data,
        {headers: {Authorization: `Bearer ${token}`}}
      )   
    }
    goToHomePage();
    setLoading(false);
    return 'Usuário atualizado com sucesso!';
  }

  async function dellStocks(){
    setLoading(true);
    await axios.delete(
      "https://stock-project-seven.vercel.app/stocks/dellall",
      {headers: {Authorization: `Bearer ${token}`}}
    )
    setLoading(false);
    return 'Registros deletados com sucesso!';
  }
   
  return (
    <main>
      {loading && <LoadingCard/>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="title">
            Atualizar dados da conta
        </div>
        <div className="orientation-text">
            nome
        </div>
        <input className='use-width' type="text" value={userName} onChange={(e) => setUserName(e.target.value)}/>
        <div className="orientation-text padding-top">
            senha
        </div>    
        <input type="password" className='use-width' value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/>
        <div className="orientation-text padding-top">
            confirme sua senha
        </div>
        <input type="password" className='use-width' value={userPasswordConfirmation} onChange={(e) => setUserPasswordConfirmation(e.target.value)}/>
     
        <div className="next-buttons padding-top">
            <button type="submit" className="green-button">atualizar</button>
            <button type="button" className="gray-button" onClick={goToHomePage}>voltar</button>
        </div>
        <div>
          <button 
          type="button" 
          className="red-button dell-button use-width"
          onClick={dellStocks}>
            deletar registros 
          </button>
        </div>
    </form>
    </main>
  );
}

export default RegisterPage;