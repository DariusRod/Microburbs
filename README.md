# Suburb Property Dashboard 🏡

A dynamic web application that fetches and displays "for sale" property listings from the Microburbs API. Built to demonstrate integrating a third‑party API, processing complex data, and presenting it in a clean, interactive dashboard.

---

## Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Run the app](#run-the-app)
- [Contributing](#contributing)
- [License](#license)

---

## Features ✨
- Dynamic property search by Australian suburb
- Interactive, card-based property listing layout
- Sort properties by price (High ↔ Low)
- Detailed cards (property type, land size, bedrooms, bathrooms, garage)
- Secure API proxy via Flask backend (API key never exposed client-side)
- Loading states, clear error messages, results summary, and expandable descriptions

---

## Tech stack 🛠️
- Backend: Python, Flask  
- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)  
- HTTP: Python requests  
- Environment management: venv, python-dotenv

---

## Demo
Run locally and open http://127.0.0.1:5000 — the dashboard loads and shows results for the default suburb.

---

## Prerequisites
- Python 3.6+
- pip

---

## Getting started

Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

Create and activate a virtual environment:
```bash
# Create the environment
python -m venv venv

# macOS / Linux
source venv/bin/activate

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Windows (cmd)
.\venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

(If you don't have a requirements.txt yet, generate one after installing packages:
```bash
pip freeze > requirements.txt
```)

---

## Environment variables

Create a `.env` file in the project root and add your API key. For the sandbox/test environment:
```
MICROBURBS_API_KEY=test
```

The Flask backend uses this key to query the Microburbs API so the client never sees the secret.

---

## Run the app
Start the Flask server:
```bash
flask run
```
Open your browser to: http://127.0.0.1:5000

---
