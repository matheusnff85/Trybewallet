import propTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { fetchCurrencies, fetchExpenses, removeExpense, editExpense } from '../actions';
import './Wallet.css';

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = {
      id: 0,
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
      editBtnIsOn: false,
    };
  }

  componentDidMount() {
    const { getCurrency } = this.props;
    getCurrency();
  }

  handleChange = ({ target }) => {
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({ [name]: value });
  };

  onAddExpenseButtonClick = async () => {
    let { id } = this.state;
    const { addExpense } = this.props;
    await addExpense(this.state);
    id += 1;
    this.setState({ id, value: '', description: '' });
  }

  findCoinName = (data) => {
    const coinName = data.exchangeRates[data.currency].name;
    return coinName.split('/')[0];
  };

  findCotation = (data) => {
    const coin = data.exchangeRates[data.currency].ask;
    return Number(coin);
  }

  getTotalOfExpenses = () => {
    const { expenses } = this.props;
    if (expenses.length === 0) return 0;
    const totalValue = expenses.map(({ value, currency, exchangeRates }) => (
      Number(exchangeRates[currency].ask) * Number(value)
    )).reduce((acc, curr) => acc + curr);
    return totalValue;
  }

  onExpenseEditBtn = ({
    id, value, description, method, tag, currency, exchangeRates }) => {
    const { editBtnIsOn } = this.state;
    if (editBtnIsOn) return this.setState({ editBtnIsOn: false });
    this.setState({
      editBtnIsOn: true,
      id,
      value,
      description,
      method,
      tag,
      currency,
      exchangeRates,
    });
  }

  onSubmitEditBtn = (state, expenses) => {
    const { editExpenseBtn } = this.props;
    editExpenseBtn(state, expenses);
    this.setState({ id: expenses.length, editBtnIsOn: false });
  }

  render() {
    const { value, description, editBtnIsOn } = this.state;
    const { email, currencies, expenses, removeExpenseBtn } = this.props;
    return (
      <>
        <header className="wallet-header">
          <h4 data-testid="email-field">{email}</h4>
          <div className="total-div">
            <h4>Despesa total: R$</h4>
            <h4 data-testid="total-field">
              { this.getTotalOfExpenses().toFixed(2) }
            </h4>
          </div>
          <h4 data-testid="header-currency-field" className="brl">BRL</h4>
        </header>
        <form className="expense-form">
          <label htmlFor="value">
            Valor:
            <input
              name="value"
              value={ value }
              id="value"
              type="number"
              data-testid="value-input"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="coin">
            Moeda:
            <select
              data-testid="currency-input"
              id="coin"
              onChange={ this.handleChange }
              name="currency"
            >
              { currencies.map((coin) => (
                <option key={ coin } value={ coin }>
                  { coin }
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="method">
            Método de Pagamento:
            <select
              id="method"
              data-testid="method-input"
              name="method"
              onChange={ this.handleChange }
            >
              <option>Dinheiro</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
            </select>
          </label>
          <label htmlFor="category">
            Categoria:
            <select
              id="category"
              data-testid="tag-input"
              name="tag"
              onChange={ this.handleChange }
            >
              <option>Alimentação</option>
              <option>Lazer</option>
              <option>Trabalho</option>
              <option>Transporte</option>
              <option>Saúde</option>
            </select>
          </label>
          <label htmlFor="description">
            Descrição:
            <input
              type="text"
              id="description"
              data-testid="description-input"
              name="description"
              value={ description }
              onChange={ this.handleChange }
            />
          </label>
          {editBtnIsOn
            ? (
              <button
                type="button"
                onClick={ () => this.onSubmitEditBtn(this.state, expenses) }
              >
                Editar despesa
              </button>)
            : (
              <button type="button" onClick={ this.onAddExpenseButtonClick }>
                Adicionar despesa
              </button>
            )}
        </form>
        <table>
          <tr>
            <th scope="col">Descrição</th>
            <th scope="col">Tag</th>
            <th scope="col">Método de pagamento</th>
            <th scope="col">Valor</th>
            <th scope="col">Moeda</th>
            <th scope="col">Câmbio utilizado</th>
            <th scope="col">Valor convertido</th>
            <th scope="col">Moeda de conversão</th>
            <th scope="col">Editar/Excluir</th>
          </tr>
          { expenses.length === 0 ? ''
            : (
              expenses.map((item) => (
                <tr key={ item.id }>
                  <td>{item.description}</td>
                  <td>{item.tag}</td>
                  <td>{item.method}</td>
                  <td>{Number(item.value).toFixed(2)}</td>
                  <td>{this.findCoinName(item)}</td>
                  <td>{this.findCotation(item).toFixed(2)}</td>
                  <td>{(Number(item.value) * this.findCotation(item)).toFixed(2)}</td>
                  <td>Real</td>
                  <td>
                    <button
                      type="button"
                      data-testid="edit-btn"
                      onClick={ () => this.onExpenseEditBtn(expenses[item.id]) }
                      className="edit-btn"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      data-testid="delete-btn"
                      onClick={ () => removeExpenseBtn(item.id, expenses) }
                      className="remove-btn"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
        </table>
      </>
    );
  }
}
Wallet.propTypes = {
  email: propTypes.string.isRequired,
  getCurrency: propTypes.func.isRequired,
  currencies: propTypes.arrayOf.isRequired,
  expenses: propTypes.arrayOf.isRequired,
  addExpense: propTypes.func.isRequired,
  removeExpenseBtn: propTypes.func.isRequired,
  editExpenseBtn: propTypes.func.isRequired,
};
function mapDispatchToProps(dispatch) {
  return {
    getCurrency: () => dispatch(fetchCurrencies()),
    addExpense: (state) => dispatch(fetchExpenses(state)),
    removeExpenseBtn: (id, data) => dispatch(removeExpense(id, data)),
    editExpenseBtn: (obj, expenses) => dispatch(editExpense(obj, expenses)),
  };
}
const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
});
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
