class Calculator {
  constructor() {
    this.result = '';
    this.currentValue = '';
    this.operator = null;
    this.operationalCommand = null;

    this.resultDisplay  = document.querySelector('.result-display');
    this.currentDisplay = document.querySelector('.current-display');

    this.initEventListener();
    this.initKeyboardListener();      // ← NEW
  }

  initEventListener() {
  this.calcButtons = document.querySelectorAll('.calc-button');
  this.calcButtons.forEach(el => {
    el.addEventListener('click', () => {
      const btn = el.innerHTML;

      if (el.classList.contains('operational-button')) {
        this.operationalCommand = btn;
        this.handleOperationalClick();

      } else if (el.classList.contains('operator-button')) {
        this.handleOperatorClick(btn);

      } else {
        if (btn === '.' && this.currentValue.includes('.')) {
          console.warn("Can't enter two decimals in a row!");
        } else {
          this.currentValue += btn;
        }
      }

      this.updateView();
    });
  });
}


  initKeyboardListener() {
    document.addEventListener('keydown', e => {
      const k = e.key;

      // digits and decimal
      if ((k >= '0' && k <= '9') || k === '.') {
        if (k === '.' && this.currentValue.includes('.')) {
          console.warn("Can't enter two decimals in a row!");
        } else {
          this.currentValue += k;
        }

      // operators
      } else if (k === '+' || k === '-' || k === '*' || k === '/') {
        const map = { '*': '×', '/': '÷' };
        this.handleOperatorClick(map[k] || k);

      // equals
      } else if (k === 'Enter' || k === '=') {
        this.handleOperatorClick('=');

      // clear all
      } else if (k === 'Escape' || k.toLowerCase() === 'c') {
        this.operationalCommand = 'AC';
        this.handleOperationalClick();

      // percent
      } else if (k === '%') {
        this.operationalCommand = '%';
        this.handleOperationalClick();

      // backspace
      } else if (k === 'Backspace') {
        this.operationalCommand = '⌫';
        this.handleOperationalClick();

      // toggle sign (you could pick another key if you like)
      } else if (k.toLowerCase() === 'p') {
        this.operationalCommand = '+/-';
        this.handleOperationalClick();

      } else {
        return; // ignore other keys
      }

      this.updateView();
      e.preventDefault();
    });
  }

    handleOperatorClick(operator) {
    if (this.operator !== null && this.currentValue === '') {
      this.operator = (operator === '=') ? null : operator;
      this.updateView();
      return;
    }

    // — otherwise do exactly what you had before:
    if (this.operator !== null) {
      const rhs = this.currentValue === '' ? this.result : this.currentValue;
      this.result = this.handleStringEquation(this.result, rhs, this.operator);
    } else if (this.currentValue !== '') {
      this.result = this.currentValue;
    }

    this.currentValue = '';
    this.operator     = (operator === '=') ? null : operator;
    this.updateView();
  }


  handleOperationalClick() {
    switch (this.operationalCommand) {
      case 'AC':
        this.currentValue = '';
        this.result = '';
        this.operator = null;
        this.operationalCommand = null;
        break;
      case '+/-':
        this.currentValue = this.currentValue.startsWith('-')
          ? this.currentValue.slice(1)
          : '-' + this.currentValue;
        break;
      case '%':
        const v = parseFloat(this.currentValue);
        if (!isNaN(v)) this.currentValue = String(v * 0.01);
        break;
      case '⌫':
        this.currentValue = this.currentValue.slice(0, -1);
        break;
    }
  }

  handleStringEquation(a, b, operator) {
    const n1 = parseFloat(a), n2 = parseFloat(b);
    if (isNaN(n1)) return String(n2);
    if (isNaN(n2)) return String(n1);

    let res;
    switch (operator) {
      case '+': res = n1 + n2; break;
      case '-': res = n1 - n2; break;
      case '×': res = n1 * n2; break;
      case '÷': res = (n2 === 0 ? NaN : n1 / n2); break;
      default:
        console.error('Unknown operator:', operator);
        return '';
    }
    return String(res);
  }

  updateView() {
    this.resultDisplay.textContent  = this.result;
    this.currentDisplay.textContent = this.currentValue;
  }
}

document.addEventListener('DOMContentLoaded', () => new Calculator());
