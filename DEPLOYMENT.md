# Divine Training - Deployment Guide

Choose your path:

## Path A: Run Locally on Your Mac (Quick Testing)

```bash
# 1. Install Node.js from https://nodejs.org if needed

# 2. Go to the app folder
cd divine-training-app

# 3. Install packages
npm install

# 4. Start server
npm start

# 5. Open browser: http://localhost:3000

# 6. Create accounts and test
```

**Good for:** Testing before going live, development

---

## Path B: Deploy Live (Railway - Easiest)

### Step 1: Prepare Code
Make sure you have:
- `package.json`
- `server.js`
- `public/index.html`
- `divine.db` (created automatically)

### Step 2: Push to GitHub
1. Create a new GitHub repo
2. Add the code:
```bash
git init
git add .
git commit -m "Initial Divine Training app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/divine-training.git
git push -u origin main
```

### Step 3: Deploy on Railway
1. Go to https://railway.app
2. Sign up (free)
3. Click "Create a new project"
4. Select "Deploy from GitHub"
5. Select your `divine-training` repo
6. Railway deploys automatically (takes ~2 min)
7. Get your live URL from Railway dashboard

### Step 4: Share with Sekou
Send him the URL. Both of you create accounts and go!

**Cost:** Free tier (includes $5/month credit)

**Uptime:** Always on, global servers

---

## Path C: Deploy on Render.com (Alternative)

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Paste your GitHub URL
4. Set Runtime: Node
5. Set Start Command: `npm start`
6. Deploy
7. Get your URL from Render dashboard

**Cost:** Free tier, but slow

---

## Post-Deployment Checklist

- [ ] Create Sekou's trainer account
- [ ] Create your client account
- [ ] Sekou adds Day 1 and Day 2 exercises
- [ ] You log a test workout
- [ ] Check that everything saves
- [ ] Backup `divine.db` regularly

---

## Backup Your Database

**If deployed:** Contact hosting provider on how to download files

**If local:** 
```bash
cp divine.db divine-backup-$(date +%Y%m%d).db
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Change port: `npm start -- --port 3001` |
| npm not found | Install Node.js from nodejs.org |
| Database corrupted | Delete `divine.db`, restart, it recreates |
| Site down after deploy | Check hosting provider logs |

---

## Questions?

This app is designed to be simple and straightforward. If something isn't working, let me know!
