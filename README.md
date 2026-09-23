# 🎓 Student Resources Hub

A full-stack web application designed to help college students access, manage, and study from academic resources in one place.

Students can explore notes, previous year questions, syllabus, ebooks, use AI-powered study tools, create study plans, and bookmark their favorite resources.

---

## 🚀 Live Demo

🌐 **Frontend:**  
https://student-resources-hub-production-k5rk8wlwq.vercel.app/login

---

## ✨ Features

### 📚 Academic Resources
- 📖 Notes
- 📝 Previous Year Questions (PYQs)
- 📋 Syllabus
- 📕 Ebooks
- 🎓 Branch-wise resources
- 🔍 Resource search and filtering

### 🤖 AI Study Tools
- AI Study Assistant
- AI Question Paper Generator
- AI-powered academic assistance
- Subject and language selection
- Generate custom question papers

### ⭐ Bookmarks / Favorites
- Bookmark important resources
- Remove bookmarks anytime
- Dedicated Bookmarks page
- Bookmark status synced with user account

### 📅 Study Planner
- Create study tasks
- Set dates and priorities
- Track study progress
- Save planner data locally

### 🔐 Authentication
- User registration
- User login
- JWT authentication
- Protected routes
- Admin authentication

### 🛠️ Admin Panel
- Upload resources
- Manage resources
- Delete resources
- Resource management dashboard

### 📱 Responsive Design
- Mobile friendly
- Tablet friendly
- Desktop optimized
- Responsive navigation

---

## 🧰 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Google Gemini API

### Deployment

- Vercel
- MongoDB Atlas
- Cloudinary

---

## 📂 Project Structure

```text
Student-Resources-Hub/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.tsx
│       └── main.tsx
│
├── .gitignore
├── package.json
└── README.md
