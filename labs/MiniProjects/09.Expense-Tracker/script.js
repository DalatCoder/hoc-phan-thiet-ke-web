const dom = (function () {
  const balance = document.getElementById('balance');
  const money_plus = document.getElementById('money-plus');
  const money_minus = document.getElementById('money-minus');
  const list = document.getElementById('list');
  const form = document.getElementById('form');
  const text = document.getElementById('text');
  const amount = document.getElementById('amount');
  const error_text = document.getElementById('error-text');
  const error_amount = document.getElementById('error-amount');
  const errorContainer = document.getElementById('error-container');

  return {
    balance,
    money_plus,
    money_minus,
    list,
    form,
    text,
    amount,
    error_text,
    error_amount,
    errorContainer,
  };
})();

// const examples = [
//   { id: 1, text: 'flowers', amount: '-50' },
//   { id: 2, text: 'salary', amount: '300' },
//   { id: 3, text: 'book', amount: '-50' },
//   { id: 4, text: 'camera', amount: '-50' },
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions = localStorageTransactions || [];

// Add transaction to collection
function addTransaction(text, amount) {
  const transaction = {
    id: generateID(),
    text,
    amount,
  };

  transactions.push(transaction);

  // Clear inputs
  dom.text.value = '';
  dom.amount.value = '';

  // Add to DOM
  addTransactionDOM(transaction);

  // Update
  updateValues();
  updateLocalStorage();
}

// Generate random ID
function generateID() {
  return Date.now();
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  const { amount, text } = transaction;
  // Get sign
  const sign = amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  item.classList.add(sign === '+' ? 'plus' : 'minus');
  item.innerHTML = `
    ${text} <span>${sign}${Math.abs(amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${
      transaction.id
    })">x</button>
  `;

  dom.list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map((e) => parseFloat(e.amount));
  const balance = amounts.reduce((total, cur) => (total += cur), 0);
  const totalIncome = amounts
    .filter((num) => num > 0)
    .reduce((total, cur) => (total += cur), 0);
  const totalExpense = amounts
    .filter((num) => num < 0)
    .reduce((total, cur) => (total += cur), 0);

  dom.balance.innerText = 'đ' + formatMoney(balance) + ' x 1000';
  dom.money_plus.innerText = '+đ' + formatMoney(totalIncome);
  dom.money_minus.innerText = '-đ' + formatMoney(Math.abs(totalExpense));
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((e) => e.id !== id);

  updateLocalStorage();

  Init();
}

// Format number as money
function formatMoney(money) {
  return money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // 12,345.67
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function Init() {
  dom.list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}
Init();

// Event listeners
dom.form.addEventListener('submit', onFormSubmit);

dom.text.addEventListener('input', onTextInput);
dom.amount.addEventListener('change', onAmountChange);
dom.amount.addEventListener('input', onAmountChange);

// Handle events
function onFormSubmit(event) {
  event.preventDefault();
  const innerText = dom.text.value;
  const amountValue = dom.amount.value;

  const textErrorMsg = analysisTextInput(innerText);
  const amountErrorMsg = analysisAmountInput(amountValue);

  if (!textErrorMsg && !amountErrorMsg) {
    addTransaction(innerText, amountValue);
    return;
  }

  if (textErrorMsg) {
    dom.error_text.innerText = textErrorMsg;
    dom.error_text.classList.add('show');
  }

  if (amountErrorMsg) {
    dom.error_amount.innerText = amountErrorMsg;
    dom.error_amount.classList.add('show');
  }
}

function onTextInput(event) {
  const value = event.target.value;

  const errorMessage = analysisTextInput(value);
  if (!errorMessage) {
    if (dom.error_text.classList.contains('show')) {
      dom.error_text.classList.remove('show');
    }
    return;
  }

  dom.error_text.innerText = errorMessage;
  dom.error_text.classList.add('show');
}

function onAmountChange(event) {
  const value = event.target.value;

  const errorMessage = analysisAmountInput(value);
  if (!errorMessage) {
    if (dom.error_amount.classList.contains('show')) {
      dom.error_amount.classList.remove('show');
    }
    return;
  }

  dom.error_amount.innerText = errorMessage;
  dom.error_amount.classList.add('show');
}

// Bussiness logic
function analysisTextInput(innerText) {
  const text = innerText.trim();

  if (text.length == 0) {
    return 'Mô tả không được để trống!';
  }

  if (text.length > 30) {
    return 'Mô tả quá dài!';
  }

  return '';
}

function analysisAmountInput(amountInput) {
  const amount = parseInt(amountInput);

  if (amount === 0 || Number.isNaN(amount)) {
    return 'Số lượng tiền không hợp lệ!';
  }

  return '';
}
