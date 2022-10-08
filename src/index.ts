const operands = document.querySelectorAll("[data-operand]");
const operators = document.querySelectorAll("[data-operator]");
const output = document.querySelector("[data-control='output']");
const clear = document.querySelector("[data-control='clear']");

operands.forEach((operand) => {
  operand.addEventListener("click", () => operandListener(operand));
});

operators.forEach((operator) => {
  operator.addEventListener("click", () => operatorListener(operator));
});

clear?.addEventListener("click", () => {
  if (output && output.textContent) {
    output.textContent = "";
  }
});

function operandListener(el: Element) {
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
      if (lastOperand.length > 0) {
        output.textContent += `${operator}`;
      }
    }
  }
}

function trimOutputToFinalOperand(str: string): string {
  return str.replace(/.*(\/|\*|\-|\+|\=)/, "");
}
