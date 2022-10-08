let operandHistory: number[] = [];
let operatorHistory: string[] = [];

const operands = document.querySelectorAll("[data-operand]");
const operators = document.querySelectorAll("[data-operator]");
const evaluate = document.querySelector("[data-operator='=']");
const result = document.querySelector("[data-control='result']");
const output = document.querySelector("[data-control='output']");
const clear = document.querySelector("[data-control='clear']");

operands.forEach((operand) => {
  operand.addEventListener("click", () => operandListener(operand));
});

operators.forEach((operator) => {
  operator.addEventListener("click", () => operatorListener(operator));
});

clear?.addEventListener("click", () => {
  resetOutput();
  resetResult();
});

evaluate?.addEventListener("click", () => {
  if (output?.textContent && output.textContent.length > 0) {
    const total = eval(output.textContent.slice(0, -1));
    if (result?.textContent && result.textContent === "0") {
      result.textContent = total;
    }
  }
});

function operandListener(el: Element) {
  if (output?.textContent?.endsWith("=")) {
    resetOutput();
    resetResult();
  }
  if (output && el instanceof HTMLElement) {
    const operand = el.dataset.operand;
    if (output.textContent) {
      const dot = ".";
      const lastOperand = trimOutputToFinalOperand(output.textContent);
      const isFraction = !!lastOperand.includes(dot);
      if (isFraction && operand === dot) return;
    }
    output.textContent += `${operand}`;
  }
}

function operatorListener(el: Element) {
  if (output && el instanceof HTMLElement) {
    const operator = el.dataset.operator;
    if (output.textContent) {
      const lastOperand = trimOutputToFinalOperand(output.textContent);
      if (lastOperand.length > 0 && operator) {
        output.textContent += `${operator}`;
        operandHistory.push(Number(lastOperand));
        operatorHistory.push(operator);
      }
    }
  }
}

function trimOutputToFinalOperand(str: string): string {
  return str.replace(/.*(\/|\*|\-|\+|\=)/, "");
}

function resetOutput() {
  if (output) {
    output.textContent = "";
  }
}
function resetResult() {
  if (result) {
    result.textContent = "0";
  }
}
