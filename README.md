# 📌 Task Manager — Full Stack Application

This project is a complete task management application with an Angular frontend and a Node.js backend, connected to a MySQL database.

---

## 📁 Project Structure

```
.
├── api/             # Backend - REST API (Node.js, Express)
├── interface/       # Frontend - Angular Application
├── bd.sql           # SQL script for the database
└── README.md
```

---

## 🧰 Technologies Used

- **Frontend**: Angular 15+
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Languages**: TypeScript, JavaScript, SQL

---

## ⚙️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPOSITORY>.git
cd <YOUR-REPOSITORY>
```

---

### 2. Backend Setup (API)

```bash
cd api
npm install
npm start
```
Access Swagger UI via [http://localhost:3000/api-docs/#/](http://localhost:3000/api-docs/#/)

---

### 3. Frontend Setup (Angular Interface)

```bash
cd ../interface
npm install
ng serve
```

Access the interface at [http://localhost:4200](http://localhost:4200)

---

### 4. Database Setup

Run the SQL script using MySQL:

```bash
mysql -u root -p < bd.sql
```

---

## 🚀 Main Features

- ✅ Task creation by admin only
- ✏️ Task modification and update by admin
- ❌ Task deletion by admin
- 👁️ Task list view by admin; users can view only their own tasks
- 🔄 Reactive forms using Angular

---
