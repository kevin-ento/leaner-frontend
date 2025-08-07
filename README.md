# 📚 Learner - E-Learning Platform (Frontend)

This is the **frontend** of the `Learner` MERN stack-based e-learning platform. It is built with **React (Vite)** and **Tailwind CSS v4**, designed to support **three roles**: `Student`, `Instructor`, and `Admin`.

> 🔐 Includes full authentication, role-based dashboards, responsive layouts, and API integration using Axios + Bearer token.

---

## 🚀 Features

- 🔐 Authentication (Register, Login, OTP Verification, Forgot/Reset Password)
- 👤 Role-based Routing (`Student`, `Instructor`, `Admin`)
- 📦 Global Auth State via React Context API
- 🌐 Axios instance with Bearer Token support
- 🧩 Reusable UI Components (Button, Input, Sidebar, etc.)
- 📱 Fully Responsive Layouts with Tailwind CSS
- 📚 Student:
  - View Enrolled & Available Courses
  - Watch Session Videos
  - Enroll in New Courses
- 🧑‍🏫 Instructor:
  - Manage Own Courses & Sessions
  - View & Approve Enrollments
- 🛠️ Admin:
  - View & Manage All Users
  - Global Course Management

---

## 🧠 Tech Stack

| Tech         | Description                      |
| ------------ | -------------------------------- |
| React (Vite) | Fast frontend build tool         |
| Tailwind CSS | Utility-first responsive styling |
| Axios        | HTTP client for API requests     |
| React Router | SPA routing & navigation         |
| Context API  | Global state management          |

---

## 🛠️ Project Structure

```bash
learner-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── student/
│   │   ├── instructor/
│   │   └── admin/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env
└── README.md
```
