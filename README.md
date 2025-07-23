# SD230 Final Projects

- Troy Brunette
- SD230 Final Project
- 12/11/2024

## Overview

This repository contains three web applications as part of my final project for the SD230 Web Design class. Each application showcases a different aspect of web development, including front-end design, user interaction, and API integration. The applications included are:

1. **Rock-Paper-Scissors Game** 
    - [GitHub Pages](https://psycho-daisies.github.io/Rock-Paper-Scissors-Final/rps).
2. **Calculator App**
    - [Setup Instructions](./calculator-app/README.md).
  
3. **Currency Exchange App**
    - [Setup Instructions](./currency-exchange-app/README.md).

## 1. Rock-Paper-Scissors Game

### Description
The Rock-Paper-Scissors Game is a web-based game that allows users to play against the computer. It uses SVG graphics for the hand gestures and includes dynamic hover effects.

### Features
- Sound effects
- Hover animation effects for a fun experience.

### Setup Instructions
You can play the Rock-Paper-Scissors Game here -> [GitHub Pages](https://psycho-daisies.github.io/Rock-Paper-Scissors-Final/rps).

---

## 2. Calculator App

### Description
The Calculator App allows users to perform basic arithmetic operations. It also features a server-side backend implemented with Node.js and Express to serve the application.

### Features
- Basic arithmetic operations: addition, subtraction, multiplication, and division.
- Responsive design for a variety of sizes.
- Backend server implemented with Node.js and Express.
- Express middleware for serving static files.
- Security headers implemented using Helmet.
- Routes for the main app page, an info page, a contact page, and a 404 page for all other routes.

### Setup Instructions
For setup instructions, refer to the [Currency Exchange App README](./calculator-app/README.md).

---

## 3. Currency Exchange App

### Description
The Currency Exchange App provides an interface for users to convert between different currencies. It fetches real-time exchange rates from the Exchange Rate API, saves them to a local file, and reads the rates from the file for conversions.

### Features
- Dropdown menus to select currencies.
- A switch button to swap base and target currencies.
- Up to date conversion rates.
- Displays flags for each currency.
- Built using EJS template engine for dynamic rendering.
- Backend implemented with Node.js and Express.
- Express static middleware for serving static files.
- Route endpoints to fetch exchange rates, save them to a file, and serve them to the frontend.

### Setup Instructions
For setup instructions, refer to the [Currency Exchange App README](./currency-exchange-app/README.md).

---

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **API Integration**: Exchange Rate API (for Currency Exchange App)