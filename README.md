# ⚛️ Quantity Measurement Application — Frontend

A modern React-based frontend application built using **Vite + React**, integrated with a secure Spring Boot backend to provide a complete **full-stack quantity measurement system**.

---

## 🚀 Tech Stack

![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=flat-square)
![CSS](https://img.shields.io/badge/CSS-Styling-blue?style=flat-square)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=flat-square)
![OAuth2](https://img.shields.io/badge/OAuth2-Google-red?style=flat-square)

---

## 🔗 Backend Repository

This frontend is fully integrated with a Spring Boot backend.

👉 Please refer to the backend repository for:
- API documentation
- Database setup
- Environment configuration
- Authentication (JWT & OAuth2) setup

🔗 Backend Repository:  
https://github.com/ayushgupta703/QuantityMeasurementApp.git

---

## ⚡ Quickstart (TL;DR)

1. **Clone the repo**
   ```bash
   git clone https://github.com/ayushgupta703/QuantityMeasurementApp-Frontend.git
   cd QuantityMeasurementApp-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npm run dev
   ```

4. Open:
   ```
   http://localhost:5173
   ```

> ⚠️ Note: Make sure the backend server is running on `http://localhost:8081` before starting the frontend.
---

## 📖 Project Overview (UC19–UC20)

This frontend was developed as an extension of the backend system, focusing on UI, UX, and API integration.

---

### 🟢 UC19 — UI Development (HTML, CSS, JS)

- Designed Login & Signup UI
- Implemented dashboard UI
- Used JSON Server for mock backend
- Focused on UI/UX design and layout

---

### 🔵 UC20 — React Integration & Backend Connectivity

- Migrated UI to React (Vite)
- Connected frontend with Spring Boot backend
- Implemented API-based architecture
- Integrated authentication and protected routes

---

## 🔐 Authentication Flow

### ✅ Local Authentication
- Login using email & password
- JWT token stored in localStorage
- Token used in API calls

### ✅ Google OAuth Login
- Login/Signup using Google
- Backend handles authentication
- Redirects to frontend with JWT token
- Token stored and user redirected to dashboard

---

## 🔄 Application Flow

User → React UI → API Request → Spring Boot Backend → JWT Authentication → Response → UI

---

## 🖥️ Features

### 🔹 Authentication
✔ Login with email/password  
✔ Signup with validation  
✔ Google OAuth login  
✔ JWT-based authentication  
✔ Protected routes  

---

### 🔹 Dashboard Functionality
✔ Unit Conversion (user-defined target unit)  
✔ Comparison (Equal / Not Equal)  
✔ Arithmetic Operations (Add, Subtract, Divide)  
✔ Dynamic UI based on measurement type  
✔ Real-time API integration  

---

### 🔹 Supported Measurement Types

| Category | Units |
|----------|------|
| Length | FEET, INCHES, YARDS, CENTIMETERS |
| Weight | KILOGRAM, GRAM, POUND |
| Volume | LITRE, MILLILITRE, GALLON |
| Temperature | CELSIUS, FAHRENHEIT *(no arithmetic)* |

---

## ⚙️ Project Structure

```
src/
 ├── pages/
 │    ├── Login.jsx
 │    ├── Signup.jsx
 │    ├── Dashboard.jsx
 │    ├── OAuthSuccess.jsx
 │
 ├── services/
 │    └── calculationService.js
 │
 ├── styles/
 │    ├── auth.css
 │    ├── dashboard.css
 │
 ├── App.jsx
 ├── main.jsx

 ```

---

## 🔌 API Integration

Frontend communicates with backend APIs:

| Feature | Endpoint |
|--------|--------|
| Login | `/auth/login` |
| Register | `/auth/register` |
| Convert | `/api/v1/quantities/convert` |
| Compare | `/api/v1/quantities/compare` |
| Add | `/api/v1/quantities/add` |
| Subtract | `/api/v1/quantities/subtract` |
| Divide | `/api/v1/quantities/divide` |

---

## 🔑 Token Handling

- JWT stored in:
  ```js
  localStorage.setItem("token", token);
  ```
- Sent in headers:
  ```js
  Authorization: Bearer <token>
  ```

---

## 🎨 UI Highlights

- Clean and responsive layout
- Dynamic unit selection
- Conditional rendering for operations
- Real-time result updates
- Improved UX (Equal / Not Equal instead of boolean)

---

## 🧠 Concepts Covered

- React Hooks (useState, useEffect)
- Component-based architecture
- API integration using Fetch
- State management
- Conditional rendering
- Authentication handling (JWT)
- OAuth integration flow
- Protected routes

---

## 🎯 One-Line Summary

A dynamic React frontend integrated with a secure Spring Boot backend, supporting real-time unit conversion, arithmetic operations, and authentication using JWT and Google OAuth.

---

## 👨‍💻 Author

Ayush Gupta
