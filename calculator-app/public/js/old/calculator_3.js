// Troy Brunette
// SD230 - Web Programming - Project Final - Calculator
// 12/05/2024

// Calculator Module - Handles the calculator logic and operations

//TODO: Refactor the calculator module to use a class
//1. Create a class called Calculator
//2. Move all the functions into the class as methods
//3. Export the class as the default export
//4. Import the class in the main.js file
//5. Refactor the event listeners to use the class methods

// Element Selections
const display = document.querySelector(".display");
const historyLog = document.querySelector("#history-log");


// Variables
const numbers = [];
const operators = ["+", "-", "*", "/", "%"];
let currentNumber = "";
let currentOperator = "";
let history = [];


// Initialize the calculator
export function initializeCalculator() {
    clearAll();
}

/**
 * Function to clear all values back to original state
 */
export function clearAll() {
    currentOperator = "";
    currentNumber = "";
    numbers.length = 0;
    updateDisplay("0");
}


/**
 *
 * Function to update the display with the current number, operator, or result
 *
 * @param {*} value
 */
export function updateDisplay(value) {
    display.textContent = value !== undefined ? value : currentNumber || "0";
};


/**
 * Function to format the results for display.
 * Keeping only two decimal places.
 * 
 * @param {*} result
 * 
 * @returns formatted result for display use
 *
 */
function formatResults(result) {
    if (result.toString().includes(".")) {
        return parseFloat(result.toFixed(2));
    } else {
        return result;
    };
};



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
};


/**
 * Function to add the last expression to the history log
 */
function addToHistory() {
    // Remove the highlight from the previous history item
    let highlightedItem = document.querySelector(".highlight");
    if (highlightedItem) {
        highlightedItem.classList.remove("highlight");
    };

    // If the stack is not empty, add the last item to the history list
    if (history.length > 0) {
        let lastItem = history[history.length - 1];
        // Create a new list item and add the last item in the history array
        let historyItem = document.createElement("li");
        historyItem.classList.add("history-item");
        historyItem.textContent = lastItem;
        historyLog.appendChild(historyItem);
        historyItem.classList.add("highlight");
    };
};









/**
 * Main calculate function to handle the math operations
 * 
 * @returns returns the result of the calculation
 */
function calculate() {
    // Check for valid numbers and operator before proceeding
    if (numbers.length < 2 || !currentOperator) return;

    let result;
    let a = Number(numbers[0]);
    let b = Number(numbers[1]);

    // For debugging
    console.log(`a: ${a}, b: ${b}, operator: ${currentOperator}`);

    // Perform the calculation
    switch (currentOperator) {
        case "+":
            result = a + b;
            break;
        case "-":
            result = a - b;
            break;
        case "*":
            result = a * b;
            break;
        case "/":
            result = divide(a, b);
            break;
        case "%":
            result = modulo(a, b);
            break;
        default:
            console.log("Error: Calculation Failed")
            return;
    };

    // Validate the results for display
    if (typeof result === "number" && !isNaN(result)) {
        result = formatResults(Number(result));
        updateDisplay(result);

        // Add the expression to the history log
        history.push(`${a} ${currentOperator} ${b} = ${result}`);
        addToHistory();
        // Clear numbers array and store the results for calculations
        numbers.length = 0;
        numbers.push(parseFloat(result));
    } else {
        updateDisplay("Error");
        clearAll();
        console.log("Error: Invalid result");
    };

    // Clear current operator
    currentOperator = "";

    return result;
};


// Handles operator buttons for [+, -, *, /, %] and calls the calculate function
export function handleOperators(value) {
    console.log(`Operator Button Clicked: ${value}`);
    if (operators.includes(value)) {
        if (currentNumber !== "") {
            numbers.push(parseFloat(currentNumber));
            currentNumber = "";
        }
        currentOperator = value;
        console.log(`Operator Button Clicked: ${value}`);
        if (numbers.length > 1) {
            calculate();
        }
        updateDisplay(currentOperator);
    };
}

// Refactored number button logic to handle all number buttons
export function handleNumbers(value) {
    console.log(`Number Button Clicked: ${value}`);
    currentNumber += value;
    updateDisplay(currentNumber);
}


// Separate Equals button logic
export function handleEquals(value) {
    if (value === "=") {
        if (currentNumber !== "" && currentNumber !== NaN) {
            numbers.push(parseFloat(currentNumber));
            currentNumber = "";
        };
        let result = calculate();
        history.push(
            `${Number(numbers[0])} ${currentOperator} ${Number(numbers[1])} = ${result}`
        );
        updateDisplay(result);
        console.log(`Equals Button Clicked: ${result}`);
    };
}



// Action buttons for clear, plus/minus, and decimal buttons
export function handleActions(value) {
    console.log(`Action Button Clicked: ${value}`);
    if (value === "clear") {
        clearAll();
    } else if (value === "+/-") {
        currentNumber = changeSign(Number(currentNumber));
        updateDisplay(currentNumber);
    } else if (value === "%") {
        currentNumber = calculatePercentage(Number(currentNumber));
        updateDisplay(currentNumber);
    } else if (value === ".") {
        currentNumber += handleDecimal(currentNumber);
        updateDisplay(currentNumber);
    }
}


/**
 * Change the sign of a number by multiplying by -1.
 * Expects a number as input.
 * 
 * @param {number} num
 * 
 * @returns number with the sign changed
 */
function changeSign(num) {
    return num * -1;
};


/**
 * Function to add a decimal to a number.
 * 
 * @param {*} inputNumber 
 * 
 * @returns a number with a decimal as a string
 */
function handleDecimal(inputNumber) {
    // Convert input number to a string
    const numberString = String(inputNumber);

    // Check for a decimal in the number
    if (numberString.includes(".")) {
        return numberString;
    };

    // Check for empty string or zero
    if (numberString === "" || numberString === "0") {
        return "0.";
    };

    // add a decimal to the number
    return ".";
};


/**
 * Function for division, handles division by zero
 * Expects two numbers as input
 * 
 * @param {number} a 
 * 
 * @param {number} b 
 * 
 * @returns the result of the division
 */
function divide(a, b) {
    if (b === 0) return "Error: Division by zero";
    return a / b;
};


/**
 * Function for modulo, handles division by zero
 * Expects two numbers as input
 * 
 * @param {number} a 
 * 
 * @param {number} b 
 * 
 * @returns the result of the modulo operation
 */
function modulo(a, b) {
    if (b === 0) return "Error: Division by zero";
    return a % b;
};