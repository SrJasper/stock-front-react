import { useNavigate } from "react-router-dom";
import './HomeStyle.css';

function HomePage() {

  const navigate = useNavigate();
  const Logout = () => {
    navigate('/home');
  }

  return(
    <main>
      <div className="header-container">
        <h1>Stocks</h1>
        <div>
            <div className="info">user</div>
            <div className="info">email@teste.com</div>
        </div>
        <div className="exit-button" onClick={Logout}> sair </div>
      </div>

      <div className="market-body">
        <div className="search-tab">
            <p>Procurar ação</p>
            <input type="text"/>
            <button> pesquisar </button>
            <button className="reg-button"> Registrar ação </button>
        </div>

        <div className="search-symbol">
          <select>
            <option value="opcao1"> Selecionar ação </option>
            <option value="opcao2">Opção 2</option>
            <option value="opcao3">Opção 3</option>
          </select>
        </div>

        <ol className="stock-pannel" id="stocks">
            <li className="stock">
                <div>
                  <div className="stock-name">
                      <p>Gerdau S.A</p>
                      <p>GGB</p>                    
                  </div>
                  <div className="stock-info">
                      <p>R$</p>
                      <p className="stockValue">4.24</p>
                  </div>
                  <p>Valor pago </p>
                  <p className="stockOpen">4.43</p>                           
                </div>
                <button className="sell-button"> vender </button>
            </li>
        </ol>
      </div>
    </main>
  )
}

export default HomePage;