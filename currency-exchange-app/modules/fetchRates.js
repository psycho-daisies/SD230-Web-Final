import { loadRatesFromFile, saveRatesToFile } from "./readFiles.js";
import logger from "../middleware/logger.js";


// Rates need to be updated every 24 hours
const RATES_DURATION = 24 * 60 * 60 * 1000;

// The currencies used in the app
const requiredCurrencies = {
    AUD: { name: "Australian Dollar", symbol: "A$", currency_code: "AUD" },
    CAD: { name: "Canadian Dollar", symbol: "C$", currency_code: "CAD" },
    CLP: { name: "Chilean Peso", symbol: "CLP$", currency_code: "CLP" },
    CNY: { name: "Chinese Yuan", symbol: "¥", currency_code: "CNY" },
    EUR: { name: "Euro", symbol: "€", currency_code: "EUR" },
    GBP: { name: "British Pound Sterling", symbol: "£", currency_code: "GBP" },
    INR: { name: "Indian Rupee", symbol: "₹", currency_code: "INR" },
    JPY: { name: "Japanese Yen", symbol: "¥", currency_code: "JPY" },
    RUB: { name: "Russian Ruble", symbol: "₽", currency_code: "RUB" },
    USD: { name: "United States Dollar", symbol: "$", currency_code: "USD" },
    ZAR: { name: "South African Rand", symbol: "R", currency_code: "ZAR" },
};


/**
 * Handles filtering the raw data from the API to what the app needs.
 * 
 * @param {Object} data Raw API data.
 * @returns {Object} Filtered rates.
 */
const filterRates = (data) => {
    const filteredRates = {
        time_last_update_unix: data.time_last_update_unix,
        time_last_update_utc: data.time_last_update_utc,
        conversion_rates: {},
    };

    for (const currency in requiredCurrencies) {
        if (data.conversion_rates[currency]) {
            filteredRates.conversion_rates[currency] = {
                ...requiredCurrencies[currency],
                rate: data.conversion_rates[currency],
            };
        }
    }

    return filteredRates;
};


/**
 * Fetch exchange rates from the API, filter them, and save to a file for use.
 * 
 * @returns {Object} Filtered rates.
 */
async function fetchFilterSaveRates() {
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
    try {
        logger.info("Fetching rates from API");
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Filter the data for specific currencies
        const filteredData = filterRates(data);

        // Save to JSON file
        saveRatesToFile(filteredData);
        logger.info("Rates updated and saved to file");
        // console.log("Rates updated and saved to file");
        return filteredData;
    } catch (error) {
        logger.error("Error fetching or filtering rates:", { error: error.message });
        // console.error("Error fetching or filtering rates:", error);
    }
};


/**
 * Retrieve exchange rates data from file or API.
 * @returns {Object} Exchange rates data.
 */
async function getExchangeRatesData() {
    try {
        // Step 1: Try loading cached rates
        const cachedRates = loadRatesFromFile();
        const currentTime = new Date().getTime();

        // Check if rates are still valid
        if (cachedRates && currentTime - (cachedRates.time_last_update_unix * 1000) < RATES_DURATION) {
            logger.info("Using cached rates");
            // console.log("Using cached rates");
            return cachedRates;
        }

        // Step 2: Fetch and cache new rates if no cache or expired
        const newRates = await fetchFilterSaveRates();
        if (newRates) {
            return newRates;
        }

        throw new Error("Failed to fetch new rates.");
    } catch (error) {
        logger.error("Error fetching exchange rates:", { error: error.message });
        // console.error("Error fetching exchange rates:", error.message);
    }
};


/**
 * Used by the route to get exchange rates data.
 */
export const handleGetExchangeRates = async (req, res) => {
    try {
        const rates = await getExchangeRatesData();
        res.json(rates);
    } catch (error) {
        res.status(500).json({ error: "Failed to load exchange rates" });
    }
};
