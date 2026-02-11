# 🚀 Promitto - Complete Setup Guide

Follow these steps to run Promitto locally.

---

## 📋 Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or [Local Install](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/))

---

## 🔧 Quick Setup

### **1. Clone Repository**
```bash
git clone https://github.com/reputation-1989/promitto.git
cd promitto
```

---

## 🗄️ MongoDB Setup

### **Option A: MongoDB Atlas (Recommended - Free)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/promitto?retryWrites=true&w=majority
```

### **Option B: Local MongoDB**

1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
   - **Windows**: MongoDB runs as a service automatically

3. Use local connection string:
```
mongodb://localhost:27017/promitto
```

---

## ⚙️ Backend Setup

### **1. Navigate to backend**
```bash
cd backend
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Create .env file**
```bash
cp .env.example .env
```

### **4. Edit .env file**
Open `backend/.env` and configure:

```env
# REQUIRED: MongoDB connection
MONGODB_URI=mongodb://localhost:27017/promitto
# Or use MongoDB Atlas connection string

# REQUIRED: JWT secret (any random string)
JWT_SECRET=your_super_secret_key_change_this

# Server config
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# OPTIONAL: Twilio (leave empty for dev mode)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### **5. Start backend server**
```bash
npm run dev
```

✅ **You should see:**
```
⚠️  Twilio not configured - using development mode (OTP: 123456)
🚀 Server running on port 5000
✅ MongoDB connected
```

---

## 🎨 Frontend Setup

### **1. Open new terminal, navigate to frontend**
```bash
cd ../frontend
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Create .env file**
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### **4. Start frontend**
```bash
npm run dev
```

✅ **You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3001/
```

---

## 🧪 Testing the App

### **1. Open browser**
Go to: `http://localhost:3001`

### **2. Create account**
- Click "Sign up"
- Enter any phone number (e.g., `+919876543210`)
- Click "Send OTP"
- Enter OTP: `123456` (always this in development)
- Complete signup form

### **3. Test features**
- ✅ Dashboard
- ✅ Search for users
- ✅ Send connection requests
- ✅ Chat messaging

---

## 🐛 Troubleshooting

### **Backend won't start**

**Error: "MongoDB Connection Error"**
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas: Check network access (allow your IP)
- For local: Start MongoDB service

**Error: "Twilio account error"**
- This is fixed! Just pull latest code:
  ```bash
  git pull origin main
  ```

### **Frontend won't start**

**Error: "Cannot connect to backend"**
- Make sure backend is running on port 5000
- Check `.env` file has correct API URL

**Port already in use**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
vite --port 3002
```

---

## 📝 Development Notes

### **OTP in Development Mode**
When Twilio is not configured, OTP is always `123456`

### **Database**
All data is stored in MongoDB. To reset:
```bash
mongo promitto --eval "db.dropDatabase()"
```

### **Environment Variables**
- Backend: `backend/.env`
- Frontend: `frontend/.env`

---

## 🚀 Next Steps

Once everything is running:

1. **Create 2 test accounts** (use different browsers/incognito)
2. **Search and connect** between accounts
3. **Send messages** in real-time chat
4. **Test all features**

---

## 🆘 Still Having Issues?

Check:
1. Node.js version: `node --version` (should be v18+)
2. MongoDB is running
3. Both backend and frontend are running
4. No firewall blocking ports 5000 and 3001

---

## 📦 Production Deployment

For production setup:
1. Get real MongoDB Atlas cluster
2. Configure Twilio for SMS
3. Set up Redis for caching
4. Use environment-specific `.env` files
5. Deploy backend (Render/Railway)
6. Deploy frontend (Vercel/Netlify)

See `DEPLOYMENT.md` for full production guide.

---

✨ **Enjoy building with Promitto!** 💎