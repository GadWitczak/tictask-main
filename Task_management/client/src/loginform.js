import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';
import { Link } from 'react-router-dom';

class Loginform extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", passwordVisible: false };
  }

  componentDidUpdate(prevProps) {
    // Se as credenciais forem inválidas, exibe um alerta
    if (this.props.credentials !== prevProps.credentials) {
      if (this.props.credentials === "invalid") {
        alert("Incorrect username/password");
      }
      if (this.props.credentials === "acccreated") {
        alert("Account created successfully");
      }
    }
  }

  // Alterna a visibilidade da senha
  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      passwordVisible: !prevState.passwordVisible
    }));
  };

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  render() {
    return (
      <div className="container-fluid text-white">
        <center>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'blue', marginRight: 0, marginLeft: 150 }}>
              <img src={require("./images/logo.png")} style={{ width: 948, height: 1080 }} />
            </div>
            <div style={{ backgroundColor: 'purple', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 250, marginRight: 500, marginTop: -200 }}>
              <img src={require("./images/login.png")} style={{ width: 143, height: 227, marginTop: -150, marginBottom: 100, marginLeft: 250 }} />

              <form action="http://localhost:9000/login" method="POST" autoComplete="off" style={{ display: "inline-block", backgroundColor: 'gray' }} className="form-group">
                <label style={{ color: 'black', backgroundColor: 'yellow', marginRight: 385, marginBottom: 10 }}>Usuário</label>
                <input
                  className="form-control-lg"
                  style={{ width: 452, height: 44 }}
                  placeholder='Nome@gmail.com'
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                  type="text"
                  name="username"
                /><br /><br />
                <label style={{ backgroundColor: 'yellow', color: 'black', marginRight: 385, marginBottom: 10 }}>Senha</label>
                <input
                  className="form-control-lg"
                  style={{ width: 452, height: 44 }}
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  type={this.state.passwordVisible ? 'text' : 'password'} // Alterna entre 'text' e 'password'
                  name="password"
                /><br /><br />
                <button type="button" onClick={this.togglePasswordVisibility} style={{ marginBottom: 10 }}>
                  {this.state.passwordVisible ? 'Ocultar Senha' : 'Ver Senha'}
                </button><br /><br />
                <button className="btn btn-primary" type="submit">Login</button>
              </form>

              <Link to="/createacc">
                <button className="btn btn-primary" style={{ marginLeft: 190 }}>Criar Conta</button>
              </Link>
            </div>
          </div>
        </center>
      </div>
    );
  }
}

export default Loginform;
