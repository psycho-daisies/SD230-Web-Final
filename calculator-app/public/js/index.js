// Troy Brunette
// SD230 - Web Programming - Final Project - Calculator
// 12/07/2024
import Calculator from "./Calculator.js";

// Updated Calculator class
const calculator = new Calculator();

// Element Selections
const display = document.querySelector(".display");
const historyLog = document.querySelector("#history-log");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector(".equal");
const actionButtons = document.querySelectorAll(".action");

/**
 * Grabs the value from the button data attribute.
 * Used for number and operator buttons.
 *
 * @param {*} button
 *
 * @returns the data-value attribute of the button
 */
function getButtonValue(button) {
    return button.getAttribute("data-value");
}

// Event listeners
numberButtons.forEach((button) =>
    button.addEventListener("click", () => {
        const value = getButtonValue(button);
        console.log(`Number Button Clicked: ${value}`);
        display.textContent = calculator.handleNumbers(value);
    })
);

operatorButtons.forEach((button) =>
    button.addEventListener("click", () => {
        const value = getButtonValue(button);
        console.log(`Operator Button Clicked: ${value}`);
        display.textContent = value;
        calculator.handleOperators(value);
    })
);

actionButtons.forEach((button) =>
    button.addEventListener("click", () => {
        const value = getButtonValue(button);
        console.log(`Action Button Clicked: ${value}`);
        display.textContent = calculator.handleActions(value);
    })
);

// Separate Equals button logic
equalsButton.addEventListener("click", () => {
    const value = getButtonValue(equalsButton);
    console.log(`Equals Button Clicked: ${value}`);
    // let result = calculator.handleEquals2(value, addExpressionToHistory);
    let result = calculator.handleEquals(value);

    display.textContent = result;
    addToHistory();
});

// Clear history log
document.querySelector(".clear-history").addEventListener("click", () => {
    historyLog.innerHTML = "";
    calculator.clearHistoryLog();
});

/**
 * Function to add the last expression to the history log
 */
function addToHistory() {
    const historyLog = document.querySelector("#history-log");
    // Remove the highlight from the previous history item
    let highlightedItem = document.querySelector(".highlight");
    if (highlightedItem) {
        highlightedItem.classList.remove("highlight");
    }
    // Grab the history from the calculator
    let history = calculator.getHistory();

    // If the stack is not empty, add the last item to the history list
    if (history.length > 0) {
        console.log(`History: ${history}`);
        let lastItem = history[history.length - 1];
        if (lastItem.length === 4) {
            createExpressionElements(lastItem);
        } else {
            // Create a new list item and add the last item in the history array
            let historyItem = document.createElement("li");
            historyItem.classList.add("history-item");
            console.log(`Last Item: ${history}`);
            historyItem.textContent = lastItem;
            historyLog.appendChild(historyItem);
            historyItem.classList.add("highlight");
        }
    }
}


function createExpressionElements(expression) {
    const historyLog = document.querySelector("#history-log");

    // Create a new list item for the history log
    const historyLogItem = document.createElement("li");
    historyLogItem.classList.add("history-item");
    // Create the expression line
    const expressionSpan = document.createElement("span");
    expressionSpan.classList.add("expression");
    expressionSpan.textContent = `${expression[0]} ${expression[1]} ${expression[2]} =`;

    // Create the result line
    const resultSpan = document.createElement("span");
    resultSpan.classList.add("result");
    resultSpan.textContent = expression[3];

    // Put the expression and result together
    historyLogItem.appendChild(expressionSpan);
    historyLogItem.appendChild(document.createElement("br")); // Line break
    historyLogItem.appendChild(resultSpan);
    // Add the history item to the log
    historyLog.appendChild(historyLogItem);
    historyLogItem.classList.add("highlight");
}

/**
 * Adds an expression to the history log in the UI.
 *
 * @param {Array} expression - The expression array [num1, operator, num2, result].
 */
export function addExpressionToHistory(expression) {
    const historyLog = document.querySelector("#history-log");

    // Create a new list item for the history log
    const historyLogItem = document.createElement("li");
    historyLogItem.classList.add("history-item");

    // Edge case: No Operator or Error
    if (expression.length === 1) {
        if (expression[0].includes("Error")) {
            // Create a span for the error message
            const error = document.createElement("span");
            error.classList.add("error");
            error.textContent = expression[0];

            // Add the error to the history item
            historyLogItem.appendChild(error);
        } else {
            const result = document.createElement("span");
            result.classList.add("result");
            result.textContent = expression[0];

            // Add the result to the history item
            historyLogItem.appendChild(result);
        }
    } else {
        // Grab the expression values
        let num1 = expression[0];
        let operator = expression[1];
        let num2 = expression[2];
        let result = expression[3];

        // Create the expression line
        const expressionSpan = document.createElement("span");
        expressionSpan.classList.add("expression");
        expressionSpan.textContent = `${num1} ${operator} ${num2} =`;

        // Create the result line
        const resultSpan = document.createElement("span");
        resultSpan.classList.add("result");
        resultSpan.textContent = result;

        // Put the expression and result together
        historyLogItem.appendChild(expressionSpan);
        historyLogItem.appendChild(document.createElement("br")); // Line break
        historyLogItem.appendChild(resultSpan);
    }

    // Add the history item to the log
    historyLog.appendChild(historyLogItem);
}
