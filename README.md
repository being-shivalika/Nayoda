# SkillSphere

A production-inspired MERN freelance marketplace that connects clients with skilled freelancers through secure hiring, AI-assisted matching, real-time communication, and reputation-based profiles.

**Live Demo:** https://skill-sphere-gules.vercel.app/

---

## Overview

SkillSphere is a full-stack freelance marketplace designed to simplify the hiring process for both clients and freelancers. It provides a complete workflow from project posting and proposal submission to secure payments and real-time collaboration.

The project focuses on scalable architecture, secure authentication, AI-powered recommendations, and modern marketplace workflows.

---

## Features

### Authentication
- JWT Authentication
- Google OAuth
- Email Verification
- Password Reset
- Two-Factor Authentication
- Role-Based Access Control

### Freelancer
- Professional Profile
- Portfolio Management
- Skills & Experience
- Proposal Submission
- Reputation Score
- Earnings Dashboard

### Client
- Company Profile
- Project Posting
- Proposal Management
- Hire Freelancers
- Project Tracking

### Communication
- Real-Time Chat
- Typing Indicators
- Read Receipts
- Notifications

### Payments
- Razorpay Integration
- Escrow Payments
- Milestone Releases
- Payment History

### AI Features
- Intelligent Freelancer Matching
- Recommendation Engine
- Reputation-Based Ranking

### Admin
- User Management
- Review Moderation
- Dispute Management
- Platform Analytics

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Other Technologies
- Socket.IO
- JWT
- Cloudinary
- Razorpay
- Nodemailer

---

## Project Structure

```
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── sockets/
├── utils/
└── server.js
```

---

## Core Workflow

### Client

Register → Create Profile → Post Project → Receive Proposals → Hire Freelancer → Communicate → Release Payment → Leave Review

### Freelancer

Register → Create Portfolio → Browse Projects → Submit Proposal → Get Hired → Complete Work → Receive Payment → Build Reputation

---

## Installation

```bash
git clone  https://github.com/being-shivalika/Nayoda.git

cd skillsphere

npm install

npm run seed

npm run dev
```

---

## Required Services

- MongoDB Atlas
- Cloudinary
- Razorpay
- Google OAuth
- SMTP Mail Service

---

## Future Improvements

- AI Proposal Generator
- AI Resume Analysis
- Video Meetings
- Contract Generation
- Mobile Application
- Advanced Analytics

---

## Author

**Shivalika Mehra**

GitHub: https://github.com/being-shivalika
