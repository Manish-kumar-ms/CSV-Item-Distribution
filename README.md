# Task Distribution Dashboard (MERN + Tailwind)

A full-stack web application to manage agents and automatically distribute uploaded tasks
from a CSV file. Built with **React**, **Node.js/Express**, **MongoDB**, **Axios**, and **Tailwind CSS**.

---

## 🌐 Live Demo

- **Frontend**: [https://csv-item-distribution-frontend.onrender.com](https://csv-item-distribution-frontend.onrender.com)  
- **Backend**: [https://csv-item-distribution-backend1.onrender.com](https://csv-item-distribution-backend1.onrender.com)

---

## ✨ Features

- **Authentication**  
  - User signup, login, and logout using JWT cookies .
- **Agent Management**  
  - Add, edit, delete agents directly from a modal dialog—no page refresh required.
  - Click an agent’s name to view a dedicated details page (Items,name,email etc.).
- **Task Upload & Distribution**  
  - Upload a CSV file containing tasks.  
  - Tasks are distributed evenly across all agents in a round-robin fashion.
  - Items count updates live without page refresh.
- **Responsive UI**  
  - Tailwind CSS for a clean, mobile-friendly dashboard.

---

## 🛠️ Tech Stack

| Layer        | Tech                                   |
|--------------|----------------------------------------|
| Frontend     | React (Vite or CRA), Tailwind CSS, Axios, React Router |
| Backend      | Node.js, Express.js                    |
| Database     | MongoDB (Mongoose ODM)                 |
| Auth         | JSON Web Token (JWT) stored in secure cookies |

---

## 📂 Project Structure

```
root/
│
├─ backend/
│   ├─ models/AgentModel.js
│   ├─ routes/agentRoutes.js
│   ├─ routes/authRoutes.js
│   ├─ controllers/
│   ├─ middleware/
│   └─ server.js
│
├─ frontend/
│   ├─ src/
│   │   ├─ Components/
│   │   │   ├─ Home.jsx
│   │   │   ├─ Login.jsx
│   │   │   ├─ Signup.jsx
│   │   │   └─ AgentDetails.jsx
│   │   ├─ context/UserContext.js
│   │   └─ App.jsx
│   └─ tailwind.config.js
│
└─ README.md
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Node.js (>= 18)
- MongoDB (local or Atlas)

### 2️⃣ Backend Setup
```bash
cd backend
npm install
# Create a .env file:
# PORT=8000
# MONGODB_URL=mongodb+srv://...
# JWT_SECRET=your_secret

npm start
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev   
```

---

## 🔑 Environment Variables

Backend `.env` example:

```
PORT=8000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=super_secret_jwt_key

```

---

## 🖱️ Usage

1. **Sign Up / Login** to get a secure session.
2. **Add Agents** via the **Add Agent** modal.
3. **Upload a CSV** with tasks (e.g., `tasks.csv`).
4. Tasks are distributed evenly across all agents.  
   - Example: 5 agents + 27 tasks → first 2 agents get 6 tasks, remaining get 5.
5. Click an agent’s name to view their assigned tasks.

---

## 🧪 Example API Endpoints

| Method | Endpoint                         | Description                |
|------- |-----------------------------------|----------------------------|
| POST   | `/api/auth/signup`                | Register user             |
| POST   | `/api/auth/login`                 | Login user                |
| POST   | `/api/auth/logout`                | Logout user               |
| GET    | `/api/agent/getAgents`            | List all agents           |
| POST   | `/api/agent/addAgent`             | Add new agent             |
| PUT    | `/api/agent/editAgent/:id`        | Edit agent details        |
| DELETE | `/api/agent/deleteAgent/:id`      | Delete agent              |
| POST   | `/api/agent/uploadAndDistribute`  | Upload tasks CSV & assign |

---

## 📝 Sample Agent JSON for Postman

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+91 9876543210",
  "password": "strongpassword"
}
```

---
