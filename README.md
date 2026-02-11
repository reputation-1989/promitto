# 💎 Promitto - The Virtual Engagement Ring

> **One person. One connection. Forever.**

Promitto is not a dating app - it's a **relationship operating system**. Built for couples who want exclusivity, privacy, and a space to grow together. Think of it as a virtual engagement ring: **one connection at a time, with real commitment**.

---

## 🌟 Why Promitto?

### The Problem with Other Apps:
- **WhatsApp/Instagram**: Great for messaging, but no sense of relationship growth
- **Dating Apps**: Designed for endless swiping, not commitment
- **Social Media**: Public, distracting, not private

### What Makes Promitto Different:
✅ **ONE Connection** - You can only connect to ONE person. Ever.  
✅ **Privacy First** - No browsing profiles. Must know their exact username.  
✅ **Relationship Growth** - Your connection has a **level** that grows with quality interactions  
✅ **Daily Rituals** - Built-in reasons to engage every day  
✅ **Real Commitment** - Breaking connection = **losing ALL progress** (levels, points, streaks)  
✅ **Gamified but Meaningful** - XP system tracks relationship health, not superficial metrics  

---

## 🚀 Features

### 💎 Connection Level System
Your relationship has a **level (1-100)** that grows through:
- 💬 Quality conversations (5+ message exchanges)
- 🌅 Daily rituals completed together
- 🔥 Maintaining streaks
- 🎯 Hitting milestones (1 week, 1 month, etc.)
- 💞 Sharing emotions honestly

#### Level Rewards:
- **Level 5**: Voice Messages 🎤
- **Level 10**: Photo Sharing 📸
- **Level 15**: Voice Calls 📞
- **Level 20**: Video Calls 📹
- **Level 25**: Shared Journal 📖
- **Level 30**: Time Capsules ⏰
- **Level 50**: Couple Challenges 🎯
- **Level 100**: Mystery Reward 🎁

### 🌅 Daily Rituals
4 rituals each day (both partners must complete):
1. **Morning Check-in** 🌅 - Start the day together (+15 XP)
2. **Afternoon Chat** ☀️ - Midday connection (+15 XP)
3. **Evening Gratitude** 🌙 - Share what you're grateful for (+15 XP)
4. **Emotion Share** 💭 - Express how you feel (+15 XP)

**Complete all 4 together = +100 bonus XP!**

### 🔥 Streaks
- Daily activity maintains your streak
- **7-day streak**: +100 XP
- **30-day streak**: +500 XP
- **100-day streak**: +2000 XP

### ⚡ Real-Time Features
- 💬 Instant messaging with Socket.io
- ⏳ Typing indicators
- 🔵 Online/offline status
- ✅ Message delivery & read receipts

### 🔒 Privacy & Exclusivity
- **No profile browsing** - Must know exact username
- **Profile hidden until connected** - Privacy first
- **One connection only** - No multiple connections
- **Breaking = Starting over** - All progress lost

---

## 🛠️ Tech Stack

### Backend:
- **Node.js** + **Express**
- **MongoDB** (Mongoose)
- **Socket.io** (Real-time)
- **JWT** authentication
- **bcrypt** password hashing

### Frontend:
- **React** + **Vite**
- **TailwindCSS** (Custom design system)
- **Framer Motion** (Animations)
- **Socket.io Client** (Real-time)
- **Axios** (API calls)
- **React Router** (Navigation)

---

## 🚀 Deployment

### Prerequisites:
- **MongoDB** database (free tier on MongoDB Atlas)
- **Node.js** 18+ installed
- **GitHub Codespace** (recommended) or local machine

### Step 1: Clone & Setup
```bash
git clone https://github.com/reputation-1989/promitto.git
cd promitto
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_min_32_chars
PORT=5000
```

Start backend:
```bash
npm start
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### Step 4: Access
Open browser: `http://localhost:5173`

---

## 📊 How The Level System Works

### Point Breakdown:
| Action | Points |
|--------|--------|
| Connection established | +50 |
| First message | +10 |
| Quality conversation (5+ msgs) | +20 |
| Morning check-in (both) | +15 |
| Afternoon check-in (both) | +15 |
| Evening gratitude (both) | +15 |
| Emotion share (both) | +15 |
| All daily rituals | +100 |
| 7-day streak | +100 |
| 30-day streak | +500 |
| 100-day streak | +2000 |

### Leveling Formula:
```javascript
pointsToNextLevel = 100 * (1.5 ^ (level - 1))
```

Level 1 → 2: 100 XP  
Level 2 → 3: 150 XP  
Level 3 → 4: 225 XP  
...exponential growth!

---

## 💎 The Philosophy

**Promitto = Promise in Italian**

This app is built on the idea that:
1. **Exclusivity creates value** - One connection forces you to choose wisely
2. **Privacy breeds intimacy** - No public profiles = real connection
3. **Progress creates investment** - Levels make breaking up emotionally costly
4. **Rituals build habits** - Daily check-ins strengthen bonds
5. **Gamification works** - But only if it tracks meaningful actions

**Result:** Couples become **obsessed** because:
- They see their relationship growing (visible progress)
- They have daily reasons to engage (rituals)
- Breaking would mean losing everything (investment)
- It's private and exclusive (special)

---

## 📝 API Endpoints

### Auth:
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Connection:
- `GET /api/connection/search/:username` - Search user
- `POST /api/connection/send-request` - Send request
- `POST /api/connection/accept-request` - Accept request
- `POST /api/connection/reject-request` - Reject request
- `POST /api/connection/break` - Break connection
- `GET /api/connection/status` - Get connection status

### Messages:
- `GET /api/connection/messages` - Get messages
- `POST /api/connection/message` - Send message
- `POST /api/connection/messages/mark-read` - Mark as read

### Level System:
- `GET /api/level` - Get connection level
- `POST /api/level/ritual/:type` - Complete daily ritual
- `POST /api/level/add-points` - Add points

### Socket Events:
- `join` - Join user room
- `sendMessage` - Send real-time message
- `receiveMessage` - Receive message
- `typing` - User typing
- `stopTyping` - User stopped typing
- `userOnline` - User online status

---

## 🔮 Future Features (Phase 2)

- 🎵 **Connection Ceremony** - Beautiful animation when connecting
- 📸 **Memory Vault** - Save special moments
- 📅 **Milestones Timeline** - Visual journey together
- 🏆 **Couple Challenges** - Activities to do together
- ⏳ **Time Capsules** - Messages to the future
- 🔔 **Break Protection** - Cooling-off period
- 📊 **Promitto Score** - Relationship health indicator
- 🎁 **Virtual Gifts** - Earned through connection depth

---

## 👥 Credits

Built with ❤️ by the Promitto team

**Vision:** Make exclusive relationships the norm, not the exception.

---

## 📝 License

MIT License - Feel free to use, but please credit us!

---

## 🚀 Current Status

✅ Authentication & Authorization  
✅ One-to-one connection system  
✅ Real-time messaging  
✅ Connection Level System  
✅ Daily Rituals  
✅ Streak tracking  
✅ Progressive feature unlocks  
✅ Privacy-first design  
✅ Message persistence  
✅ Profile system with photos  

**Ready for beta testing!** 🎉

---

**Remember:** Promitto isn't just an app. It's a commitment device. A virtual engagement ring. A relationship operating system.

💎 **One person. One connection. Forever.**