export const LOGIN_ACTION = 'LOGIN_ACTION';
export const UPDATE_CURRIENCIES = 'UPDATE_CURRIENCIES';
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const REMOVE_EXPENSE = 'REMOVE_EXPENSE';
export const EDIT_EXPENSE = 'EDIT_EXPENSE';

export function submitLogin(state) {
  return {
    type: LOGIN_ACTION,
    payload: state.email,
  };
}

const fetchCurrency = (data) => ({
  type: UPDATE_CURRIENCIES,
  payload: data,
});

export const fetchCurrencies = () => async (dispatch) => {
  const apiData = await fetch('https://economia.awesomeapi.com.br/json/all');
  const result = await apiData.json();
  delete result.USDT;
  dispatch(fetchCurrency(result));
};

const fetchExpense = (data) => ({
  type: ADD_EXPENSE,
  payload: data,
});

export const fetchExpenses = (state) => async (dispatch) => {
  const apiData = await fetch('https://economia.awesomeapi.com.br/json/all');
  const result = await apiData.json();
  delete result.USDT;
  const { id, value, description, currency, method, tag } = state;
  const expenseObj = {
    id,
    value,
    description,
    currency,
    method,
    tag,
    exchangeRates: result,
  };
  dispatch(fetchExpense(expenseObj));
};

const removeAction = (array) => ({
  type: REMOVE_EXPENSE,
  payload: array,
});

export const removeExpense = (id, data) => (dispatch) => {
  const newArray = data.filter((item) => item.id !== id);
  dispatch(removeAction(newArray));
};

const editAction = (obj) => ({
  type: EDIT_EXPENSE,
  payload: obj,
});

export const editExpense = (editedExpense, expenses) => (dispatch) => {
  delete editedExpense.editBtnIsOn;
  dispatch(editAction(expenses[editedExpense.id] = editedExpense));
};
