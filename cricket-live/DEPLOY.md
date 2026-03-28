# Deploy CricLive to Vercel — Step by Step

## Prerequisites
- Node.js installed
- Git installed
- GitHub account
- Vercel account (free at vercel.com)

---

## Step 1 — Install Vercel CLI

```bash
npm install -g vercel
```

---

## Step 2 — Push code to GitHub

```bash
# Inside the cricket-live folder
cd cricket-live

git init
git add .
git commit -m "initial commit"
```

Go to https://github.com/new → create a new repo (e.g. `criclive`)

```bash
git remote add origin https://github.com/YOUR_USERNAME/criclive.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy to Vercel via CLI

```bash
# Still inside cricket-live folder
vercel
```

Answer the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → your account
- **Link to existing project?** → N
- **Project name?** → criclive (or any name)
- **In which directory is your code?** → `.` (current directory)
- **Want to override settings?** → N

Vercel will deploy and give you a URL like `https://criclive.vercel.app`

---

## Step 4 — Add Environment Variables

Go to https://vercel.com/dashboard → your project → **Settings** → **Environment Variables**

Add these two:

| Name | Value |
|------|-------|
| `CRICAPI_KEY` | `21ca41bb-6179-46b8-9188-9cb741f74628` |
| `RAPIDAPI_KEY` | `558938671bmsh3dd6497bc17c942p14d5cejsne2f5d450d385` |

Set environment to: **Production**, **Preview**, **Development** (check all three)

Click **Save**

---

## Step 5 — Redeploy with env vars

```bash
vercel --prod
```

Or go to Vercel dashboard → **Deployments** → click the three dots → **Redeploy**

---

## Step 6 — Verify it works

Open your URL and test:
- `https://criclive.vercel.app/api/health` → should return `{"status":"ok","cricapi":true,"rapidapi":true}`
- `https://criclive.vercel.app/api/matches/live` → live match data
- `https://criclive.vercel.app` → full site

---

## Step 7 — Connect custom domain (optional)

Vercel dashboard → your project → **Settings** → **Domains** → Add your domain

---

## Local development (unchanged)

```bash
# Terminal 1 — backend
cd server && npm install && npm run dev

# Terminal 2 — frontend  
cd client && npm install && npm start
```

The React app proxies `/api` to `localhost:5000` via `"proxy"` in `client/package.json`.
