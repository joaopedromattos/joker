import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FaInfo from "react-icons/lib/fa/info";
import FaCheckCircle from "react-icons/lib/fa/check-circle";
import "./Header.scss";
import Modal from 'react-responsive-modal';


class Header extends Component {
  static propTypes = { user: PropTypes.object };

  constructor() {
    super();

    this.state = {
      openInstructions: true,
      openDone: false,
      finishEnable: false,
      currentCount: 60,
      done: false
    };

    this.onOpenModalInstructions = this.onOpenModalInstructions.bind(this);
    this.onCloseModalInstructions = this.onCloseModalInstructions.bind(this);
    this.onOpenModalDone = this.onOpenModalDone.bind(this);
    this.onCloseModalDone = this.onCloseModalDone.bind(this);
    this.timer = this.timer.bind(this);
  }

  onOpenModalInstructions = () => {
    this.setState({ openInstructions: true });
  };

  onCloseModalInstructions = () => {
    this.setState({ openInstructions: false });
  };

  onOpenModalDone = () => {
    this.setState({ openDone: true, done: true });
  };

  onCloseModalDone = () => {
    this.setState({ openDone: false });
  };


  componentDidMount() {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }
 
  componentWillUnmount() {
      // use intervalId from the state to clear the interval
      clearInterval(this.state.intervalId);
  }
 
  timer() {
    // setState method is used to update the state
    this.setState({ currentCount: this.state.currentCount - 1 });
    if (this.state.currentCount == 0) {
      this.setState({finishEnable: true})
    }
  }

  render = () => {
    const { openInstructions, openDone } = this.state;

    return (
      <header>
        <Link to="/" className="header-title">
          {/*<img src={kanbanLogo} alt="React Kanban logo" />*/}
          &nbsp;
        </Link>
        <div className="header-right-side">
          <button onClick={this.onOpenModalInstructions} className="signout-link" >
            <FaInfo className="signout-icon" />
            &nbsp;Ajuda e informações
          </button>


          {
            this.state.finishEnable ? (
              <button className="concluir" onClick={this.onOpenModalDone}>
                <FaCheckCircle className="signout-icon" />
                &nbsp;Concluir
              </button>)
            :(
            <button className="movacartoes"  disabled="disabled">
              Organize os cartões para concluir
            </button>)
          }
        <Modal open={openInstructions} onClose={this.onCloseModalInstructions}>
          <h2 className="instructions-h2">Instruções</h2>
              
            <p><strong>Passo 1: </strong>Dê uma olhada na lista de cartões à esquerda. Nós gostaríamos que você os categorizasse como achar que faz sentido para você. O objetivo é categorizar todos os cartões.</p>

            <p><strong>Passo 2: </strong>Arraste cartões relacionados para uma mesma categoria. Criamos uma categoria inicial para você, mas você poderá criar quantas mais desejar.</p>

            <p><strong>Passo 3: </strong>Crie novas categorias sempre que achar necessário e arraste os cartões que desejar para a nova categoria.</p>

            <p><strong>Passo 4: </strong>Quando terminar, clique em "Concluir" no canto superior direito (o botão aparece após 1 minuto de uso). Diverta-se!</p>
            
            <p>Obs.: Não há resposta certa ou errada. Apenas faça o que vem naturalmente.</p>

            <button onClick={this.onCloseModalInstructions} className="buttonConfirm">Ok, entendi!</button>
        </Modal>

        <Modal open={openDone} center>
        
            <h2>Concluído</h2>
              
            <h3>Muito obrigado por sua participação!</h3>
        </Modal>

        </div>
      </header>
    );
  };
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(Header);
