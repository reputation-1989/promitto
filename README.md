# Promitto - One Connection at a Time 💍

Promitto is a unique web app where each person can connect with only ONE other person at a time. Think of it as a digital commitment - exclusive, intentional, and private.

## ✨ Features

### Phase 1 (MVP - Current)
- ✅ Phone number + Email authentication with OTP
- ✅ Unique username system
- ✅ One connection per account (strictly enforced)
- ✅ Search users by username
- ✅ Send/receive connection requests
- ✅ Accept/reject requests
- ✅ Break connections
- ✅ Real-time chat with Socket.IO
- ✅ Mobile-first responsive design
- ✅ PWA (Progressive Web App) ready

### Phase 2 (Coming Soon)
- 🔜 Shared gallery
- 🔜 Shared calendar
- 🔜 Couple games & activities
- 🔜 Daily streaks
- 🔜 App icon color change when connected
- 🔜 Aadhar verification
- 🔜 Multiple phone numbers per account

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB (Atlas)
- Socket.IO (real-time chat)
- Twilio (SMS OTP)
- JWT authentication

**Frontend:**
- React 18
- Vite (build tool)
- React Router (navigation)
- Socket.IO client
- PWA support

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free)
- Twilio account (free trial)

## 🚀 Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your credentials:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
PORT=5000
FRONTEND_URL=http://localhost:3000
```

4. Start backend server:
```bash
npm run dev
```

Server runs on http://localhost:5000

### Frontend Setup

1. Open new terminal and navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

App runs on http://localhost:3000

## 📱 Using the App

1. **Sign Up**: Enter phone number → Receive OTP → Verify → Complete profile
2. **Search**: Find someone by their exact username
3. **Connect**: Send a connection request (only if both are available)
4. **Chat**: Once connected, chat in real-time
5. **Break**: Either person can break the connection anytime

## 🔐 Core Logic: One Connection Only

The app enforces these rules:

- ✅ Cannot send request if you already have pending request
- ✅ Cannot send request if you're already connected
- ✅ Cannot accept new requests if connected
- ✅ Cannot search for users who are already connected
- ✅ Only ONE active connection per account

## 📁 Project Structure

```
promitto/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── connection.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
└── README.md
```

## 🌐 Deployment

**Backend**: Deploy to Render, Railway, or Heroku (free tiers available)
**Frontend**: Deploy to Vercel or Netlify (free)
**Database**: MongoDB Atlas (free 512MB)

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📄 License

MIT License

---

**Built with ❤️ by the Promitto team**