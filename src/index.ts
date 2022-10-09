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

const evaluate = queryElement(HTMLButtonElement, "[data-operator='=']");
const clear = queryElement(HTMLButtonElement, "[data-control='clear']");

const result = queryElement(HTMLSpanElement, "[data-control='result']");
const output = queryElement(HTMLSpanElement, "[data-control='output']");

const calc = new Calculator(output, result);

operands.forEach((operand) => {
  operand.addEventListener("click", () => operandListener(operand));
});

operators.forEach((operator) => {
  operator.addEventListener("click", () => operatorListener(operator));
});

clear.addEventListener("click", () => {
  calc.resetOutput();
  calc.resetResult();
});

evaluate.addEventListener("click", () => {
  const expression = calc.outputText;
  if (expression && expression.length > 0) {
    // remove the equals sign for evaluation
    const total = eval(expression.slice(0, -1));
    // prevent reevaluation of an old result
    if (calc.resultText && calc.resultText === "0") {
      calc.resultText = total;
    }
  }
});

function operandListener(el: HTMLButtonElement) {
  if (calc.outputText.endsWith("=")) {
    // a new operator clears a previously evaluated output
    calc.resetOutput();
    calc.resetResult();
  }

  const operand = el.dataset.operand;
  // handle various operand edge cases
  const isFraction = !!calc.currentOperand.includes(".");
  const isZero = calc.currentOperand === "0";
  // don't allow octal literals
  if (isZero && operand === "0") return;
  // can't start a calculation with 0
  if (calc.currentOperand === "" && operand === "0") return;
  // fractions have only one decimal place
  if (isFraction && operand === ".") return;

  calc.outputText += `${operand}`;
  calc.currentOperand += `${operand}`;
}

function operatorListener(el: HTMLButtonElement) {
  const operator = el.dataset.operator;
  // move previous result (ending with '=') to output and build upon them
  if (calc.outputText.endsWith("=") && calc.resultText && operator !== "=") {
    calc.outputText = calc.resultText;
    calc.currentOperand = calc.resultText;
    calc.operands = [];
    calc.operators = [];
    calc.resetResult();
  }
  if (output.textContent) {
    const lastOperand = calc.currentOperand;
    // push the current operand/operator to history, continue the expression
    if (lastOperand.length > 0 && operator) {
      calc.outputText += `${operator}`;
      calc.resetCurrentOperand();
      calc.operands = [...calc.operands, Number(lastOperand)];
      calc.operators = [...calc.operators, operator];
    }
  }
}

/**
 * Queries a null-checked element of a specific instance type.
 *
 * @remarks
 * slightly modified from https://effectivetypescript.com/2020/07/27/safe-queryselector/
 *
 * @param type - the expected type of the element to be queried
 * @param selector - the selector to query
 * @param parent - where to query (defaults to document)
 * @returns the matching element
 * @throws error if types do not match
 *
 */
function queryElement<T extends typeof Element>(
  type: T,
  selector: string,
  parent?: Document | Element
): InstanceType<T> {
  const el = checkedQuerySelector(parent ?? document, selector);
  if (!(el instanceof type)) {
    throw new Error(
      `Selector ${selector} matched ${el} which is not an ${type}`
    );
  }
  return el as InstanceType<T>;
}

/**
 * Returns a query selector that has been null checked already.
 *
 * @remarks
 * slightly modified from https://effectivetypescript.com/2020/07/27/safe-queryselector/
 *
 * @param parent - where the query selection will be made
 * @param selector - the selector to query
 * @returns the matching element
 * @throws error if nothing matches
 *
 */
function checkedQuerySelector(
  parent: Element | Document,
  selector: string
): Element {
  const el = parent.querySelector(selector);
  if (!el) {
    throw new Error(`Selector ${selector} didn't match any elements.`);
  }
  return el;
}
