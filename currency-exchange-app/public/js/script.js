// Troy Brunette
// SD230 - Web Programming - Project 3 - Currency Converter
// 12/07/2024
// Currency Converter Program - Converts from one currency to another using the exchange rates.

// Frequently used elements
const startingCurrency = document.getElementById("starting-currency");
const targetCurrency = document.getElementById("target-currency");
const resultElement = document.getElementById("conversion-result");
const convertButton = document.getElementById("convert-button");
const switchButton = document.getElementById("switch-button");
const convertTab = document.getElementById("convert-tab");
const convertContent = document.getElementById("converter-form");

// Global variable for the currency data
let CURRENCY_DATA = null;


// Constants for the forward and backward arrows
let forward = "⇆";
let backward = "⇄";

// Initialize the dropdowns and event listener
document.addEventListener("DOMContentLoaded", initializeApp);

// Event listener for the Convert button
convertButton.addEventListener("click", (event) => {
    event.preventDefault();
    convertCurrency();
});


/**
 * Switch the selected currencies in the dropdowns.
 */
// Event listener for the Switch button
switchButton.addEventListener("click", () => {
    if (switchButton.textContent === forward) {
        switchButton.textContent = backward;
    } else {
        switchButton.textContent = forward;
    }

    console.log("Switching currencies");
    const fromCurrencyValue = startingCurrency.value;
    startingCurrency.value = targetCurrency.value;
    targetCurrency.value = fromCurrencyValue;
    console.log(
        `Switched currencies to ${startingCurrency.value} and ${targetCurrency.value}`
    );
});

/**
 * Initialize the dropdowns and event listener
 */
async function initializeApp() {
    resetForm();
    await fetchExchangeRates();
    loadCurrencyMenu();
}

/**
 * Fetch currency data from the backend and update the global variable.
 */
async function fetchExchangeRates() {
    try {
        const response = await fetch("/api/exchange-rates");
        if (!response.ok) throw new Error("Error fetching currency data");
        CURRENCY_DATA = await response.json();
        console.log("Currency data loaded:", CURRENCY_DATA);
    } catch (error) {
        console.error("Error loading currency data:", error);
    }
}



/**
 * Function to format the dropdown options
 *
 * @param {*} currency
 *
 * @returns formatted currency option string
 */
function formatDropdownOptions(currency) {
    return `${currency.name} (${currency.currency_code})`;
}

/**
 * Reset the form to its initial state.
 */
function resetForm() {
    document.getElementById("amount").value = "";
    document.getElementById("conversion-result").classList.add("hidden");
}

/**
 * Load the dropdowns with the currency options
 *
 * @param {*} options The list of currency options
 *
 * @param {*} element The dropdown element being populated
 */
function fillDropdown(options, element) {
    options.forEach((option) => {
        const currency = CURRENCY_DATA.conversion_rates[option];
        const currencyOption = document.createElement("option");
        currencyOption.value = option;
        currencyOption.text = formatDropdownOptions(currency);
        element.appendChild(currencyOption);
    });
}
/**
 * Load the Currency dropdowns with the currency options from the data fetched.
 */
function loadCurrencyMenu() {
    // Default Option when page loads
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select Currency";
    // defaultOption.disabled = true;
    defaultOption.selected = true;

    // Add default option to dropdowns
    startingCurrency.appendChild(defaultOption.cloneNode(true));
    targetCurrency.appendChild(defaultOption.cloneNode(true));

    // Fill the dropdowns with currency options
    fillDropdown(Object.keys(CURRENCY_DATA.conversion_rates), startingCurrency);
    fillDropdown(Object.keys(CURRENCY_DATA.conversion_rates), targetCurrency);
}

/**
 * Handle the conversion of currencies.
 *
 * Handle the conversion of currencies.
 */
function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("starting-currency").value;
    const toCurrency = document.getElementById("target-currency").value;
    let currencies = CURRENCY_DATA.conversion_rates;

    // Validate inputs
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }
    if (!currencies[fromCurrency] || !currencies[toCurrency]) {
        alert("Please select valid currencies.");
        return;
    }
    // Conversion logic
    const fromRate = currencies[fromCurrency].rate;
    const toRate = currencies[toCurrency].rate;
    const convertedAmount = (amount / fromRate) * toRate;

    displayConversionResult(amount, fromCurrency, toCurrency, convertedAmount);
    loadFlagImages(fromCurrency, toCurrency);
    console.log("Conversion successful");
    populateRateBoxes();
}


/**
 * Updates the UI with the results from the currency conversion
 */
function displayConversionResult(
    amount,
    fromCurrency,
    toCurrency,
    convertedAmount
) {
    const from = CURRENCY_DATA.conversion_rates[fromCurrency];
    const to = CURRENCY_DATA.conversion_rates[toCurrency];

    const resultElementText = document.getElementById("conversion-text");

    resultElementText.innerHTML = `
        ${amount.toFixed(2)} ${from.symbol} (${from.name}) = 
        ${convertedAmount.toFixed(2)} ${to.symbol} (${to.name})
    `;

    resultElement.classList.remove("hidden");
}

/**
 * Load the flag images needed for the selected currencies
 * 
 */
function loadFlagImages() {
    const fromCurrency = document.getElementById("starting-currency").value;
    const toCurrency = document.getElementById("target-currency").value;

    const flagFrom = document.getElementById("from-flag");
    const flagTo = document.getElementById("to-flag");

    flagFrom.src = `assets/flags/${fromCurrency}.png`;
    flagTo.src = `assets/flags/${toCurrency}.png`;
}




//TODO: Refactor and streamline populateRateBoxes() 
/**
 * Show the conversion rates for the selected currencies in set amounts.
 */
function populateRateBoxes() {
    const fromCurrency = document.getElementById("starting-currency").value;
    const toCurrency = document.getElementById("target-currency").value;
    const fromRate = CURRENCY_DATA.conversion_rates[fromCurrency].rate;
    const toRate = CURRENCY_DATA.conversion_rates[toCurrency].rate;

    const amounts = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];

    updateRateTitle("left", fromCurrency, toCurrency);
    updateRateBox("left", fromCurrency, toCurrency, fromRate, toRate, amounts);

    updateRateTitle("right", toCurrency, fromCurrency);
    updateRateBox("right", toCurrency, fromCurrency, toRate, fromRate, amounts);

    removeHidden("conversion-rates");
};

/**
 * Function to set the header title for the Conversion Rates Tables
 *
 * @param {*} side the side to update
 *
 * @param {*} fromCurrency
 *
 * @param {*} toCurrency
 */
function updateRateTitle(side, fromCurrency, toCurrency) {
    const rateTitle = document.getElementById(`rate-title-${side}`);
    let title = `Convert ${fromCurrency} to ${toCurrency}`;
    rateTitle.textContent = title;
}

/**
 * Function to update the rate boxes with the conversion rates for
 * the selected currencies and amounts
 *
 * @param {*} side left or right side conversion rate box
 * @param {*} fromCurrency starting currency
 * @param {*} toCurrency ending currency
 * @param {*} fromRate the rate of the starting currency
 * @param {*} toRate the rate of the ending currency
 * @param {*} amounts the amounts to convert
 */
function updateRateBox(
    side,
    fromCurrency,
    toCurrency,
    fromRate,
    toRate,
    amounts
) {
    const rateFlagFrom = document.getElementById(`from-flag-${side}`);
    const rateFlagTo = document.getElementById(`to-flag-${side}`);
    const rateCurrencyFrom = document.getElementById(
        `rate-currency-from-${side}`
    );
    const rateCurrencyTo = document.getElementById(`rate-currency-to-${side}`);
    const rateTableBody = document.getElementById(`rate-table-body-${side}`);

    // Update headers and flags
    rateFlagFrom.src = `assets/flags/${fromCurrency.toLowerCase()}.png`;
    rateFlagTo.src = `assets/flags/${toCurrency.toLowerCase()}.png`;
    rateCurrencyFrom.textContent = fromCurrency;
    rateCurrencyTo.textContent = toCurrency;

    // Generate table rows dynamically
    rateTableBody.innerHTML = ""; // Clear any existing rows
    amounts.forEach((baseAmount) => {
        const convertedRate = (baseAmount / fromRate) * toRate;
        const row = `<tr>
                        <td>${baseAmount.toFixed(2)}</td>
                        <td>${convertedRate.toFixed(2)}</td>
                     </tr>`;
        rateTableBody.innerHTML += row;
    });
}

/**
 * Removes the hidden class from the specified element
 * @param {*} element
 */
function removeHidden(element) {
    const hiddenElement = document.getElementById(element);
    hiddenElement.classList.remove("hidden");
}
