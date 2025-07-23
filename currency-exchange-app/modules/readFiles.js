import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file to store Currency Exchange Rates data from the API
const DATA_FILE = path.join(__dirname, "../data/rates/rates.json");

/**
 * Read the contents of a the included rates.json file and return the data.
 * 
 * @returns {Object} - the data from the file.
 */
export const loadRatesFromFile = () => {
    try {
        console.log("DATA_FILE", DATA_FILE);
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading rates from file:", error);
        return {};
    }
};
/**
 * Saves the data to the file.
 * 
 * @param {Object} data - The data to save.
 */
export const saveRatesToFile = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving rates to file:", error);
    }
};
