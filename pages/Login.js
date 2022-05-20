import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { submitLogin } from '../actions';
import './Login.css';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
    };
  }

  handleChange = ({ target }) => {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({
      [name]: value,
    });
  };

  isValidEmailAndPassword = () => {
    const { email, password } = this.state;
    const regex = /^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+[a-zA-Z]$/;
    const minPassLength = 6;
    if (regex.test(email) === true && password.length >= minPassLength) {
      return true;
    }
    return false;
  }

  render() {
    const { email, password } = this.state;
    const { onLoginBtnClick } = this.props;
    const loginButtonIsDisabled = !this.isValidEmailAndPassword();
    return (
      <section className="login-container">
        <h2 className="login-title">
          <img
            src="https://cdn-icons-png.flaticon.com/512/214/214362.png"
            alt="wallet-icon"
          />
          TrybeWallet
        </h2>
        <input
          type="text"
          name="email"
          value={ email }
          onChange={ this.handleChange }
          placeholder="Insira seu e-mail"
          data-testid="email-input"
          className="login-page-input"
        />
        <input
          type="password"
          name="password"
          value={ password }
          onChange={ this.handleChange }
          placeholder="Insira sua senha"
          data-testid="password-input"
          className="login-page-input"
        />
        <Link to="/carteira">
          <button
            type="button"
            disabled={ loginButtonIsDisabled }
            onClick={ () => onLoginBtnClick(this.state) }
            className="login-button"
          >
            Entrar
          </button>
        </Link>
      </section>
    );
  }
}

Login.propTypes = {
  onLoginBtnClick: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onLoginBtnClick: (state) => dispatch(submitLogin(state)),
  };
}

export default connect(null, mapDispatchToProps)(Login);
