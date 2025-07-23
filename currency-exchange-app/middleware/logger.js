import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log file paths
const LOG_DIR = path.join(__dirname, "../data/logs");
const LOG_FILE = path.join(LOG_DIR, "request.log");
const ERROR_LOG_FILE = path.join(LOG_DIR, "error.log");

// Ensure the log directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Configure Winston logger
const logger = winston.createLogger({
    level: "info", // Default log level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Log as JSON
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: LOG_FILE }),
        new winston.transports.File({
            filename: ERROR_LOG_FILE,
            level: "error",
        }),
    ],
});

/**
 * Middleware to log each HTTP request with a timestamp and response details.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        // Calculate response time
        const duration = Date.now() - start;

        // Determine log level based on status code
        const logLevel =
            res.statusCode >= 500
                ? "error"
                : res.statusCode >= 400
                  ? "warn"
                  : "info";

        // Log the request details
        logger.log(logLevel, {
            message: `Handled ${req.method} request for ${req.url}`,
            method: req.method,
            url: req.url,
            status: res.statusCode,
            responseTime: `${duration}ms`,
            timestamp: new Date().toISOString(),
        });
    });

    next();
};

// Export logger for general-purpose logging
export default logger;
