import express from "express";
import { handleGetExchangeRates } from "../modules/fetchRates.js";
import logger from "../middleware/logger.js";

// Create a router
const router = express.Router();

// GET / - Home route
router.get("/", (req, res) => {
    res.render("pages/index", {
        title: "Currency Converter Final Form",
    });
});
// GET /api/exchange-rates - Get exchange rates
router.get("/api/exchange-rates", (req, res) => {
    try {
        // logger.info("GET /api/exchange-rates");
        handleGetExchangeRates(req, res);
    } catch (error) {
        logger.error("Error getting exchange rates:", { error: error.message });
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default router;
