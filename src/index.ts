class Calculator {
  currentOperand: string;

  operandHistory: number[];
  operatorHistory: string[];

  #output: Element;
  #result: Element;

  constructor(output: Element, result: Element) {
    this.currentOperand = "";
    this.operandHistory = [];
    this.operatorHistory = [];
    this.#output = output;
    this.#result = result;
  }

  resetCurrentOperand() {
    this.currentOperand = "";
  }
  resetOutput() {
    this.#output.textContent = "";
  }
  resetResult() {
    this.#result.textContent = "0";
  }

  get resultText() {
    return this.#result.textContent ?? "";
  }
  set resultText(text: string) {
    this.#result.textContent = text;
  }
  get outputText() {
    return this.#output.textContent ?? "";
  }
  set outputText(text: string) {
    this.#output.textContent = text;
  }
  get operands(): number[] {
    return this.operandHistory;
  }
  set operands(value: number[]) {
    this.operandHistory = value;
  }
  get operators(): string[] {
    return this.operatorHistory;
  }
  set operators(value: string[]) {
    this.operatorHistory = value;
  }
}

const operands = document.querySelectorAll("[data-operand]");
const operators = document.querySelectorAll("[data-operator]");
const evaluate = document.querySelector("[data-operator='=']");
const result = document.querySelector("[data-control='result']");
const output = document.querySelector("[data-control='output']");
if (!result) throw new Error("a selector was queried for result but not found");
if (!output) throw new Error("a selector was queried for output but not found");
const clear = document.querySelector("[data-control='clear']");

const calculator = new Calculator(output, result);

operands.forEach((operand) => {
  operand.addEventListener("click", () => operandListener(operand));
});

operators.forEach((operator) => {
  operator.addEventListener("click", () => operatorListener(operator));
});

clear?.addEventListener("click", () => {
  calculator.resetOutput();
  calculator.resetResult();
});

evaluate?.addEventListener("click", () => {
  const expression = calculator.outputText;
  if (expression && expression.length > 0) {
    const total = eval(expression.slice(0, -1));
    if (calculator.resultText && calculator.resultText === "0") {
      calculator.resultText = total;
    }
  }
});

function operandListener(el: Element) {
  if (calculator.outputText.endsWith("=")) {
    calculator.resetOutput();
    calculator.resetResult();
  }
  if (output && el instanceof HTMLElement) {
    const operand = el.dataset.operand;
    const dot = ".";
    const zero = "0";
    const lastOperand = calculator.currentOperand;
    const isFraction = !!lastOperand.includes(dot);
    const isZero = lastOperand === zero;
    if (isZero && operand === zero) return;
    if (lastOperand === "" && operand === zero) return;
    if (isFraction && operand === dot) return;
    calculator.outputText += `${operand}`;
    calculator.currentOperand += `${operand}`;
  }
}

function operatorListener(el: Element) {
  if (output && el instanceof HTMLElement) {
    const operator = el.dataset.operator;
    if (
      calculator.outputText.endsWith("=") &&
      calculator.resultText &&
      operator !== "="
    ) {
      calculator.outputText = calculator.resultText;
      calculator.currentOperand = calculator.resultText;
      calculator.operands = [];
      calculator.operators = [];
      calculator.resetResult();
    }
    if (output.textContent) {
      const lastOperand = calculator.currentOperand;
      if (lastOperand.length > 0 && operator) {
        calculator.outputText += `${operator}`;
        calculator.resetCurrentOperand();
        calculator.operands = [...calculator.operands, Number(lastOperand)];
        calculator.operators = [...calculator.operators, operator];
      }
    }
  }
}
