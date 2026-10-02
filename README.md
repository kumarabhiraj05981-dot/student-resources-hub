# 🎓 Student Resources Hub

> **A modern full-stack academic platform that brings notes, PYQs, syllabus, e-books, AI study tools, bookmarks, and study planning into one place.**

Student Resources Hub is a full-stack web application built to make academic resources easier to **discover, organize, study, and manage**.

It provides students with branch-wise academic resources, AI-powered study assistance, personalized bookmarks, and a study planner — while administrators can manage and upload resources through a dedicated admin panel.

---

## 🌐 Live Demo

### 🚀 Student Resources Hub

**Live Website:**
https://student-resources-hq1anqjkr-student-resource-hub1.vercel.app/login

> The application is deployed online, so users can access it without running the project on a local computer.

---

## ✨ Key Features

### 📚 Academic Resource Library

* 📖 Notes
* 📝 Previous Year Questions (PYQs)
* 📋 Syllabus
* 📕 E-Books
* 🎓 Branch-wise resources
* 🔎 Search resources
* 🏷️ Resource filtering
* 📂 Organized academic content

### 🤖 AI Study Tools

* 🧠 AI Study Assistant
* 📝 AI Question Paper Generator
* 📚 Subject-based question generation
* 🌐 Language selection
* 🎯 Custom question papers
* 💡 AI-powered academic assistance

### ⭐ Bookmarks & Favorites

* 🔖 Bookmark important resources
* ❌ Remove bookmarks
* 📌 Dedicated bookmarks page
* 🔄 Bookmark status synchronized with user account

### 📅 Study Planner

* ➕ Create study tasks
* 📅 Set task dates
* 🎯 Set priorities
* ✅ Track study progress
* 💾 Save planner information locally

### 🔐 Authentication & Security

* 👤 User registration
* 🔑 User login
* 🔐 JWT authentication
* 🛡️ Protected routes
* 👨‍💼 Admin authentication
* 🔒 Role-based access

### 🛠️ Admin Dashboard

Administrators can:

* 📤 Upload academic resources
* 📚 Manage resources
* ✏️ Update resources
* 🗑️ Delete resources
* 📊 Manage the resource library

### 📱 Responsive UI

Designed to work across:

* 📱 Mobile
* 📲 Tablet
* 💻 Laptop
* 🖥️ Desktop

---

# 🧰 Tech Stack

## 🎨 Frontend

| Technology   | Purpose               |
| ------------ | --------------------- |
| React 19     | UI development        |
| TypeScript   | Type-safe development |
| Vite         | Frontend build tool   |
| Tailwind CSS | Styling               |
| React Router | Client-side routing   |
| Axios        | API communication     |

## ⚙️ Backend

| Technology        | Purpose            |
| ----------------- | ------------------ |
| Node.js           | Runtime            |
| Express.js        | REST API           |
| MongoDB           | Database           |
| Mongoose          | MongoDB ODM        |
| JWT               | Authentication     |
| Cloudinary        | File/media storage |
| Google Gemini API | AI features        |

## ☁️ Deployment & Services

| Service       | Purpose                |
| ------------- | ---------------------- |
| Vercel        | Frontend deployment    |
| MongoDB Atlas | Cloud database         |
| Cloudinary    | Resource/file storage  |
| Render        | Backend/API deployment |

---

# 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      Students       │
                    │ Mobile / Desktop    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Vercel        │
                    │ React + TypeScript  │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Render        │
                    │ Node + Express API  │
                    └──────┬──────┬───────┘
                           │      │
              ┌────────────┘      └─────────────┐
              ▼                                 ▼
    ┌──────────────────┐              ┌──────────────────┐
    │  MongoDB Atlas   │              │    Cloudinary    │
    │      Database    │              │  File Storage    │
    └──────────────────┘              └──────────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Google Gemini AI │
                  │   Study Tools    │
                  └──────────────────┘
```

---

# 📂 Project Structure

```text
Student-Resources-Hub/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

---

# 🚀 Getting Started

Follow these steps to run the project locally.

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/kumarabhiraj05981-dot/student-resources-hub.git
```

```bash
cd student-resources-hub
```

---

## 2️⃣ Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Never upload `.env` files or API keys to GitHub.

---

# ▶️ Run the Application

## Start Backend

```bash
cd backend
npm start
```

or, if your project uses the development script:

```bash
npm run dev
```

Backend will run on your configured port.

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Vite will provide the local development URL.

---

# 🔑 Authentication Flow

```text
User
  │
  ▼
Register / Login
  │
  ▼
Backend Authentication
  │
  ▼
JWT Token
  │
  ▼
Protected Routes
  │
  ├── Resources
  ├── Bookmarks
  ├── Study Planner
  └── User Features
```

Admin users have access to additional resource-management functionality.

---

# 📚 Main Modules

### 👨‍🎓 Student Module

```text
Dashboard
   │
   ├── Notes
   ├── PYQs
   ├── Syllabus
   ├── E-Books
   ├── Bookmarks
   ├── Study Planner
   └── AI Study Tools
```

### 👨‍💼 Admin Module

```text
Admin Dashboard
      │
      ├── Upload Resource
      ├── View Resources
      ├── Update Resource
      └── Delete Resource
```

---

# 🤖 AI Question Paper Generator

The AI module allows students to generate customized question papers based on parameters such as:

* Subject
* Difficulty
* Number of questions
* Language
* Academic requirements

Example workflow:

```text
Select Subject
      ↓
Select Language
      ↓
Choose Difficulty
      ↓
Choose Number of Questions
      ↓
Generate Question Paper
      ↓
AI Generated Questions
```

---

# ☁️ Deployment

The project is designed for cloud deployment.

```text
Frontend
   ↓
Vercel

Backend
   ↓
Render

Database
   ↓
MongoDB Atlas

Files
   ↓
Cloudinary

AI
   ↓
Google Gemini API
```

Because the frontend and backend are deployed separately, the user's computer does **not** need to keep the project running locally.

---

# 🔒 Security Considerations

The application uses several security mechanisms:

* JWT-based authentication
* Protected API routes
* Admin authentication
* Environment variables for secrets
* Cloud-based file storage
* Database authentication

### Important

Never commit these files or values:

```text
.env
API keys
JWT secrets
MongoDB passwords
Cloudinary secrets
Gemini API keys
```

---

# 📈 Future Improvements

Planned improvements include:

* 🔔 Notifications
* 📊 Student progress analytics
* 🏆 Gamification and achievement system
* 📝 Online quizzes
* 📈 Performance tracking
* 📚 Personalized study recommendations
* 🌙 Dark mode improvements
* 📱 Progressive Web App (PWA)
* 📄 PDF preview
* 🔍 Advanced resource filtering
* 👥 Student discussion/community features
* 🤖 More advanced AI study features

---

# 🎯 Project Goals

The main goals of Student Resources Hub are:

1. Centralize academic resources.
2. Reduce the time students spend searching for study material.
3. Provide AI-powered academic assistance.
4. Make resources accessible from any device.
5. Help students organize their studies.
6. Provide administrators with an easy resource-management system.

---

# 💡 Why This Project?

College students often need to search through multiple sources for:

* Notes
* PYQs
* Syllabus
* E-books
* Study material
* Practice questions

Student Resources Hub aims to provide these resources through a **single centralized platform**.

---

# 🧪 Project Highlights

This project demonstrates practical experience with:

* Full-stack web development
* REST API development
* React and TypeScript
* Authentication and authorization
* MongoDB database design
* Cloud file storage
* AI API integration
* Responsive UI development
* Frontend/backend deployment
* Git and GitHub workflow

---

# 👨‍💻 Developer

### Abhiraj Kumar

**Computer Science Engineering Student**
Government Polytechnic Vaishali

Interested in:

* 🤖 Artificial Intelligence
* 🧠 Machine Learning
* 💻 Software Development
* 🌐 Full-Stack Development

### Connect With Me

* 💼 LinkedIn: `abhiraj-kumar-2a869a3b1`
* 🐙 GitHub: `kumarabhiraj05981-dot`

---

# ⭐ Support the Project

If you find this project useful:

⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest improvements

---

## 📜 License

This project is developed for educational and academic purposes.
