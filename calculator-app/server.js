// Troy Brunette
// SD230 - Web Programming - Project Final - Calculator App
// 12/06/2024
import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

// Express App //
const app = express();
const PORT = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware //
// helmet Middleware for securing HTTP headers
app.use(helmet());
// express.static Middleware for serving static files
app.use(express.static(path.join(__dirname, "public")));

// Routes //
// Main Page - Calculator
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./pages", "index.html"));
});

// Info Page
app.get("/info", (req, res) => {
    res.sendFile(path.join(__dirname, "./pages", "info.html"));
});

// Contact Page
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "./pages", "contact.html"));
});

// 404 Handler for all other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "./pages", "404.html"));
});

// Server //
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
