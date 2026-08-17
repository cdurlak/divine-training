# Divine Training - Workout Logger

A simple web app for logging workouts. Sekou sets up exercises, you log weight and reps.

## Quick Start

### Option 1: Run Locally (Testing)

1. **Install Node.js** from https://nodejs.org (if you don't have it)

2. **Navigate to the app folder**
```bash
cd divine-training-app
```

3. **Install dependencies**
```bash
npm install
```

4. **Start the server**
```bash
npm start
```

5. **Open in browser**
Go to: `http://localhost:3000`

6. **Create accounts**
   - First, create Sekou's trainer account (Role: Trainer)
   - Then, create your client account (Role: Client)

---

### Option 2: Deploy to the Internet (Production)

You have several free/cheap options. Here's the easiest:

#### Deploy with Railway.app (Recommended)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect your GitHub account
4. Select this repository (or upload the code)
5. Railway will auto-detect it's a Node.js app
6. Click "Deploy"
7. Once live, Railway gives you a URL (e.g., `https://divine-training.up.railway.app`)
8. Share this URL with Sekou

**Cost:** Free tier includes $5/month; this app uses less than that.

---

#### Deploy with Render.com (Alternative)

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub or upload code
4. Set start command to: `npm start`
5. Deploy
6. Get your live URL

**Cost:** Free tier available, though slower.

---

#### Deploy with Heroku (If you prefer)

1. Install Heroku CLI
2. Run: `heroku create divine-training`
3. Run: `git push heroku main`
4. Heroku gives you a live URL

**Cost:** Paid (no free tier anymore, ~$7/month)

---

## How to Use

### First Time Setup

1. **Sekou creates trainer account**
   - Name: "Sekou Kaba"
   - Role: Trainer

2. **You create client account**
   - Name: "Chris"
   - Role: Client

3. **Sekou sets up workouts**
   - Log in as Sekou
   - Go to "Manage Workouts"
   - Create "Day 1 - Upper Body"
   - Add exercises one by one:
     - Lat Pulldown | 3 x 8-12
     - Dumbbell Bench Press | 3 x 8-12
     - (etc.)
   - Create "Day 2 - Lower Body"
   - Add exercises

### You Log Workouts

1. Log in as Chris
2. Click "Log Workout"
3. Pick Day 1 or Day 2
4. Enter weight and reps for each exercise
5. Click "Save Workout"
6. Done!

### View Progress

1. Go to "View Progress"
2. See all your past workouts

---

## Data

All data is stored in `divine.db` (SQLite database). It's local to your server.

**Backup your database regularly** by downloading `divine.db`:
- If deployed, check your hosting provider's file system
- If local, copy `divine.db` somewhere safe

---

## Features

- ✅ Sekou creates custom workouts
- ✅ You log sets, reps, and weight
- ✅ View workout history
- ✅ Simple, fast interface
- ✅ Mobile-friendly (works on phone)

## Future Upgrades

- Email notifications
- Progress charts
- Notes/feedback from Sekou
- Multiple clients (if Sekou wants to expand)

---

## Troubleshooting

**Port already in use?**
```bash
npm start -- --port 3001
```

**Database issues?**
Delete `divine.db` and restart—it recreates itself.

**Deployment not working?**
- Check that Node.js version is 16+
- Make sure `package.json` and `server.js` are in root
- Check hosting provider logs

---

## Questions?

The app is intentionally simple. If you want changes, just ask!
