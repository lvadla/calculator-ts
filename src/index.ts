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

const operands = document.querySelectorAll<HTMLButtonElement>("[data-operand]");
const operators =
  document.querySelectorAll<HTMLButtonElement>("[data-operator]");
const evaluate = document.querySelector<HTMLButtonElement>(
  "[data-operator='=']"
);
const result = document.querySelector("[data-control='result']");
const output = document.querySelector("[data-control='output']");
if (!result) throw new Error("a selector was queried for result but not found");
if (!output) throw new Error("a selector was queried for output but not found");
const clear = document.querySelector<HTMLButtonElement>(
  "[data-control='clear']"
);

const calc = new Calculator(output, result);

operands.forEach((operand) => {
  operand.addEventListener("click", () => operandListener(operand));
});

operators.forEach((operator) => {
  operator.addEventListener("click", () => operatorListener(operator));
});

clear?.addEventListener("click", () => {
  calc.resetOutput();
  calc.resetResult();
});

evaluate?.addEventListener("click", () => {
  const expression = calc.outputText;
  if (expression && expression.length > 0) {
    const total = eval(expression.slice(0, -1));
    if (calc.resultText && calc.resultText === "0") {
      calc.resultText = total;
    }
  }
});

function operandListener(el: HTMLButtonElement) {
  if (calc.outputText.endsWith("=")) {
    calc.resetOutput();
    calc.resetResult();
  }
  if (output) {
    const operand = el.dataset.operand;
    const dot = ".";
    const zero = "0";
    const lastOperand = calc.currentOperand;
    const isFraction = !!lastOperand.includes(dot);
    const isZero = lastOperand === zero;
    if (isZero && operand === zero) return;
    if (lastOperand === "" && operand === zero) return;
    if (isFraction && operand === dot) return;
    calc.outputText += `${operand}`;
    calc.currentOperand += `${operand}`;
  }
}

function operatorListener(el: HTMLButtonElement) {
  if (output) {
    const operator = el.dataset.operator;
    if (calc.outputText.endsWith("=") && calc.resultText && operator !== "=") {
      calc.outputText = calc.resultText;
      calc.currentOperand = calc.resultText;
      calc.operands = [];
      calc.operators = [];
      calc.resetResult();
    }
    if (output.textContent) {
      const lastOperand = calc.currentOperand;
      if (lastOperand.length > 0 && operator) {
        calc.outputText += `${operator}`;
        calc.resetCurrentOperand();
        calc.operands = [...calc.operands, Number(lastOperand)];
        calc.operators = [...calc.operators, operator];
      }
    }
  }
}
