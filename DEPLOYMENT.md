# 🚀 Promitto Deployment Guide

## Quick Start (GitHub Codespace)

### Step 1: Pull Latest Changes
```bash
git pull origin main
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### Step 3: Environment Variables

**Backend `.env`** (create in `backend/` folder):
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/promitto?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_at_least_32_characters_long_for_security
PORT=5000
NODE_ENV=development
```

**Frontend `.env`** (create in `frontend/` folder):
```env
VITE_API_URL=https://your-codespace-5000.app.github.dev/api
```

⚠️ **Important:** Replace `your-codespace-5000` with your actual Codespace URL!

To find your URL:
1. Start backend first (see below)
2. Look at the "Ports" tab in Codespace
3. Copy the forwarded address for port 5000

### Step 4: Start Backend

Open terminal in `backend/` folder:
```bash
npm start
```

You should see:
```
🚀 Server running on port 5000
🔒 Security: Enabled
⚡ Compression: Enabled
🛡️  Rate Limiting: Active
💎 Connection Level System: Active
```

### Step 5: Start Frontend

Open **NEW** terminal (keep backend running), go to `frontend/` folder:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 6: Open App

1. Go to "Ports" tab in Codespace
2. Find port **5173** (frontend)
3. Click the globe icon to open in browser
4. You should see the Promitto login page!

---

## ✅ Verify Everything Works

### Test 1: Create Account
1. Click "Sign Up"
2. Fill in:
   - Display Name: Your Name
   - Username: yourusername
   - Password: (secure password)
3. Click "Sign Up"
4. Should redirect to Dashboard

### Test 2: Connection Level
1. From Dashboard, find another test user
2. Send connection request
3. Accept it (use another account or device)
4. Check Dashboard - you should see:
   - 💎 **Connection Level** card showing Level 1
   - ✨ **Daily Rituals** card
   - Your connected user profile

### Test 3: Daily Rituals
1. Click any ritual button (e.g., "Morning Check-in")
2. Should see toast: "✨ Ritual completed! +15 XP"
3. Button should show "Waiting for partner..."
4. When partner completes: "Both done!" + points added

### Test 4: Real-Time Chat
1. Click "Open Chat"
2. Send a message
3. Should appear instantly (no refresh needed)
4. Check if typing indicator works

---

## 🐛 Troubleshooting

### Backend won't start
**Error:** `MONGO_URI is not defined`
- ✅ Check `.env` file exists in `backend/` folder
- ✅ Verify MongoDB URI is correct
- ✅ Make sure no spaces around `=` in `.env`

**Error:** `Port 5000 already in use`
```bash
# Kill process on port 5000
kill -9 $(lsof -ti:5000)
```

### Frontend won't start
**Error:** `Cannot find module`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Socket.io not connecting
1. Check backend is running
2. Verify `VITE_API_URL` in frontend `.env`
3. Make sure URL doesn't end with `/api` in `.env`
4. Check browser console for errors

### Connection Level not showing
1. Make sure both users accepted connection
2. Check backend logs for errors
3. Verify MongoDB is accessible
4. Try refreshing the page

---

## 📊 MongoDB Setup (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free account
3. Create new cluster (Free tier - M0)
4. Create database user:
   - Username: promitto_admin
   - Password: (generate secure password)
5. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

Example:
```
mongodb+srv://promitto_admin:YourPassword123@cluster0.xxxxx.mongodb.net/promitto?retryWrites=true&w=majority
```

---

## 🔐 Security Notes

### JWT Secret
- **NEVER** use default secret in production
- Generate secure secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### MongoDB
- Use strong passwords
- In production, restrict IP whitelist
- Enable MongoDB encryption at rest

### Environment Variables
- **NEVER** commit `.env` files
- Use different secrets for dev/production
- Rotate secrets regularly

---

## 🌐 Production Deployment

### Option 1: Render (Recommended)

**Backend:**
1. Go to [Render.com](https://render.com)
2. Create "New Web Service"
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Add all `.env` variables
5. Deploy!

**Frontend:**
1. Create "New Static Site"
2. Connect same repo
3. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment: Add `VITE_API_URL` with your backend URL
4. Deploy!

### Option 2: Vercel + Railway

**Backend** (Railway):
1. [Railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Select repo, choose `backend` folder
4. Add environment variables
5. Deploy

**Frontend** (Vercel):
1. [Vercel.com](https://vercel.com)
2. Import project from GitHub
3. Framework: Vite
4. Root Directory: `frontend`
5. Add `VITE_API_URL` environment variable
6. Deploy

---

## 📝 Current Status

✅ **Fully Functional:**
- User authentication
- One-to-one connections
- Real-time messaging
- Connection Level system
- Daily Rituals
- Streak tracking
- Profile editing
- Message persistence

🚧 **Coming Soon:**
- Connection ceremony animation
- Memory vault
- Couple challenges
- Time capsules
- Break protection period

---

## 🎯 What You Built

You now have a **fully functional relationship app** with:
1. 💎 **Gamified progression** - Couples level up together
2. ⚡ **Real-time features** - Instant messaging, typing indicators
3. 🔒 **Privacy first** - No browsing, username search only
4. 🌅 **Daily engagement** - Rituals keep couples active
5. 💪 **Commitment device** - Breaking = losing all progress

This is **not a chat app**. It's a **relationship operating system** that makes couples obsessed.

---

**Need help?** Check the main README.md for detailed API docs and architecture.

**Ready to scale to $10B?** 🚀

Let's make exclusive relationships the norm! 💎