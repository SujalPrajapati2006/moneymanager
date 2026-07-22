# 💰 Money Manager - Personal Finance & Expense Tracker

[![Live Demo](https://img.shields.io/badge/Live_Demo-moneymanager--cyan.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://moneymanager-cyan.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Render_Docker-blue?style=for-the-badge&logo=render)](https://moneymanager-eysi.onrender.com/api/v1.0)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.x-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)

> A modern, full-stack Personal Finance and Expense Management Web Application built with **React**, **Vite**, **Spring Boot 3**, and **PostgreSQL**. Track income, categorize expenses, view interactive analytics, and generate Excel financial reports sent directly to your email.

---

## 🌐 Live Demo & Deployment

- 🚀 **Frontend App (Vercel)**: [https://moneymanager-cyan.vercel.app](https://moneymanager-cyan.vercel.app)
- ⚙️ **Backend REST API (Render)**: [https://moneymanager-eysi.onrender.com/api/v1.0](https://moneymanager-eysi.onrender.com/api/v1.0)

---

## ✨ Features

- **🔐 User Authentication & Authorization**: Stateless JWT authentication, BCrypt password hashing, and protected route navigation.
- **📊 Interactive Financial Dashboard**: Real-time financial summary with visual charts (Income vs Expense breakdown, pie charts, and monthly trend graphs using Recharts).
- **💸 Income & Expense Tracking**: Effortlessly record, edit, and categorize all income streams and daily expenditures.
- **🏷️ Custom Category Management**: Organize transactions by income/expense categories with emoji icon customization.
- **🔍 Advanced Transaction Filtering**: Filter financial records by specific date ranges, transaction types, and categories.
- **📄 Excel Export & Email Reports**: Download financial statements in `.xlsx` format (powered by Apache POI) or email reports directly to your inbox via Brevo SMTP.
- **🖼️ Profile Management & Image Uploads**: Update user profiles with cloud avatar uploads integrated via Cloudinary.
- **📱 Fully Responsive Design**: Mobile-friendly, clean UI built with custom CSS, modern components, and smooth micro-animations.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM (v6)
- **Charts**: Recharts
- **Icons & UI**: Lucide React, React Icons, React Hot Toast
- **Image Storage**: Cloudinary API
- **Hosting**: Vercel

### Backend
- **Framework**: Java 21, Spring Boot 3
- **Security**: Spring Security + JWT (JSON Web Tokens)
- **Database**: PostgreSQL
- **ORM & Migrations**: Spring Data JPA / Hibernate, Flyway DB
- **File Generation**: Apache POI (Excel `.xlsx`)
- **Email Service**: Spring Boot Mail / Brevo SMTP
- **Containerization & Hosting**: Docker, Render

---

## 🏗️ Project Architecture

```
MoneyManagerProject/
├── money-manager/            # Spring Boot REST API Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/money_manager/
│   │   │   │   ├── config/          # Security & CORS Configurations
│   │   │   │   ├── controller/      # REST API Endpoints
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA Entities (Profile, Category, Income, Expense)
│   │   │   │   ├── repository/      # Spring Data Repositories
│   │   │   │   ├── security/        # JWT Filters & Auth Utilities
│   │   │   │   └── service/         # Business Logic & Services
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/    # Flyway Migration Scripts
│   ├── Dockerfile
│   └── pom.xml
└── moneymanagerwebapp/       # React + Vite Frontend
    ├── public/
    ├── src/
    │   ├── components/       # Reusable UI Components & Charts
    │   ├── context/          # App Context & State
    │   ├── pages/            # Application Views (Dashboard, Income, Expense, etc.)
    │   └── util/             # API Endpoints & Axios Client Setup
    ├── vercel.json           # SPA Route Rewrites
    └── package.json
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1.0/register` | Register a new user account | ❌ |
| `POST` | `/api/v1.0/login` | Authenticate user & return JWT token | ❌ |
| `GET` | `/api/v1.0/profile` | Get logged-in user profile | ✅ |
| `GET` | `/api/v1.0/dashboard` | Fetch dashboard analytics summary | ✅ |
| `GET`/`POST` | `/api/v1.0/incomes` | List all incomes / Add new income | ✅ |
| `DELETE` | `/api/v1.0/incomes/{id}` | Delete income entry by ID | ✅ |
| `GET`/`POST` | `/api/v1.0/expenses` | List all expenses / Add new expense | ✅ |
| `DELETE` | `/api/v1.0/expenses/{id}` | Delete expense entry by ID | ✅ |
| `GET`/`POST` | `/api/v1.0/categories` | Manage user financial categories | ✅ |
| `POST` | `/api/v1.0/filter` | Filter transactions by date/category | ✅ |
| `GET` | `/api/v1.0/excel/download/income` | Download Income Excel Sheet | ✅ |
| `GET` | `/api/v1.0/excel/download/expense` | Download Expense Excel Sheet | ✅ |
| `POST` | `/api/v1.0/email/income-excel` | Email Income Excel Report | ✅ |
| `POST` | `/api/v1.0/email/expense-excel` | Email Expense Excel Report | ✅ |

---

## 💻 Local Setup & Development Guide

### Prerequisites
- **Node.js**: `v18+`
- **Java JDK**: `21+`
- **Maven**: `3.9+`
- **PostgreSQL**: `v15+`

### 1. Clone the Repository
```bash
git clone https://github.com/SujalPrajapati2006/moneymanager.git
cd moneymanager
```

### 2. Backend Setup (`money-manager`)
1. Navigate to the backend directory:
   ```bash
   cd money-manager
   ```
2. Create a `.env` file or set environment variables:
   ```env
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/moneymanager
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=your_password
   BREVO_USERNAME=your_brevo_username
   BREVO_PASSWORD=your_brevo_password
   BREVO_FROM_EMAIL=your_email@domain.com
   MONEY_MANAGER_FRONTEND_URL=http://localhost:5173
   ```
3. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend server will start at `http://localhost:8080/api/v1.0`.

### 3. Frontend Setup (`moneymanagerwebapp`)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd moneymanagerwebapp
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `moneymanagerwebapp`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1.0
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

Developed with ❤️ by **[Sujal Prajapati](https://github.com/SujalPrajapati2006)**.
