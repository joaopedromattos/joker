import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";import "./LandingPage.scss";
import classnames from "classnames";
import slugify from "slugify";

class LandingPage extends Component {
  static propTypes = {
    boards: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,
    listsById: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  enterAsGuest = () => {
    this.props.dispatch({ type: "ENTER_AS_GUEST" });
  };

  render = () => {

    const { boards, listsById, history } = this.props;

    

    return (
    <div className="landing-page">
      <Helmet>
        <title>Carding Sort Project</title>
      </Helmet>
      <div className="landing-page-info-wrapper">
        <div className="landing-page-info">
          <p className="landing-page-description">
            Olá,</p>

            <p className="landing-page-description">
              Esta atividade dura menos de 5 min, as instruções de como completá-la serão exibidas assim que prosseguir para a mesma. 
            </p>

            <p className="landing-page-description">
              Este formulário é parte de uma pesquisa realizada pelos pesquisadores da Universidade de São Paulo (USP).
            </p>
            <ul>
                <li>Me. André de Lima Salgado (Doutorando)</li>
                <li>Felipe Silva Dias (Mestrando)</li>
                <li>Anderson Canale Garcia (Mestrando) </li>
                <li>Dra. Renata P. M. Fortes (Professora)</li>            
              </ul>
            <p className="landing-page-description">
              Nossa pesquisa é sobre o controle (limites no uso) feito por pais e mães sobre o uso da Internet pelos filhos.
            </p>
            <p className="landing-page-description">
              Sua opinião é importante para nos ajudar a descobrir o agrupamento de termos que mais faz sentido para um aplicativo.
            </p>
            <p className="landing-page-description">
              Não se preocupe, não é necessário conhecimento específico para participar, você é quem definirá o agrupamento segundo suas preferências.
            </p>

            <p className="landing-page-description">
              Lembramos que todas as informações fornecidas são anônimas, e não visamos identificar sua individualidade em nenhum momento da pesquisa.
            </p>

            <p className="landing-page-description">
              Caso aceite participar, clique em “começar”.
            </p>

            <p className="landing-page-description">
              Muito obrigado,<br />

              André, Felipe, Anderson e Renata
            </p>
            
            <p><i>Agradecimentos  aos  processos  nº  2017/15239
                -
                0  e  nº  2015/24525
                -
                0,  da  Fundação  de Amparo à Pesquisa do Estado de São Paulo (FAPESP), que financiaram esta pesquisa.</i></p>
          
            <p><i>
            As opiniões, hipóteses e conclusões ou recomendações expressas neste material são de responsabilidade do(s) autor(es) e não necessariamente refletem a visão da FAPESP.
              
              </i></p>  
          <div className="signin-buttons">

            <div className="guest-button-wrapper">

              <Link to="/boardAccess">
                <button className="signin-button guest-button">
                  Começar
                </button>
              </Link>

              {/* {boards.map(board => (
                <Link
                  key={board._id}
                  to={`/b/${board._id}/${slugify(board.title, {
                    lower: true
                  })}`}
                  onClick={this.enterAsGuest}
                >
                  <div className="guest-button-wrapper">
                    <button className="signin-button guest-button">
                      Começar
                  </button>
                  </div>
                </Link>
              ))} */}
              <br/>
              <Link to="/researcherAuth">
                <button className="signin-button guest-button">
                  Área do pesquisador
                </button>
              </Link>
              
            </div>                        
          </div>
        </div>
      </div>
    </div>);
  }
}


const mapStateToProps = state => ({
  boards: Object.values(state.boardsById),
  listsById: state.listsById
});

export default connect(mapStateToProps)(LandingPage);
