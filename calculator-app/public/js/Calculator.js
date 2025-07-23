// Troy Brunette
// SD230 - Web Programming - Project Final - Calculator
// 12/06/2024

// Calculator Module - Handles the calculator logic and operations

//TODO 
//* [x] - Refactor previous calculator assignment
//* [x] - Create a class called Calculator
//* [x] - Move all the functions into the class as methods
//* [x] - Export the class as the default export
//* [x] - Import the class in the main
//* [x] - Refactor the event listeners to use the class methods
//* [x] - Test the application to ensure it still works

/**
 * Calculator class handles the core logic for the calculator 
 * math operatiors, numbers, actions, and history log.
 */
export default class Calculator {
    /**
     * Initialize the calculator with default values
     *
     * @constructor
     *
     * @property {array} numbers - array to hold the numbers
     * @property {array} operators - array to hold the operators
     * @property {string} currentNumber - the current number
     * @property {string} currentOperator - the current operator
     * @property {array} history - array to hold the history log
     *
     */
    constructor() {
        this.numbers = [];
        this.operators = ["+", "-", "*", "/", "%"];
        this.currentNumber = "";
        this.currentOperator = "";
        this.history = [];
    }

    /**
     * Function to clear all values back to original state
     * 
     * @returns {string} - sets the display back to "0"
     */
    clearAll() {
        this.currentOperator = "";
        this.currentNumber = "";
        this.numbers.length = 0;
        return "0";
    }

    /**
     * Function to clear the history log
     */
    clearHistoryLog() {
        this.history.length = 0;
    }

    /**
     * Function to get the history log
     * @returns {array} - the history log
     */
    getHistory() {
        return this.history;
    }


    /**
     *
     * Handles what value should be displayed on the calculator
     * based on the current state of the calculator or the value passed in.
     *
     * @param {*} value - specific value to display
     * @returns {string} - the value to display
     */
    updateDisplayValue(value) {
        return value !== undefined ? value : this.currentNumber || "0";
    }

    /**
     * Function to format the results for display.
     * Keeping only two decimal places.
     *
     * @param {number} - the number to format
     *
     * @returns {number} - The formatted number
     *
     */
    formatResults(result) {
        return result.toString().includes(".")
            ? parseFloat(result.toFixed(2))
            : result;
    }

    /**
     * Function to handle input of numbers
     * @param {string} number - the number input
     *
     * @param {*} number - The number to display
     */
    handleNumbers(number) {
        if (this.currentNumber === "0") {
            this.currentNumber = number;
        } else {
            this.currentNumber += number;
        }
        return this.updateDisplayValue();
    }

    /**
     * Function to handle the operator input.
     * Stores the current number and sets the current operator.
     *
     * @param {string} value - the operator input
     *
     * @returns {string} - the value to display
     */
    handleOperators(value) {
        // If no current number or result from previous calculation, default to "0"
        if (!this.currentNumber && !this.numbers.length) {
            this.numbers.push("0");
        }

        // The current number is stored in the numbers array and reset for the next input
        if (this.currentNumber) {
            this.numbers.push(this.currentNumber);
            this.currentNumber = "";
        }

        // Set the operator
        this.currentOperator = value;

        // Update the display
        return this.updateDisplayValue();
    }

    /**
     * Handles the action buttons for the calculator.
     *
     * @param {string} value - The action input (e.g., "clear", "+/-", ".").
     * @returns {string} The updated display value.
     */
    handleActions(value) {
        // Clear all values and reset the display
        if (value === "clear") return this.clearAll();

        if (value === "+/-") {
            if (!this.currentNumber) {
                // If there is no current number, check for previous calculations in numbers
                if (this.numbers.length) {
                    // Flip the sign of the last result in numbers
                    this.numbers[0] = this.changeSign(Number(this.numbers[0]));
                    return this.updateDisplayValue(this.numbers[0]);
                }
                // Default to "0" if no numbers or current input
                return this.updateDisplayValue("0");
            }

            // Change the sign of the current number
            this.currentNumber = this.changeSign(Number(this.currentNumber));
            return this.updateDisplayValue(this.currentNumber);
        }

        if (value === ".") {
            // Add a decimal point if not already present
            if (!this.currentNumber.includes(".")) {
                this.currentNumber += ".";
            }
            return this.updateDisplayValue(this.currentNumber);
        }

        // Default case: return current display without changes
        return this.updateDisplayValue();
    }

    handleEquals() {
        // Store the current number for calculation
        if (this.currentNumber) {
            this.numbers.push(this.currentNumber);
        }
        // Edge case: no operator or enough numbers to calculate
        if (!this.currentOperator || this.numbers.length < 2) {
            // Uses whatever number is available as the result in this edge case
            const result = this.currentNumber || this.numbers[0] || "0";
            this.history.push(result);
            return this.updateDisplayValue(result);
        }

        // Perform calculation
        let result = this.calculate();
        result = this.formatResults(result);

        if (result === "Error: Divide by 0") {
            this.history.push(result);
            return this.updateDisplayValue(result);
        }

        // Build the expression for the history log
        const expression = [
            this.numbers[0],
            this.currentOperator,
            this.numbers[1],
            result,
        ];
        // const expression = `${this.numbers[0]} ${this.currentOperator} ${this.numbers[1]} = ${result}`;
        this.history.push(expression);

        // Prepare for the next calculation
        this.numbers = [result]; // Use result as the base for the next calculation
        this.currentNumber = "";
        this.currentOperator = "";

        return result;
    }

    /**
     * Function to calculate the results
     *
     * @returns the result of the calculation
     */
    calculate() {
        let result = 0;
        let num1 = Number(this.numbers[0]);
        let num2 = Number(this.numbers[1]);
        switch (this.currentOperator) {
            case "+":
                result = num1 + num2;
                break;
            case "-":
                result = num1 - num2;
                break;
            case "*":
                result = num1 * num2;
                break;
            case "/":
                result = this.divide(num1, num2);
                break;
            case "%":
                result = this.modulo(num1, num2);
                break;
            default:
                break;
        }

        return result;
    }

    /**
     * Function to change the sign of a number by multiplying by -1.
     * Expects a number as input.
     *
     * @param {number} num
     *
     * @returns number with the sign changed
     */
    changeSign(num) {
        return num * -1;
    }

    /**
     * Function to add a decimal to a number.
     *
     * @param {string} currentNumber
     *
     * @returns the decimal point
     */
    handleDecimal(currentNumber) {
        if (!currentNumber.includes(".")) {
            return ".";
        } else {
            return "";
        }
    }

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
    divide(a, b) {
        if (b === 0) return "Error: Divide by 0";
        return a / b;
    }

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
    modulo(a, b) {
        if (b === 0) return "Error: Divide by 0";
        return a % b;
    }
}
