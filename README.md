# ⚛️ Quantity Measurement Application — Frontend

A modern React-based frontend built using **Vite + React**, integrated with a **microservices-based Spring Boot backend** via an API Gateway to provide a complete full-stack quantity measurement system.

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

This frontend is fully integrated with a **microservices-based Spring Boot backend**.

👉 Backend includes:

* Auth Service
* Measurement Service
* Eureka Server
* API Gateway

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

```text
http://localhost:5173
```

> ⚠️ Ensure backend services are running and accessible via API Gateway (`http://localhost:8082`)

---

## 📖 Project Overview

---

### 🟢 UC19 — UI Development

* Designed Login & Signup UI
* Built Dashboard UI
* Focused on UX and responsiveness

---

### 🔵 UC20 — React Integration

* Migrated UI to React (Vite)
* Integrated with backend APIs
* Implemented authentication & protected routes

---

### 🌐 UC21 — Microservices Integration

Frontend was refactored to work with a **microservices backend via API Gateway**.

---

## 🌐 Application Flow

```text
User → React UI → API Gateway → Microservices → Response → UI
```

---

## 🔐 Authentication Flow

### ✅ Local Authentication

* Login using email/password
* JWT token stored in localStorage
* Token attached in API requests

---

### ✅ Google OAuth Login

* Initiated via API Gateway
* Backend handles authentication
* Redirects to frontend with JWT
* Token stored and user redirected to dashboard

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

✔ Unit Conversion
✔ Comparison (Equal / Not Equal)
✔ Arithmetic Operations (Add, Subtract, Divide)
✔ Dynamic UI based on measurement type
✔ Real-time API integration

---

## 🔧 API Integration (via Gateway)

All API calls are routed through:

```text
http://localhost:8082
```

---

### 🔐 Auth APIs

| Feature      | Endpoint                                    |
| ------------ | ------------------------------------------- |
| Login        | `/auth-service/auth/login`                  |
| Register     | `/auth-service/auth/register`               |
| Google OAuth | `/auth-service/oauth2/authorization/google` |

---

### ⚙️ Measurement APIs

| Feature    | Endpoint                                             |
| ---------- | ---------------------------------------------------- |
| Operations | `/measurement-service/api/v1/quantities/operation/*` |
| History    | `/measurement-service/api/v1/quantities/history`     |

---

## 🔑 Token Handling

```js
localStorage.setItem("token", token);
```

Used in requests:

```js
Authorization: Bearer <token>
```

---

## 📁 Project Structure

```
src/
 ├── pages/
 │    ├── AuthPage.jsx
 │    ├── Dashboard.jsx
 │    ├── OAuthSuccess.jsx
 │
 ├── services/
 │    ├── api.js
 │    ├── authService.js
 │    ├── calculationService.js
 │
 ├── styles/
 │
 ├── App.jsx
 ├── main.jsx
```

---

## 🎨 UI Highlights

* Clean and responsive UI
* Dynamic unit selection
* Conditional rendering
* Real-time updates
* Improved UX (Equal / Not Equal display)

---

## 🧠 Concepts Covered

* React Hooks (useState, useEffect)
* Component-based architecture
* API integration via Gateway
* JWT authentication handling
* OAuth2 flow handling
* Protected routes
* Microservices communication via Gateway

---

## 🎯 One-Line Summary

A dynamic React frontend integrated with a microservices-based Spring Boot backend via an API Gateway, supporting real-time unit operations with secure authentication using JWT and Google OAuth.

---

## 👨‍💻 Author

**Ayush Gupta**
