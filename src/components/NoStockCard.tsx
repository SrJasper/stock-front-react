import './styles/noStockCard.css'

const NoStockCard = () => {
  
  return (
    <div className='use-width'>
      <div className='no-stock-card'>
        <h2>Parece que você ainda não tem simulações</h2>
        <p>
          Para fazer uma nove simulação, procure por uma ação pelo simbolo no balão de procurar ação
          à cima. Se não souber o simbolo, clique no link "Ver lista de ações (ibovespa)" para ver uma
          lista de ações disponíveis.
        </p>
        <hr className='padding-line'/>
        <h2>Sobre o site</h2>
        <p>
          O Monitor de ações é um site que permite que você interaja com ações da bolsa de
          valores realizando simulações ou registros reais.<br />
          Ao escolher um ativo pelo link "Ver lista de ações (ibovespa)", você terá a opção
          de realizar uma simulação ou de registrar a ação (que pode ser real) em sua carteira
          no site. E ao realizar a venda o site mostrará um card com informações sobre a rentabilidade
          da ação realizando alguns cálculos para mostrar informações de venda
          relevantes para o investidor sem que ele tenha que se dar ao trabalho de fazer isso.<br />
        </p>
        <hr className='gap-line black'/>
        <div className='horizontal-texts'>
          <div>
            <h2 className='green-text'>Simulação</h2>
            <p>
              A simulação é uma forma de você acompanhar o desempenho de uma ação sem precisar
              investir dinheiro real. <br />
              Para realizar uma simulação, procure pelo simbolo da ação no balão de procurar
              ação e clique em "Comprar". Ao fazer isso, um balão aparecerá pedindo que informe
              a quantidade de ações que deseja comprar. Após informar a quantidade, clique em
              "Comprar" novamente e a simulação será realizada. <br />
              Para realizar a venda, clique em "Vender" a plataforma irá mostrar um card com 
              informações sobre a rentabilidade da simulação. Esse cartão leva em consideração
              valores que o usuário não poderá controlar, como data de compra e venda, preço de
              venda e compra e proventos. Depois disso, se o usuário "estiver satisfeito" com a 
              simulação, é só clicar novamente em "vender" e pronto.<br />
              Esse é o tipo mais rápido de interação com o site e não requer que o usuário
              coloque mais informações para monitorar a ação, entretanto também,
              data de compra e venda, preço de compra e venda e proventos serão valores
              serão automaticos, isto é, estão fora do controle do usuário. <br />
              Essa é uma alternativa para quem deseja "brincar de investir" usando ações reais
              pela plataforma.
            </p>
            </div>
          <hr />
          <div>
            <h2 className='blue-text'>Registro</h2>
            <p>
              O registro é uma forma de você adicionar ações reais à sua carteira no site. <br />
              Para registrar uma ação tem doi jeitos, procure pelo simbolo da ação no balão 
              de procurar ação e clique em "Registrar" ou você pode clicar em "Registrar ação"
              (O segundo jeito está apenas disponível em computadores). <br />
              Ao fazer isso, um balão aparecerá pedindo que informe o nome da ação, o simbolo
              a quantidadem, o preço e o dia em que a ação foi comprada, esses valores já virão
              preenchidos caso a ação seja registrada a partir de uma pesquisa pelo balão de
              pesquisa, mas podem ser alterados (caso o usuário modifique o nome e simbolo
              da ação, o processo de buscar os dados automáticamente poderá ficar comprometido)
              após informar os valores, clique em "Registrar" e a ação será registrada. <br />
              Para realizar a venda, clique em "Vender" a plataforma irá mostrar um card que 
              pede para que o usuário complete algumas informações sobre a venda para que as
              informações de rentabilidade sejam calculadas com mais precisão.
              Após informar os valores, clique em "Vender", aparecerá um card com informações do 
              mesmo jeito que as simualções, mas com valores que o usuário informou. <br />
              Esse é o tipo mais completo de interação com o site e requer que o usuário coloque
              mais informações para monitorar a ação. Também pode ser usado para "brincar de
              investir" mas pode ser usado como um registrador de ações reais, informando ao 
              usuário informações reais sobre ações que ele possui em sua carteira. Podendo ser 
              usada como uma ferramenta real de monitoramento de ações.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export {NoStockCard}