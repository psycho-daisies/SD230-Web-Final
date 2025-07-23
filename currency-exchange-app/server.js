import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import currencyRoutes from "./routes/routes.js";
import logger, { requestLogger } from "./middleware/logger.js";
dotenv.config();
 

// Express App //
const app = express();
const PORT = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware //
app.use(requestLogger);
app.use(express.json());
// express.static Middleware for serving static files
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes //
// Use currency exchange routes
app.use("/", currencyRoutes);

// Default error handling
app.use((err, req, res, next) => {
    logger.error("Error:", { error: err.message });
    res.status(500).json({ error: "Internal Server Error" });
});

// 404 Handler for all other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "./views/pages", "404.html"));
});

// Server //
app.listen(PORT, () =>
    // console.log(`Server running on port ${PORT} at http://localhost:${PORT}`)
    logger.info(`Server running on port ${PORT} at http://localhost:${PORT}`)
);

