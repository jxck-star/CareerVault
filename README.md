# 🚀 CareerVault: Professional Hiring Platform

Welcome to **CareerVault**, a modern, full-stack recruitment and job-seeking ecosystem designed to bridge the gap between top talent and leading employers.

---

## 📖 Project Overview

CareerVault is built using the **MERN** stack (MongoDB, Express, React, Node.js) and powered by **Vite** for high-performance frontend development. It features real-time notifications, AI-driven assessments, and a dual-purpose interface for both recruiters and job seekers.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: Version 18.x or higher
- **MongoDB**: A running MongoDB instance (Local or Atlas)
- **NPM**: Package manager (comes with Node.js)

### 2. Installation
Clone the repository and install the necessary dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following configuration:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

---

## 🚀 How to Run

### Development Mode
Runs both the frontend (Vite) and the backend (Node) concurrently:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

### Production Build
Build the optimized frontend assets:
```bash
npm run build
```

---

## 🧠 AI-Powered Features

CareerVault leverages advanced artificial intelligence and machine learning algorithms to streamline the hiring process:
- **Smart Resume Parsing (NLP & NER)**: Employs Natural Language Processing (NLP) and Named Entity Recognition (NER) algorithms to automatically extract distinct entities like skills, experience, and education from uploaded resumes, instantly building comprehensive applicant profiles.
- **Job Recommendation Engine (TF-IDF & Cosine Similarity)**: Connects users with opportunities matching their precise skill set. By vectorizing profiles and job descriptions using Term Frequency-Inverse Document Frequency (TF-IDF) and calculating their Cosine Similarity, the system surfaces highly accurate semantic matches.
- **Dynamic Assessments (LLM-based Scoring)**: Generates role-specific technical assessments. Upon completion, the system utilizes prompt-engineered Large Language Models (LLMs) to automatically assign quantitative scores to open-ended and technical responses, immediately providing the HR recruiter with the candidate's final score.

---

## 👥 User Roles & Workflows

CareerVault supports three distinct user roles, each with a specialized dashboard:

### 1. Job Seeker (Applier)
- **Professional Profile**: Build a digital resume with education, experience, and skills.
- **Job Discovery**: Search and filter through thousands of job listings.
- **Seamless Applications**: Apply with one click and track status in real-time.
- **Skills Assessment**: Take customized tests to verify your expertise for specific roles.

### 2. Recruiter (HR)
- **Talent Acquisition**: Post detailed job listings with salary brackets and skill requirements.
- **Application Management**: Review, shortlist, or reject applications through an intuitive pipeline.
- **Test Assignment & Automated Scoring**: Assign technical assessments to candidates directly from the dashboard. Once an applier completes the assessment, the AI automatically evaluates the responses and displays a comprehensive candidate score.
- **Real-time Insights**: See how many people are looking at your jobs.

### 3. System Admin
- **User Oversight**: Full control over user accounts and data security.
- **Platform Analytics**: View global statistics on users, jobs, and successful hires.
- **Support System**: Manage tickets and technical issues reported by users.

---

## 🏗️ Technical Architecture

- **Frontend**: React 18, Vite, Lucide Icons, CSS3 (Custom Design System)
- **Backend**: Node.js, Express, Socket.io (Real-time events)
- **AI & Machine Learning**: NLP (Named Entity Recognition), TF-IDF Algorithm, Cosine Similarity, LLMs
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT Authentication, Bcrypt Password Hashing, CORS Protection
- **Deployment**: Optimized for Vercel

---

## 🛡️ Data Security Note
CareerVault implements industry-standard security practices, including password hashing and JWT-based session management. **Always ensure your `JWT_SECRET` is kept private and never committed to version control.**

---

*© 2026 CareerVault Technologies. All rights reserved.*
