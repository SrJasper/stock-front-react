import './styles/registerCard.css'

const RegisterStockCard = () => {

  const refreshPage = () => {
    window.location.reload();
  }
  
  function refresh(){
    refreshPage();
  }

  return (
    <div className="background-blocker">
      
      <form className="register-stock-form">
        <div className="title">
          Registrar nova ação
        </div>
        <div className="input-box padding-top">
          <label>Nome da ação</label>
          <input type="text"/>
        </div>
        <div className="input-box padding-top">
          <div className="input-row">
            <label>Simbolo da ação</label>
            <label className='mark'> ⓘ </label>
          </div>
          <input type="text"/>
        </div>
        <div className="input-box padding-top">
          <label>Quantidade</label>
          <input type="text"/>
        </div>
        <div className="input-box padding-top">
          <label>Preço</label>
          <input type="text"/>
        </div>
        <div className="input-box padding-top">
          <label>Data de compra</label>
          <input type="date"/>
        </div>

        <div className="create-button padding-top">
            <button type="button" className="confirm-button padding-top green-button">registrar</button>
        </div>
        <div className="create-button">
            <button type="button" className="cancel-button padding-top gray-button" onClick={refresh}>cancelar</button>
        </div>
      </form>
    </div>  
  )
}

export {RegisterStockCard}