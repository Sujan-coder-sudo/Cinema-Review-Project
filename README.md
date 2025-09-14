
# 🎬 CinemaReview - Full-Stack Movie Review Platform

A modern, responsive movie discovery and review platform built with **React, TypeScript, Tailwind CSS, shadcn/ui, Node.js, Express, and MongoDB (Mongoose)**.  
Easily search movies via **TMDB API**, write reviews, maintain a watchlist, and track your movie activity.


![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Express](https://img.shields.io/badge/Express.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-darkgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

---
# How to use
[![How to Use](https://img.youtube.com/vi/cTPl8TzRjTc/0.jpg)](https://www.youtube.com/watch?v=cTPl8TzRjTc)

---
## 📌 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚡ Quick Start](#-quick-start)
- [⚙️ Backend Setup](#-backend-setup)
- [🎨 Frontend Setup](#-frontend-setup)
- [🗄️ Database Setup](#-database-setup)
- [🔌 API Endpoints](#-api-endpoints)
- [🚀 Deployment](#-deployment)
- [📱 Responsive Design](#-responsive-design)
- [♿ Accessibility](#-accessibility)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## ✨ Features

- 🎥 Movie Discovery – Search & filter movies using TMDB  
- 📝 User Reviews – Post, edit, and delete your own reviews  
- ⭐ Ratings System – Rate movies with stars  
- 📌 Watchlist – Add/remove movies to your watchlist  
- 🕒 Activity Tracking – Keep track of viewed movies  
- 👤 User Profiles – Manage profile, view history, activity logs  
- 🔑 Authentication – JWT-based secure login/register  
- 🎬 Trailers Integration – Watch trailers from TMDB in modal dialogs  
- 📱 Responsive Design – Mobile-first, works across all devices  

---

## 🛠️ Tech Stack

**Frontend:**

- React 18 + Vite  
- TypeScript  
- TailwindCSS + shadcn/ui  
- React Router v6  
- React Query  
- Zustand (state management)

**Backend:**

- Node.js + Express  
- MongoDB + Mongoose  
- JWT Authentication

**External APIs:**

- TMDB (The Movie Database)

---

## 📁 Project Structure

```
cine-spark-54/
├── movies-api/           # Backend (Express + MongoDB)
│   ├── models/           # Mongoose schemas (User, Review, Watchlist, etc.)
│   ├── routes/           # Express routes
│   ├── controllers/      # Business logic
│   └── server.js         # Entry point
│
├── src/                  # Frontend (React + Vite)
│   ├── components/       # UI components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   └── lib/              # API utilities
│
└── README.md             # Documentation
```

---

## ⚡ Quick Start

```bash
git clone <repository-url>
cd cine-spark-54
```

- Run Backend → `movies-api` on port `5000`  
- Run Frontend → Vite dev server on port `8080`

---

## ⚙️ Backend Setup

```bash
cd movies-api
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cinema_review_db
JWT_SECRET=supersecretkey
```

Start MongoDB:

```bash
mongod
```

(optional shell):

```bash
mongosh
```

Run backend:

```bash
npm start
```

✅ Output:

```
Server running on http://localhost:5000
MongoDB connected
```

---

## 🎨 Frontend Setup

```bash
cd ..
npm install
```

Create `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=CinemaReview

VITE_TMDB_API_KEY=fe35a4ff09d24629439326403d8715c7
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

Run frontend:

```bash
npm run dev
```

✅ Visit: [http://localhost:8080](http://localhost:8080)

---

## 🗄️ Database Setup

We use **MongoDB + Mongoose**.

Basic models:

- **User**: username, email, password (hashed), watchlist, viewed
- **Review**: movieId, userId, rating, comment, createdAt
- **Watchlist**: references User + Movies
- **ViewedMovie**: history of watched movies

Check DB:

```bash
mongosh
use cinema_review_db
show collections
```

---

## 🔌 API Endpoints

### Auth

- `POST /api/auth/register` → Register new user  
- `POST /api/auth/login` → Login & get JWT  

### Movies

- `GET /api/movies` → Get all movies  
- `GET /api/movies/:id` → Get single movie  

### Reviews

- `POST /api/movies/:id/reviews` → Add review  
- `GET /api/movies/:id/reviews` → Get reviews  
- `DELETE /api/reviews/:id` → Delete review  

### User

- `GET /api/users/:id` → Profile info  
- `GET /api/users/:id/watchlist` → Watchlist  
- `POST /api/users/:id/watchlist` → Add movie to watchlist  
- `GET /api/users/:id/viewed` → Viewed movies history  

---

## 🚀 Deployment

### Frontend

```bash
npm run build
```

Deploy `/dist` → Netlify, Vercel, etc.

### Backend

Use Heroku, Railway, or Render.  
Set environment variables:

- `MONGO_URI` (Atlas recommended)  
- `JWT_SECRET`  
- `PORT`

---

## 📱 Responsive Design

- Mobile: `< 768px`  
- Tablet: `768px - 1024px`  
- Desktop: `> 1024px`

---

## ♿ Accessibility

- WCAG 2.1 AA compliant  
- Keyboard navigation  
- Screen reader support

---

## 🔒 Security

- JWT authentication  
- Password hashing with bcrypt  
- Helmet middleware  
- XSS & CSRF protection

---

## 🤝 Contributing

```bash
# Fork the repo
git checkout -b feature/awesome-feature
git commit -m "Added awesome feature"
git push origin feature/awesome-feature
```

Open a Pull Request 🚀

---

## 📄 License

Licensed under the **MIT License** – free to use & modify.

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/)  
- [shadcn/ui](https://ui.shadcn.com/)  
- [Tailwind CSS](https://tailwindcss.com/)
```

---

